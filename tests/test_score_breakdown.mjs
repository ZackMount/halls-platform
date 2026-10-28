import {test} from 'node:test';
import assert from 'node:assert/strict';
import {scoreAdjustments} from '../web/score-breakdown.js';
test('category deductions show signed amounts, escaped reasons and no internal fields',()=>{
 const html=scoreAdjustments({components:{integrity:-55},adjustments:{items:[{title:'地图与运动',reason:'<script>private</script>',points:-30},{title:'时间与速度',reason:'时间异常',points:-25}],notes:['竞速奖励未计入。']}});
 assert.match(html,/-55.00/);assert.match(html,/-30.00/);assert.match(html,/-25.00/);assert.match(html,/&lt;script&gt;/);assert.doesNotMatch(html,/<script>/);assert.match(html,/竞速奖励未计入/);
});
test('normal results omit the empty adjustment section and deductions keep their categories',()=>{
 assert.equal(scoreAdjustments({components:{integrity:0}}),'');const html=scoreAdjustments({deductions:{automation:30},components:{integrity:-30}});assert.match(html,/自动化行为/);assert.match(html,/-30.00/);
});
test('automation suspicion is a percentage, with unavailable and nonnumeric values hidden',()=>{
 const html=scoreAdjustments({automation:{available:true,suspicion:90},deductions:{automation:36.55},components:{integrity:-36.55}});
 assert.match(html,/90.00%/);assert.match(html,/-36.55/);assert.doesNotMatch(html,/不代表开挂概率/);
 for(const suspicion of [null,NaN,Infinity,'<script>',0,31.5,50])assert.doesNotMatch(scoreAdjustments({automation:{available:true,suspicion,deduction:0}}),/自动化可疑度|无扣分|评判调整/);
 assert.equal(scoreAdjustments({automation:{available:true,suspicion:90,deduction:0}}),'');
 assert.doesNotMatch(scoreAdjustments({automation:{available:false,suspicion:100}}),/100.00%/);
});

test('fractional model suspicion retains two decimal places',()=>{
 const html=scoreAdjustments({automation:{available:true,suspicion:67.83,deduction:24.5},components:{integrity:-24.5}});
 assert.match(html,/67\.83%/);assert.doesNotMatch(html,/67\.8%/);
});
