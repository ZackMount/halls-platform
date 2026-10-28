"""Formal-score admission is separate from authenticated replay decoding."""
try:
 from .layout import CURRENT_BUILD,LAYOUTS
 from .validation import ProofError
except ImportError:
 from layout import CURRENT_BUILD,LAYOUTS
 from validation import ProofError

MINIMUM_CLIENT=LAYOUTS[CURRENT_BUILD].version
UPGRADE_MESSAGE=f'当前仅接受 HALLS {MINIMUM_CLIENT} 生成的成绩凭证。请升级客户端，重新通关后再提交。'

def upgrade_error(checks=None):
 error=ProofError(UPGRADE_MESSAGE,stage='eligibility',code='client_upgrade_required',status=422)
 if checks is not None:error.checks={**checks,'eligibility':'failed'}
 return error

def require_current_submission(meta):
 if meta.get('recordingBuild')!=CURRENT_BUILD:raise upgrade_error(meta.get('importChecks'))
