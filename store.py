"""SQLite transactions are the boundary for admission, deduplication and moderation."""
import contextlib,hashlib,json,os,secrets,sqlite3,time
from pathlib import Path
ROOT=Path(__file__).resolve().parent
DATA=Path(os.environ.get('HALLS_DATA',ROOT/'data')).resolve()
DEFAULTS={'scoring':{'completion':10,'pace':50,'coins':30,'tactics':10},'deductions':{'movement':12,'timing':10,'combat':10,'entities':5,'automation':20,'map_similarity':8,'path_similarity':4},'seedScoreCap':9,'downloadsEnabled':True,'downloadsOpenAt':0,'uploadsEnabled':True,'webUploads':True,'previewsEnabled':True,'apiUploads':False,'publicationConfirmation':True,'fullyAutomatic':False,'autoApprove':True,'autoPublish':True,'strictRaceReference':True,'requireBehaviorAssessment':True,'allowLimited':False,'unrankedEnabled':False,'maxBotScore':60,'minScore':0,'maxDuration':14400,'judge':{},'timestamp':{'enabled':True,'futureSkewSeconds':300,'maxAgeDays':0,'action':'review'},'similarity':{'seedEnabled':True,'mapEnabled':True,'pathEnabled':True,'mapThreshold':99.95,'pathThreshold':97,'minimumDistance':100,'action':'review'}}
def dumps(x):return json.dumps(x,ensure_ascii=False,separators=(',',':'),allow_nan=False)
def digest(x):return hashlib.sha256(x.encode() if isinstance(x,str) else x).hexdigest()
@contextlib.contextmanager
def db(write=False):
 c=sqlite3.connect(DATA/'halls.sqlite3',timeout=15);c.row_factory=sqlite3.Row;c.execute('PRAGMA foreign_keys=ON');c.execute('PRAGMA busy_timeout=15000')
 try:
  if write:c.execute('BEGIN IMMEDIATE')
  yield c
  c.commit()
 except BaseException:c.rollback();raise
 finally:c.close()
def initialize():
 DATA.mkdir(mode=0o700,parents=True,exist_ok=True)
 for folder in ['proofs','results','replays','tmp','preview-proofs','preview-replays','preview-tmp']: (DATA/folder).mkdir(mode=0o700,exist_ok=True)
 with db() as c:
  c.execute('PRAGMA journal_mode=WAL')
  c.executescript('''
  CREATE TABLE IF NOT EXISTS settings(id INTEGER PRIMARY KEY CHECK(id=1),json TEXT NOT NULL,revision INTEGER NOT NULL DEFAULT 1);
  CREATE TABLE IF NOT EXISTS admins(name TEXT PRIMARY KEY,password TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS sessions(hash TEXT PRIMARY KEY,csrf TEXT NOT NULL,expires REAL NOT NULL);
  CREATE TABLE IF NOT EXISTS admin_totp_used(key_version TEXT NOT NULL,counter INTEGER NOT NULL,used REAL NOT NULL,PRIMARY KEY(key_version,counter));
  CREATE TABLE IF NOT EXISTS runs(id TEXT PRIMARY KEY,name TEXT NOT NULL,sha TEXT UNIQUE NOT NULL,identity TEXT UNIQUE,raw_sha TEXT UNIQUE,cap_hash TEXT NOT NULL,created REAL NOT NULL,updated REAL NOT NULL,status TEXT NOT NULL,decision TEXT NOT NULL DEFAULT 'pending',board TEXT NOT NULL DEFAULT 'hidden',tags TEXT NOT NULL DEFAULT '[]',note TEXT NOT NULL DEFAULT '',report TEXT,score REAL,duration REAL,grade TEXT,verdict TEXT,playable INTEGER NOT NULL DEFAULT 0,bytes INTEGER NOT NULL,policy TEXT NOT NULL,policy_revision INTEGER NOT NULL,fingerprint TEXT,attempts INTEGER NOT NULL DEFAULT 0);
  CREATE INDEX IF NOT EXISTS run_board_score ON runs(board,score DESC,duration,id);
  CREATE INDEX IF NOT EXISTS run_board_speed ON runs(board,duration,score DESC,id);
  CREATE INDEX IF NOT EXISTS run_status ON runs(status,created);
  CREATE TABLE IF NOT EXISTS rates(key TEXT PRIMARY KEY,count INTEGER NOT NULL,expires REAL NOT NULL);
  CREATE TABLE IF NOT EXISTS audit(id INTEGER PRIMARY KEY,at REAL NOT NULL,actor TEXT NOT NULL,run TEXT,action TEXT NOT NULL,detail TEXT NOT NULL);
  CREATE INDEX IF NOT EXISTS audit_run_action ON audit(run,action);
  CREATE TABLE IF NOT EXISTS api_keys(id TEXT PRIMARY KEY,label TEXT NOT NULL,hash TEXT UNIQUE NOT NULL,created REAL NOT NULL,last_used REAL,uses INTEGER NOT NULL DEFAULT 0,active INTEGER NOT NULL DEFAULT 1);
  CREATE TABLE IF NOT EXISTS koh_submissions(key_id TEXT NOT NULL REFERENCES api_keys(id) ON DELETE CASCADE,problem_id INTEGER NOT NULL,submission_id INTEGER NOT NULL,sha TEXT NOT NULL,bytes INTEGER NOT NULL,instance TEXT NOT NULL,duplicate INTEGER NOT NULL DEFAULT 0,run TEXT REFERENCES runs(id) ON DELETE CASCADE,created REAL NOT NULL,PRIMARY KEY(key_id,problem_id,submission_id));
  CREATE INDEX IF NOT EXISTS koh_hash ON koh_submissions(sha);
  CREATE TABLE IF NOT EXISTS koh_receipts(token_hash TEXT PRIMARY KEY,key_id TEXT NOT NULL REFERENCES api_keys(id) ON DELETE CASCADE,problem_id INTEGER NOT NULL,submission_id INTEGER NOT NULL,instance TEXT NOT NULL,nonce TEXT NOT NULL,sha TEXT NOT NULL,bytes INTEGER NOT NULL,run TEXT REFERENCES runs(id) ON DELETE CASCADE,result TEXT NOT NULL,created REAL NOT NULL,claim_problem INTEGER,claim_submission INTEGER,claim_instance TEXT,claimed REAL,UNIQUE(key_id,problem_id,submission_id),UNIQUE(key_id,claim_problem,claim_submission));
  CREATE TABLE IF NOT EXISTS submission_sources(id INTEGER PRIMARY KEY,at REAL NOT NULL,channel TEXT NOT NULL,key_id TEXT NOT NULL,key_label TEXT NOT NULL,problem_id INTEGER,submission_id INTEGER,instance TEXT NOT NULL DEFAULT '',source_id TEXT NOT NULL DEFAULT '',source_kind TEXT NOT NULL,sha TEXT NOT NULL,file_bytes INTEGER NOT NULL,hash_verified INTEGER NOT NULL DEFAULT 0,run_id TEXT,duplicate INTEGER NOT NULL DEFAULT 0,status TEXT NOT NULL);
  CREATE INDEX IF NOT EXISTS source_sha ON submission_sources(sha);
  CREATE INDEX IF NOT EXISTS source_run ON submission_sources(run_id);
  CREATE INDEX IF NOT EXISTS source_context ON submission_sources(key_id,problem_id,submission_id,sha);
  CREATE TABLE IF NOT EXISTS web_uploads(hash TEXT PRIMARY KEY,ip TEXT NOT NULL,expires REAL NOT NULL);
  CREATE TABLE IF NOT EXISTS preview_cache(id TEXT PRIMARY KEY,sha TEXT UNIQUE NOT NULL,status TEXT NOT NULL,bytes INTEGER NOT NULL,created REAL NOT NULL,updated REAL NOT NULL,summary TEXT,error TEXT);
  CREATE TABLE IF NOT EXISTS previews(id TEXT PRIMARY KEY,cache_id TEXT REFERENCES preview_cache(id),cap_hash TEXT NOT NULL,created REAL NOT NULL,expires REAL NOT NULL,status TEXT NOT NULL);
  CREATE INDEX IF NOT EXISTS preview_queue ON preview_cache(status,created);
  CREATE TABLE IF NOT EXISTS preview_nonces(hash TEXT PRIMARY KEY,ip TEXT NOT NULL,expires REAL NOT NULL);
  CREATE TABLE IF NOT EXISTS preview_tickets(hash TEXT PRIMARY KEY,preview TEXT NOT NULL REFERENCES previews(id) ON DELETE CASCADE,ip TEXT NOT NULL,expires REAL NOT NULL,uses INTEGER NOT NULL DEFAULT 0);
  CREATE TABLE IF NOT EXISTS tickets(hash TEXT PRIMARY KEY,run TEXT NOT NULL,ip TEXT NOT NULL,expires REAL NOT NULL,uses INTEGER NOT NULL DEFAULT 0,private INTEGER NOT NULL DEFAULT 0);
  ''')
  c.execute('BEGIN IMMEDIATE')
  if 'scope' not in {r[1] for r in c.execute('PRAGMA table_info(api_keys)')}:c.execute("ALTER TABLE api_keys ADD COLUMN scope TEXT NOT NULL DEFAULT 'upload'")
  if 'seed' not in {r[1] for r in c.execute('PRAGMA table_info(runs)')}:c.execute('ALTER TABLE runs ADD COLUMN seed TEXT')
  c.execute("UPDATE runs SET seed=CAST(json_extract(report,'$.proof.seed') AS TEXT) WHERE seed IS NULL AND report IS NOT NULL AND json_valid(report)")
  c.execute('CREATE INDEX IF NOT EXISTS run_seed ON runs(seed,created)')
  if 'name' not in {r[1] for r in c.execute('PRAGMA table_info(sessions)')}:
   c.execute('ALTER TABLE sessions ADD COLUMN name TEXT')
   admins=c.execute('SELECT name FROM admins').fetchall()
   if len(admins)==1:c.execute('UPDATE sessions SET name=?',(admins[0][0],))
   else:c.execute('DELETE FROM sessions')
  c.execute('INSERT OR IGNORE INTO settings(id,json) VALUES(1,?)',(dumps(DEFAULTS),))
  row=c.execute('SELECT json FROM settings WHERE id=1').fetchone();old=json.loads(row[0]);merged={**DEFAULTS,**old}
  if set(merged.get('scoring',{}))!=set(DEFAULTS['scoring']):merged['scoring']=DEFAULTS['scoring'].copy()
  merged['deductions']={**DEFAULTS['deductions'],**merged.get('deductions',{})};merged['similarity']={**DEFAULTS['similarity'],**merged.get('similarity',{})}
  if 'duplicate' not in {r[1] for r in c.execute('PRAGMA table_info(koh_submissions)')}:c.execute('ALTER TABLE koh_submissions ADD COLUMN duplicate INTEGER NOT NULL DEFAULT 0')
  if merged!=old:c.execute('UPDATE settings SET json=?,revision=revision+1 WHERE id=1',(dumps(merged),))
 secret=DATA/'session.key'
 try:
  fd=os.open(secret,os.O_WRONLY|os.O_CREAT|os.O_EXCL,0o600)
  with os.fdopen(fd,'w') as f:f.write(secrets.token_hex(32))
 except FileExistsError:pass

def settings(c=None):
 if c is not None:
  r=c.execute('SELECT * FROM settings WHERE id=1').fetchone();return json.loads(r['json']),r['revision']
 with db() as conn:return settings(conn)
def audit(c,actor,action,run=None,detail=None):c.execute('INSERT INTO audit(at,actor,run,action,detail) VALUES(?,?,?,?,?)',(time.time(),actor,run,action,dumps(detail or {})))
def rate(key,limit,seconds):
 now=time.time();key=digest(key)+':'+str(int(now//seconds))
 with db(True) as c:
  c.execute('DELETE FROM rates WHERE expires<?',(now,))
  c.execute('INSERT INTO rates VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1',(key,now+seconds))
  return c.execute('SELECT count FROM rates WHERE key=?',(key,)).fetchone()[0]<=limit

def visible(r,c=None):
 if r['status']!='done':return False
 if r['board']=='ranked':return r['decision']=='approved' and r['score'] is not None
 return r['board']=='unranked' and settings(c)[0]['unrankedEnabled']

def public_row(r):
 report=json.loads(r['report']) if r['report'] else {}
 return {k:r[k] for k in ['id','name','created','updated','decision','board','score','duration','grade','verdict','playable']}|{'tags':json.loads(r['tags']),'completedAt':report.get('proof',{}).get('completedAt'),'referenceScore':report.get('performance',{}).get('referenceScore'),'platform':report.get('proof',{}).get('platform'),'architecture':report.get('proof',{}).get('architecture')}
