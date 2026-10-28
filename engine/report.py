"""Portable report rendering, with every data value escaped and no scripts/assets."""
import html,json

def printable(report):
 def e(x):return html.escape(str(x),quote=True)
 def j(x):return e(json.dumps(x,ensure_ascii=False,indent=2))
 r=report;m=r['metrics'];p=r['performance']
 sections=[]
 for rule in r['rules']:
  evidence=''.join(f'<li><b>Tick {e(item["tick"])} / E{e(item["entity"])}</b> · {e(item["message"])}<pre>实录 {j(item["observed"])}\n预期 / 上限 {j(item["expected"])}</pre></li>' for item in rule['evidence'])
  sections.append(f'<section><h3>{e(rule["title"])} <small>{e({"pass":"通过","fail":"未通过","disabled":"关闭","inconclusive":"未完成","insufficient":"样本不足"}[rule["status"]])}</small></h3><p>{rule["checked"]} 次对照 · {rule["violations"]} 处异常 · 处置 {e(rule["action"])}</p><p>{e(rule["reason"] or "")}</p><pre>{j(r["policy"][rule["id"]])}</pre><ol>{evidence}</ol><p>省略证据 {rule["evidenceOmitted"]} 条；全部异常均计入判定。</p></section>')
 features=''
 if r.get('bot'):
  b=r['bot'];features=f'<p>可疑度 {e(b["score"] if b["sufficient"] else "样本不足")} % · 阈值 {b["threshold"]} · 达到扣分门槛的证据通道 {b["signals"]} 项</p><p>{e(b["reason"] or b["interpretation"])}</p>'
  if b.get('precision'):
   precision=b['precision'];features+=f'<h3>持续精密操作观察</h3><p>{e(precision["preciseTurns"])} 次精密转向，分布在 {e(precision["corners"])} 个位置、{e(precision["windows"])} 个时间窗口；该项可疑度 {e(precision["score"])}%。位置与转角条件必须同时成立，普通直角和最短路线不计分。</p><pre>{j(precision)}</pre>'
  if b.get('pulse',{}).get('available'):
   pulse=b['pulse'];features+=f'<h3>脉冲输入缓存观察</h3><p>{e(pulse["events"])} 帧异常，分布在 {e(pulse["windows"])} 个时间窗口；该项可疑度 {e(pulse["score"])}%。单次异常或集中在短时段的异常不触发扣分。</p><pre>{j(pulse["evidence"])}</pre>'
  if b.get('motion'):
   motion=b['motion'];features+=f'<h3>分段移动观察</h3><p>{e(motion["segments"])} 段已完成移动中，{e(motion["preciseSegments"])} 段精确匹配整格位移，分布在 {e(motion["positions"])} 个位置；该项可疑度 {e(motion["score"])}%。按移动方向分段，独立于视角转向。</p><pre>{j(motion)}</pre>'
  if b.get('patterns'):features+='<h3>其他控制器模式观察</h3><pre>'+j(b['patterns'])+'</pre>'
  features+=''.join(f'<div class="feature"><b>{e(f["label"])} · {f["value"]} / 100</b><p>权重 {f["weight"]} · 测量 {e(f["measurement"])}</p><p>{e(f["description"])}</p></div>' for f in b['features'])
 else:features='<p>本次未开启 Bot 评判。</p>'
 identity={k:r[k] for k in ('reportVersion','generatedAt','proof','policySha256','engine','coverage','disabled','insufficient','importChecks')}
 return ('<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>HALLS 成绩报告</title><style>body{max-width:960px;margin:40px auto;padding:0 24px;font:14px/1.7 system-ui,sans-serif;color:#252920;background:#f7f7f1}h1{font-size:30px;font-weight:500}h2{font-weight:500}h3{font-size:16px}header,section{border-bottom:1px solid #ccd0c1;padding:20px 0}small{float:right;color:#69705e}pre{white-space:pre-wrap;word-break:break-all;background:#edeee5;padding:14px;font:11px/1.7 monospace}p{color:#5b6451}.metrics{display:flex;gap:32px;flex-wrap:wrap}.metrics b{display:block;font-size:24px}.feature{display:inline-block;vertical-align:top;width:46%;margin:8px 3% 8px 0}li{border-top:1px solid #d8ddcd;padding-top:10px}@media print{body{margin:0;background:white}section,li{break-inside:avoid}pre{background:transparent}}</style><header><p>HALLS / ADJUDICATION REPORT</p><h1>'+e(r['label'])+'</h1><p>'+e(r['generatedAt'])+'</p></header>'+
  f'<section><h2>表现评价 {e(p["grade"])} · {p["score"] if p["score"] is not None else "—"} / 100</h2><p>{"非正式表现参考" if p["provisional"] else "符合本次评判规则"} · {e(p["description"])}</p><div class="metrics"><div>用时<b>{m["duration"]:.2f} s</b></div><div>移动<b>{m["pathMeters"]:.1f} m</b></div><div>路线效率<b>{m["routeEfficiency"]*100:.1f}%</b></div><div>生命<b>{m["remainingHealth"]:.0f} HP</b></div></div><p>{e(p["formula"])}</p><pre>{j(m)}</pre><h3>评分方案</h3><pre>{j(p["policy"])}</pre></section><section><h2>自动化可疑度</h2>{features}</section>'+''.join(sections)+f'<section><h2>模型与报告身份</h2><p>{e(r["method"])}</p><pre>{j(identity)}</pre>'+''.join('<p>'+e(x)+'</p>' for x in r['limitations'])+'</section></html>').encode()
