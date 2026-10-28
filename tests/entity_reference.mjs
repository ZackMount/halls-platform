// Reference interpreter retained only for geometry parity tests.
import program from '../web/replay/entity-program.json' with {type:'json'};
let state,at,clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
function wireModel(entityIndex,cloudOnly=false){const i=state.index,k=24+entityIndex*12,O=program.ops,C=program.constants,F=program.functions,B=program.code,r=Array.from({length:O.REGISTERS},()=>[0,0,0]),s=[],calls=[],vertices=[],particles=[];const scalar=x=>[x,x,x],pop=()=>s.pop();
 let [pc,base]=F[O.FN_DRAW];const args=cloudOnly?[[state.meta.exit[0]*2+1,0,state.meta.exit[1]*2+1],scalar(0),scalar(at(i,22)),scalar(0),scalar(-state.meta.ceiling/3.5),scalar(0),scalar(0),scalar(0),scalar(1)]:[[at(i,k),0,at(i,k+1)],scalar(at(i,k+2)),scalar(at(i,22)),scalar(Number(BigInt(state.meta.formSeeds[entityIndex])%997n)),scalar(state.meta.ceiling/3.5),scalar(at(i,k+3)),scalar(at(i,k+4)),scalar(at(i,k+5)),scalar(clamp((at(i,k+6)-70)/30,0,1))];args.forEach((v,n)=>r[base+n]=v);
 for(let count=0;count<2_000_000;count++){
  const op=B[pc++];if(op>=48+O.REGISTERS){s.push(scalar(C[op-48-O.REGISTERS]));continue;}if(op>=48){s.push(r[op-48]);continue;}
  if(op===O.SET){r[B[pc++]]=pop();continue;}if(op===O.INDEX){s.push(r[Math.trunc(pop()[0])]);continue;}if(op===O.PUT){const v=pop();r[Math.trunc(pop()[0])]=v;continue;}
  if(op===O.JUMP||op===O.ZERO){const dest=B[pc]+256*B[pc+1];pc+=2;if(op===O.JUMP||pop()[0]===0)pc=dest;continue;}
  if(op===O.CALL){const f=F[B[pc++]],argv=s.splice(s.length-f[2],f[2]);argv.forEach((v,n)=>r[f[1]+n]=v);calls.push(pc);pc=f[0];continue;}
  if(op===O.RETURN){if(!calls.length)return {vertices,particles};pc=calls.pop();continue;}if(op===O.POP){pop();continue;}
  if(op===O.QUAD||op===O.RQUAD){const d=pop(),c=pop(),b=pop(),a=pop();for(const p of [a,b,c,a,c,d])(op===O.RQUAD?particles:vertices).push(p[0],p[1],-p[2]);continue;}
  if(op===O.VEC){const z=pop()[0],y=pop()[0],x=pop()[0];s.push([x,y,z]);continue;}
  const b=pop();let v;
  if(op===O.NEG)v=b.map(x=>-x);else if(op===O.SIN)v=scalar(Math.sin(b[0]));else if(op===O.COS)v=scalar(Math.cos(b[0]));else if(op===O.ABS)v=scalar(Math.abs(b[0]));else if(op===O.SQRT)v=scalar(Math.sqrt(b[0]));else{const a=pop();if(op===O.ADD)v=a.map((x,j)=>x+b[j]);else if(op===O.SUB)v=a.map((x,j)=>x-b[j]);else if(op===O.MUL)v=a.map(x=>x*b[0]);else if(op===O.DIV)v=a.map(x=>x/b[0]);else if(op===O.LT)v=scalar(+(a[0]<b[0]));else if(op===O.EQ)v=scalar(+(a[0]===b[0]));else if(op===O.POW)v=scalar(Math.pow(a[0],b[0]));else if(op===O.REM)v=scalar((a[0]%b[0]+b[0])%b[0]);else if(op===O.MIN)v=scalar(Math.min(a[0],b[0]));else if(op===O.MAX)v=scalar(Math.max(a[0],b[0]));else if(op===O.DOT)v=scalar(a[0]*b[0]+a[1]*b[1]+a[2]*b[2]);else if(op===O.CROSS)v=[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];else throw new Error('Unknown procedural opcode');}s.push(v);
 }
 throw new Error('Entity program exceeded instruction budget');
}

export function legacy(meta,row){state={index:0,meta};at=(i,k)=>row[k];return wireModel(0);}