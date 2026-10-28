"""The server clock is authoritative for scheduled download access."""
import math,time

def state(policy,now=None):
 now=time.time() if now is None else now
 opens=policy.get('downloadsOpenAt',0)
 scheduled=bool(policy['downloadsEnabled'] and opens>now)
 seconds=max(0,math.ceil(opens-now)) if scheduled else 0
 days,remainder=divmod(seconds,86400);hours,remainder=divmod(remainder,3600);minutes,seconds=divmod(remainder,60)
 return {'enabled':bool(policy['downloadsEnabled'] and not scheduled),'scheduled':scheduled,'opensAt':opens,
         'serverTime':now,'countdown':f'{days} 天 {hours} 小时 {minutes} 分 {seconds} 秒'}
