"""Permanent organizer deletion of a run and its derived copies."""
import re,shutil,time
from store import DATA,db,audit

class DeleteError(Exception):
 def __init__(self,message,status=409,code='delete_busy'):super().__init__(message);self.status=status;self.code=code

def remove(folder,name):
 root=DATA/folder
 if root.is_symlink():raise OSError('Storage directory must not be a symlink')
 path=root/name
 if path.is_symlink() or path.is_file():path.unlink(missing_ok=True)
 elif path.is_dir():shutil.rmtree(path)

def delete_run(run_id,actor):
 if not isinstance(run_id,str) or not re.fullmatch('[a-f0-9]{24}',run_id):raise DeleteError('记录不存在。',404,'not_found')
 failed=False
 # Keep the write transaction while removing files: workers cannot claim a
 # queued run or matching preview, and concurrent deletions cannot overlap.
 with db(True) as c:
  run=c.execute('SELECT * FROM runs WHERE id=?',(run_id,)).fetchone()
  if not run:raise DeleteError('记录不存在。',404,'not_found')
  caches=c.execute('SELECT id,status FROM preview_cache WHERE sha=?',(run['sha'],)).fetchall()
  if run['status'] in ('receiving','processing') or any(r['status']=='processing' for r in caches):raise DeleteError('记录或关联预览正在处理，请等任务完成后再删除。')
  c.execute('PRAGMA secure_delete=ON')
  cache_ids=[r['id'] for r in caches];preview_ids=[]
  for key in cache_ids:
   preview_ids += [r[0] for r in c.execute('SELECT id FROM previews WHERE cache_id=?',(key,))]
   c.execute("UPDATE preview_cache SET status='deleting',updated=? WHERE id=?",(time.time(),key))
   c.execute('DELETE FROM preview_tickets WHERE preview IN (SELECT id FROM previews WHERE cache_id=?)',(key,))
  c.execute("UPDATE runs SET status='deleting',board='hidden',decision='rejected',playable=0,updated=? WHERE id=?",(time.time(),run_id))
  c.execute('DELETE FROM tickets WHERE run=?',(run_id,))
  try:
   for folder in ('proofs','results','replays','tmp'):remove(folder,run_id)
   remove('results',run_id+'.json')
   for key in set(cache_ids+preview_ids):
    if not re.fullmatch('[a-f0-9]{24}',key):raise OSError('Invalid stored preview identifier')
    for folder in ('preview-proofs','preview-replays','preview-tmp'):remove(folder,key)
  except OSError:
   # Commit the hidden tombstone; a failed filesystem cleanup must never leave
   # a public run or release its reservation. The administrator can retry.
   failed=True;audit(c,actor,'delete_failed',run_id)
  else:
   for key in cache_ids:
    c.execute('DELETE FROM previews WHERE cache_id=?',(key,));c.execute('DELETE FROM preview_cache WHERE id=?',(key,))
   c.execute('DELETE FROM submission_sources WHERE run_id=? OR sha=?',(run_id,run['sha']))
   c.execute('DELETE FROM koh_submissions WHERE run=? OR sha=?',(run_id,run['sha']))
   c.execute('DELETE FROM audit WHERE run=?',(run_id,))
   c.execute('DELETE FROM runs WHERE id=?',(run_id,))
   audit(c,actor,'permanent_delete',run_id,{'previewCopies':len(cache_ids)})
 if failed:raise DeleteError('文件清理未完成，记录已隐藏。请稍后重试彻底删除。',503,'delete_cleanup_failed')
 return {'ok':True,'deleted':run_id}
