import assert from 'node:assert/strict';
import {batteryDisplay} from '../web/replay/battery.js';
for(const [value,cells,level] of [[100,5,'green'],[80,4,'green'],[60,3,'yellow'],[40,2,'yellow'],[20,1,'red'],[0,0,'red']]){
 assert.deepEqual(batteryDisplay(value),{cells,level,label:`${value}%`,abnormal:false});
}
assert.equal(batteryDisplay(100000).label,'100000%');assert.equal(batteryDisplay(100000).abnormal,true);
assert.equal(batteryDisplay(-3).abnormal,true);assert.equal(batteryDisplay(NaN).label,'—');
console.log('Five-cell battery levels, threshold colours and unclamped abnormal values passed');
