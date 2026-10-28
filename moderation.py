"""Final placement uses the policy snapshot captured when the run was admitted."""
def automatic_decision(config,meta,report):
 perf=report['performance'];bot=report.get('bot') or {};full=config.get('fullyAutomatic',False)
 # An abstaining optional classifier cannot invalidate otherwise complete game
 # consistency checks. Missing/broken models raise an assessment error instead.
 model_gap=(bot.get('mode')=='model_only' and bot.get('score') is None and not bot.get('sufficient')
            and bot.get('unavailableReason') in ('unsupported_input_protocol','insufficient_activity_windows')
            and bot.get('patterns',{}).get('learned',{}).get('available') is True
            and set(report.get('insufficient',[]))=={'bot'} and not report.get('disabled')
            and not report.get('failed') and not report.get('review')
            and all(r.get('id')=='bot' or r.get('status')=='pass' for r in report.get('rules',[]))
            and any(r.get('id')=='bot' and r.get('status')=='insufficient' for r in report.get('rules',[])))
 required_missing=config.get('requireBehaviorAssessment',False) and bot.get('score') is None
 accepted=(not required_missing and not meta['testFixture'] and perf['eligible'] and (report['verdict'] in (('accepted','accepted_limited') if config['allowLimited'] else ('accepted',)) or model_gap and report['verdict']=='accepted_limited') and (bot.get('score') is not None and bot['score']<=config['maxBotScore'] or (config['allowLimited'] or model_gap) and bot.get('score') is None) and perf['score'] is not None and perf['score']>=config['minScore'] and 0<meta['duration']<=config['maxDuration'])
 if full:return {'automatic':True,'mode':'full','decision':'approved' if accepted else 'rejected','board':'ranked' if accepted else 'unranked'}
 approved=config['autoApprove'] and accepted
 return {'automatic':True,'mode':'assisted','decision':'approved' if approved else 'pending','board':'ranked' if approved and config['autoPublish'] else 'hidden'}
