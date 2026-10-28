import assert from 'node:assert/strict';
import {PauseTimeline} from '../web/replay/pause-timeline.js';
const t=new PauseTimeline(100,[[10,20],[50,80]]);
assert.equal(t.active,60);assert.equal(t.display(15,true),10);assert.equal(t.display(90,true),50);assert.equal(t.wall(10,true),20);assert.equal(t.wall(40,true),80);
assert.equal(t.wall(t.display(9,true)+5,true),24);
assert.equal(t.wall(t.display(85,true)-5,true),80);
assert.deepEqual(t.pauseAt(10),[10,20]);assert.equal(t.pauseAt(20),null);
for(const x of [0,9,20,30,49,80,99,100]){assert.equal(t.wall(t.display(x,true),true),x);assert.equal(t.display(x),x);assert.equal(t.wall(x),x);}
assert.match(t.background(true),/#647143/);assert.match(t.background(),/#c9ac72/);
const merged=new PauseTimeline(10,[[8,20],[2,5],[4,8],[-3,1],[8,8],[NaN,1]]);assert.deepEqual(merged.ranges,[[0,1],[2,10]]);assert.equal(merged.active,1);assert.equal(merged.wall(1,true),10);
console.log('Pause coloring, merging, compressed seeks, skip boundaries and real-time mapping passed');
const {readFileSync}=await import('node:fs');
const html=readFileSync(new URL('../web/replay/index.html',import.meta.url),'utf8'),app=readFileSync(new URL('../web/replay/app.js',import.meta.url),'utf8');
const ids=new Set([...html.matchAll(/id="([^"]+)"/g)].map(m=>m[1]));for(const [,id] of app.matchAll(/\$\('([^']+)'\)/g))assert.ok(ids.has(id),`Missing replay control: ${id}`);
const chase=new PauseTimeline(100,[[10,20]],[[5,30]]);assert.match(chase.background(),/#b94d42/);assert.match(chase.background(),/#c9ac72/);assert.match(chase.background(true),/#b94d42/);assert.doesNotMatch(chase.background(true),/#c9ac72/);
assert.doesNotMatch(new PauseTimeline(100,[[10,20]],[[12,18]]).background(true),/#b94d42/,'hidden pause-only chase must not color active time');
