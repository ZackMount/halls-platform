#!/usr/bin/env python3
"""One-shot organizer reset; the service wrapper stops writers and gates time."""
import argparse,json,shutil,sqlite3
from pathlib import Path
from contextlib import closing

KEEP_TABLES={'settings','admins','sessions','admin_totp_used','api_keys'}
DATA_FOLDERS=('proofs','results','replays','tmp','preview-proofs','preview-replays','preview-tmp')

def remove(path):
 if path.is_symlink() or path.is_file():path.unlink()
 elif path.is_dir():shutil.rmtree(path)

def reset(data,backups=None,execute=False):
 data=Path(data);database=data/'halls.sqlite3'
 if not data.is_absolute() or data.is_symlink() or database.is_symlink() or not database.is_file():raise ValueError('Expected an existing, direct data directory and database')
 for name in DATA_FOLDERS:
  if (data/name).is_symlink():raise ValueError('Storage directory must not be a symlink')
 backups=Path(backups) if backups is not None else None
 if backups is not None and (not backups.is_absolute() or backups.is_symlink() or backups==data or data in backups.parents or backups in data.parents):raise ValueError('Backups must be a separate direct directory')
 with closing(sqlite3.connect(database)) as c:
  names={r[0] for r in c.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")}
  if not KEEP_TABLES<=names:raise ValueError('Unexpected database schema')
  quote=lambda name:'"'+name.replace('"','""')+'"'
  retained={name:list(c.execute('SELECT * FROM '+quote(name)+' ORDER BY 1')) for name in KEEP_TABLES}
  counts={name:c.execute('SELECT count(*) FROM '+quote(name)).fetchone()[0] for name in sorted(names-KEEP_TABLES)}
  summary={'execute':execute,'removedRows':counts,'storageEntries':{name:len(list((data/name).iterdir())) if (data/name).is_dir() else 0 for name in DATA_FOLDERS},'backupEntries':len(list(backups.iterdir())) if backups and backups.exists() else 0,'apiKeysPreserved':len(retained['api_keys']),'administratorStatePreserved':True,'settingsPreserved':True}
  if not execute:return summary
  c.execute('PRAGMA foreign_keys=OFF');c.execute('PRAGMA secure_delete=ON');c.execute('BEGIN IMMEDIATE')
  for name in sorted(names-KEEP_TABLES):c.execute('DELETE FROM '+quote(name))
  for name in DATA_FOLDERS:
   folder=data/name
   if folder.is_dir():
    for path in folder.iterdir():remove(path)
  if backups and backups.is_dir():
   for path in backups.iterdir():remove(path)
  for name,rows in retained.items():
   if list(c.execute('SELECT * FROM '+quote(name)+' ORDER BY 1'))!=rows:raise RuntimeError('Retained administrator/API configuration changed')
  if list(c.execute('PRAGMA foreign_key_check')):raise RuntimeError('Remaining foreign-key violations')
  c.commit();c.execute('PRAGMA wal_checkpoint(TRUNCATE)');c.execute('VACUUM');c.execute('PRAGMA wal_checkpoint(TRUNCATE)')
  assert all(c.execute('SELECT count(*) FROM '+quote(name)).fetchone()[0]==0 for name in names-KEEP_TABLES)
  assert all(not list((data/name).iterdir()) for name in DATA_FOLDERS if (data/name).is_dir())
 return summary

if __name__=='__main__':
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--data',type=Path,required=True);p.add_argument('--backups',type=Path);p.add_argument('--execute',action='store_true')
 a=p.parse_args();print(json.dumps(reset(a.data,a.backups,a.execute),sort_keys=True))
