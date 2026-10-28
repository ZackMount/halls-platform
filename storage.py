"""Shared upload reservations; no filesystem paths are returned to the browser."""
import os,shutil,time
from store import DATA
RESERVE=300*1024**2
LIMIT=int(os.environ.get('HALLS_STORAGE_GB','20'))*1024**3
FREE_FLOOR=int(os.environ.get('HALLS_MIN_FREE_MB','1024'))*1024**2

def snapshot(c):
 disk=shutil.disk_usage(DATA)
 runs=c.execute("SELECT COUNT(*),COALESCE(SUM(bytes),0),COUNT(CASE WHEN status IN ('receiving','queued','processing') THEN 1 END) FROM runs").fetchone()
 previews=c.execute("SELECT COUNT(*),COALESCE(SUM(bytes),0),COUNT(CASE WHEN status IN ('queued','processing') THEN 1 END) FROM preview_cache").fetchone()
 receiving=c.execute("SELECT COUNT(*) FROM previews WHERE status='receiving'").fetchone()[0]
 pending=runs[2]+previews[2]+receiving
 # Preview cache bytes already include its queued job reservations.
 reserved=pending*RESERVE
 used=runs[1]+max(0,previews[1]-previews[2]*RESERVE)
 remaining=max(0,min(LIMIT-used-reserved,disk.free-FREE_FLOOR-pending*RESERVE))
 allowed=runs[0]<20000 and remaining>=RESERVE
 return {'at':int(time.time()),'disk':{'total':disk.total,'used':disk.used,'free':disk.free},'platform':{'used':used,'limit':LIMIT,'reserved':reserved,'remaining':remaining,'runs':runs[0],'previews':previews[0],'pending':pending},'safety':{'minimumFree':FREE_FLOOR,'perUploadReserve':RESERVE,'acceptingUploads':allowed}}

def admission(c):
 """Call inside the same write transaction that reserves the new job."""
 s=snapshot(c)
 if s['disk']['free']-s['platform']['pending']*RESERVE<FREE_FLOOR+RESERVE:
  return '服务器可用磁盘空间不足，已暂停接收新文件。'
 if not s['safety']['acceptingUploads']:return '服务器存储配额不足，已暂停接收新文件。'
 return None
