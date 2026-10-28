// Coin state is reconstructed by the server from the verified movement trace.
export const PICKUP_SECONDS=.75;
const collectedAt=(pickupTime,time)=>Number.isFinite(pickupTime)&&pickupTime>=0&&time>=pickupTime;
export const coinCollected=(coin,time)=>collectedAt(coin.pickupTime,time);
export function coinPose(time,pickupTime=null,ageTime=time,id=0){
 const collected=collectedAt(pickupTime,ageTime);
 const age=collected?ageTime-pickupTime:0,progress=Math.min(1,age/PICKUP_SECONDS);
 return {collected,visible:!collected||age<PICKUP_SECONDS,progress,
  yaw:time*1.55+id*1.7+(collected?progress*7:0),height:1.05+(collected?progress*.38:Math.sin(time*2.3+id)*.045),
  scale:collected?Math.sqrt(Math.max(0,1-progress/.48)):1};
}
export function replayCoins(meta){
 const pickups=new Map((meta.coinPickups||[]).map(p=>[p.id,p.time]));
 return (meta.coins||[]).map(coin=>({...coin,pickupTime:pickups.get(coin.id)??null}));
}
