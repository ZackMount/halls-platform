"""Import failure stages, separate from configurable gameplay judgement."""
from contextlib import contextmanager
import re
STAGES=('envelope','authentication','compression','signature','format')
LABELS={'envelope':'文件封装','authentication':'解密与认证标签','compression':'压缩数据','signature':'客户端签名','format':'录制数据格式','configuration':'本机密钥配置','resource':'资源限制','request':'导入请求'}
MESSAGES={
 '旧版凭证不再支持，请使用 0.9.0 或更新版本重新通关。':'旧版凭证不再支持，请使用 0.9.0 或更新版本重新通关。',
 'Not a supported HALLS proof':'不是受支持的 HALLS 凭证，或文件已截断。',
 'Unknown signing/encryption key set':'凭证使用了未知密钥组，无法用当前配置校验。',
 'Invalid envelope length':'文件长度与封装声明不一致，可能已截断或被修改。',
 'Client signature is invalid':'解密已成功，但客户端签名无效：内容可能被修改，或并非由匹配密钥签发。',
 'Decryption/authentication failed':'解密认证失败：文件可能损坏、被修改，或解密密钥不匹配。',
 'Organizer key configuration is invalid':'本机解密 / 验签密钥不可用，请检查组织者密钥配置。',
 'Unsupported recording layout/build':'签名有效，但当前版本不支持这种录制布局或游戏版本。',
 'Motion value outside safe numeric encoding range':'录制含 NaN、无穷大或超出安全数值范围的数据。',
 'Recording is too large or has no simulation ticks':'帧数无效或超过安全容量限制。',
 'Impossible frame count for payload':'声明的帧数与实际数据长度不可能匹配。',
 'Import processing time limit exceeded':'导入处理超出时间上限，已停止处理。',
 'Noncanonical tick delta':'录制使用了非规范的变长整数编码。',
}
class ProofError(ValueError):
 def __init__(self,message,stage='format',code=None,status=400):
  super().__init__(message);self.detail=message;self.stage=stage;self.code=code or re.sub('[^a-z0-9]+','_',message.lower()).strip('_');self.status=status;self.checks={s:'not_run' for s in STAGES}
 def payload(self):
  message=MESSAGES.get(self.detail)
  if message is None:message=f'{LABELS.get(self.stage,self.stage)}校验失败：数据截断、长度错误或编码不合法。' if self.stage in STAGES else self.detail
  return {'error':message,'detail':self.detail,'code':self.code,'stage':self.stage,'checks':self.checks,'verdict':'not_assessed','importAccepted':False}
@contextmanager
def checking(stage,checks):
 try:yield
 except ProofError as error:
  if error.stage=='configuration':raise
  error.stage=stage;error.checks={**checks,stage:'failed'};raise
 else:checks[stage]='passed'
