"""Keep the listening socket open while workers adopt a newly activated release."""
import os,sys
from pathlib import Path
chdir='/opt/halls/current' if Path('/opt/halls/current').is_dir() else os.getcwd()
preload_app=False

def on_reload(server):
 if server.cfg.chdir=='/opt/halls/current':
  # Workers load the active release through the current symlink.
  sys.path[:]=[server.cfg.chdir]+[p for p in sys.path if p!=server.cfg.chdir and Path(p).parent!=Path('/opt/halls/releases')]
