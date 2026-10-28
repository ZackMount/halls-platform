import assert from 'node:assert/strict';
import {recordedSpeed} from '../web/replay/player-speed.js';
import {PauseTimeline} from '../web/replay/pause-timeline.js';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const points=[[0,0],[.46,0],[.92,0]],times=[0,.1,.2];
const sample={position:i=>points[i],time:i=>times[i]};
for(const index of [0,1,2])assert.ok(Math.abs(recordedSpeed(index,3,sample)-4.6)<1e-9);
assert.equal(recordedSpeed(1,3,{...sample,paused:true}),0);
assert.equal(recordedSpeed(1,3,{...sample,available:()=>false}),0);
assert.ok(Math.abs(recordedSpeed(1,3,{...sample,available:i=>i<2})-4.6)<1e-9);
assert.equal(recordedSpeed(0,1,sample),0);
assert.equal(recordedSpeed(0,2,{...sample,time:()=>0}),0);
assert.equal(recordedSpeed(0,2,{...sample,position:()=>[NaN,0]}),0);
const timeline=new PauseTimeline(10.2,[[.1,10.1]]),wallTimes=[0,10.1,10.2];
assert.ok(Math.abs(recordedSpeed(1,3,{...sample,time:i=>timeline.display(wallTimes[i],true)})-4.6)<1e-9,'pause gaps must not dilute recorded movement speed');
assert.equal(recordedSpeed(0,2,{position:i=>[i*10,0],time:i=>i*.01}),1000,'abnormal movement is displayed without clamping');
console.log('Recorded player speed, pause gaps, streaming boundaries and unclamped abnormal values passed');

// Exercise the caller as well: a correct speed formula can still read the
// player's coordinates after the observation target has changed.
const app=readFileSync(new URL('../web/replay/app.js',import.meta.url),'utf8');
const hud=app.slice(app.indexOf('function subjectName('),app.indexOf('\nfunction selectSubject('));
const values=new Float32Array(84*2);
for(const [field,start,end] of [[6,0,5],[8,0,0],[24,10,11.5],[25,20,20],[72,30,36.5],[73,40,40],[3,49,48],[19,100,100]]){values[field]=start;values[84+field]=end;}
const state={meta:{frames:2,words:84,format:'HVR5'},f:values,times:[0,1],index:0,time:0,subject:-1};
const nodes=new Map(),node=id=>{if(!nodes.has(id))nodes.set(id,{hidden:false,textContent:'',children:[]});return nodes.get(id);};
let batteryUpdates=0;
const context=vm.createContext({state,$:node,recordedSpeed,recordedPause:()=>false,loaded:new Set([0]),pauseTimeline:{display:t=>t},transport(){},updateBattery(element,value){batteryUpdates++;element.value=value;},at:(i,k)=>values[i*84+k],bits:()=>512,document:{querySelectorAll:()=>[]},subjectPose:()=>({x:10,z:20}),Math});
vm.runInContext(hud,context);
vm.runInContext('updateHUD()',context);assert.equal(node('subject-speed').textContent,'5.00 m/s');assert.equal(node('battery-status').hidden,false);assert.equal(node('input-panel').hidden,false);
state.subject=0;vm.runInContext('updateHUD()',context);assert.equal(node('subject-speed').textContent,'1.50 m/s');assert.equal(node('current-subject').textContent,'实体 E01');assert.equal(node('battery-status').hidden,true);assert.equal(node('input-panel').hidden,true);assert.equal(batteryUpdates,1);
state.subject=4;vm.runInContext('updateHUD()',context);assert.equal(node('subject-speed').textContent,'6.50 m/s');assert.equal(node('battery-status').hidden,true);
state.subject=-1;state.index=1;vm.runInContext('updateHUD()',context);assert.equal(node('subject-speed').textContent,'5.00 m/s');assert.equal(node('battery-status').hidden,false);assert.equal(node('battery-status').value,48);assert.equal(node('input-panel').hidden,false);
console.log('Switching between player and entities updates speed and shows only applicable player resources/inputs');
