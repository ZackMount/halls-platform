var sh=0,bl=1,rh=2;var Sl=1,ah=2,bn=3,On=0,Vt=1,wt=2,zn=0,Ei=1,wl=2,El=3,Tl=4,oh=5,ei=100,lh=101,ch=102,hh=103,uh=104,dh=200,fh=201,ph=202,mh=203,$r=204,Jr=205,gh=206,xh=207,_h=208,yh=209,vh=210,Mh=211,bh=212,Sh=213,wh=214,ba=0,Sa=1,wa=2,Ti=3,Ea=4,Ta=5,Aa=6,Ra=7,Al=0,Eh=1,Th=2,mn=0,Ah=1,Rh=2,Ch=3,Ih=4,Ph=5,Dh=6,Lh=7;var Rl=300,Ii=301,Pi=302,Ca=303,Ia=304,nr=306,Kr=1e3,Qn=1001,jr=1002,Xt=1003,Uh=1004;var ir=1005;var qt=1006,Pa=1007;var ai=1008;var Sn=1009,Cl=1010,Il=1011,fs=1012,Da=1013,oi=1014,wn=1015,ps=1016,La=1017,Ua=1018,ms=1020,Pl=35902,Dl=35899,Ll=1021,Ul=1022,hn=1023,rs=1026,gs=1027,xs=1028,Na=1029,Nl=1030,Fa=1031;var Oa=1033,sr=33776,rr=33777,ar=33778,or=33779,Ba=35840,ka=35841,za=35842,Va=35843,Ha=36196,Ga=37492,Wa=37496,Xa=37808,qa=37809,Ya=37810,Za=37811,$a=37812,Ja=37813,Ka=37814,ja=37815,Qa=37816,eo=37817,to=37818,no=37819,io=37820,so=37821,ro=36492,ao=36494,oo=36495,lo=36283,co=36284,ho=36285,uo=36286;var Ns=2300,Qr=2301,Zr=2302,gl=2400,xl=2401,_l=2402;var Nh=3200,Fh=3201;var Oh=0,Bh=1,Vn="",zt="srgb",Ai="srgb-linear",Fs="linear",it="srgb";var wi=7680;var yl=519,kh=512,zh=513,Vh=514,Fl=515,Hh=516,Gh=517,Wh=518,Xh=519,vl=35044,lr=35048;var Ol="300 es",pn=2e3,Os=2001;var Bn=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){let i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){let i=this._listeners;if(i===void 0)return;let s=i[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let i=t[e.type];if(i!==void 0){e.target=this;let s=i.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}},Ut=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];var qo=Math.PI/180,ea=180/Math.PI;function cr(){let n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Ut[n&255]+Ut[n>>8&255]+Ut[n>>16&255]+Ut[n>>24&255]+"-"+Ut[e&255]+Ut[e>>8&255]+"-"+Ut[e>>16&15|64]+Ut[e>>24&255]+"-"+Ut[t&63|128]+Ut[t>>8&255]+"-"+Ut[t>>16&255]+Ut[t>>24&255]+Ut[i&255]+Ut[i>>8&255]+Ut[i>>16&255]+Ut[i>>24&255]).toLowerCase()}function je(n,e,t){return Math.max(e,Math.min(t,n))}function Ld(n,e){return(n%e+e)%e}function Yo(n,e,t){return(1-t)*n+t*e}function Cs(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Wt(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}var Ze=class n{constructor(e=0,t=0){n.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=je(this.x,e.x,t.x),this.y=je(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=je(this.x,e,t),this.y=je(this.y,e,t),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(je(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let i=this.dot(e)/t;return Math.acos(je(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let i=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*i-a*s+e.x,this.y=r*s+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},kn=class{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,r,a,o){let l=i[s+0],c=i[s+1],h=i[s+2],u=i[s+3],d=r[a+0],f=r[a+1],m=r[a+2],_=r[a+3];if(o===0){e[t+0]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u;return}if(o===1){e[t+0]=d,e[t+1]=f,e[t+2]=m,e[t+3]=_;return}if(u!==_||l!==d||c!==f||h!==m){let g=1-o,p=l*d+c*f+h*m+u*_,E=p>=0?1:-1,w=1-p*p;if(w>Number.EPSILON){let T=Math.sqrt(w),R=Math.atan2(T,p*E);g=Math.sin(g*R)/T,o=Math.sin(o*R)/T}let v=o*E;if(l=l*g+d*v,c=c*g+f*v,h=h*g+m*v,u=u*g+_*v,g===1-o){let T=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=T,c*=T,h*=T,u*=T}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,i,s,r,a){let o=i[s],l=i[s+1],c=i[s+2],h=i[s+3],u=r[a],d=r[a+1],f=r[a+2],m=r[a+3];return e[t]=o*m+h*u+l*f-c*d,e[t+1]=l*m+h*d+c*u-o*f,e[t+2]=c*m+h*f+o*d-l*u,e[t+3]=h*m-o*u-l*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let i=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(i/2),h=o(s/2),u=o(r/2),d=l(i/2),f=l(s/2),m=l(r/2);switch(a){case"XYZ":this._x=d*h*u+c*f*m,this._y=c*f*u-d*h*m,this._z=c*h*m+d*f*u,this._w=c*h*u-d*f*m;break;case"YXZ":this._x=d*h*u+c*f*m,this._y=c*f*u-d*h*m,this._z=c*h*m-d*f*u,this._w=c*h*u+d*f*m;break;case"ZXY":this._x=d*h*u-c*f*m,this._y=c*f*u+d*h*m,this._z=c*h*m+d*f*u,this._w=c*h*u-d*f*m;break;case"ZYX":this._x=d*h*u-c*f*m,this._y=c*f*u+d*h*m,this._z=c*h*m-d*f*u,this._w=c*h*u+d*f*m;break;case"YZX":this._x=d*h*u+c*f*m,this._y=c*f*u+d*h*m,this._z=c*h*m-d*f*u,this._w=c*h*u-d*f*m;break;case"XZY":this._x=d*h*u-c*f*m,this._y=c*f*u-d*h*m,this._z=c*h*m+d*f*u,this._w=c*h*u+d*f*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,i=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],u=t[10],d=i+o+u;if(d>0){let f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(a-s)*f}else if(i>o&&i>u){let f=2*Math.sqrt(1+i-o-u);this._w=(h-l)/f,this._x=.25*f,this._y=(s+a)/f,this._z=(r+c)/f}else if(o>u){let f=2*Math.sqrt(1+o-i-u);this._w=(r-c)/f,this._x=(s+a)/f,this._y=.25*f,this._z=(l+h)/f}else{let f=2*Math.sqrt(1+u-i-o);this._w=(a-s)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(je(this.dot(e),-1,1)))}rotateTowards(e,t){let i=this.angleTo(e);if(i===0)return this;let s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let i=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=i*h+a*o+s*c-r*l,this._y=s*h+a*l+r*o-i*c,this._z=r*h+a*c+i*l-s*o,this._w=a*h-i*o-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let i=this._x,s=this._y,r=this._z,a=this._w,o=a*e._w+i*e._x+s*e._y+r*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=i,this._y=s,this._z=r,this;let l=1-o*o;if(l<=Number.EPSILON){let f=1-t;return this._w=f*a+t*this._w,this._x=f*i+t*this._x,this._y=f*s+t*this._y,this._z=f*r+t*this._z,this.normalize(),this}let c=Math.sqrt(l),h=Math.atan2(c,o),u=Math.sin((1-t)*h)/c,d=Math.sin(t*h)/c;return this._w=a*u+this._w*d,this._x=i*u+this._x*d,this._y=s*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},B=class n{constructor(e=0,t=0,i=0){n.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(kc.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(kc.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6]*s,this.y=r[1]*t+r[4]*i+r[7]*s,this.z=r[2]*t+r[5]*i+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,i=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*i+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*i+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*i+r[10]*s+r[14])*a,this}applyQuaternion(e){let t=this.x,i=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*s-o*i),h=2*(o*t-r*s),u=2*(r*i-a*t);return this.x=t+l*c+a*u-o*h,this.y=i+l*h+o*c-r*u,this.z=s+l*u+r*h-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*s,this.y=r[1]*t+r[5]*i+r[9]*s,this.z=r[2]*t+r[6]*i+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=je(this.x,e.x,t.x),this.y=je(this.y,e.y,t.y),this.z=je(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=je(this.x,e,t),this.y=je(this.y,e,t),this.z=je(this.z,e,t),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(je(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let i=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-i*l,this.z=i*o-s*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Zo.copy(this).projectOnVector(e),this.sub(Zo)}reflect(e){return this.sub(Zo.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let i=this.dot(e)/t;return Math.acos(je(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){let s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Zo=new B,kc=new kn,Xe=class n{constructor(e,t,i,s,r,a,o,l,c){n.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,l,c)}set(e,t,i,s,r,a,o,l,c){let h=this.elements;return h[0]=e,h[1]=s,h[2]=o,h[3]=t,h[4]=r,h[5]=l,h[6]=i,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],h=i[4],u=i[7],d=i[2],f=i[5],m=i[8],_=s[0],g=s[3],p=s[6],E=s[1],w=s[4],v=s[7],T=s[2],R=s[5],P=s[8];return r[0]=a*_+o*E+l*T,r[3]=a*g+o*w+l*R,r[6]=a*p+o*v+l*P,r[1]=c*_+h*E+u*T,r[4]=c*g+h*w+u*R,r[7]=c*p+h*v+u*P,r[2]=d*_+f*E+m*T,r[5]=d*g+f*w+m*R,r[8]=d*p+f*v+m*P,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-i*r*h+i*o*l+s*r*c-s*a*l}invert(){let e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=h*a-o*c,d=o*l-h*r,f=c*r-a*l,m=t*u+i*d+s*f;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);let _=1/m;return e[0]=u*_,e[1]=(s*c-h*i)*_,e[2]=(o*i-s*a)*_,e[3]=d*_,e[4]=(h*t-s*l)*_,e[5]=(s*r-o*t)*_,e[6]=f*_,e[7]=(i*l-c*t)*_,e[8]=(a*t-i*r)*_,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,r,a,o){let l=Math.cos(r),c=Math.sin(r);return this.set(i*l,i*c,-i*(l*a+c*o)+a+e,-s*c,s*l,-s*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply($o.makeScale(e,t)),this}rotate(e){return this.premultiply($o.makeRotation(-e)),this}translate(e,t){return this.premultiply($o.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){let i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}},$o=new Xe;function Bl(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function Bs(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function qh(){let n=Bs("canvas");return n.style.display="block",n}var zc={};function as(n){n in zc||(zc[n]=!0,console.warn(n))}function Yh(n,e,t){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:i()}}setTimeout(r,t)})}var Vc=new Xe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Hc=new Xe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Ud(){let n={enabled:!0,workingColorSpace:Ai,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===it&&(s.r=Fn(s.r),s.g=Fn(s.g),s.b=Fn(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===it&&(s.r=ss(s.r),s.g=ss(s.g),s.b=ss(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Vn?Fs:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return as("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return as("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[Ai]:{primaries:e,whitePoint:i,transfer:Fs,toXYZ:Vc,fromXYZ:Hc,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:zt},outputColorSpaceConfig:{drawingBufferColorSpace:zt}},[zt]:{primaries:e,whitePoint:i,transfer:it,toXYZ:Vc,fromXYZ:Hc,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:zt}}}),n}var Qe=Ud();function Fn(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function ss(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}var qi,ta=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{qi===void 0&&(qi=Bs("canvas")),qi.width=e.width,qi.height=e.height;let s=qi.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),i=qi}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=Bs("canvas");t.width=e.width,t.height=e.height;let i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);let s=i.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Fn(r[a]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(Fn(t[i]/255)*255):t[i]=Fn(t[i]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},Nd=0,os=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Nd++}),this.uuid=cr(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Jo(s[a].image)):r.push(Jo(s[a]))}else r=Jo(s);i.url=r}return t||(e.images[this.uuid]=i),i}};function Jo(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?ta.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var Fd=0,Ko=new B,Yt=class n extends Bn{constructor(e=n.DEFAULT_IMAGE,t=n.DEFAULT_MAPPING,i=Qn,s=Qn,r=qt,a=ai,o=hn,l=Sn,c=n.DEFAULT_ANISOTROPY,h=Vn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Fd++}),this.uuid=cr(),this.name="",this.source=new os(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Ze(0,0),this.repeat=new Ze(1,1),this.center=new Ze(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Xe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Ko).x}get height(){return this.source.getSize(Ko).y}get depth(){return this.source.getSize(Ko).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let i=e[t];if(i===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[t]=i}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Rl)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Kr:e.x=e.x-Math.floor(e.x);break;case Qn:e.x=e.x<0?0:1;break;case jr:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Kr:e.y=e.y-Math.floor(e.y);break;case Qn:e.y=e.y<0?0:1;break;case jr:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Yt.DEFAULT_IMAGE=null;Yt.DEFAULT_MAPPING=Rl;Yt.DEFAULT_ANISOTROPY=1;var bt=class n{constructor(e=0,t=0,i=0,s=1){n.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,i=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*i+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*i+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*i+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,r,l=e.elements,c=l[0],h=l[4],u=l[8],d=l[1],f=l[5],m=l[9],_=l[2],g=l[6],p=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-_)<.01&&Math.abs(m-g)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+_)<.1&&Math.abs(m+g)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let w=(c+1)/2,v=(f+1)/2,T=(p+1)/2,R=(h+d)/4,P=(u+_)/4,U=(m+g)/4;return w>v&&w>T?w<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(w),s=R/i,r=P/i):v>T?v<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(v),i=R/s,r=U/s):T<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(T),i=P/r,s=U/r),this.set(i,s,r,t),this}let E=Math.sqrt((g-m)*(g-m)+(u-_)*(u-_)+(d-h)*(d-h));return Math.abs(E)<.001&&(E=1),this.x=(g-m)/E,this.y=(u-_)/E,this.z=(d-h)/E,this.w=Math.acos((c+f+p-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=je(this.x,e.x,t.x),this.y=je(this.y,e.y,t.y),this.z=je(this.z,e.z,t.z),this.w=je(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=je(this.x,e,t),this.y=je(this.y,e,t),this.z=je(this.z,e,t),this.w=je(this.w,e,t),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(je(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},na=class extends Bn{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:qt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new bt(0,0,e,t),this.scissorTest=!1,this.viewport=new bt(0,0,e,t);let s={width:e,height:t,depth:i.depth},r=new Yt(s);this.textures=[];let a=i.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(e={}){let t={minFilter:qt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let s=Object.assign({},e.textures[t].image);this.textures[t].source=new os(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},vn=class extends na{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}},ks=class extends Yt{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Xt,this.minFilter=Xt,this.wrapR=Qn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var ia=class extends Yt{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Xt,this.minFilter=Xt,this.wrapR=Qn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var ti=class{constructor(e=new B(1/0,1/0,1/0),t=new B(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(un.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(un.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let i=un.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let i=e.geometry;if(i!==void 0){let r=i.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,un):un.fromBufferAttribute(r,a),un.applyMatrix4(e.matrixWorld),this.expandByPoint(un);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Rr.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Rr.copy(i.boundingBox)),Rr.applyMatrix4(e.matrixWorld),this.union(Rr)}let s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,un),un.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Is),Cr.subVectors(this.max,Is),Yi.subVectors(e.a,Is),Zi.subVectors(e.b,Is),$i.subVectors(e.c,Is),qn.subVectors(Zi,Yi),Yn.subVectors($i,Zi),vi.subVectors(Yi,$i);let t=[0,-qn.z,qn.y,0,-Yn.z,Yn.y,0,-vi.z,vi.y,qn.z,0,-qn.x,Yn.z,0,-Yn.x,vi.z,0,-vi.x,-qn.y,qn.x,0,-Yn.y,Yn.x,0,-vi.y,vi.x,0];return!jo(t,Yi,Zi,$i,Cr)||(t=[1,0,0,0,1,0,0,0,1],!jo(t,Yi,Zi,$i,Cr))?!1:(Ir.crossVectors(qn,Yn),t=[Ir.x,Ir.y,Ir.z],jo(t,Yi,Zi,$i,Cr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,un).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(un).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Pn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Pn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Pn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Pn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Pn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Pn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Pn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Pn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Pn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Pn=[new B,new B,new B,new B,new B,new B,new B,new B],un=new B,Rr=new ti,Yi=new B,Zi=new B,$i=new B,qn=new B,Yn=new B,vi=new B,Is=new B,Cr=new B,Ir=new B,Mi=new B;function jo(n,e,t,i,s){for(let r=0,a=n.length-3;r<=a;r+=3){Mi.fromArray(n,r);let o=s.x*Math.abs(Mi.x)+s.y*Math.abs(Mi.y)+s.z*Math.abs(Mi.z),l=e.dot(Mi),c=t.dot(Mi),h=i.dot(Mi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}var Od=new ti,Ps=new B,Qo=new B,Ri=class{constructor(e=new B,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let i=this.center;t!==void 0?i.copy(t):Od.setFromPoints(e).getCenter(i);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,i.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Ps.subVectors(e,this.center);let t=Ps.lengthSq();if(t>this.radius*this.radius){let i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(Ps,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Qo.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Ps.copy(e.center).add(Qo)),this.expandByPoint(Ps.copy(e.center).sub(Qo))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},Dn=new B,el=new B,Pr=new B,Zn=new B,tl=new B,Dr=new B,nl=new B,zs=class{constructor(e=new B,t=new B(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Dn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Dn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Dn.copy(this.origin).addScaledVector(this.direction,t),Dn.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){el.copy(e).add(t).multiplyScalar(.5),Pr.copy(t).sub(e).normalize(),Zn.copy(this.origin).sub(el);let r=e.distanceTo(t)*.5,a=-this.direction.dot(Pr),o=Zn.dot(this.direction),l=-Zn.dot(Pr),c=Zn.lengthSq(),h=Math.abs(1-a*a),u,d,f,m;if(h>0)if(u=a*l-o,d=a*o-l,m=r*h,u>=0)if(d>=-m)if(d<=m){let _=1/h;u*=_,d*=_,f=u*(u+a*d+2*o)+d*(a*u+d+2*l)+c}else d=r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;else d=-r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;else d<=-m?(u=Math.max(0,-(-a*r+o)),d=u>0?-r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c):d<=m?(u=0,d=Math.min(Math.max(-r,-l),r),f=d*(d+2*l)+c):(u=Math.max(0,-(a*r+o)),d=u>0?r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c);else d=a>0?-r:r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(el).addScaledVector(Pr,d),f}intersectSphere(e,t){Dn.subVectors(e.center,this.origin);let i=Dn.dot(this.direction),s=Dn.dot(Dn)-i*i,r=e.radius*e.radius;if(s>r)return null;let a=Math.sqrt(r-s),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){let i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,r,a,o,l,c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(i=(e.min.x-d.x)*c,s=(e.max.x-d.x)*c):(i=(e.max.x-d.x)*c,s=(e.min.x-d.x)*c),h>=0?(r=(e.min.y-d.y)*h,a=(e.max.y-d.y)*h):(r=(e.max.y-d.y)*h,a=(e.min.y-d.y)*h),i>a||r>s||((r>i||isNaN(i))&&(i=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(e.min.z-d.z)*u,l=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,l=(e.min.z-d.z)*u),i>l||o>s)||((o>i||i!==i)&&(i=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,Dn)!==null}intersectTriangle(e,t,i,s,r){tl.subVectors(t,e),Dr.subVectors(i,e),nl.crossVectors(tl,Dr);let a=this.direction.dot(nl),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Zn.subVectors(this.origin,e);let l=o*this.direction.dot(Dr.crossVectors(Zn,Dr));if(l<0)return null;let c=o*this.direction.dot(tl.cross(Zn));if(c<0||l+c>a)return null;let h=-o*Zn.dot(nl);return h<0?null:this.at(h/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Tt=class n{constructor(e,t,i,s,r,a,o,l,c,h,u,d,f,m,_,g){n.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,l,c,h,u,d,f,m,_,g)}set(e,t,i,s,r,a,o,l,c,h,u,d,f,m,_,g){let p=this.elements;return p[0]=e,p[4]=t,p[8]=i,p[12]=s,p[1]=r,p[5]=a,p[9]=o,p[13]=l,p[2]=c,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=m,p[11]=_,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new n().fromArray(this.elements)}copy(e){let t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){let t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,i=e.elements,s=1/Ji.setFromMatrixColumn(e,0).length(),r=1/Ji.setFromMatrixColumn(e,1).length(),a=1/Ji.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*r,t[5]=i[5]*r,t[6]=i[6]*r,t[7]=0,t[8]=i[8]*a,t[9]=i[9]*a,t[10]=i[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,i=e.x,s=e.y,r=e.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){let d=a*h,f=a*u,m=o*h,_=o*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=f+m*c,t[5]=d-_*c,t[9]=-o*l,t[2]=_-d*c,t[6]=m+f*c,t[10]=a*l}else if(e.order==="YXZ"){let d=l*h,f=l*u,m=c*h,_=c*u;t[0]=d+_*o,t[4]=m*o-f,t[8]=a*c,t[1]=a*u,t[5]=a*h,t[9]=-o,t[2]=f*o-m,t[6]=_+d*o,t[10]=a*l}else if(e.order==="ZXY"){let d=l*h,f=l*u,m=c*h,_=c*u;t[0]=d-_*o,t[4]=-a*u,t[8]=m+f*o,t[1]=f+m*o,t[5]=a*h,t[9]=_-d*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){let d=a*h,f=a*u,m=o*h,_=o*u;t[0]=l*h,t[4]=m*c-f,t[8]=d*c+_,t[1]=l*u,t[5]=_*c+d,t[9]=f*c-m,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){let d=a*l,f=a*c,m=o*l,_=o*c;t[0]=l*h,t[4]=_-d*u,t[8]=m*u+f,t[1]=u,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=f*u+m,t[10]=d-_*u}else if(e.order==="XZY"){let d=a*l,f=a*c,m=o*l,_=o*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=d*u+_,t[5]=a*h,t[9]=f*u-m,t[2]=m*u-f,t[6]=o*h,t[10]=_*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Bd,e,kd)}lookAt(e,t,i){let s=this.elements;return en.subVectors(e,t),en.lengthSq()===0&&(en.z=1),en.normalize(),$n.crossVectors(i,en),$n.lengthSq()===0&&(Math.abs(i.z)===1?en.x+=1e-4:en.z+=1e-4,en.normalize(),$n.crossVectors(i,en)),$n.normalize(),Lr.crossVectors(en,$n),s[0]=$n.x,s[4]=Lr.x,s[8]=en.x,s[1]=$n.y,s[5]=Lr.y,s[9]=en.y,s[2]=$n.z,s[6]=Lr.z,s[10]=en.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],h=i[1],u=i[5],d=i[9],f=i[13],m=i[2],_=i[6],g=i[10],p=i[14],E=i[3],w=i[7],v=i[11],T=i[15],R=s[0],P=s[4],U=s[8],S=s[12],b=s[1],I=s[5],k=s[9],X=s[13],Y=s[2],K=s[6],$=s[10],ne=s[14],Z=s[3],de=s[7],xe=s[11],Ce=s[15];return r[0]=a*R+o*b+l*Y+c*Z,r[4]=a*P+o*I+l*K+c*de,r[8]=a*U+o*k+l*$+c*xe,r[12]=a*S+o*X+l*ne+c*Ce,r[1]=h*R+u*b+d*Y+f*Z,r[5]=h*P+u*I+d*K+f*de,r[9]=h*U+u*k+d*$+f*xe,r[13]=h*S+u*X+d*ne+f*Ce,r[2]=m*R+_*b+g*Y+p*Z,r[6]=m*P+_*I+g*K+p*de,r[10]=m*U+_*k+g*$+p*xe,r[14]=m*S+_*X+g*ne+p*Ce,r[3]=E*R+w*b+v*Y+T*Z,r[7]=E*P+w*I+v*K+T*de,r[11]=E*U+w*k+v*$+T*xe,r[15]=E*S+w*X+v*ne+T*Ce,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],i=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],u=e[6],d=e[10],f=e[14],m=e[3],_=e[7],g=e[11],p=e[15];return m*(+r*l*u-s*c*u-r*o*d+i*c*d+s*o*f-i*l*f)+_*(+t*l*f-t*c*d+r*a*d-s*a*f+s*c*h-r*l*h)+g*(+t*c*u-t*o*f-r*a*u+i*a*f+r*o*h-i*c*h)+p*(-s*o*h-t*l*u+t*o*d+s*a*u-i*a*d+i*l*h)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){let e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=e[9],d=e[10],f=e[11],m=e[12],_=e[13],g=e[14],p=e[15],E=u*g*c-_*d*c+_*l*f-o*g*f-u*l*p+o*d*p,w=m*d*c-h*g*c-m*l*f+a*g*f+h*l*p-a*d*p,v=h*_*c-m*u*c+m*o*f-a*_*f-h*o*p+a*u*p,T=m*u*l-h*_*l-m*o*d+a*_*d+h*o*g-a*u*g,R=t*E+i*w+s*v+r*T;if(R===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let P=1/R;return e[0]=E*P,e[1]=(_*d*r-u*g*r-_*s*f+i*g*f+u*s*p-i*d*p)*P,e[2]=(o*g*r-_*l*r+_*s*c-i*g*c-o*s*p+i*l*p)*P,e[3]=(u*l*r-o*d*r-u*s*c+i*d*c+o*s*f-i*l*f)*P,e[4]=w*P,e[5]=(h*g*r-m*d*r+m*s*f-t*g*f-h*s*p+t*d*p)*P,e[6]=(m*l*r-a*g*r-m*s*c+t*g*c+a*s*p-t*l*p)*P,e[7]=(a*d*r-h*l*r+h*s*c-t*d*c-a*s*f+t*l*f)*P,e[8]=v*P,e[9]=(m*u*r-h*_*r-m*i*f+t*_*f+h*i*p-t*u*p)*P,e[10]=(a*_*r-m*o*r+m*i*c-t*_*c-a*i*p+t*o*p)*P,e[11]=(h*o*r-a*u*r-h*i*c+t*u*c+a*i*f-t*o*f)*P,e[12]=T*P,e[13]=(h*_*s-m*u*s+m*i*d-t*_*d-h*i*g+t*u*g)*P,e[14]=(m*o*s-a*_*s-m*i*l+t*_*l+a*i*g-t*o*g)*P,e[15]=(a*u*s-h*o*s+h*i*l-t*u*l-a*i*d+t*o*d)*P,this}scale(e){let t=this.elements,i=e.x,s=e.y,r=e.z;return t[0]*=i,t[4]*=s,t[8]*=r,t[1]*=i,t[5]*=s,t[9]*=r,t[2]*=i,t[6]*=s,t[10]*=r,t[3]*=i,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let i=Math.cos(t),s=Math.sin(t),r=1-i,a=e.x,o=e.y,l=e.z,c=r*a,h=r*o;return this.set(c*a+i,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+i,h*l-s*a,0,c*l-s*o,h*l+s*a,r*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,r,a){return this.set(1,i,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){let s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,h=a+a,u=o+o,d=r*c,f=r*h,m=r*u,_=a*h,g=a*u,p=o*u,E=l*c,w=l*h,v=l*u,T=i.x,R=i.y,P=i.z;return s[0]=(1-(_+p))*T,s[1]=(f+v)*T,s[2]=(m-w)*T,s[3]=0,s[4]=(f-v)*R,s[5]=(1-(d+p))*R,s[6]=(g+E)*R,s[7]=0,s[8]=(m+w)*P,s[9]=(g-E)*P,s[10]=(1-(d+_))*P,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){let s=this.elements,r=Ji.set(s[0],s[1],s[2]).length(),a=Ji.set(s[4],s[5],s[6]).length(),o=Ji.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],dn.copy(this);let c=1/r,h=1/a,u=1/o;return dn.elements[0]*=c,dn.elements[1]*=c,dn.elements[2]*=c,dn.elements[4]*=h,dn.elements[5]*=h,dn.elements[6]*=h,dn.elements[8]*=u,dn.elements[9]*=u,dn.elements[10]*=u,t.setFromRotationMatrix(dn),i.x=r,i.y=a,i.z=o,this}makePerspective(e,t,i,s,r,a,o=pn,l=!1){let c=this.elements,h=2*r/(t-e),u=2*r/(i-s),d=(t+e)/(t-e),f=(i+s)/(i-s),m,_;if(l)m=r/(a-r),_=a*r/(a-r);else if(o===pn)m=-(a+r)/(a-r),_=-2*a*r/(a-r);else if(o===Os)m=-a/(a-r),_=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=m,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,i,s,r,a,o=pn,l=!1){let c=this.elements,h=2/(t-e),u=2/(i-s),d=-(t+e)/(t-e),f=-(i+s)/(i-s),m,_;if(l)m=1/(a-r),_=a/(a-r);else if(o===pn)m=-2/(a-r),_=-(a+r)/(a-r);else if(o===Os)m=-1/(a-r),_=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=m,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){let i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}},Ji=new B,dn=new Tt,Bd=new B(0,0,0),kd=new B(1,1,1),$n=new B,Lr=new B,en=new B,Gc=new Tt,Wc=new kn,Mn=class n{constructor(e=0,t=0,i=0,s=n.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){let s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],h=s[9],u=s[2],d=s[6],f=s[10];switch(t){case"XYZ":this._y=Math.asin(je(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-je(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(je(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-je(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(je(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-je(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return Gc.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Gc,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Wc.setFromEuler(this),this.setFromQuaternion(Wc,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Mn.DEFAULT_ORDER="XYZ";var Vs=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},zd=0,Xc=new B,Ki=new kn,Ln=new Tt,Ur=new B,Ds=new B,Vd=new B,Hd=new kn,qc=new B(1,0,0),Yc=new B(0,1,0),Zc=new B(0,0,1),$c={type:"added"},Gd={type:"removed"},ji={type:"childadded",child:null},il={type:"childremoved",child:null},nn=class n extends Bn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:zd++}),this.uuid=cr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=n.DEFAULT_UP.clone();let e=new B,t=new Mn,i=new kn,s=new B(1,1,1);function r(){i.setFromEuler(t,!1)}function a(){t.setFromQuaternion(i,void 0,!1)}t._onChange(r),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Tt},normalMatrix:{value:new Xe}}),this.matrix=new Tt,this.matrixWorld=new Tt,this.matrixAutoUpdate=n.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=n.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Vs,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Ki.setFromAxisAngle(e,t),this.quaternion.multiply(Ki),this}rotateOnWorldAxis(e,t){return Ki.setFromAxisAngle(e,t),this.quaternion.premultiply(Ki),this}rotateX(e){return this.rotateOnAxis(qc,e)}rotateY(e){return this.rotateOnAxis(Yc,e)}rotateZ(e){return this.rotateOnAxis(Zc,e)}translateOnAxis(e,t){return Xc.copy(e).applyQuaternion(this.quaternion),this.position.add(Xc.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(qc,e)}translateY(e){return this.translateOnAxis(Yc,e)}translateZ(e){return this.translateOnAxis(Zc,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Ln.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Ur.copy(e):Ur.set(e,t,i);let s=this.parent;this.updateWorldMatrix(!0,!1),Ds.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ln.lookAt(Ds,Ur,this.up):Ln.lookAt(Ur,Ds,this.up),this.quaternion.setFromRotationMatrix(Ln),s&&(Ln.extractRotation(s.matrixWorld),Ki.setFromRotationMatrix(Ln),this.quaternion.premultiply(Ki.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent($c),ji.child=e,this.dispatchEvent(ji),ji.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Gd),il.child=e,this.dispatchEvent(il),il.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Ln.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Ln.multiply(e.parent.matrixWorld)),e.applyMatrix4(Ln),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent($c),ji.child=e,this.dispatchEvent(ji),ji.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){let a=this.children[i].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ds,e,Vd),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ds,Hd,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){let i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let u=l[c];r(e.shapes,u)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){let o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),u=a(e.shapes),d=a(e.skeletons),f=a(e.animations),m=a(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),u.length>0&&(i.shapes=u),d.length>0&&(i.skeletons=d),f.length>0&&(i.animations=f),m.length>0&&(i.nodes=m)}return i.object=s,i;function a(o){let l=[];for(let c in o){let h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){let s=e.children[i];this.add(s.clone())}return this}};nn.DEFAULT_UP=new B(0,1,0);nn.DEFAULT_MATRIX_AUTO_UPDATE=!0;nn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var fn=new B,Un=new B,sl=new B,Nn=new B,Qi=new B,es=new B,Jc=new B,rl=new B,al=new B,ol=new B,ll=new bt,cl=new bt,hl=new bt,jn=class n{constructor(e=new B,t=new B,i=new B){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),fn.subVectors(e,t),s.cross(fn);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,i,s,r){fn.subVectors(s,t),Un.subVectors(i,t),sl.subVectors(e,t);let a=fn.dot(fn),o=fn.dot(Un),l=fn.dot(sl),c=Un.dot(Un),h=Un.dot(sl),u=a*c-o*o;if(u===0)return r.set(0,0,0),null;let d=1/u,f=(c*l-o*h)*d,m=(a*h-o*l)*d;return r.set(1-f-m,m,f)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,Nn)===null?!1:Nn.x>=0&&Nn.y>=0&&Nn.x+Nn.y<=1}static getInterpolation(e,t,i,s,r,a,o,l){return this.getBarycoord(e,t,i,s,Nn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Nn.x),l.addScaledVector(a,Nn.y),l.addScaledVector(o,Nn.z),l)}static getInterpolatedAttribute(e,t,i,s,r,a){return ll.setScalar(0),cl.setScalar(0),hl.setScalar(0),ll.fromBufferAttribute(e,t),cl.fromBufferAttribute(e,i),hl.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(ll,r.x),a.addScaledVector(cl,r.y),a.addScaledVector(hl,r.z),a}static isFrontFacing(e,t,i,s){return fn.subVectors(i,t),Un.subVectors(e,t),fn.cross(Un).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return fn.subVectors(this.c,this.b),Un.subVectors(this.a,this.b),fn.cross(Un).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return n.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return n.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,r){return n.getInterpolation(e,this.a,this.b,this.c,t,i,s,r)}containsPoint(e){return n.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return n.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let i=this.a,s=this.b,r=this.c,a,o;Qi.subVectors(s,i),es.subVectors(r,i),rl.subVectors(e,i);let l=Qi.dot(rl),c=es.dot(rl);if(l<=0&&c<=0)return t.copy(i);al.subVectors(e,s);let h=Qi.dot(al),u=es.dot(al);if(h>=0&&u<=h)return t.copy(s);let d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return a=l/(l-h),t.copy(i).addScaledVector(Qi,a);ol.subVectors(e,r);let f=Qi.dot(ol),m=es.dot(ol);if(m>=0&&f<=m)return t.copy(r);let _=f*c-l*m;if(_<=0&&c>=0&&m<=0)return o=c/(c-m),t.copy(i).addScaledVector(es,o);let g=h*m-f*u;if(g<=0&&u-h>=0&&f-m>=0)return Jc.subVectors(r,s),o=(u-h)/(u-h+(f-m)),t.copy(s).addScaledVector(Jc,o);let p=1/(g+_+d);return a=_*p,o=d*p,t.copy(i).addScaledVector(Qi,a).addScaledVector(es,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Zh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Jn={h:0,s:0,l:0},Nr={h:0,s:0,l:0};function ul(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}var Ke=class{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=zt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Qe.colorSpaceToWorking(this,t),this}setRGB(e,t,i,s=Qe.workingColorSpace){return this.r=e,this.g=t,this.b=i,Qe.colorSpaceToWorking(this,s),this}setHSL(e,t,i,s=Qe.workingColorSpace){if(e=Ld(e,1),t=je(t,0,1),i=je(i,0,1),t===0)this.r=this.g=this.b=i;else{let r=i<=.5?i*(1+t):i+t-i*t,a=2*i-r;this.r=ul(a,r,e+1/3),this.g=ul(a,r,e),this.b=ul(a,r,e-1/3)}return Qe.colorSpaceToWorking(this,s),this}setStyle(e,t=zt){function i(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=zt){let i=Zh[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Fn(e.r),this.g=Fn(e.g),this.b=Fn(e.b),this}copyLinearToSRGB(e){return this.r=ss(e.r),this.g=ss(e.g),this.b=ss(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=zt){return Qe.workingToColorSpace(Nt.copy(this),e),Math.round(je(Nt.r*255,0,255))*65536+Math.round(je(Nt.g*255,0,255))*256+Math.round(je(Nt.b*255,0,255))}getHexString(e=zt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Qe.workingColorSpace){Qe.workingToColorSpace(Nt.copy(this),t);let i=Nt.r,s=Nt.g,r=Nt.b,a=Math.max(i,s,r),o=Math.min(i,s,r),l,c,h=(o+a)/2;if(o===a)l=0,c=0;else{let u=a-o;switch(c=h<=.5?u/(a+o):u/(2-a-o),a){case i:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-i)/u+2;break;case r:l=(i-s)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=Qe.workingColorSpace){return Qe.workingToColorSpace(Nt.copy(this),t),e.r=Nt.r,e.g=Nt.g,e.b=Nt.b,e}getStyle(e=zt){Qe.workingToColorSpace(Nt.copy(this),e);let t=Nt.r,i=Nt.g,s=Nt.b;return e!==zt?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL(Jn),this.setHSL(Jn.h+e,Jn.s+t,Jn.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(Jn),e.getHSL(Nr);let i=Yo(Jn.h,Nr.h,t),s=Yo(Jn.s,Nr.s,t),r=Yo(Jn.l,Nr.l,t);return this.setHSL(i,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,i=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*i+r[6]*s,this.g=r[1]*t+r[4]*i+r[7]*s,this.b=r[2]*t+r[5]*i+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Nt=new Ke;Ke.NAMES=Zh;var Wd=0,ni=class extends Bn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Wd++}),this.uuid=cr(),this.name="",this.type="Material",this.blending=Ei,this.side=On,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=$r,this.blendDst=Jr,this.blendEquation=ei,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ke(0,0,0),this.blendAlpha=0,this.depthFunc=Ti,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=yl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=wi,this.stencilZFail=wi,this.stencilZPass=wi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Ei&&(i.blending=this.blending),this.side!==On&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==$r&&(i.blendSrc=this.blendSrc),this.blendDst!==Jr&&(i.blendDst=this.blendDst),this.blendEquation!==ei&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Ti&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==yl&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==wi&&(i.stencilFail=this.stencilFail),this.stencilZFail!==wi&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==wi&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){let a=[];for(let o in r){let l=r[o];delete l.metadata,a.push(l)}return a}if(t){let r=s(e.textures),a=s(e.images);r.length>0&&(i.textures=r),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,i=null;if(t!==null){let s=t.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=t[r].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},St=class extends ni{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ke(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Mn,this.combine=Al,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}};var Et=new B,Fr=new Ze,Xd=0,Dt=class{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Xd++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=vl,this.updateRanges=[],this.gpuType=wn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Fr.fromBufferAttribute(this,t),Fr.applyMatrix3(e),this.setXY(t,Fr.x,Fr.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)Et.fromBufferAttribute(this,t),Et.applyMatrix3(e),this.setXYZ(t,Et.x,Et.y,Et.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)Et.fromBufferAttribute(this,t),Et.applyMatrix4(e),this.setXYZ(t,Et.x,Et.y,Et.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Et.fromBufferAttribute(this,t),Et.applyNormalMatrix(e),this.setXYZ(t,Et.x,Et.y,Et.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Et.fromBufferAttribute(this,t),Et.transformDirection(e),this.setXYZ(t,Et.x,Et.y,Et.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=Cs(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Wt(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Cs(t,this.array)),t}setX(e,t){return this.normalized&&(t=Wt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Cs(t,this.array)),t}setY(e,t){return this.normalized&&(t=Wt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Cs(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Wt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Cs(t,this.array)),t}setW(e,t){return this.normalized&&(t=Wt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=Wt(t,this.array),i=Wt(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=Wt(t,this.array),i=Wt(i,this.array),s=Wt(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e*=this.itemSize,this.normalized&&(t=Wt(t,this.array),i=Wt(i,this.array),s=Wt(s,this.array),r=Wt(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==vl&&(e.usage=this.usage),e}};var Hs=class extends Dt{constructor(e,t,i){super(new Uint16Array(e),t,i)}};var Gs=class extends Dt{constructor(e,t,i){super(new Uint32Array(e),t,i)}};var lt=class extends Dt{constructor(e,t,i){super(new Float32Array(e),t,i)}},qd=0,cn=new Tt,dl=new nn,ts=new B,tn=new ti,Ls=new ti,Pt=new B,gt=class n extends Bn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:qd++}),this.uuid=cr(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Bl(e)?Gs:Hs)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let i=this.attributes.normal;if(i!==void 0){let r=new Xe().getNormalMatrix(e);i.applyNormalMatrix(r),i.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return cn.makeRotationFromQuaternion(e),this.applyMatrix4(cn),this}rotateX(e){return cn.makeRotationX(e),this.applyMatrix4(cn),this}rotateY(e){return cn.makeRotationY(e),this.applyMatrix4(cn),this}rotateZ(e){return cn.makeRotationZ(e),this.applyMatrix4(cn),this}translate(e,t,i){return cn.makeTranslation(e,t,i),this.applyMatrix4(cn),this}scale(e,t,i){return cn.makeScale(e,t,i),this.applyMatrix4(cn),this}lookAt(e){return dl.lookAt(e),dl.updateMatrix(),this.applyMatrix4(dl.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ts).negate(),this.translate(ts.x,ts.y,ts.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let i=[];for(let s=0,r=e.length;s<r;s++){let a=e[s];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new lt(i,3))}else{let i=Math.min(e.length,t.count);for(let s=0;s<i;s++){let r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ti);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new B(-1/0,-1/0,-1/0),new B(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){let r=t[i];tn.setFromBufferAttribute(r),this.morphTargetsRelative?(Pt.addVectors(this.boundingBox.min,tn.min),this.boundingBox.expandByPoint(Pt),Pt.addVectors(this.boundingBox.max,tn.max),this.boundingBox.expandByPoint(Pt)):(this.boundingBox.expandByPoint(tn.min),this.boundingBox.expandByPoint(tn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ri);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new B,1/0);return}if(e){let i=this.boundingSphere.center;if(tn.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){let o=t[r];Ls.setFromBufferAttribute(o),this.morphTargetsRelative?(Pt.addVectors(tn.min,Ls.min),tn.expandByPoint(Pt),Pt.addVectors(tn.max,Ls.max),tn.expandByPoint(Pt)):(tn.expandByPoint(Ls.min),tn.expandByPoint(Ls.max))}tn.getCenter(i);let s=0;for(let r=0,a=e.count;r<a;r++)Pt.fromBufferAttribute(e,r),s=Math.max(s,i.distanceToSquared(Pt));if(t)for(let r=0,a=t.length;r<a;r++){let o=t[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Pt.fromBufferAttribute(o,c),l&&(ts.fromBufferAttribute(e,c),Pt.add(ts)),s=Math.max(s,i.distanceToSquared(Pt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let i=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Dt(new Float32Array(4*i.count),4));let a=this.getAttribute("tangent"),o=[],l=[];for(let U=0;U<i.count;U++)o[U]=new B,l[U]=new B;let c=new B,h=new B,u=new B,d=new Ze,f=new Ze,m=new Ze,_=new B,g=new B;function p(U,S,b){c.fromBufferAttribute(i,U),h.fromBufferAttribute(i,S),u.fromBufferAttribute(i,b),d.fromBufferAttribute(r,U),f.fromBufferAttribute(r,S),m.fromBufferAttribute(r,b),h.sub(c),u.sub(c),f.sub(d),m.sub(d);let I=1/(f.x*m.y-m.x*f.y);isFinite(I)&&(_.copy(h).multiplyScalar(m.y).addScaledVector(u,-f.y).multiplyScalar(I),g.copy(u).multiplyScalar(f.x).addScaledVector(h,-m.x).multiplyScalar(I),o[U].add(_),o[S].add(_),o[b].add(_),l[U].add(g),l[S].add(g),l[b].add(g))}let E=this.groups;E.length===0&&(E=[{start:0,count:e.count}]);for(let U=0,S=E.length;U<S;++U){let b=E[U],I=b.start,k=b.count;for(let X=I,Y=I+k;X<Y;X+=3)p(e.getX(X+0),e.getX(X+1),e.getX(X+2))}let w=new B,v=new B,T=new B,R=new B;function P(U){T.fromBufferAttribute(s,U),R.copy(T);let S=o[U];w.copy(S),w.sub(T.multiplyScalar(T.dot(S))).normalize(),v.crossVectors(R,S);let I=v.dot(l[U])<0?-1:1;a.setXYZW(U,w.x,w.y,w.z,I)}for(let U=0,S=E.length;U<S;++U){let b=E[U],I=b.start,k=b.count;for(let X=I,Y=I+k;X<Y;X+=3)P(e.getX(X+0)),P(e.getX(X+1)),P(e.getX(X+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Dt(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let d=0,f=i.count;d<f;d++)i.setXYZ(d,0,0,0);let s=new B,r=new B,a=new B,o=new B,l=new B,c=new B,h=new B,u=new B;if(e)for(let d=0,f=e.count;d<f;d+=3){let m=e.getX(d+0),_=e.getX(d+1),g=e.getX(d+2);s.fromBufferAttribute(t,m),r.fromBufferAttribute(t,_),a.fromBufferAttribute(t,g),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),o.fromBufferAttribute(i,m),l.fromBufferAttribute(i,_),c.fromBufferAttribute(i,g),o.add(h),l.add(h),c.add(h),i.setXYZ(m,o.x,o.y,o.z),i.setXYZ(_,l.x,l.y,l.z),i.setXYZ(g,c.x,c.y,c.z)}else for(let d=0,f=t.count;d<f;d+=3)s.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),a.fromBufferAttribute(t,d+2),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),i.setXYZ(d+0,h.x,h.y,h.z),i.setXYZ(d+1,h.x,h.y,h.z),i.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)Pt.fromBufferAttribute(e,t),Pt.normalize(),e.setXYZ(t,Pt.x,Pt.y,Pt.z)}toNonIndexed(){function e(o,l){let c=o.array,h=o.itemSize,u=o.normalized,d=new c.constructor(l.length*h),f=0,m=0;for(let _=0,g=l.length;_<g;_++){o.isInterleavedBufferAttribute?f=l[_]*o.data.stride+o.offset:f=l[_]*h;for(let p=0;p<h;p++)d[m++]=c[f++]}return new Dt(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new n,i=this.index.array,s=this.attributes;for(let o in s){let l=s[o],c=e(l,i);t.setAttribute(o,c)}let r=this.morphAttributes;for(let o in r){let l=[],c=r[o];for(let h=0,u=c.length;h<u;h++){let d=c[h],f=e(d,i);l.push(f)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,l=a.length;o<l;o++){let c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let i=this.attributes;for(let l in i){let c=i[l];e.data.attributes[l]=c.toJSON(e.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){let f=c[u];h.push(f.toJSON(e.data))}h.length>0&&(s[l]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let i=e.index;i!==null&&this.setIndex(i.clone());let s=e.attributes;for(let c in s){let h=s[c];this.setAttribute(c,h.clone(t))}let r=e.morphAttributes;for(let c in r){let h=[],u=r[c];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let c=0,h=a.length;c<h;c++){let u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},Kc=new Tt,bi=new zs,Or=new Ri,jc=new B,Br=new B,kr=new B,zr=new B,fl=new B,Vr=new B,Qc=new B,Hr=new B,st=class extends nn{constructor(e=new gt,t=new St){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){let s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){let i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,a=i.morphTargetsRelative;t.fromBufferAttribute(s,e);let o=this.morphTargetInfluences;if(r&&o){Vr.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=o[l],u=r[l];h!==0&&(fl.fromBufferAttribute(u,e),a?Vr.addScaledVector(fl,h):Vr.addScaledVector(fl.sub(t),h))}t.add(Vr)}return t}raycast(e,t){let i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Or.copy(i.boundingSphere),Or.applyMatrix4(r),bi.copy(e.ray).recast(e.near),!(Or.containsPoint(bi.origin)===!1&&(bi.intersectSphere(Or,jc)===null||bi.origin.distanceToSquared(jc)>(e.far-e.near)**2))&&(Kc.copy(r).invert(),bi.copy(e.ray).applyMatrix4(Kc),!(i.boundingBox!==null&&bi.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,bi)))}_computeIntersections(e,t,i){let s,r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let m=0,_=d.length;m<_;m++){let g=d[m],p=a[g.materialIndex],E=Math.max(g.start,f.start),w=Math.min(o.count,Math.min(g.start+g.count,f.start+f.count));for(let v=E,T=w;v<T;v+=3){let R=o.getX(v),P=o.getX(v+1),U=o.getX(v+2);s=Gr(this,p,e,i,c,h,u,R,P,U),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{let m=Math.max(0,f.start),_=Math.min(o.count,f.start+f.count);for(let g=m,p=_;g<p;g+=3){let E=o.getX(g),w=o.getX(g+1),v=o.getX(g+2);s=Gr(this,a,e,i,c,h,u,E,w,v),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let m=0,_=d.length;m<_;m++){let g=d[m],p=a[g.materialIndex],E=Math.max(g.start,f.start),w=Math.min(l.count,Math.min(g.start+g.count,f.start+f.count));for(let v=E,T=w;v<T;v+=3){let R=v,P=v+1,U=v+2;s=Gr(this,p,e,i,c,h,u,R,P,U),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{let m=Math.max(0,f.start),_=Math.min(l.count,f.start+f.count);for(let g=m,p=_;g<p;g+=3){let E=g,w=g+1,v=g+2;s=Gr(this,a,e,i,c,h,u,E,w,v),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}}};function Yd(n,e,t,i,s,r,a,o){let l;if(e.side===Vt?l=i.intersectTriangle(a,r,s,!0,o):l=i.intersectTriangle(s,r,a,e.side===On,o),l===null)return null;Hr.copy(o),Hr.applyMatrix4(n.matrixWorld);let c=t.ray.origin.distanceTo(Hr);return c<t.near||c>t.far?null:{distance:c,point:Hr.clone(),object:n}}function Gr(n,e,t,i,s,r,a,o,l,c){n.getVertexPosition(o,Br),n.getVertexPosition(l,kr),n.getVertexPosition(c,zr);let h=Yd(n,e,t,i,Br,kr,zr,Qc);if(h){let u=new B;jn.getBarycoord(Qc,Br,kr,zr,u),s&&(h.uv=jn.getInterpolatedAttribute(s,o,l,c,u,new Ze)),r&&(h.uv1=jn.getInterpolatedAttribute(r,o,l,c,u,new Ze)),a&&(h.normal=jn.getInterpolatedAttribute(a,o,l,c,u,new B),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));let d={a:o,b:l,c,normal:new B,materialIndex:0};jn.getNormal(Br,kr,zr,d.normal),h.face=d,h.barycoord=u}return h}var ls=class n extends gt{constructor(e=1,t=1,i=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:r,depthSegments:a};let o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);let l=[],c=[],h=[],u=[],d=0,f=0;m("z","y","x",-1,-1,i,t,e,a,r,0),m("z","y","x",1,-1,i,t,-e,a,r,1),m("x","z","y",1,1,e,i,t,s,a,2),m("x","z","y",1,-1,e,i,-t,s,a,3),m("x","y","z",1,-1,e,t,i,s,r,4),m("x","y","z",-1,-1,e,t,-i,s,r,5),this.setIndex(l),this.setAttribute("position",new lt(c,3)),this.setAttribute("normal",new lt(h,3)),this.setAttribute("uv",new lt(u,2));function m(_,g,p,E,w,v,T,R,P,U,S){let b=v/P,I=T/U,k=v/2,X=T/2,Y=R/2,K=P+1,$=U+1,ne=0,Z=0,de=new B;for(let xe=0;xe<$;xe++){let Ce=xe*I-X;for(let ke=0;ke<K;ke++){let Me=ke*b-k;de[_]=Me*E,de[g]=Ce*w,de[p]=Y,c.push(de.x,de.y,de.z),de[_]=0,de[g]=0,de[p]=R>0?1:-1,h.push(de.x,de.y,de.z),u.push(ke/P),u.push(1-xe/U),ne+=1}}for(let xe=0;xe<U;xe++)for(let Ce=0;Ce<P;Ce++){let ke=d+Ce+K*xe,Me=d+Ce+K*(xe+1),Ae=d+(Ce+1)+K*(xe+1),De=d+(Ce+1)+K*xe;l.push(ke,Me,De),l.push(Me,Ae,De),Z+=6}o.addGroup(f,Z,S),f+=Z,d+=ne}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function Di(n){let e={};for(let t in n){e[t]={};for(let i in n[t]){let s=n[t][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone():Array.isArray(s)?e[t][i]=s.slice():e[t][i]=s}}return e}function Ot(n){let e={};for(let t=0;t<n.length;t++){let i=Di(n[t]);for(let s in i)e[s]=i[s]}return e}function Zd(n){let e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function kl(n){let e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Qe.workingColorSpace}var $h={clone:Di,merge:Ot},$d=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Jd=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Zt=class extends ni{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=$d,this.fragmentShader=Jd,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Di(e.uniforms),this.uniformsGroups=Zd(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let i={};for(let s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}},Ws=class extends nn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Tt,this.projectionMatrix=new Tt,this.projectionMatrixInverse=new Tt,this.coordinateSystem=pn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Kn=new B,eh=new Ze,th=new Ze,Ft=class extends Ws{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=ea*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(qo*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return ea*2*Math.atan(Math.tan(qo*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){Kn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Kn.x,Kn.y).multiplyScalar(-e/Kn.z),Kn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Kn.x,Kn.y).multiplyScalar(-e/Kn.z)}getViewSize(e,t){return this.getViewBounds(e,eh,th),t.subVectors(th,eh)}setViewOffset(e,t,i,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(qo*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,r=-.5*s,a=this.view;if(this.view!==null&&this.view.enabled){let l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*i/c,s*=a.width/l,i*=a.height/c}let o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},ns=-90,is=1,sa=class extends nn{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Ft(ns,is,e,t);s.layers=this.layers,this.add(s);let r=new Ft(ns,is,e,t);r.layers=this.layers,this.add(r);let a=new Ft(ns,is,e,t);a.layers=this.layers,this.add(a);let o=new Ft(ns,is,e,t);o.layers=this.layers,this.add(o);let l=new Ft(ns,is,e,t);l.layers=this.layers,this.add(l);let c=new Ft(ns,is,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[i,s,r,a,o,l]=t;for(let c of t)this.remove(c);if(e===pn)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Os)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,a,o,l,c,h]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),m=e.xr.enabled;e.xr.enabled=!1;let _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,s),e.render(t,r),e.setRenderTarget(i,1,s),e.render(t,a),e.setRenderTarget(i,2,s),e.render(t,o),e.setRenderTarget(i,3,s),e.render(t,l),e.setRenderTarget(i,4,s),e.render(t,c),i.texture.generateMipmaps=_,e.setRenderTarget(i,5,s),e.render(t,h),e.setRenderTarget(u,d,f),e.xr.enabled=m,i.texture.needsPMREMUpdate=!0}},Xs=class extends Yt{constructor(e=[],t=Ii,i,s,r,a,o,l,c,h){super(e,t,i,s,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},ra=class extends vn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new Xs(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new ls(5,5,5),r=new Zt({name:"CubemapFromEquirect",uniforms:Di(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Vt,blending:zn});r.uniforms.tEquirect.value=t;let a=new st(s,r),o=t.minFilter;return t.minFilter===ai&&(t.minFilter=qt),new sa(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,i=!0,s=!0){let r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,i,s);e.setRenderTarget(r)}},Lt=class extends nn{constructor(){super(),this.isGroup=!0,this.type="Group"}},Kd={type:"move"},cs=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Lt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Lt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new B,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new B),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Lt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new B,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new B),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,r=null,a=null,o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(let _ of e.hand.values()){let g=t.getJointPose(_,i),p=this._getHandJoint(c,_);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}let h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,m=.005;c.inputState.pinching&&d>f+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=f-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,i),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Kd)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let i=new Lt;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}},qs=class n{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new Ke(e),this.density=t}clone(){return new n(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}};var Ys=class extends nn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Mn,this.environmentIntensity=1,this.environmentRotation=new Mn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}};var hs=class extends Yt{constructor(e=null,t=1,i=1,s,r,a,o,l,c=Xt,h=Xt,u,d){super(null,a,o,l,c,h,s,r,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var pl=new B,jd=new B,Qd=new Xe,yn=class{constructor(e=new B(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){let s=pl.subVectors(i,t).cross(jd.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let i=e.delta(pl),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(i,r)}intersectsLine(e){let t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let i=t||Qd.getNormalMatrix(e),s=this.coplanarPoint(pl).applyMatrix4(e),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},Si=new Ri,ef=new Ze(.5,.5),Wr=new B,Zs=class{constructor(e=new yn,t=new yn,i=new yn,s=new yn,r=new yn,a=new yn){this.planes=[e,t,i,s,r,a]}set(e,t,i,s,r,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){let t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=pn,i=!1){let s=this.planes,r=e.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],u=r[5],d=r[6],f=r[7],m=r[8],_=r[9],g=r[10],p=r[11],E=r[12],w=r[13],v=r[14],T=r[15];if(s[0].setComponents(c-a,f-h,p-m,T-E).normalize(),s[1].setComponents(c+a,f+h,p+m,T+E).normalize(),s[2].setComponents(c+o,f+u,p+_,T+w).normalize(),s[3].setComponents(c-o,f-u,p-_,T-w).normalize(),i)s[4].setComponents(l,d,g,v).normalize(),s[5].setComponents(c-l,f-d,p-g,T-v).normalize();else if(s[4].setComponents(c-l,f-d,p-g,T-v).normalize(),t===pn)s[5].setComponents(c+l,f+d,p+g,T+v).normalize();else if(t===Os)s[5].setComponents(l,d,g,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Si.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Si.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Si)}intersectsSprite(e){Si.center.set(0,0,0);let t=ef.distanceTo(e.center);return Si.radius=.7071067811865476+t,Si.applyMatrix4(e.matrixWorld),this.intersectsSphere(Si)}intersectsSphere(e){let t=this.planes,i=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let i=0;i<6;i++){let s=t[i];if(Wr.x=s.normal.x>0?e.max.x:e.min.x,Wr.y=s.normal.y>0?e.max.y:e.min.y,Wr.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Wr)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var us=class extends ni{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ke(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},aa=new B,oa=new B,nh=new Tt,Us=new zs,Xr=new Ri,ml=new B,ih=new B,$s=class extends nn{constructor(e=new gt,t=new us){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,i=[0];for(let s=1,r=t.count;s<r;s++)aa.fromBufferAttribute(t,s-1),oa.fromBufferAttribute(t,s),i[s]=i[s-1],i[s]+=aa.distanceTo(oa);e.setAttribute("lineDistance",new lt(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){let i=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Xr.copy(i.boundingSphere),Xr.applyMatrix4(s),Xr.radius+=r,e.ray.intersectsSphere(Xr)===!1)return;nh.copy(s).invert(),Us.copy(e.ray).applyMatrix4(nh);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,h=i.index,d=i.attributes.position;if(h!==null){let f=Math.max(0,a.start),m=Math.min(h.count,a.start+a.count);for(let _=f,g=m-1;_<g;_+=c){let p=h.getX(_),E=h.getX(_+1),w=qr(this,e,Us,l,p,E,_);w&&t.push(w)}if(this.isLineLoop){let _=h.getX(m-1),g=h.getX(f),p=qr(this,e,Us,l,_,g,m-1);p&&t.push(p)}}else{let f=Math.max(0,a.start),m=Math.min(d.count,a.start+a.count);for(let _=f,g=m-1;_<g;_+=c){let p=qr(this,e,Us,l,_,_+1,_);p&&t.push(p)}if(this.isLineLoop){let _=qr(this,e,Us,l,m-1,f,m-1);_&&t.push(_)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){let s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};function qr(n,e,t,i,s,r,a){let o=n.geometry.attributes.position;if(aa.fromBufferAttribute(o,s),oa.fromBufferAttribute(o,r),t.distanceSqToSegment(aa,oa,ml,ih)>i)return;ml.applyMatrix4(n.matrixWorld);let c=e.ray.origin.distanceTo(ml);if(!(c<e.near||c>e.far))return{distance:c,point:ih.clone().applyMatrix4(n.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:n}}var Js=class extends Yt{constructor(e,t,i=oi,s,r,a,o=Xt,l=Xt,c,h=rs,u=1){if(h!==rs&&h!==gs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let d={width:e,height:t,depth:u};super(d,s,r,a,o,l,h,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new os(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},Ks=class extends Yt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}};var ds=class n extends gt{constructor(e=1,t=1,i=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};let c=this;s=Math.floor(s),r=Math.floor(r);let h=[],u=[],d=[],f=[],m=0,_=[],g=i/2,p=0;E(),a===!1&&(e>0&&w(!0),t>0&&w(!1)),this.setIndex(h),this.setAttribute("position",new lt(u,3)),this.setAttribute("normal",new lt(d,3)),this.setAttribute("uv",new lt(f,2));function E(){let v=new B,T=new B,R=0,P=(t-e)/i;for(let U=0;U<=r;U++){let S=[],b=U/r,I=b*(t-e)+e;for(let k=0;k<=s;k++){let X=k/s,Y=X*l+o,K=Math.sin(Y),$=Math.cos(Y);T.x=I*K,T.y=-b*i+g,T.z=I*$,u.push(T.x,T.y,T.z),v.set(K,P,$).normalize(),d.push(v.x,v.y,v.z),f.push(X,1-b),S.push(m++)}_.push(S)}for(let U=0;U<s;U++)for(let S=0;S<r;S++){let b=_[S][U],I=_[S+1][U],k=_[S+1][U+1],X=_[S][U+1];(e>0||S!==0)&&(h.push(b,I,X),R+=3),(t>0||S!==r-1)&&(h.push(I,k,X),R+=3)}c.addGroup(p,R,0),p+=R}function w(v){let T=m,R=new Ze,P=new B,U=0,S=v===!0?e:t,b=v===!0?1:-1;for(let k=1;k<=s;k++)u.push(0,g*b,0),d.push(0,b,0),f.push(.5,.5),m++;let I=m;for(let k=0;k<=s;k++){let Y=k/s*l+o,K=Math.cos(Y),$=Math.sin(Y);P.x=S*$,P.y=g*b,P.z=S*K,u.push(P.x,P.y,P.z),d.push(0,b,0),R.x=K*.5+.5,R.y=$*.5*b+.5,f.push(R.x,R.y),m++}for(let k=0;k<s;k++){let X=T+k,Y=I+k;v===!0?h.push(Y,Y+1,X):h.push(Y+1,Y,X),U+=3}c.addGroup(p,U,v===!0?1:2),p+=U}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},js=class n extends ds{constructor(e=1,t=1,i=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,i,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:i,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new n(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},la=class n extends gt{constructor(e=[],t=[],i=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:i,detail:s};let r=[],a=[];o(s),c(i),h(),this.setAttribute("position",new lt(r,3)),this.setAttribute("normal",new lt(r.slice(),3)),this.setAttribute("uv",new lt(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(E){let w=new B,v=new B,T=new B;for(let R=0;R<t.length;R+=3)f(t[R+0],w),f(t[R+1],v),f(t[R+2],T),l(w,v,T,E)}function l(E,w,v,T){let R=T+1,P=[];for(let U=0;U<=R;U++){P[U]=[];let S=E.clone().lerp(v,U/R),b=w.clone().lerp(v,U/R),I=R-U;for(let k=0;k<=I;k++)k===0&&U===R?P[U][k]=S:P[U][k]=S.clone().lerp(b,k/I)}for(let U=0;U<R;U++)for(let S=0;S<2*(R-U)-1;S++){let b=Math.floor(S/2);S%2===0?(d(P[U][b+1]),d(P[U+1][b]),d(P[U][b])):(d(P[U][b+1]),d(P[U+1][b+1]),d(P[U+1][b]))}}function c(E){let w=new B;for(let v=0;v<r.length;v+=3)w.x=r[v+0],w.y=r[v+1],w.z=r[v+2],w.normalize().multiplyScalar(E),r[v+0]=w.x,r[v+1]=w.y,r[v+2]=w.z}function h(){let E=new B;for(let w=0;w<r.length;w+=3){E.x=r[w+0],E.y=r[w+1],E.z=r[w+2];let v=g(E)/2/Math.PI+.5,T=p(E)/Math.PI+.5;a.push(v,1-T)}m(),u()}function u(){for(let E=0;E<a.length;E+=6){let w=a[E+0],v=a[E+2],T=a[E+4],R=Math.max(w,v,T),P=Math.min(w,v,T);R>.9&&P<.1&&(w<.2&&(a[E+0]+=1),v<.2&&(a[E+2]+=1),T<.2&&(a[E+4]+=1))}}function d(E){r.push(E.x,E.y,E.z)}function f(E,w){let v=E*3;w.x=e[v+0],w.y=e[v+1],w.z=e[v+2]}function m(){let E=new B,w=new B,v=new B,T=new B,R=new Ze,P=new Ze,U=new Ze;for(let S=0,b=0;S<r.length;S+=9,b+=6){E.set(r[S+0],r[S+1],r[S+2]),w.set(r[S+3],r[S+4],r[S+5]),v.set(r[S+6],r[S+7],r[S+8]),R.set(a[b+0],a[b+1]),P.set(a[b+2],a[b+3]),U.set(a[b+4],a[b+5]),T.copy(E).add(w).add(v).divideScalar(3);let I=g(T);_(R,b+0,E,I),_(P,b+2,w,I),_(U,b+4,v,I)}}function _(E,w,v,T){T<0&&E.x===1&&(a[w]=E.x-1),v.x===0&&v.z===0&&(a[w]=T/2/Math.PI+.5)}function g(E){return Math.atan2(E.z,-E.x)}function p(E){return Math.atan2(-E.y,Math.sqrt(E.x*E.x+E.z*E.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.vertices,e.indices,e.radius,e.details)}};var Qs=class n extends la{constructor(e=1,t=0){let i=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(i,s,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new n(e.radius,e.detail)}},er=class n extends gt{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};let r=e/2,a=t/2,o=Math.floor(i),l=Math.floor(s),c=o+1,h=l+1,u=e/o,d=t/l,f=[],m=[],_=[],g=[];for(let p=0;p<h;p++){let E=p*d-a;for(let w=0;w<c;w++){let v=w*u-r;m.push(v,-E,0),_.push(0,0,1),g.push(w/o),g.push(1-p/l)}}for(let p=0;p<l;p++)for(let E=0;E<o;E++){let w=E+c*p,v=E+c*(p+1),T=E+1+c*(p+1),R=E+1+c*p;f.push(w,v,R),f.push(v,T,R)}this.setIndex(f),this.setAttribute("position",new lt(m,3)),this.setAttribute("normal",new lt(_,3)),this.setAttribute("uv",new lt(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.width,e.height,e.widthSegments,e.heightSegments)}},ii=class n extends gt{constructor(e=.5,t=1,i=32,s=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:i,phiSegments:s,thetaStart:r,thetaLength:a},i=Math.max(3,i),s=Math.max(1,s);let o=[],l=[],c=[],h=[],u=e,d=(t-e)/s,f=new B,m=new Ze;for(let _=0;_<=s;_++){for(let g=0;g<=i;g++){let p=r+g/i*a;f.x=u*Math.cos(p),f.y=u*Math.sin(p),l.push(f.x,f.y,f.z),c.push(0,0,1),m.x=(f.x/t+1)/2,m.y=(f.y/t+1)/2,h.push(m.x,m.y)}u+=d}for(let _=0;_<s;_++){let g=_*(i+1);for(let p=0;p<i;p++){let E=p+g,w=E,v=E+i+1,T=E+i+2,R=E+1;o.push(w,v,R),o.push(v,T,R)}}this.setIndex(o),this.setAttribute("position",new lt(l,3)),this.setAttribute("normal",new lt(c,3)),this.setAttribute("uv",new lt(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}};var ca=class extends ni{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Nh,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},ha=class extends ni{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function Yr(n,e){return!n||n.constructor===e?n:typeof e.BYTES_PER_ELEMENT=="number"?new e(n):Array.prototype.slice.call(n)}function tf(n){return ArrayBuffer.isView(n)&&!(n instanceof DataView)}var Ci=class{constructor(e,t,i,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(i),this.sampleValues=t,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,i=this._cachedIndex,s=t[i],r=t[i-1];n:{e:{let a;t:{i:if(!(e<s)){for(let o=i+2;;){if(s===void 0){if(e<r)break i;return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===o)break;if(r=s,s=t[++i],e<s)break e}a=t.length;break t}if(!(e>=r)){let o=t[1];e<o&&(i=2,r=o);for(let l=i-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===l)break;if(s=r,r=t[--i-1],e>=r)break e}a=i,i=0;break t}break n}for(;i<a;){let o=i+a>>>1;e<t[o]?a=o:i=o+1}if(s=t[i],r=t[i-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,r,s)}return this.interpolate_(i,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,i=this.sampleValues,s=this.valueSize,r=e*s;for(let a=0;a!==s;++a)t[a]=i[r+a];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},ua=class extends Ci{constructor(e,t,i,s){super(e,t,i,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:gl,endingEnd:gl}}intervalChanged_(e,t,i){let s=this.parameterPositions,r=e-2,a=e+1,o=s[r],l=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case xl:r=e,o=2*t-i;break;case _l:r=s.length-2,o=t+s[r]-s[r+1];break;default:r=e,o=i}if(l===void 0)switch(this.getSettings_().endingEnd){case xl:a=e,l=2*i-t;break;case _l:a=1,l=i+s[1]-s[0];break;default:a=e-1,l=t}let c=(i-t)*.5,h=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-i),this._offsetPrev=r*h,this._offsetNext=a*h}interpolate_(e,t,i,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,m=(i-t)/(s-t),_=m*m,g=_*m,p=-d*g+2*d*_-d*m,E=(1+d)*g+(-1.5-2*d)*_+(-.5+d)*m+1,w=(-1-f)*g+(1.5+f)*_+.5*m,v=f*g-f*_;for(let T=0;T!==o;++T)r[T]=p*a[h+T]+E*a[c+T]+w*a[l+T]+v*a[u+T];return r}},da=class extends Ci{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e,t,i,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=(i-t)/(s-t),u=1-h;for(let d=0;d!==o;++d)r[d]=a[c+d]*u+a[l+d]*h;return r}},fa=class extends Ci{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e){return this.copySampleValue_(e-1)}},sn=class{constructor(e,t,i,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Yr(t,this.TimeBufferType),this.values=Yr(i,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,i;if(t.toJSON!==this.toJSON)i=t.toJSON(e);else{i={name:e.name,times:Yr(e.times,Array),values:Yr(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(i.interpolation=s)}return i.type=e.ValueTypeName,i}InterpolantFactoryMethodDiscrete(e){return new fa(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new da(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new ua(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case Ns:t=this.InterpolantFactoryMethodDiscrete;break;case Qr:t=this.InterpolantFactoryMethodLinear;break;case Zr:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){let i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return console.warn("THREE.KeyframeTrack:",i),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Ns;case this.InterpolantFactoryMethodLinear:return Qr;case this.InterpolantFactoryMethodSmooth:return Zr}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let i=0,s=t.length;i!==s;++i)t[i]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let i=0,s=t.length;i!==s;++i)t[i]*=e}return this}trim(e,t){let i=this.times,s=i.length,r=0,a=s-1;for(;r!==s&&i[r]<e;)++r;for(;a!==-1&&i[a]>t;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=i.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let i=this.times,s=this.values,r=i.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==r;o++){let l=i[o];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(s!==void 0&&tf(s))for(let o=0,l=s.length;o!==l;++o){let c=s[o];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),i=this.getValueSize(),s=this.getInterpolation()===Zr,r=e.length-1,a=1;for(let o=1;o<r;++o){let l=!1,c=e[o],h=e[o+1];if(c!==h&&(o!==1||c!==e[0]))if(s)l=!0;else{let u=o*i,d=u-i,f=u+i;for(let m=0;m!==i;++m){let _=t[u+m];if(_!==t[d+m]||_!==t[f+m]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];let u=o*i,d=a*i;for(let f=0;f!==i;++f)t[d+f]=t[u+f]}++a}}if(r>0){e[a]=e[r];for(let o=r*i,l=a*i,c=0;c!==i;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*i)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),i=this.constructor,s=new i(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}};sn.prototype.ValueTypeName="";sn.prototype.TimeBufferType=Float32Array;sn.prototype.ValueBufferType=Float32Array;sn.prototype.DefaultInterpolation=Qr;var si=class extends sn{constructor(e,t,i){super(e,t,i)}};si.prototype.ValueTypeName="bool";si.prototype.ValueBufferType=Array;si.prototype.DefaultInterpolation=Ns;si.prototype.InterpolantFactoryMethodLinear=void 0;si.prototype.InterpolantFactoryMethodSmooth=void 0;var pa=class extends sn{constructor(e,t,i,s){super(e,t,i,s)}};pa.prototype.ValueTypeName="color";var ma=class extends sn{constructor(e,t,i,s){super(e,t,i,s)}};ma.prototype.ValueTypeName="number";var ga=class extends Ci{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e,t,i,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(i-t)/(s-t),c=e*o;for(let h=c+o;c!==h;c+=4)kn.slerpFlat(r,0,a,c-o,a,c,l);return r}},tr=class extends sn{constructor(e,t,i,s){super(e,t,i,s)}InterpolantFactoryMethodLinear(e){return new ga(this.times,this.values,this.getValueSize(),e)}};tr.prototype.ValueTypeName="quaternion";tr.prototype.InterpolantFactoryMethodSmooth=void 0;var ri=class extends sn{constructor(e,t,i){super(e,t,i)}};ri.prototype.ValueTypeName="string";ri.prototype.ValueBufferType=Array;ri.prototype.DefaultInterpolation=Ns;ri.prototype.InterpolantFactoryMethodLinear=void 0;ri.prototype.InterpolantFactoryMethodSmooth=void 0;var xa=class extends sn{constructor(e,t,i,s){super(e,t,i,s)}};xa.prototype.ValueTypeName="vector";var _a=class{constructor(e,t,i){let s=this,r=!1,a=0,o=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=i,this.abortController=new AbortController,this.itemStart=function(h){o++,r===!1&&s.onStart!==void 0&&s.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,s.onProgress!==void 0&&s.onProgress(h,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){let u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=c.length;u<d;u+=2){let f=c[u],m=c[u+1];if(f.global&&(f.lastIndex=0),f.test(h))return m}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}},Jh=new _a,ya=class{constructor(e){this.manager=e!==void 0?e:Jh,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let i=this;return new Promise(function(s,r){i.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};ya.DEFAULT_MATERIAL_NAME="__DEFAULT";var va=class extends Ws{constructor(e=-1,t=1,i=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=i-e,a=i+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}};var Ma=class extends Ft{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}};var zl="\\[\\]\\.:\\/",nf=new RegExp("["+zl+"]","g"),Vl="[^"+zl+"]",sf="[^"+zl.replace("\\.","")+"]",rf=/((?:WC+[\/:])*)/.source.replace("WC",Vl),af=/(WCOD+)?/.source.replace("WCOD",sf),of=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Vl),lf=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Vl),cf=new RegExp("^"+rf+af+of+lf+"$"),hf=["material","materials","bones","map"],Ml=class{constructor(e,t,i){let s=i||mt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let i=this._targetGroup.nCachedObjects_,s=this._bindings[i];s!==void 0&&s.getValue(e,t)}setValue(e,t){let i=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=i.length;s!==r;++s)i[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].unbind()}},mt=class n{constructor(e,t,i){this.path=t,this.parsedPath=i||n.parseTrackName(t),this.node=n.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,i){return e&&e.isAnimationObjectGroup?new n.Composite(e,t,i):new n(e,t,i)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(nf,"")}static parseTrackName(e){let t=cf.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let i={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=i.nodeName&&i.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=i.nodeName.substring(s+1);hf.indexOf(r)!==-1&&(i.nodeName=i.nodeName.substring(0,s),i.objectName=r)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return i}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let i=e.skeleton.getBoneByName(t);if(i!==void 0)return i}if(e.children){let i=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===t||o.uuid===t)return o;let l=i(o.children);if(l)return l}return null},s=i(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)e[t++]=i[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,i=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=n.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let c=t.objectIndex;switch(i){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[i]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[i]}if(c!==void 0){if(e[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let a=e[s];if(a===void 0){let c=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};mt.Composite=Ml;mt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};mt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};mt.prototype.GetterByBindingType=[mt.prototype._getValue_direct,mt.prototype._getValue_array,mt.prototype._getValue_arrayElement,mt.prototype._getValue_toArray];mt.prototype.SetterByBindingTypeAndVersioning=[[mt.prototype._setValue_direct,mt.prototype._setValue_direct_setNeedsUpdate,mt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[mt.prototype._setValue_array,mt.prototype._setValue_array_setNeedsUpdate,mt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[mt.prototype._setValue_arrayElement,mt.prototype._setValue_arrayElement_setNeedsUpdate,mt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[mt.prototype._setValue_fromArray,mt.prototype._setValue_fromArray_setNeedsUpdate,mt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Sx=new Float32Array(1);function Hl(n,e,t,i){let s=uf(i);switch(t){case Ll:return n*e;case xs:return n*e/s.components*s.byteLength;case Na:return n*e/s.components*s.byteLength;case Nl:return n*e*2/s.components*s.byteLength;case Fa:return n*e*2/s.components*s.byteLength;case Ul:return n*e*3/s.components*s.byteLength;case hn:return n*e*4/s.components*s.byteLength;case Oa:return n*e*4/s.components*s.byteLength;case sr:case rr:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case ar:case or:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case ka:case Va:return Math.max(n,16)*Math.max(e,8)/4;case Ba:case za:return Math.max(n,8)*Math.max(e,8)/2;case Ha:case Ga:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Wa:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Xa:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case qa:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case Ya:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case Za:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case $a:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case Ja:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case Ka:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case ja:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case Qa:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case eo:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case to:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case no:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case io:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case so:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case ro:case ao:case oo:return Math.ceil(n/4)*Math.ceil(e/4)*16;case lo:case co:return Math.ceil(n/4)*Math.ceil(e/4)*8;case ho:case uo:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function uf(n){switch(n){case Sn:case Cl:return{byteLength:1,components:1};case fs:case Il:case ps:return{byteLength:2,components:1};case La:case Ua:return{byteLength:2,components:4};case oi:case Da:case wn:return{byteLength:4,components:1};case Pl:case Dl:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"180"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="180");function vu(){let n=null,e=!1,t=null,i=null;function s(r,a){t(r,a),i=n.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(s),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){n=r}}}function ff(n){let e=new WeakMap;function t(o,l){let c=o.array,h=o.usage,u=c.byteLength,d=n.createBuffer();n.bindBuffer(l,d),n.bufferData(l,c,h),o.onUploadCallback();let f;if(c instanceof Float32Array)f=n.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=n.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?f=n.HALF_FLOAT:f=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=n.SHORT;else if(c instanceof Uint32Array)f=n.UNSIGNED_INT;else if(c instanceof Int32Array)f=n.INT;else if(c instanceof Int8Array)f=n.BYTE;else if(c instanceof Uint8Array)f=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:u}}function i(o,l,c){let h=l.array,u=l.updateRanges;if(n.bindBuffer(c,o),u.length===0)n.bufferSubData(c,0,h);else{u.sort((f,m)=>f.start-m.start);let d=0;for(let f=1;f<u.length;f++){let m=u[d],_=u[f];_.start<=m.start+m.count+1?m.count=Math.max(m.count,_.start+_.count-m.start):(++d,u[d]=_)}u.length=d+1;for(let f=0,m=u.length;f<m;f++){let _=u[f];n.bufferSubData(c,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);let l=e.get(o);l&&(n.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var pf=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,mf=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,gf=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,xf=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,_f=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,yf=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,vf=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Mf=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,bf=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,Sf=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,wf=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Ef=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Tf=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Af=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Rf=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Cf=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,If=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Pf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Df=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Lf=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Uf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Nf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Ff=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,Of=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Bf=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,kf=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,zf=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Vf=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Hf=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Gf=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Wf="gl_FragColor = linearToOutputTexel( gl_FragColor );",Xf=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,qf=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Yf=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Zf=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,$f=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Jf=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Kf=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,jf=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Qf=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,ep=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,tp=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,np=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,ip=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,sp=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,rp=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,ap=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,op=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lp=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,cp=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,hp=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,up=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,dp=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,fp=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,pp=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,mp=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,gp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,xp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,_p=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,yp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,vp=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Mp=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,bp=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Sp=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,wp=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Ep=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Tp=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Ap=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Rp=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Cp=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Ip=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Pp=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Dp=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Lp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Up=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Np=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Fp=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Op=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Bp=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,kp=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,zp=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Vp=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Hp=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Gp=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Wp=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Xp=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,qp=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Yp=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Zp=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,$p=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Jp=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Kp=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,jp=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Qp=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,em=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,tm=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,nm=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,im=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,sm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,rm=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,am=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,om=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,lm=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,cm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,hm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,um=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,dm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,fm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,pm=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,mm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,gm=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,xm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,_m=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ym=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,vm=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Mm=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,bm=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Sm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,wm=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Em=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Tm=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Am=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Rm=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Cm=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Im=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Pm=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Dm=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Lm=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Um=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Nm=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Fm=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Om=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Bm=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,km=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,zm=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Vm=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Hm=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Gm=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Wm=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Xm=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,qm=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ye={alphahash_fragment:pf,alphahash_pars_fragment:mf,alphamap_fragment:gf,alphamap_pars_fragment:xf,alphatest_fragment:_f,alphatest_pars_fragment:yf,aomap_fragment:vf,aomap_pars_fragment:Mf,batching_pars_vertex:bf,batching_vertex:Sf,begin_vertex:wf,beginnormal_vertex:Ef,bsdfs:Tf,iridescence_fragment:Af,bumpmap_pars_fragment:Rf,clipping_planes_fragment:Cf,clipping_planes_pars_fragment:If,clipping_planes_pars_vertex:Pf,clipping_planes_vertex:Df,color_fragment:Lf,color_pars_fragment:Uf,color_pars_vertex:Nf,color_vertex:Ff,common:Of,cube_uv_reflection_fragment:Bf,defaultnormal_vertex:kf,displacementmap_pars_vertex:zf,displacementmap_vertex:Vf,emissivemap_fragment:Hf,emissivemap_pars_fragment:Gf,colorspace_fragment:Wf,colorspace_pars_fragment:Xf,envmap_fragment:qf,envmap_common_pars_fragment:Yf,envmap_pars_fragment:Zf,envmap_pars_vertex:$f,envmap_physical_pars_fragment:ap,envmap_vertex:Jf,fog_vertex:Kf,fog_pars_vertex:jf,fog_fragment:Qf,fog_pars_fragment:ep,gradientmap_pars_fragment:tp,lightmap_pars_fragment:np,lights_lambert_fragment:ip,lights_lambert_pars_fragment:sp,lights_pars_begin:rp,lights_toon_fragment:op,lights_toon_pars_fragment:lp,lights_phong_fragment:cp,lights_phong_pars_fragment:hp,lights_physical_fragment:up,lights_physical_pars_fragment:dp,lights_fragment_begin:fp,lights_fragment_maps:pp,lights_fragment_end:mp,logdepthbuf_fragment:gp,logdepthbuf_pars_fragment:xp,logdepthbuf_pars_vertex:_p,logdepthbuf_vertex:yp,map_fragment:vp,map_pars_fragment:Mp,map_particle_fragment:bp,map_particle_pars_fragment:Sp,metalnessmap_fragment:wp,metalnessmap_pars_fragment:Ep,morphinstance_vertex:Tp,morphcolor_vertex:Ap,morphnormal_vertex:Rp,morphtarget_pars_vertex:Cp,morphtarget_vertex:Ip,normal_fragment_begin:Pp,normal_fragment_maps:Dp,normal_pars_fragment:Lp,normal_pars_vertex:Up,normal_vertex:Np,normalmap_pars_fragment:Fp,clearcoat_normal_fragment_begin:Op,clearcoat_normal_fragment_maps:Bp,clearcoat_pars_fragment:kp,iridescence_pars_fragment:zp,opaque_fragment:Vp,packing:Hp,premultiplied_alpha_fragment:Gp,project_vertex:Wp,dithering_fragment:Xp,dithering_pars_fragment:qp,roughnessmap_fragment:Yp,roughnessmap_pars_fragment:Zp,shadowmap_pars_fragment:$p,shadowmap_pars_vertex:Jp,shadowmap_vertex:Kp,shadowmask_pars_fragment:jp,skinbase_vertex:Qp,skinning_pars_vertex:em,skinning_vertex:tm,skinnormal_vertex:nm,specularmap_fragment:im,specularmap_pars_fragment:sm,tonemapping_fragment:rm,tonemapping_pars_fragment:am,transmission_fragment:om,transmission_pars_fragment:lm,uv_pars_fragment:cm,uv_pars_vertex:hm,uv_vertex:um,worldpos_vertex:dm,background_vert:fm,background_frag:pm,backgroundCube_vert:mm,backgroundCube_frag:gm,cube_vert:xm,cube_frag:_m,depth_vert:ym,depth_frag:vm,distanceRGBA_vert:Mm,distanceRGBA_frag:bm,equirect_vert:Sm,equirect_frag:wm,linedashed_vert:Em,linedashed_frag:Tm,meshbasic_vert:Am,meshbasic_frag:Rm,meshlambert_vert:Cm,meshlambert_frag:Im,meshmatcap_vert:Pm,meshmatcap_frag:Dm,meshnormal_vert:Lm,meshnormal_frag:Um,meshphong_vert:Nm,meshphong_frag:Fm,meshphysical_vert:Om,meshphysical_frag:Bm,meshtoon_vert:km,meshtoon_frag:zm,points_vert:Vm,points_frag:Hm,shadow_vert:Gm,shadow_frag:Wm,sprite_vert:Xm,sprite_frag:qm},me={common:{diffuse:{value:new Ke(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Xe},alphaMap:{value:null},alphaMapTransform:{value:new Xe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Xe}},envmap:{envMap:{value:null},envMapRotation:{value:new Xe},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Xe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Xe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Xe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Xe},normalScale:{value:new Ze(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Xe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Xe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Xe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Xe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ke(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ke(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Xe},alphaTest:{value:0},uvTransform:{value:new Xe}},sprite:{diffuse:{value:new Ke(16777215)},opacity:{value:1},center:{value:new Ze(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Xe},alphaMap:{value:null},alphaMapTransform:{value:new Xe},alphaTest:{value:0}}},En={basic:{uniforms:Ot([me.common,me.specularmap,me.envmap,me.aomap,me.lightmap,me.fog]),vertexShader:Ye.meshbasic_vert,fragmentShader:Ye.meshbasic_frag},lambert:{uniforms:Ot([me.common,me.specularmap,me.envmap,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.fog,me.lights,{emissive:{value:new Ke(0)}}]),vertexShader:Ye.meshlambert_vert,fragmentShader:Ye.meshlambert_frag},phong:{uniforms:Ot([me.common,me.specularmap,me.envmap,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.fog,me.lights,{emissive:{value:new Ke(0)},specular:{value:new Ke(1118481)},shininess:{value:30}}]),vertexShader:Ye.meshphong_vert,fragmentShader:Ye.meshphong_frag},standard:{uniforms:Ot([me.common,me.envmap,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.roughnessmap,me.metalnessmap,me.fog,me.lights,{emissive:{value:new Ke(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ye.meshphysical_vert,fragmentShader:Ye.meshphysical_frag},toon:{uniforms:Ot([me.common,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.gradientmap,me.fog,me.lights,{emissive:{value:new Ke(0)}}]),vertexShader:Ye.meshtoon_vert,fragmentShader:Ye.meshtoon_frag},matcap:{uniforms:Ot([me.common,me.bumpmap,me.normalmap,me.displacementmap,me.fog,{matcap:{value:null}}]),vertexShader:Ye.meshmatcap_vert,fragmentShader:Ye.meshmatcap_frag},points:{uniforms:Ot([me.points,me.fog]),vertexShader:Ye.points_vert,fragmentShader:Ye.points_frag},dashed:{uniforms:Ot([me.common,me.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ye.linedashed_vert,fragmentShader:Ye.linedashed_frag},depth:{uniforms:Ot([me.common,me.displacementmap]),vertexShader:Ye.depth_vert,fragmentShader:Ye.depth_frag},normal:{uniforms:Ot([me.common,me.bumpmap,me.normalmap,me.displacementmap,{opacity:{value:1}}]),vertexShader:Ye.meshnormal_vert,fragmentShader:Ye.meshnormal_frag},sprite:{uniforms:Ot([me.sprite,me.fog]),vertexShader:Ye.sprite_vert,fragmentShader:Ye.sprite_frag},background:{uniforms:{uvTransform:{value:new Xe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ye.background_vert,fragmentShader:Ye.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Xe}},vertexShader:Ye.backgroundCube_vert,fragmentShader:Ye.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ye.cube_vert,fragmentShader:Ye.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ye.equirect_vert,fragmentShader:Ye.equirect_frag},distanceRGBA:{uniforms:Ot([me.common,me.displacementmap,{referencePosition:{value:new B},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ye.distanceRGBA_vert,fragmentShader:Ye.distanceRGBA_frag},shadow:{uniforms:Ot([me.lights,me.fog,{color:{value:new Ke(0)},opacity:{value:1}}]),vertexShader:Ye.shadow_vert,fragmentShader:Ye.shadow_frag}};En.physical={uniforms:Ot([En.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Xe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Xe},clearcoatNormalScale:{value:new Ze(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Xe},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Xe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Xe},sheen:{value:0},sheenColor:{value:new Ke(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Xe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Xe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Xe},transmissionSamplerSize:{value:new Ze},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Xe},attenuationDistance:{value:0},attenuationColor:{value:new Ke(0)},specularColor:{value:new Ke(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Xe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Xe},anisotropyVector:{value:new Ze},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Xe}}]),vertexShader:Ye.meshphysical_vert,fragmentShader:Ye.meshphysical_frag};var fo={r:0,b:0,g:0},Li=new Mn,Ym=new Tt;function Zm(n,e,t,i,s,r,a){let o=new Ke(0),l=r===!0?0:1,c,h,u=null,d=0,f=null;function m(w){let v=w.isScene===!0?w.background:null;return v&&v.isTexture&&(v=(w.backgroundBlurriness>0?t:e).get(v)),v}function _(w){let v=!1,T=m(w);T===null?p(o,l):T&&T.isColor&&(p(T,1),v=!0);let R=n.xr.getEnvironmentBlendMode();R==="additive"?i.buffers.color.setClear(0,0,0,1,a):R==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(n.autoClear||v)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function g(w,v){let T=m(v);T&&(T.isCubeTexture||T.mapping===nr)?(h===void 0&&(h=new st(new ls(1,1,1),new Zt({name:"BackgroundCubeMaterial",uniforms:Di(En.backgroundCube.uniforms),vertexShader:En.backgroundCube.vertexShader,fragmentShader:En.backgroundCube.fragmentShader,side:Vt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(R,P,U){this.matrixWorld.copyPosition(U.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),Li.copy(v.backgroundRotation),Li.x*=-1,Li.y*=-1,Li.z*=-1,T.isCubeTexture&&T.isRenderTargetTexture===!1&&(Li.y*=-1,Li.z*=-1),h.material.uniforms.envMap.value=T,h.material.uniforms.flipEnvMap.value=T.isCubeTexture&&T.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Ym.makeRotationFromEuler(Li)),h.material.toneMapped=Qe.getTransfer(T.colorSpace)!==it,(u!==T||d!==T.version||f!==n.toneMapping)&&(h.material.needsUpdate=!0,u=T,d=T.version,f=n.toneMapping),h.layers.enableAll(),w.unshift(h,h.geometry,h.material,0,0,null)):T&&T.isTexture&&(c===void 0&&(c=new st(new er(2,2),new Zt({name:"BackgroundMaterial",uniforms:Di(En.background.uniforms),vertexShader:En.background.vertexShader,fragmentShader:En.background.fragmentShader,side:On,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=T,c.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,c.material.toneMapped=Qe.getTransfer(T.colorSpace)!==it,T.matrixAutoUpdate===!0&&T.updateMatrix(),c.material.uniforms.uvTransform.value.copy(T.matrix),(u!==T||d!==T.version||f!==n.toneMapping)&&(c.material.needsUpdate=!0,u=T,d=T.version,f=n.toneMapping),c.layers.enableAll(),w.unshift(c,c.geometry,c.material,0,0,null))}function p(w,v){w.getRGB(fo,kl(n)),i.buffers.color.setClear(fo.r,fo.g,fo.b,v,a)}function E(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(w,v=1){o.set(w),l=v,p(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(w){l=w,p(o,l)},render:_,addToRenderList:g,dispose:E}}function $m(n,e){let t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=d(null),r=s,a=!1;function o(b,I,k,X,Y){let K=!1,$=u(X,k,I);r!==$&&(r=$,c(r.object)),K=f(b,X,k,Y),K&&m(b,X,k,Y),Y!==null&&e.update(Y,n.ELEMENT_ARRAY_BUFFER),(K||a)&&(a=!1,v(b,I,k,X),Y!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(Y).buffer))}function l(){return n.createVertexArray()}function c(b){return n.bindVertexArray(b)}function h(b){return n.deleteVertexArray(b)}function u(b,I,k){let X=k.wireframe===!0,Y=i[b.id];Y===void 0&&(Y={},i[b.id]=Y);let K=Y[I.id];K===void 0&&(K={},Y[I.id]=K);let $=K[X];return $===void 0&&($=d(l()),K[X]=$),$}function d(b){let I=[],k=[],X=[];for(let Y=0;Y<t;Y++)I[Y]=0,k[Y]=0,X[Y]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:I,enabledAttributes:k,attributeDivisors:X,object:b,attributes:{},index:null}}function f(b,I,k,X){let Y=r.attributes,K=I.attributes,$=0,ne=k.getAttributes();for(let Z in ne)if(ne[Z].location>=0){let xe=Y[Z],Ce=K[Z];if(Ce===void 0&&(Z==="instanceMatrix"&&b.instanceMatrix&&(Ce=b.instanceMatrix),Z==="instanceColor"&&b.instanceColor&&(Ce=b.instanceColor)),xe===void 0||xe.attribute!==Ce||Ce&&xe.data!==Ce.data)return!0;$++}return r.attributesNum!==$||r.index!==X}function m(b,I,k,X){let Y={},K=I.attributes,$=0,ne=k.getAttributes();for(let Z in ne)if(ne[Z].location>=0){let xe=K[Z];xe===void 0&&(Z==="instanceMatrix"&&b.instanceMatrix&&(xe=b.instanceMatrix),Z==="instanceColor"&&b.instanceColor&&(xe=b.instanceColor));let Ce={};Ce.attribute=xe,xe&&xe.data&&(Ce.data=xe.data),Y[Z]=Ce,$++}r.attributes=Y,r.attributesNum=$,r.index=X}function _(){let b=r.newAttributes;for(let I=0,k=b.length;I<k;I++)b[I]=0}function g(b){p(b,0)}function p(b,I){let k=r.newAttributes,X=r.enabledAttributes,Y=r.attributeDivisors;k[b]=1,X[b]===0&&(n.enableVertexAttribArray(b),X[b]=1),Y[b]!==I&&(n.vertexAttribDivisor(b,I),Y[b]=I)}function E(){let b=r.newAttributes,I=r.enabledAttributes;for(let k=0,X=I.length;k<X;k++)I[k]!==b[k]&&(n.disableVertexAttribArray(k),I[k]=0)}function w(b,I,k,X,Y,K,$){$===!0?n.vertexAttribIPointer(b,I,k,Y,K):n.vertexAttribPointer(b,I,k,X,Y,K)}function v(b,I,k,X){_();let Y=X.attributes,K=k.getAttributes(),$=I.defaultAttributeValues;for(let ne in K){let Z=K[ne];if(Z.location>=0){let de=Y[ne];if(de===void 0&&(ne==="instanceMatrix"&&b.instanceMatrix&&(de=b.instanceMatrix),ne==="instanceColor"&&b.instanceColor&&(de=b.instanceColor)),de!==void 0){let xe=de.normalized,Ce=de.itemSize,ke=e.get(de);if(ke===void 0)continue;let Me=ke.buffer,Ae=ke.type,De=ke.bytesPerElement,G=Ae===n.INT||Ae===n.UNSIGNED_INT||de.gpuType===Da;if(de.isInterleavedBufferAttribute){let J=de.data,ge=J.stride,Le=de.offset;if(J.isInstancedInterleavedBuffer){for(let be=0;be<Z.locationSize;be++)p(Z.location+be,J.meshPerAttribute);b.isInstancedMesh!==!0&&X._maxInstanceCount===void 0&&(X._maxInstanceCount=J.meshPerAttribute*J.count)}else for(let be=0;be<Z.locationSize;be++)g(Z.location+be);n.bindBuffer(n.ARRAY_BUFFER,Me);for(let be=0;be<Z.locationSize;be++)w(Z.location+be,Ce/Z.locationSize,Ae,xe,ge*De,(Le+Ce/Z.locationSize*be)*De,G)}else{if(de.isInstancedBufferAttribute){for(let J=0;J<Z.locationSize;J++)p(Z.location+J,de.meshPerAttribute);b.isInstancedMesh!==!0&&X._maxInstanceCount===void 0&&(X._maxInstanceCount=de.meshPerAttribute*de.count)}else for(let J=0;J<Z.locationSize;J++)g(Z.location+J);n.bindBuffer(n.ARRAY_BUFFER,Me);for(let J=0;J<Z.locationSize;J++)w(Z.location+J,Ce/Z.locationSize,Ae,xe,Ce*De,Ce/Z.locationSize*J*De,G)}}else if($!==void 0){let xe=$[ne];if(xe!==void 0)switch(xe.length){case 2:n.vertexAttrib2fv(Z.location,xe);break;case 3:n.vertexAttrib3fv(Z.location,xe);break;case 4:n.vertexAttrib4fv(Z.location,xe);break;default:n.vertexAttrib1fv(Z.location,xe)}}}}E()}function T(){U();for(let b in i){let I=i[b];for(let k in I){let X=I[k];for(let Y in X)h(X[Y].object),delete X[Y];delete I[k]}delete i[b]}}function R(b){if(i[b.id]===void 0)return;let I=i[b.id];for(let k in I){let X=I[k];for(let Y in X)h(X[Y].object),delete X[Y];delete I[k]}delete i[b.id]}function P(b){for(let I in i){let k=i[I];if(k[b.id]===void 0)continue;let X=k[b.id];for(let Y in X)h(X[Y].object),delete X[Y];delete k[b.id]}}function U(){S(),a=!0,r!==s&&(r=s,c(r.object))}function S(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:U,resetDefaultState:S,dispose:T,releaseStatesOfGeometry:R,releaseStatesOfProgram:P,initAttributes:_,enableAttribute:g,disableUnusedAttributes:E}}function Jm(n,e,t){let i;function s(c){i=c}function r(c,h){n.drawArrays(i,c,h),t.update(h,i,1)}function a(c,h,u){u!==0&&(n.drawArraysInstanced(i,c,h,u),t.update(h,i,u))}function o(c,h,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,h,0,u);let f=0;for(let m=0;m<u;m++)f+=h[m];t.update(f,i,1)}function l(c,h,u,d){if(u===0)return;let f=e.get("WEBGL_multi_draw");if(f===null)for(let m=0;m<c.length;m++)a(c[m],h[m],d[m]);else{f.multiDrawArraysInstancedWEBGL(i,c,0,h,0,d,0,u);let m=0;for(let _=0;_<u;_++)m+=h[_]*d[_];t.update(m,i,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function Km(n,e,t,i){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let P=e.get("EXT_texture_filter_anisotropic");s=n.getParameter(P.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(P){return!(P!==hn&&i.convert(P)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(P){let U=P===ps&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(P!==Sn&&i.convert(P)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&P!==wn&&!U)}function l(P){if(P==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";P="mediump"}return P==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let u=t.logarithmicDepthBuffer===!0,d=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),f=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),m=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_TEXTURE_SIZE),g=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),E=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),w=n.getParameter(n.MAX_VARYING_VECTORS),v=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),T=m>0,R=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:m,maxTextureSize:_,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:E,maxVaryings:w,maxFragmentUniforms:v,vertexTextures:T,maxSamples:R}}function jm(n){let e=this,t=null,i=0,s=!1,r=!1,a=new yn,o=new Xe,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){let f=u.length!==0||d||i!==0||s;return s=d,i=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){t=h(u,d,0)},this.setState=function(u,d,f){let m=u.clippingPlanes,_=u.clipIntersection,g=u.clipShadows,p=n.get(u);if(!s||m===null||m.length===0||r&&!g)r?h(null):c();else{let E=r?0:i,w=E*4,v=p.clippingState||null;l.value=v,v=h(m,d,w,f);for(let T=0;T!==w;++T)v[T]=t[T];p.clippingState=v,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=E}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function h(u,d,f,m){let _=u!==null?u.length:0,g=null;if(_!==0){if(g=l.value,m!==!0||g===null){let p=f+_*4,E=d.matrixWorldInverse;o.getNormalMatrix(E),(g===null||g.length<p)&&(g=new Float32Array(p));for(let w=0,v=f;w!==_;++w,v+=4)a.copy(u[w]).applyMatrix4(E,o),a.normal.toArray(g,v),g[v+3]=a.constant}l.value=g,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,g}}function Qm(n){let e=new WeakMap;function t(a,o){return o===Ca?a.mapping=Ii:o===Ia&&(a.mapping=Pi),a}function i(a){if(a&&a.isTexture){let o=a.mapping;if(o===Ca||o===Ia)if(e.has(a)){let l=e.get(a).texture;return t(l,a.mapping)}else{let l=a.image;if(l&&l.height>0){let c=new ra(l.height);return c.fromEquirectangularTexture(n,a),e.set(a,c),a.addEventListener("dispose",s),t(c.texture,a.mapping)}else return null}}return a}function s(a){let o=a.target;o.removeEventListener("dispose",s);let l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function r(){e=new WeakMap}return{get:i,dispose:r}}var ys=4,Kh=[.125,.215,.35,.446,.526,.582],Fi=20,Gl=new va,jh=new Ke,Wl=null,Xl=0,ql=0,Yl=!1,Ni=(1+Math.sqrt(5))/2,_s=1/Ni,Qh=[new B(-Ni,_s,0),new B(Ni,_s,0),new B(-_s,0,Ni),new B(_s,0,Ni),new B(0,Ni,-_s),new B(0,Ni,_s),new B(-1,1,-1),new B(1,1,-1),new B(-1,1,1),new B(1,1,1)],eg=new B,go=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,s=100,r={}){let{size:a=256,position:o=eg}=r;Wl=this._renderer.getRenderTarget(),Xl=this._renderer.getActiveCubeFace(),ql=this._renderer.getActiveMipmapLevel(),Yl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,i,s,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=nu(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=tu(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Wl,Xl,ql),this._renderer.xr.enabled=Yl,e.scissorTest=!1,po(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Ii||e.mapping===Pi?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Wl=this._renderer.getRenderTarget(),Xl=this._renderer.getActiveCubeFace(),ql=this._renderer.getActiveMipmapLevel(),Yl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:qt,minFilter:qt,generateMipmaps:!1,type:ps,format:hn,colorSpace:Ai,depthBuffer:!1},s=eu(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=eu(e,t,i);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=tg(r)),this._blurMaterial=ng(r,e,t)}return s}_compileMaterial(e){let t=new st(this._lodPlanes[0],e);this._renderer.compile(t,Gl)}_sceneToCubeUV(e,t,i,s,r){let l=new Ft(90,1,t,i),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,f=u.toneMapping;u.getClearColor(jh),u.toneMapping=mn,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null));let _=new St({name:"PMREM.Background",side:Vt,depthWrite:!1,depthTest:!1}),g=new st(new ls,_),p=!1,E=e.background;E?E.isColor&&(_.color.copy(E),e.background=null,p=!0):(_.color.copy(jh),p=!0);for(let w=0;w<6;w++){let v=w%3;v===0?(l.up.set(0,c[w],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[w],r.y,r.z)):v===1?(l.up.set(0,0,c[w]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[w],r.z)):(l.up.set(0,c[w],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[w]));let T=this._cubeSize;po(s,v*T,w>2?T:0,T,T),u.setRenderTarget(s),p&&u.render(g,l),u.render(e,l)}g.geometry.dispose(),g.material.dispose(),u.toneMapping=f,u.autoClear=d,e.background=E}_textureToCubeUV(e,t){let i=this._renderer,s=e.mapping===Ii||e.mapping===Pi;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=nu()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=tu());let r=s?this._cubemapMaterial:this._equirectMaterial,a=new st(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=e;let l=this._cubeSize;po(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(a,Gl)}_applyPMREM(e){let t=this._renderer,i=t.autoClear;t.autoClear=!1;let s=this._lodPlanes.length;for(let r=1;r<s;r++){let a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=Qh[(s-r-1)%Qh.length];this._blur(e,r-1,r,a,o)}t.autoClear=i}_blur(e,t,i,s,r){let a=this._pingPongRenderTarget;this._halfBlur(e,a,t,i,s,"latitudinal",r),this._halfBlur(a,e,i,i,s,"longitudinal",r)}_halfBlur(e,t,i,s,r,a,o){let l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,u=new st(this._lodPlanes[s],c),d=c.uniforms,f=this._sizeLods[i]-1,m=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*Fi-1),_=r/m,g=isFinite(r)?1+Math.floor(h*_):Fi;g>Fi&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${Fi}`);let p=[],E=0;for(let P=0;P<Fi;++P){let U=P/_,S=Math.exp(-U*U/2);p.push(S),P===0?E+=S:P<g&&(E+=2*S)}for(let P=0;P<p.length;P++)p[P]=p[P]/E;d.envMap.value=e.texture,d.samples.value=g,d.weights.value=p,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);let{_lodMax:w}=this;d.dTheta.value=m,d.mipInt.value=w-i;let v=this._sizeLods[s],T=3*v*(s>w-ys?s-w+ys:0),R=4*(this._cubeSize-v);po(t,T,R,3*v,2*v),l.setRenderTarget(t),l.render(u,Gl)}};function tg(n){let e=[],t=[],i=[],s=n,r=n-ys+1+Kh.length;for(let a=0;a<r;a++){let o=Math.pow(2,s);t.push(o);let l=1/o;a>n-ys?l=Kh[a-n+ys-1]:a===0&&(l=0),i.push(l);let c=1/(o-2),h=-c,u=1+c,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,m=6,_=3,g=2,p=1,E=new Float32Array(_*m*f),w=new Float32Array(g*m*f),v=new Float32Array(p*m*f);for(let R=0;R<f;R++){let P=R%3*2/3-1,U=R>2?0:-1,S=[P,U,0,P+2/3,U,0,P+2/3,U+1,0,P,U,0,P+2/3,U+1,0,P,U+1,0];E.set(S,_*m*R),w.set(d,g*m*R);let b=[R,R,R,R,R,R];v.set(b,p*m*R)}let T=new gt;T.setAttribute("position",new Dt(E,_)),T.setAttribute("uv",new Dt(w,g)),T.setAttribute("faceIndex",new Dt(v,p)),e.push(T),s>ys&&s--}return{lodPlanes:e,sizeLods:t,sigmas:i}}function eu(n,e,t){let i=new vn(n,e,t);return i.texture.mapping=nr,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function po(n,e,t,i,s){n.viewport.set(e,t,i,s),n.scissor.set(e,t,i,s)}function ng(n,e,t){let i=new Float32Array(Fi),s=new B(0,1,0);return new Zt({name:"SphericalGaussianBlur",defines:{n:Fi,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:ic(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:zn,depthTest:!1,depthWrite:!1})}function tu(){return new Zt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ic(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:zn,depthTest:!1,depthWrite:!1})}function nu(){return new Zt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ic(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:zn,depthTest:!1,depthWrite:!1})}function ic(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function ig(n){let e=new WeakMap,t=null;function i(o){if(o&&o.isTexture){let l=o.mapping,c=l===Ca||l===Ia,h=l===Ii||l===Pi;if(c||h){let u=e.get(o),d=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==d)return t===null&&(t=new go(n)),u=c?t.fromEquirectangular(o,u):t.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),u.texture;if(u!==void 0)return u.texture;{let f=o.image;return c&&f&&f.height>0||h&&f&&s(f)?(t===null&&(t=new go(n)),u=c?t.fromEquirectangular(o):t.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),o.addEventListener("dispose",r),u.texture):null}}}return o}function s(o){let l=0,c=6;for(let h=0;h<c;h++)o[h]!==void 0&&l++;return l===c}function r(o){let l=o.target;l.removeEventListener("dispose",r);let c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:a}}function sg(n){let e={};function t(i){if(e[i]!==void 0)return e[i];let s;switch(i){case"WEBGL_depth_texture":s=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=n.getExtension(i)}return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){let s=t(i);return s===null&&as("THREE.WebGLRenderer: "+i+" extension not supported."),s}}}function rg(n,e,t,i){let s={},r=new WeakMap;function a(u){let d=u.target;d.index!==null&&e.remove(d.index);for(let m in d.attributes)e.remove(d.attributes[m]);d.removeEventListener("dispose",a),delete s[d.id];let f=r.get(d);f&&(e.remove(f),r.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function o(u,d){return s[d.id]===!0||(d.addEventListener("dispose",a),s[d.id]=!0,t.memory.geometries++),d}function l(u){let d=u.attributes;for(let f in d)e.update(d[f],n.ARRAY_BUFFER)}function c(u){let d=[],f=u.index,m=u.attributes.position,_=0;if(f!==null){let E=f.array;_=f.version;for(let w=0,v=E.length;w<v;w+=3){let T=E[w+0],R=E[w+1],P=E[w+2];d.push(T,R,R,P,P,T)}}else if(m!==void 0){let E=m.array;_=m.version;for(let w=0,v=E.length/3-1;w<v;w+=3){let T=w+0,R=w+1,P=w+2;d.push(T,R,R,P,P,T)}}else return;let g=new(Bl(d)?Gs:Hs)(d,1);g.version=_;let p=r.get(u);p&&e.remove(p),r.set(u,g)}function h(u){let d=r.get(u);if(d){let f=u.index;f!==null&&d.version<f.version&&c(u)}else c(u);return r.get(u)}return{get:o,update:l,getWireframeAttribute:h}}function ag(n,e,t){let i;function s(d){i=d}let r,a;function o(d){r=d.type,a=d.bytesPerElement}function l(d,f){n.drawElements(i,f,r,d*a),t.update(f,i,1)}function c(d,f,m){m!==0&&(n.drawElementsInstanced(i,f,r,d*a,m),t.update(f,i,m))}function h(d,f,m){if(m===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,f,0,r,d,0,m);let g=0;for(let p=0;p<m;p++)g+=f[p];t.update(g,i,1)}function u(d,f,m,_){if(m===0)return;let g=e.get("WEBGL_multi_draw");if(g===null)for(let p=0;p<d.length;p++)c(d[p]/a,f[p],_[p]);else{g.multiDrawElementsInstancedWEBGL(i,f,0,r,d,0,_,0,m);let p=0;for(let E=0;E<m;E++)p+=f[E]*_[E];t.update(p,i,1)}}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function og(n){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,a,o){switch(t.calls++,a){case n.TRIANGLES:t.triangles+=o*(r/3);break;case n.LINES:t.lines+=o*(r/2);break;case n.LINE_STRIP:t.lines+=o*(r-1);break;case n.LINE_LOOP:t.lines+=o*r;break;case n.POINTS:t.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function lg(n,e,t){let i=new WeakMap,s=new bt;function r(a,o,l){let c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0,d=i.get(o);if(d===void 0||d.count!==u){let S=function(){P.dispose(),i.delete(o),o.removeEventListener("dispose",S)};d!==void 0&&d.texture.dispose();let f=o.morphAttributes.position!==void 0,m=o.morphAttributes.normal!==void 0,_=o.morphAttributes.color!==void 0,g=o.morphAttributes.position||[],p=o.morphAttributes.normal||[],E=o.morphAttributes.color||[],w=0;f===!0&&(w=1),m===!0&&(w=2),_===!0&&(w=3);let v=o.attributes.position.count*w,T=1;v>e.maxTextureSize&&(T=Math.ceil(v/e.maxTextureSize),v=e.maxTextureSize);let R=new Float32Array(v*T*4*u),P=new ks(R,v,T,u);P.type=wn,P.needsUpdate=!0;let U=w*4;for(let b=0;b<u;b++){let I=g[b],k=p[b],X=E[b],Y=v*T*4*b;for(let K=0;K<I.count;K++){let $=K*U;f===!0&&(s.fromBufferAttribute(I,K),R[Y+$+0]=s.x,R[Y+$+1]=s.y,R[Y+$+2]=s.z,R[Y+$+3]=0),m===!0&&(s.fromBufferAttribute(k,K),R[Y+$+4]=s.x,R[Y+$+5]=s.y,R[Y+$+6]=s.z,R[Y+$+7]=0),_===!0&&(s.fromBufferAttribute(X,K),R[Y+$+8]=s.x,R[Y+$+9]=s.y,R[Y+$+10]=s.z,R[Y+$+11]=X.itemSize===4?s.w:1)}}d={count:u,texture:P,size:new Ze(v,T)},i.set(o,d),o.addEventListener("dispose",S)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",a.morphTexture,t);else{let f=0;for(let _=0;_<c.length;_++)f+=c[_];let m=o.morphTargetsRelative?1:1-f;l.getUniforms().setValue(n,"morphTargetBaseInfluence",m),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(n,"morphTargetsTextureSize",d.size)}return{update:r}}function cg(n,e,t,i){let s=new WeakMap;function r(l){let c=i.render.frame,h=l.geometry,u=e.get(l,h);if(s.get(u)!==c&&(e.update(u),s.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),s.get(l)!==c&&(t.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,n.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){let d=l.skeleton;s.get(d)!==c&&(d.update(),s.set(d,c))}return u}function a(){s=new WeakMap}function o(l){let c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:a}}var Mu=new Yt,iu=new Js(1,1),bu=new ks,Su=new ia,wu=new Xs,su=[],ru=[],au=new Float32Array(16),ou=new Float32Array(9),lu=new Float32Array(4);function Ms(n,e,t){let i=n[0];if(i<=0||i>0)return n;let s=e*t,r=su[s];if(r===void 0&&(r=new Float32Array(s),su[s]=r),e!==0){i.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,n[a].toArray(r,o)}return r}function At(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function Rt(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function _o(n,e){let t=ru[e];t===void 0&&(t=new Int32Array(e),ru[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function hg(n,e){let t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function ug(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(At(t,e))return;n.uniform2fv(this.addr,e),Rt(t,e)}}function dg(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(At(t,e))return;n.uniform3fv(this.addr,e),Rt(t,e)}}function fg(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(At(t,e))return;n.uniform4fv(this.addr,e),Rt(t,e)}}function pg(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(At(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),Rt(t,e)}else{if(At(t,i))return;lu.set(i),n.uniformMatrix2fv(this.addr,!1,lu),Rt(t,i)}}function mg(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(At(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),Rt(t,e)}else{if(At(t,i))return;ou.set(i),n.uniformMatrix3fv(this.addr,!1,ou),Rt(t,i)}}function gg(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(At(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),Rt(t,e)}else{if(At(t,i))return;au.set(i),n.uniformMatrix4fv(this.addr,!1,au),Rt(t,i)}}function xg(n,e){let t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function _g(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(At(t,e))return;n.uniform2iv(this.addr,e),Rt(t,e)}}function yg(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(At(t,e))return;n.uniform3iv(this.addr,e),Rt(t,e)}}function vg(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(At(t,e))return;n.uniform4iv(this.addr,e),Rt(t,e)}}function Mg(n,e){let t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function bg(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(At(t,e))return;n.uniform2uiv(this.addr,e),Rt(t,e)}}function Sg(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(At(t,e))return;n.uniform3uiv(this.addr,e),Rt(t,e)}}function wg(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(At(t,e))return;n.uniform4uiv(this.addr,e),Rt(t,e)}}function Eg(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?(iu.compareFunction=Fl,r=iu):r=Mu,t.setTexture2D(e||r,s)}function Tg(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||Su,s)}function Ag(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTextureCube(e||wu,s)}function Rg(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||bu,s)}function Cg(n){switch(n){case 5126:return hg;case 35664:return ug;case 35665:return dg;case 35666:return fg;case 35674:return pg;case 35675:return mg;case 35676:return gg;case 5124:case 35670:return xg;case 35667:case 35671:return _g;case 35668:case 35672:return yg;case 35669:case 35673:return vg;case 5125:return Mg;case 36294:return bg;case 36295:return Sg;case 36296:return wg;case 35678:case 36198:case 36298:case 36306:case 35682:return Eg;case 35679:case 36299:case 36307:return Tg;case 35680:case 36300:case 36308:case 36293:return Ag;case 36289:case 36303:case 36311:case 36292:return Rg}}function Ig(n,e){n.uniform1fv(this.addr,e)}function Pg(n,e){let t=Ms(e,this.size,2);n.uniform2fv(this.addr,t)}function Dg(n,e){let t=Ms(e,this.size,3);n.uniform3fv(this.addr,t)}function Lg(n,e){let t=Ms(e,this.size,4);n.uniform4fv(this.addr,t)}function Ug(n,e){let t=Ms(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function Ng(n,e){let t=Ms(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function Fg(n,e){let t=Ms(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function Og(n,e){n.uniform1iv(this.addr,e)}function Bg(n,e){n.uniform2iv(this.addr,e)}function kg(n,e){n.uniform3iv(this.addr,e)}function zg(n,e){n.uniform4iv(this.addr,e)}function Vg(n,e){n.uniform1uiv(this.addr,e)}function Hg(n,e){n.uniform2uiv(this.addr,e)}function Gg(n,e){n.uniform3uiv(this.addr,e)}function Wg(n,e){n.uniform4uiv(this.addr,e)}function Xg(n,e,t){let i=this.cache,s=e.length,r=_o(t,s);At(i,r)||(n.uniform1iv(this.addr,r),Rt(i,r));for(let a=0;a!==s;++a)t.setTexture2D(e[a]||Mu,r[a])}function qg(n,e,t){let i=this.cache,s=e.length,r=_o(t,s);At(i,r)||(n.uniform1iv(this.addr,r),Rt(i,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||Su,r[a])}function Yg(n,e,t){let i=this.cache,s=e.length,r=_o(t,s);At(i,r)||(n.uniform1iv(this.addr,r),Rt(i,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||wu,r[a])}function Zg(n,e,t){let i=this.cache,s=e.length,r=_o(t,s);At(i,r)||(n.uniform1iv(this.addr,r),Rt(i,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||bu,r[a])}function $g(n){switch(n){case 5126:return Ig;case 35664:return Pg;case 35665:return Dg;case 35666:return Lg;case 35674:return Ug;case 35675:return Ng;case 35676:return Fg;case 5124:case 35670:return Og;case 35667:case 35671:return Bg;case 35668:case 35672:return kg;case 35669:case 35673:return zg;case 5125:return Vg;case 36294:return Hg;case 36295:return Gg;case 36296:return Wg;case 35678:case 36198:case 36298:case 36306:case 35682:return Xg;case 35679:case 36299:case 36307:return qg;case 35680:case 36300:case 36308:case 36293:return Yg;case 36289:case 36303:case 36311:case 36292:return Zg}}var $l=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=Cg(t.type)}},Jl=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=$g(t.type)}},Kl=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){let s=this.seq;for(let r=0,a=s.length;r!==a;++r){let o=s[r];o.setValue(e,t[o.id],i)}}},Zl=/(\w+)(\])?(\[|\.)?/g;function cu(n,e){n.seq.push(e),n.map[e.id]=e}function Jg(n,e,t){let i=n.name,s=i.length;for(Zl.lastIndex=0;;){let r=Zl.exec(i),a=Zl.lastIndex,o=r[1],l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){cu(t,c===void 0?new $l(o,n,e):new Jl(o,n,e));break}else{let u=t.map[o];u===void 0&&(u=new Kl(o),cu(t,u)),t=u}}}var vs=class{constructor(e,t){this.seq=[],this.map={};let i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){let r=e.getActiveUniform(t,s),a=e.getUniformLocation(t,r.name);Jg(r,a,this)}}setValue(e,t,i,s){let r=this.map[t];r!==void 0&&r.setValue(e,i,s)}setOptional(e,t,i){let s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let r=0,a=t.length;r!==a;++r){let o=t[r],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){let i=[];for(let s=0,r=e.length;s!==r;++s){let a=e[s];a.id in t&&i.push(a)}return i}};function hu(n,e,t){let i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}var Kg=37297,jg=0;function Qg(n,e){let t=n.split(`
`),i=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){let o=a+1;i.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return i.join(`
`)}var uu=new Xe;function e0(n){Qe._getMatrix(uu,Qe.workingColorSpace,n);let e=`mat3( ${uu.elements.map(t=>t.toFixed(4))} )`;switch(Qe.getTransfer(n)){case Fs:return[e,"LinearTransferOETF"];case it:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function du(n,e,t){let i=n.getShaderParameter(e,n.COMPILE_STATUS),r=(n.getShaderInfoLog(e)||"").trim();if(i&&r==="")return"";let a=/ERROR: 0:(\d+)/.exec(r);if(a){let o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+Qg(n.getShaderSource(e),o)}else return r}function t0(n,e){let t=e0(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function n0(n,e){let t;switch(e){case Ah:t="Linear";break;case Rh:t="Reinhard";break;case Ch:t="Cineon";break;case Ih:t="ACESFilmic";break;case Dh:t="AgX";break;case Lh:t="Neutral";break;case Ph:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var mo=new B;function i0(){Qe.getLuminanceCoefficients(mo);let n=mo.x.toFixed(4),e=mo.y.toFixed(4),t=mo.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function s0(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(hr).join(`
`)}function r0(n){let e=[];for(let t in n){let i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function a0(n,e){let t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){let r=n.getActiveAttrib(e,s),a=r.name,o=1;r.type===n.FLOAT_MAT2&&(o=2),r.type===n.FLOAT_MAT3&&(o=3),r.type===n.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:n.getAttribLocation(e,a),locationSize:o}}return t}function hr(n){return n!==""}function fu(n,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function pu(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var o0=/^[ \t]*#include +<([\w\d./]+)>/gm;function jl(n){return n.replace(o0,c0)}var l0=new Map;function c0(n,e){let t=Ye[e];if(t===void 0){let i=l0.get(e);if(i!==void 0)t=Ye[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return jl(t)}var h0=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function mu(n){return n.replace(h0,u0)}function u0(n,e,t,i){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function gu(n){let e=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?e+=`
#define HIGH_PRECISION`:n.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function d0(n){let e="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===Sl?e="SHADOWMAP_TYPE_PCF":n.shadowMapType===ah?e="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===bn&&(e="SHADOWMAP_TYPE_VSM"),e}function f0(n){let e="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case Ii:case Pi:e="ENVMAP_TYPE_CUBE";break;case nr:e="ENVMAP_TYPE_CUBE_UV";break}return e}function p0(n){let e="ENVMAP_MODE_REFLECTION";return n.envMap&&n.envMapMode===Pi&&(e="ENVMAP_MODE_REFRACTION"),e}function m0(n){let e="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case Al:e="ENVMAP_BLENDING_MULTIPLY";break;case Eh:e="ENVMAP_BLENDING_MIX";break;case Th:e="ENVMAP_BLENDING_ADD";break}return e}function g0(n){let e=n.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function x0(n,e,t,i){let s=n.getContext(),r=t.defines,a=t.vertexShader,o=t.fragmentShader,l=d0(t),c=f0(t),h=p0(t),u=m0(t),d=g0(t),f=s0(t),m=r0(r),_=s.createProgram(),g,p,E=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(hr).join(`
`),g.length>0&&(g+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(hr).join(`
`),p.length>0&&(p+=`
`)):(g=[gu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(hr).join(`
`),p=[gu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==mn?"#define TONE_MAPPING":"",t.toneMapping!==mn?Ye.tonemapping_pars_fragment:"",t.toneMapping!==mn?n0("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ye.colorspace_pars_fragment,t0("linearToOutputTexel",t.outputColorSpace),i0(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(hr).join(`
`)),a=jl(a),a=fu(a,t),a=pu(a,t),o=jl(o),o=fu(o,t),o=pu(o,t),a=mu(a),o=mu(o),t.isRawShaderMaterial!==!0&&(E=`#version 300 es
`,g=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,p=["#define varying in",t.glslVersion===Ol?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Ol?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let w=E+g+a,v=E+p+o,T=hu(s,s.VERTEX_SHADER,w),R=hu(s,s.FRAGMENT_SHADER,v);s.attachShader(_,T),s.attachShader(_,R),t.index0AttributeName!==void 0?s.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function P(I){if(n.debug.checkShaderErrors){let k=s.getProgramInfoLog(_)||"",X=s.getShaderInfoLog(T)||"",Y=s.getShaderInfoLog(R)||"",K=k.trim(),$=X.trim(),ne=Y.trim(),Z=!0,de=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(Z=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,_,T,R);else{let xe=du(s,T,"vertex"),Ce=du(s,R,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+I.name+`
Material Type: `+I.type+`

Program Info Log: `+K+`
`+xe+`
`+Ce)}else K!==""?console.warn("THREE.WebGLProgram: Program Info Log:",K):($===""||ne==="")&&(de=!1);de&&(I.diagnostics={runnable:Z,programLog:K,vertexShader:{log:$,prefix:g},fragmentShader:{log:ne,prefix:p}})}s.deleteShader(T),s.deleteShader(R),U=new vs(s,_),S=a0(s,_)}let U;this.getUniforms=function(){return U===void 0&&P(this),U};let S;this.getAttributes=function(){return S===void 0&&P(this),S};let b=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return b===!1&&(b=s.getProgramParameter(_,Kg)),b},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=jg++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=T,this.fragmentShader=R,this}var _0=0,Ql=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,i=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(i),a=this._getShaderCacheForMaterial(e);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){let t=this.shaderCache,i=t.get(e);return i===void 0&&(i=new ec(e),t.set(e,i)),i}},ec=class{constructor(e){this.id=_0++,this.code=e,this.usedTimes=0}};function y0(n,e,t,i,s,r,a){let o=new Vs,l=new Ql,c=new Set,h=[],u=s.logarithmicDepthBuffer,d=s.vertexTextures,f=s.precision,m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(S){return c.add(S),S===0?"uv":`uv${S}`}function g(S,b,I,k,X){let Y=k.fog,K=X.geometry,$=S.isMeshStandardMaterial?k.environment:null,ne=(S.isMeshStandardMaterial?t:e).get(S.envMap||$),Z=ne&&ne.mapping===nr?ne.image.height:null,de=m[S.type];S.precision!==null&&(f=s.getMaxPrecision(S.precision),f!==S.precision&&console.warn("THREE.WebGLProgram.getParameters:",S.precision,"not supported, using",f,"instead."));let xe=K.morphAttributes.position||K.morphAttributes.normal||K.morphAttributes.color,Ce=xe!==void 0?xe.length:0,ke=0;K.morphAttributes.position!==void 0&&(ke=1),K.morphAttributes.normal!==void 0&&(ke=2),K.morphAttributes.color!==void 0&&(ke=3);let Me,Ae,De,G;if(de){let nt=En[de];Me=nt.vertexShader,Ae=nt.fragmentShader}else Me=S.vertexShader,Ae=S.fragmentShader,l.update(S),De=l.getVertexShaderID(S),G=l.getFragmentShaderID(S);let J=n.getRenderTarget(),ge=n.state.buffers.depth.getReversed(),Le=X.isInstancedMesh===!0,be=X.isBatchedMesh===!0,qe=!!S.map,It=!!S.matcap,C=!!ne,rt=!!S.aoMap,We=!!S.lightMap,Fe=!!S.bumpMap,Re=!!S.normalMap,ht=!!S.displacementMap,we=!!S.emissiveMap,Oe=!!S.metalnessMap,ft=!!S.roughnessMap,at=S.anisotropy>0,A=S.clearcoat>0,y=S.dispersion>0,D=S.iridescence>0,V=S.sheen>0,q=S.transmission>0,z=at&&!!S.anisotropyMap,oe=A&&!!S.clearcoatMap,te=A&&!!S.clearcoatNormalMap,pe=A&&!!S.clearcoatRoughnessMap,he=D&&!!S.iridescenceMap,j=D&&!!S.iridescenceThicknessMap,se=V&&!!S.sheenColorMap,Ee=V&&!!S.sheenRoughnessMap,ye=!!S.specularMap,ue=!!S.specularColorMap,Ve=!!S.specularIntensityMap,L=q&&!!S.transmissionMap,re=q&&!!S.thicknessMap,ce=!!S.gradientMap,Se=!!S.alphaMap,ae=S.alphaTest>0,Q=!!S.alphaHash,ve=!!S.extensions,He=mn;S.toneMapped&&(J===null||J.isXRRenderTarget===!0)&&(He=n.toneMapping);let tt={shaderID:de,shaderType:S.type,shaderName:S.name,vertexShader:Me,fragmentShader:Ae,defines:S.defines,customVertexShaderID:De,customFragmentShaderID:G,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:f,batching:be,batchingColor:be&&X._colorsTexture!==null,instancing:Le,instancingColor:Le&&X.instanceColor!==null,instancingMorph:Le&&X.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:J===null?n.outputColorSpace:J.isXRRenderTarget===!0?J.texture.colorSpace:Ai,alphaToCoverage:!!S.alphaToCoverage,map:qe,matcap:It,envMap:C,envMapMode:C&&ne.mapping,envMapCubeUVHeight:Z,aoMap:rt,lightMap:We,bumpMap:Fe,normalMap:Re,displacementMap:d&&ht,emissiveMap:we,normalMapObjectSpace:Re&&S.normalMapType===Bh,normalMapTangentSpace:Re&&S.normalMapType===Oh,metalnessMap:Oe,roughnessMap:ft,anisotropy:at,anisotropyMap:z,clearcoat:A,clearcoatMap:oe,clearcoatNormalMap:te,clearcoatRoughnessMap:pe,dispersion:y,iridescence:D,iridescenceMap:he,iridescenceThicknessMap:j,sheen:V,sheenColorMap:se,sheenRoughnessMap:Ee,specularMap:ye,specularColorMap:ue,specularIntensityMap:Ve,transmission:q,transmissionMap:L,thicknessMap:re,gradientMap:ce,opaque:S.transparent===!1&&S.blending===Ei&&S.alphaToCoverage===!1,alphaMap:Se,alphaTest:ae,alphaHash:Q,combine:S.combine,mapUv:qe&&_(S.map.channel),aoMapUv:rt&&_(S.aoMap.channel),lightMapUv:We&&_(S.lightMap.channel),bumpMapUv:Fe&&_(S.bumpMap.channel),normalMapUv:Re&&_(S.normalMap.channel),displacementMapUv:ht&&_(S.displacementMap.channel),emissiveMapUv:we&&_(S.emissiveMap.channel),metalnessMapUv:Oe&&_(S.metalnessMap.channel),roughnessMapUv:ft&&_(S.roughnessMap.channel),anisotropyMapUv:z&&_(S.anisotropyMap.channel),clearcoatMapUv:oe&&_(S.clearcoatMap.channel),clearcoatNormalMapUv:te&&_(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:pe&&_(S.clearcoatRoughnessMap.channel),iridescenceMapUv:he&&_(S.iridescenceMap.channel),iridescenceThicknessMapUv:j&&_(S.iridescenceThicknessMap.channel),sheenColorMapUv:se&&_(S.sheenColorMap.channel),sheenRoughnessMapUv:Ee&&_(S.sheenRoughnessMap.channel),specularMapUv:ye&&_(S.specularMap.channel),specularColorMapUv:ue&&_(S.specularColorMap.channel),specularIntensityMapUv:Ve&&_(S.specularIntensityMap.channel),transmissionMapUv:L&&_(S.transmissionMap.channel),thicknessMapUv:re&&_(S.thicknessMap.channel),alphaMapUv:Se&&_(S.alphaMap.channel),vertexTangents:!!K.attributes.tangent&&(Re||at),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!K.attributes.color&&K.attributes.color.itemSize===4,pointsUvs:X.isPoints===!0&&!!K.attributes.uv&&(qe||Se),fog:!!Y,useFog:S.fog===!0,fogExp2:!!Y&&Y.isFogExp2,flatShading:S.flatShading===!0&&S.wireframe===!1,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:ge,skinning:X.isSkinnedMesh===!0,morphTargets:K.morphAttributes.position!==void 0,morphNormals:K.morphAttributes.normal!==void 0,morphColors:K.morphAttributes.color!==void 0,morphTargetsCount:Ce,morphTextureStride:ke,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:S.dithering,shadowMapEnabled:n.shadowMap.enabled&&I.length>0,shadowMapType:n.shadowMap.type,toneMapping:He,decodeVideoTexture:qe&&S.map.isVideoTexture===!0&&Qe.getTransfer(S.map.colorSpace)===it,decodeVideoTextureEmissive:we&&S.emissiveMap.isVideoTexture===!0&&Qe.getTransfer(S.emissiveMap.colorSpace)===it,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===wt,flipSided:S.side===Vt,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionClipCullDistance:ve&&S.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ve&&S.extensions.multiDraw===!0||be)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()};return tt.vertexUv1s=c.has(1),tt.vertexUv2s=c.has(2),tt.vertexUv3s=c.has(3),c.clear(),tt}function p(S){let b=[];if(S.shaderID?b.push(S.shaderID):(b.push(S.customVertexShaderID),b.push(S.customFragmentShaderID)),S.defines!==void 0)for(let I in S.defines)b.push(I),b.push(S.defines[I]);return S.isRawShaderMaterial===!1&&(E(b,S),w(b,S),b.push(n.outputColorSpace)),b.push(S.customProgramCacheKey),b.join()}function E(S,b){S.push(b.precision),S.push(b.outputColorSpace),S.push(b.envMapMode),S.push(b.envMapCubeUVHeight),S.push(b.mapUv),S.push(b.alphaMapUv),S.push(b.lightMapUv),S.push(b.aoMapUv),S.push(b.bumpMapUv),S.push(b.normalMapUv),S.push(b.displacementMapUv),S.push(b.emissiveMapUv),S.push(b.metalnessMapUv),S.push(b.roughnessMapUv),S.push(b.anisotropyMapUv),S.push(b.clearcoatMapUv),S.push(b.clearcoatNormalMapUv),S.push(b.clearcoatRoughnessMapUv),S.push(b.iridescenceMapUv),S.push(b.iridescenceThicknessMapUv),S.push(b.sheenColorMapUv),S.push(b.sheenRoughnessMapUv),S.push(b.specularMapUv),S.push(b.specularColorMapUv),S.push(b.specularIntensityMapUv),S.push(b.transmissionMapUv),S.push(b.thicknessMapUv),S.push(b.combine),S.push(b.fogExp2),S.push(b.sizeAttenuation),S.push(b.morphTargetsCount),S.push(b.morphAttributeCount),S.push(b.numDirLights),S.push(b.numPointLights),S.push(b.numSpotLights),S.push(b.numSpotLightMaps),S.push(b.numHemiLights),S.push(b.numRectAreaLights),S.push(b.numDirLightShadows),S.push(b.numPointLightShadows),S.push(b.numSpotLightShadows),S.push(b.numSpotLightShadowsWithMaps),S.push(b.numLightProbes),S.push(b.shadowMapType),S.push(b.toneMapping),S.push(b.numClippingPlanes),S.push(b.numClipIntersection),S.push(b.depthPacking)}function w(S,b){o.disableAll(),b.supportsVertexTextures&&o.enable(0),b.instancing&&o.enable(1),b.instancingColor&&o.enable(2),b.instancingMorph&&o.enable(3),b.matcap&&o.enable(4),b.envMap&&o.enable(5),b.normalMapObjectSpace&&o.enable(6),b.normalMapTangentSpace&&o.enable(7),b.clearcoat&&o.enable(8),b.iridescence&&o.enable(9),b.alphaTest&&o.enable(10),b.vertexColors&&o.enable(11),b.vertexAlphas&&o.enable(12),b.vertexUv1s&&o.enable(13),b.vertexUv2s&&o.enable(14),b.vertexUv3s&&o.enable(15),b.vertexTangents&&o.enable(16),b.anisotropy&&o.enable(17),b.alphaHash&&o.enable(18),b.batching&&o.enable(19),b.dispersion&&o.enable(20),b.batchingColor&&o.enable(21),b.gradientMap&&o.enable(22),S.push(o.mask),o.disableAll(),b.fog&&o.enable(0),b.useFog&&o.enable(1),b.flatShading&&o.enable(2),b.logarithmicDepthBuffer&&o.enable(3),b.reversedDepthBuffer&&o.enable(4),b.skinning&&o.enable(5),b.morphTargets&&o.enable(6),b.morphNormals&&o.enable(7),b.morphColors&&o.enable(8),b.premultipliedAlpha&&o.enable(9),b.shadowMapEnabled&&o.enable(10),b.doubleSided&&o.enable(11),b.flipSided&&o.enable(12),b.useDepthPacking&&o.enable(13),b.dithering&&o.enable(14),b.transmission&&o.enable(15),b.sheen&&o.enable(16),b.opaque&&o.enable(17),b.pointsUvs&&o.enable(18),b.decodeVideoTexture&&o.enable(19),b.decodeVideoTextureEmissive&&o.enable(20),b.alphaToCoverage&&o.enable(21),S.push(o.mask)}function v(S){let b=m[S.type],I;if(b){let k=En[b];I=$h.clone(k.uniforms)}else I=S.uniforms;return I}function T(S,b){let I;for(let k=0,X=h.length;k<X;k++){let Y=h[k];if(Y.cacheKey===b){I=Y,++I.usedTimes;break}}return I===void 0&&(I=new x0(n,b,S,r),h.push(I)),I}function R(S){if(--S.usedTimes===0){let b=h.indexOf(S);h[b]=h[h.length-1],h.pop(),S.destroy()}}function P(S){l.remove(S)}function U(){l.dispose()}return{getParameters:g,getProgramCacheKey:p,getUniforms:v,acquireProgram:T,releaseProgram:R,releaseShaderCache:P,programs:h,dispose:U}}function v0(){let n=new WeakMap;function e(a){return n.has(a)}function t(a){let o=n.get(a);return o===void 0&&(o={},n.set(a,o)),o}function i(a){n.delete(a)}function s(a,o,l){n.get(a)[o]=l}function r(){n=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:r}}function M0(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function xu(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function _u(){let n=[],e=0,t=[],i=[],s=[];function r(){e=0,t.length=0,i.length=0,s.length=0}function a(u,d,f,m,_,g){let p=n[e];return p===void 0?(p={id:u.id,object:u,geometry:d,material:f,groupOrder:m,renderOrder:u.renderOrder,z:_,group:g},n[e]=p):(p.id=u.id,p.object=u,p.geometry=d,p.material=f,p.groupOrder=m,p.renderOrder=u.renderOrder,p.z=_,p.group=g),e++,p}function o(u,d,f,m,_,g){let p=a(u,d,f,m,_,g);f.transmission>0?i.push(p):f.transparent===!0?s.push(p):t.push(p)}function l(u,d,f,m,_,g){let p=a(u,d,f,m,_,g);f.transmission>0?i.unshift(p):f.transparent===!0?s.unshift(p):t.unshift(p)}function c(u,d){t.length>1&&t.sort(u||M0),i.length>1&&i.sort(d||xu),s.length>1&&s.sort(d||xu)}function h(){for(let u=e,d=n.length;u<d;u++){let f=n[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:t,transmissive:i,transparent:s,init:r,push:o,unshift:l,finish:h,sort:c}}function b0(){let n=new WeakMap;function e(i,s){let r=n.get(i),a;return r===void 0?(a=new _u,n.set(i,[a])):s>=r.length?(a=new _u,r.push(a)):a=r[s],a}function t(){n=new WeakMap}return{get:e,dispose:t}}function S0(){let n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new B,color:new Ke};break;case"SpotLight":t={position:new B,direction:new B,color:new Ke,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new B,color:new Ke,distance:0,decay:0};break;case"HemisphereLight":t={direction:new B,skyColor:new Ke,groundColor:new Ke};break;case"RectAreaLight":t={color:new Ke,position:new B,halfWidth:new B,halfHeight:new B};break}return n[e.id]=t,t}}}function w0(){let n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ze};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ze};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ze,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}var E0=0;function T0(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function A0(n){let e=new S0,t=w0(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new B);let s=new B,r=new Tt,a=new Tt;function o(c){let h=0,u=0,d=0;for(let S=0;S<9;S++)i.probe[S].set(0,0,0);let f=0,m=0,_=0,g=0,p=0,E=0,w=0,v=0,T=0,R=0,P=0;c.sort(T0);for(let S=0,b=c.length;S<b;S++){let I=c[S],k=I.color,X=I.intensity,Y=I.distance,K=I.shadow&&I.shadow.map?I.shadow.map.texture:null;if(I.isAmbientLight)h+=k.r*X,u+=k.g*X,d+=k.b*X;else if(I.isLightProbe){for(let $=0;$<9;$++)i.probe[$].addScaledVector(I.sh.coefficients[$],X);P++}else if(I.isDirectionalLight){let $=e.get(I);if($.color.copy(I.color).multiplyScalar(I.intensity),I.castShadow){let ne=I.shadow,Z=t.get(I);Z.shadowIntensity=ne.intensity,Z.shadowBias=ne.bias,Z.shadowNormalBias=ne.normalBias,Z.shadowRadius=ne.radius,Z.shadowMapSize=ne.mapSize,i.directionalShadow[f]=Z,i.directionalShadowMap[f]=K,i.directionalShadowMatrix[f]=I.shadow.matrix,E++}i.directional[f]=$,f++}else if(I.isSpotLight){let $=e.get(I);$.position.setFromMatrixPosition(I.matrixWorld),$.color.copy(k).multiplyScalar(X),$.distance=Y,$.coneCos=Math.cos(I.angle),$.penumbraCos=Math.cos(I.angle*(1-I.penumbra)),$.decay=I.decay,i.spot[_]=$;let ne=I.shadow;if(I.map&&(i.spotLightMap[T]=I.map,T++,ne.updateMatrices(I),I.castShadow&&R++),i.spotLightMatrix[_]=ne.matrix,I.castShadow){let Z=t.get(I);Z.shadowIntensity=ne.intensity,Z.shadowBias=ne.bias,Z.shadowNormalBias=ne.normalBias,Z.shadowRadius=ne.radius,Z.shadowMapSize=ne.mapSize,i.spotShadow[_]=Z,i.spotShadowMap[_]=K,v++}_++}else if(I.isRectAreaLight){let $=e.get(I);$.color.copy(k).multiplyScalar(X),$.halfWidth.set(I.width*.5,0,0),$.halfHeight.set(0,I.height*.5,0),i.rectArea[g]=$,g++}else if(I.isPointLight){let $=e.get(I);if($.color.copy(I.color).multiplyScalar(I.intensity),$.distance=I.distance,$.decay=I.decay,I.castShadow){let ne=I.shadow,Z=t.get(I);Z.shadowIntensity=ne.intensity,Z.shadowBias=ne.bias,Z.shadowNormalBias=ne.normalBias,Z.shadowRadius=ne.radius,Z.shadowMapSize=ne.mapSize,Z.shadowCameraNear=ne.camera.near,Z.shadowCameraFar=ne.camera.far,i.pointShadow[m]=Z,i.pointShadowMap[m]=K,i.pointShadowMatrix[m]=I.shadow.matrix,w++}i.point[m]=$,m++}else if(I.isHemisphereLight){let $=e.get(I);$.skyColor.copy(I.color).multiplyScalar(X),$.groundColor.copy(I.groundColor).multiplyScalar(X),i.hemi[p]=$,p++}}g>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=me.LTC_FLOAT_1,i.rectAreaLTC2=me.LTC_FLOAT_2):(i.rectAreaLTC1=me.LTC_HALF_1,i.rectAreaLTC2=me.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=u,i.ambient[2]=d;let U=i.hash;(U.directionalLength!==f||U.pointLength!==m||U.spotLength!==_||U.rectAreaLength!==g||U.hemiLength!==p||U.numDirectionalShadows!==E||U.numPointShadows!==w||U.numSpotShadows!==v||U.numSpotMaps!==T||U.numLightProbes!==P)&&(i.directional.length=f,i.spot.length=_,i.rectArea.length=g,i.point.length=m,i.hemi.length=p,i.directionalShadow.length=E,i.directionalShadowMap.length=E,i.pointShadow.length=w,i.pointShadowMap.length=w,i.spotShadow.length=v,i.spotShadowMap.length=v,i.directionalShadowMatrix.length=E,i.pointShadowMatrix.length=w,i.spotLightMatrix.length=v+T-R,i.spotLightMap.length=T,i.numSpotLightShadowsWithMaps=R,i.numLightProbes=P,U.directionalLength=f,U.pointLength=m,U.spotLength=_,U.rectAreaLength=g,U.hemiLength=p,U.numDirectionalShadows=E,U.numPointShadows=w,U.numSpotShadows=v,U.numSpotMaps=T,U.numLightProbes=P,i.version=E0++)}function l(c,h){let u=0,d=0,f=0,m=0,_=0,g=h.matrixWorldInverse;for(let p=0,E=c.length;p<E;p++){let w=c[p];if(w.isDirectionalLight){let v=i.directional[u];v.direction.setFromMatrixPosition(w.matrixWorld),s.setFromMatrixPosition(w.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(g),u++}else if(w.isSpotLight){let v=i.spot[f];v.position.setFromMatrixPosition(w.matrixWorld),v.position.applyMatrix4(g),v.direction.setFromMatrixPosition(w.matrixWorld),s.setFromMatrixPosition(w.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(g),f++}else if(w.isRectAreaLight){let v=i.rectArea[m];v.position.setFromMatrixPosition(w.matrixWorld),v.position.applyMatrix4(g),a.identity(),r.copy(w.matrixWorld),r.premultiply(g),a.extractRotation(r),v.halfWidth.set(w.width*.5,0,0),v.halfHeight.set(0,w.height*.5,0),v.halfWidth.applyMatrix4(a),v.halfHeight.applyMatrix4(a),m++}else if(w.isPointLight){let v=i.point[d];v.position.setFromMatrixPosition(w.matrixWorld),v.position.applyMatrix4(g),d++}else if(w.isHemisphereLight){let v=i.hemi[_];v.direction.setFromMatrixPosition(w.matrixWorld),v.direction.transformDirection(g),_++}}}return{setup:o,setupView:l,state:i}}function yu(n){let e=new A0(n),t=[],i=[];function s(h){c.camera=h,t.length=0,i.length=0}function r(h){t.push(h)}function a(h){i.push(h)}function o(){e.setup(t)}function l(h){e.setupView(t,h)}let c={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:o,setupLightsView:l,pushLight:r,pushShadow:a}}function R0(n){let e=new WeakMap;function t(s,r=0){let a=e.get(s),o;return a===void 0?(o=new yu(n),e.set(s,[o])):r>=a.length?(o=new yu(n),a.push(o)):o=a[r],o}function i(){e=new WeakMap}return{get:t,dispose:i}}var C0=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,I0=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function P0(n,e,t){let i=new Zs,s=new Ze,r=new Ze,a=new bt,o=new ca({depthPacking:Fh}),l=new ha,c={},h=t.maxTextureSize,u={[On]:Vt,[Vt]:On,[wt]:wt},d=new Zt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ze},radius:{value:4}},vertexShader:C0,fragmentShader:I0}),f=d.clone();f.defines.HORIZONTAL_PASS=1;let m=new gt;m.setAttribute("position",new Dt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new st(m,d),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Sl;let p=this.type;this.render=function(R,P,U){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||R.length===0)return;let S=n.getRenderTarget(),b=n.getActiveCubeFace(),I=n.getActiveMipmapLevel(),k=n.state;k.setBlending(zn),k.buffers.depth.getReversed()===!0?k.buffers.color.setClear(0,0,0,0):k.buffers.color.setClear(1,1,1,1),k.buffers.depth.setTest(!0),k.setScissorTest(!1);let X=p!==bn&&this.type===bn,Y=p===bn&&this.type!==bn;for(let K=0,$=R.length;K<$;K++){let ne=R[K],Z=ne.shadow;if(Z===void 0){console.warn("THREE.WebGLShadowMap:",ne,"has no shadow.");continue}if(Z.autoUpdate===!1&&Z.needsUpdate===!1)continue;s.copy(Z.mapSize);let de=Z.getFrameExtents();if(s.multiply(de),r.copy(Z.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/de.x),s.x=r.x*de.x,Z.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/de.y),s.y=r.y*de.y,Z.mapSize.y=r.y)),Z.map===null||X===!0||Y===!0){let Ce=this.type!==bn?{minFilter:Xt,magFilter:Xt}:{};Z.map!==null&&Z.map.dispose(),Z.map=new vn(s.x,s.y,Ce),Z.map.texture.name=ne.name+".shadowMap",Z.camera.updateProjectionMatrix()}n.setRenderTarget(Z.map),n.clear();let xe=Z.getViewportCount();for(let Ce=0;Ce<xe;Ce++){let ke=Z.getViewport(Ce);a.set(r.x*ke.x,r.y*ke.y,r.x*ke.z,r.y*ke.w),k.viewport(a),Z.updateMatrices(ne,Ce),i=Z.getFrustum(),v(P,U,Z.camera,ne,this.type)}Z.isPointLightShadow!==!0&&this.type===bn&&E(Z,U),Z.needsUpdate=!1}p=this.type,g.needsUpdate=!1,n.setRenderTarget(S,b,I)};function E(R,P){let U=e.update(_);d.defines.VSM_SAMPLES!==R.blurSamples&&(d.defines.VSM_SAMPLES=R.blurSamples,f.defines.VSM_SAMPLES=R.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),R.mapPass===null&&(R.mapPass=new vn(s.x,s.y)),d.uniforms.shadow_pass.value=R.map.texture,d.uniforms.resolution.value=R.mapSize,d.uniforms.radius.value=R.radius,n.setRenderTarget(R.mapPass),n.clear(),n.renderBufferDirect(P,null,U,d,_,null),f.uniforms.shadow_pass.value=R.mapPass.texture,f.uniforms.resolution.value=R.mapSize,f.uniforms.radius.value=R.radius,n.setRenderTarget(R.map),n.clear(),n.renderBufferDirect(P,null,U,f,_,null)}function w(R,P,U,S){let b=null,I=U.isPointLight===!0?R.customDistanceMaterial:R.customDepthMaterial;if(I!==void 0)b=I;else if(b=U.isPointLight===!0?l:o,n.localClippingEnabled&&P.clipShadows===!0&&Array.isArray(P.clippingPlanes)&&P.clippingPlanes.length!==0||P.displacementMap&&P.displacementScale!==0||P.alphaMap&&P.alphaTest>0||P.map&&P.alphaTest>0||P.alphaToCoverage===!0){let k=b.uuid,X=P.uuid,Y=c[k];Y===void 0&&(Y={},c[k]=Y);let K=Y[X];K===void 0&&(K=b.clone(),Y[X]=K,P.addEventListener("dispose",T)),b=K}if(b.visible=P.visible,b.wireframe=P.wireframe,S===bn?b.side=P.shadowSide!==null?P.shadowSide:P.side:b.side=P.shadowSide!==null?P.shadowSide:u[P.side],b.alphaMap=P.alphaMap,b.alphaTest=P.alphaToCoverage===!0?.5:P.alphaTest,b.map=P.map,b.clipShadows=P.clipShadows,b.clippingPlanes=P.clippingPlanes,b.clipIntersection=P.clipIntersection,b.displacementMap=P.displacementMap,b.displacementScale=P.displacementScale,b.displacementBias=P.displacementBias,b.wireframeLinewidth=P.wireframeLinewidth,b.linewidth=P.linewidth,U.isPointLight===!0&&b.isMeshDistanceMaterial===!0){let k=n.properties.get(b);k.light=U}return b}function v(R,P,U,S,b){if(R.visible===!1)return;if(R.layers.test(P.layers)&&(R.isMesh||R.isLine||R.isPoints)&&(R.castShadow||R.receiveShadow&&b===bn)&&(!R.frustumCulled||i.intersectsObject(R))){R.modelViewMatrix.multiplyMatrices(U.matrixWorldInverse,R.matrixWorld);let X=e.update(R),Y=R.material;if(Array.isArray(Y)){let K=X.groups;for(let $=0,ne=K.length;$<ne;$++){let Z=K[$],de=Y[Z.materialIndex];if(de&&de.visible){let xe=w(R,de,S,b);R.onBeforeShadow(n,R,P,U,X,xe,Z),n.renderBufferDirect(U,null,X,xe,R,Z),R.onAfterShadow(n,R,P,U,X,xe,Z)}}}else if(Y.visible){let K=w(R,Y,S,b);R.onBeforeShadow(n,R,P,U,X,K,null),n.renderBufferDirect(U,null,X,K,R,null),R.onAfterShadow(n,R,P,U,X,K,null)}}let k=R.children;for(let X=0,Y=k.length;X<Y;X++)v(k[X],P,U,S,b)}function T(R){R.target.removeEventListener("dispose",T);for(let U in c){let S=c[U],b=R.target.uuid;b in S&&(S[b].dispose(),delete S[b])}}}var D0={[ba]:Sa,[wa]:Aa,[Ea]:Ra,[Ti]:Ta,[Sa]:ba,[Aa]:wa,[Ra]:Ea,[Ta]:Ti};function L0(n,e){function t(){let L=!1,re=new bt,ce=null,Se=new bt(0,0,0,0);return{setMask:function(ae){ce!==ae&&!L&&(n.colorMask(ae,ae,ae,ae),ce=ae)},setLocked:function(ae){L=ae},setClear:function(ae,Q,ve,He,tt){tt===!0&&(ae*=He,Q*=He,ve*=He),re.set(ae,Q,ve,He),Se.equals(re)===!1&&(n.clearColor(ae,Q,ve,He),Se.copy(re))},reset:function(){L=!1,ce=null,Se.set(-1,0,0,0)}}}function i(){let L=!1,re=!1,ce=null,Se=null,ae=null;return{setReversed:function(Q){if(re!==Q){let ve=e.get("EXT_clip_control");Q?ve.clipControlEXT(ve.LOWER_LEFT_EXT,ve.ZERO_TO_ONE_EXT):ve.clipControlEXT(ve.LOWER_LEFT_EXT,ve.NEGATIVE_ONE_TO_ONE_EXT),re=Q;let He=ae;ae=null,this.setClear(He)}},getReversed:function(){return re},setTest:function(Q){Q?J(n.DEPTH_TEST):ge(n.DEPTH_TEST)},setMask:function(Q){ce!==Q&&!L&&(n.depthMask(Q),ce=Q)},setFunc:function(Q){if(re&&(Q=D0[Q]),Se!==Q){switch(Q){case ba:n.depthFunc(n.NEVER);break;case Sa:n.depthFunc(n.ALWAYS);break;case wa:n.depthFunc(n.LESS);break;case Ti:n.depthFunc(n.LEQUAL);break;case Ea:n.depthFunc(n.EQUAL);break;case Ta:n.depthFunc(n.GEQUAL);break;case Aa:n.depthFunc(n.GREATER);break;case Ra:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}Se=Q}},setLocked:function(Q){L=Q},setClear:function(Q){ae!==Q&&(re&&(Q=1-Q),n.clearDepth(Q),ae=Q)},reset:function(){L=!1,ce=null,Se=null,ae=null,re=!1}}}function s(){let L=!1,re=null,ce=null,Se=null,ae=null,Q=null,ve=null,He=null,tt=null;return{setTest:function(nt){L||(nt?J(n.STENCIL_TEST):ge(n.STENCIL_TEST))},setMask:function(nt){re!==nt&&!L&&(n.stencilMask(nt),re=nt)},setFunc:function(nt,In,_n){(ce!==nt||Se!==In||ae!==_n)&&(n.stencilFunc(nt,In,_n),ce=nt,Se=In,ae=_n)},setOp:function(nt,In,_n){(Q!==nt||ve!==In||He!==_n)&&(n.stencilOp(nt,In,_n),Q=nt,ve=In,He=_n)},setLocked:function(nt){L=nt},setClear:function(nt){tt!==nt&&(n.clearStencil(nt),tt=nt)},reset:function(){L=!1,re=null,ce=null,Se=null,ae=null,Q=null,ve=null,He=null,tt=null}}}let r=new t,a=new i,o=new s,l=new WeakMap,c=new WeakMap,h={},u={},d=new WeakMap,f=[],m=null,_=!1,g=null,p=null,E=null,w=null,v=null,T=null,R=null,P=new Ke(0,0,0),U=0,S=!1,b=null,I=null,k=null,X=null,Y=null,K=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS),$=!1,ne=0,Z=n.getParameter(n.VERSION);Z.indexOf("WebGL")!==-1?(ne=parseFloat(/^WebGL (\d)/.exec(Z)[1]),$=ne>=1):Z.indexOf("OpenGL ES")!==-1&&(ne=parseFloat(/^OpenGL ES (\d)/.exec(Z)[1]),$=ne>=2);let de=null,xe={},Ce=n.getParameter(n.SCISSOR_BOX),ke=n.getParameter(n.VIEWPORT),Me=new bt().fromArray(Ce),Ae=new bt().fromArray(ke);function De(L,re,ce,Se){let ae=new Uint8Array(4),Q=n.createTexture();n.bindTexture(L,Q),n.texParameteri(L,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(L,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let ve=0;ve<ce;ve++)L===n.TEXTURE_3D||L===n.TEXTURE_2D_ARRAY?n.texImage3D(re,0,n.RGBA,1,1,Se,0,n.RGBA,n.UNSIGNED_BYTE,ae):n.texImage2D(re+ve,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,ae);return Q}let G={};G[n.TEXTURE_2D]=De(n.TEXTURE_2D,n.TEXTURE_2D,1),G[n.TEXTURE_CUBE_MAP]=De(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),G[n.TEXTURE_2D_ARRAY]=De(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),G[n.TEXTURE_3D]=De(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),J(n.DEPTH_TEST),a.setFunc(Ti),Fe(!1),Re(bl),J(n.CULL_FACE),rt(zn);function J(L){h[L]!==!0&&(n.enable(L),h[L]=!0)}function ge(L){h[L]!==!1&&(n.disable(L),h[L]=!1)}function Le(L,re){return u[L]!==re?(n.bindFramebuffer(L,re),u[L]=re,L===n.DRAW_FRAMEBUFFER&&(u[n.FRAMEBUFFER]=re),L===n.FRAMEBUFFER&&(u[n.DRAW_FRAMEBUFFER]=re),!0):!1}function be(L,re){let ce=f,Se=!1;if(L){ce=d.get(re),ce===void 0&&(ce=[],d.set(re,ce));let ae=L.textures;if(ce.length!==ae.length||ce[0]!==n.COLOR_ATTACHMENT0){for(let Q=0,ve=ae.length;Q<ve;Q++)ce[Q]=n.COLOR_ATTACHMENT0+Q;ce.length=ae.length,Se=!0}}else ce[0]!==n.BACK&&(ce[0]=n.BACK,Se=!0);Se&&n.drawBuffers(ce)}function qe(L){return m!==L?(n.useProgram(L),m=L,!0):!1}let It={[ei]:n.FUNC_ADD,[lh]:n.FUNC_SUBTRACT,[ch]:n.FUNC_REVERSE_SUBTRACT};It[hh]=n.MIN,It[uh]=n.MAX;let C={[dh]:n.ZERO,[fh]:n.ONE,[ph]:n.SRC_COLOR,[$r]:n.SRC_ALPHA,[vh]:n.SRC_ALPHA_SATURATE,[_h]:n.DST_COLOR,[gh]:n.DST_ALPHA,[mh]:n.ONE_MINUS_SRC_COLOR,[Jr]:n.ONE_MINUS_SRC_ALPHA,[yh]:n.ONE_MINUS_DST_COLOR,[xh]:n.ONE_MINUS_DST_ALPHA,[Mh]:n.CONSTANT_COLOR,[bh]:n.ONE_MINUS_CONSTANT_COLOR,[Sh]:n.CONSTANT_ALPHA,[wh]:n.ONE_MINUS_CONSTANT_ALPHA};function rt(L,re,ce,Se,ae,Q,ve,He,tt,nt){if(L===zn){_===!0&&(ge(n.BLEND),_=!1);return}if(_===!1&&(J(n.BLEND),_=!0),L!==oh){if(L!==g||nt!==S){if((p!==ei||v!==ei)&&(n.blendEquation(n.FUNC_ADD),p=ei,v=ei),nt)switch(L){case Ei:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case wl:n.blendFunc(n.ONE,n.ONE);break;case El:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Tl:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}else switch(L){case Ei:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case wl:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case El:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Tl:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}E=null,w=null,T=null,R=null,P.set(0,0,0),U=0,g=L,S=nt}return}ae=ae||re,Q=Q||ce,ve=ve||Se,(re!==p||ae!==v)&&(n.blendEquationSeparate(It[re],It[ae]),p=re,v=ae),(ce!==E||Se!==w||Q!==T||ve!==R)&&(n.blendFuncSeparate(C[ce],C[Se],C[Q],C[ve]),E=ce,w=Se,T=Q,R=ve),(He.equals(P)===!1||tt!==U)&&(n.blendColor(He.r,He.g,He.b,tt),P.copy(He),U=tt),g=L,S=!1}function We(L,re){L.side===wt?ge(n.CULL_FACE):J(n.CULL_FACE);let ce=L.side===Vt;re&&(ce=!ce),Fe(ce),L.blending===Ei&&L.transparent===!1?rt(zn):rt(L.blending,L.blendEquation,L.blendSrc,L.blendDst,L.blendEquationAlpha,L.blendSrcAlpha,L.blendDstAlpha,L.blendColor,L.blendAlpha,L.premultipliedAlpha),a.setFunc(L.depthFunc),a.setTest(L.depthTest),a.setMask(L.depthWrite),r.setMask(L.colorWrite);let Se=L.stencilWrite;o.setTest(Se),Se&&(o.setMask(L.stencilWriteMask),o.setFunc(L.stencilFunc,L.stencilRef,L.stencilFuncMask),o.setOp(L.stencilFail,L.stencilZFail,L.stencilZPass)),we(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),L.alphaToCoverage===!0?J(n.SAMPLE_ALPHA_TO_COVERAGE):ge(n.SAMPLE_ALPHA_TO_COVERAGE)}function Fe(L){b!==L&&(L?n.frontFace(n.CW):n.frontFace(n.CCW),b=L)}function Re(L){L!==sh?(J(n.CULL_FACE),L!==I&&(L===bl?n.cullFace(n.BACK):L===rh?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):ge(n.CULL_FACE),I=L}function ht(L){L!==k&&($&&n.lineWidth(L),k=L)}function we(L,re,ce){L?(J(n.POLYGON_OFFSET_FILL),(X!==re||Y!==ce)&&(n.polygonOffset(re,ce),X=re,Y=ce)):ge(n.POLYGON_OFFSET_FILL)}function Oe(L){L?J(n.SCISSOR_TEST):ge(n.SCISSOR_TEST)}function ft(L){L===void 0&&(L=n.TEXTURE0+K-1),de!==L&&(n.activeTexture(L),de=L)}function at(L,re,ce){ce===void 0&&(de===null?ce=n.TEXTURE0+K-1:ce=de);let Se=xe[ce];Se===void 0&&(Se={type:void 0,texture:void 0},xe[ce]=Se),(Se.type!==L||Se.texture!==re)&&(de!==ce&&(n.activeTexture(ce),de=ce),n.bindTexture(L,re||G[L]),Se.type=L,Se.texture=re)}function A(){let L=xe[de];L!==void 0&&L.type!==void 0&&(n.bindTexture(L.type,null),L.type=void 0,L.texture=void 0)}function y(){try{n.compressedTexImage2D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function D(){try{n.compressedTexImage3D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function V(){try{n.texSubImage2D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function q(){try{n.texSubImage3D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function z(){try{n.compressedTexSubImage2D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function oe(){try{n.compressedTexSubImage3D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function te(){try{n.texStorage2D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function pe(){try{n.texStorage3D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function he(){try{n.texImage2D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function j(){try{n.texImage3D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function se(L){Me.equals(L)===!1&&(n.scissor(L.x,L.y,L.z,L.w),Me.copy(L))}function Ee(L){Ae.equals(L)===!1&&(n.viewport(L.x,L.y,L.z,L.w),Ae.copy(L))}function ye(L,re){let ce=c.get(re);ce===void 0&&(ce=new WeakMap,c.set(re,ce));let Se=ce.get(L);Se===void 0&&(Se=n.getUniformBlockIndex(re,L.name),ce.set(L,Se))}function ue(L,re){let Se=c.get(re).get(L);l.get(re)!==Se&&(n.uniformBlockBinding(re,Se,L.__bindingPointIndex),l.set(re,Se))}function Ve(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),a.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),h={},de=null,xe={},u={},d=new WeakMap,f=[],m=null,_=!1,g=null,p=null,E=null,w=null,v=null,T=null,R=null,P=new Ke(0,0,0),U=0,S=!1,b=null,I=null,k=null,X=null,Y=null,Me.set(0,0,n.canvas.width,n.canvas.height),Ae.set(0,0,n.canvas.width,n.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:J,disable:ge,bindFramebuffer:Le,drawBuffers:be,useProgram:qe,setBlending:rt,setMaterial:We,setFlipSided:Fe,setCullFace:Re,setLineWidth:ht,setPolygonOffset:we,setScissorTest:Oe,activeTexture:ft,bindTexture:at,unbindTexture:A,compressedTexImage2D:y,compressedTexImage3D:D,texImage2D:he,texImage3D:j,updateUBOMapping:ye,uniformBlockBinding:ue,texStorage2D:te,texStorage3D:pe,texSubImage2D:V,texSubImage3D:q,compressedTexSubImage2D:z,compressedTexSubImage3D:oe,scissor:se,viewport:Ee,reset:Ve}}function U0(n,e,t,i,s,r,a){let o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Ze,h=new WeakMap,u,d=new WeakMap,f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(A,y){return f?new OffscreenCanvas(A,y):Bs("canvas")}function _(A,y,D){let V=1,q=at(A);if((q.width>D||q.height>D)&&(V=D/Math.max(q.width,q.height)),V<1)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap||typeof VideoFrame<"u"&&A instanceof VideoFrame){let z=Math.floor(V*q.width),oe=Math.floor(V*q.height);u===void 0&&(u=m(z,oe));let te=y?m(z,oe):u;return te.width=z,te.height=oe,te.getContext("2d").drawImage(A,0,0,z,oe),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+q.width+"x"+q.height+") to ("+z+"x"+oe+")."),te}else return"data"in A&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+q.width+"x"+q.height+")."),A;return A}function g(A){return A.generateMipmaps}function p(A){n.generateMipmap(A)}function E(A){return A.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:A.isWebGL3DRenderTarget?n.TEXTURE_3D:A.isWebGLArrayRenderTarget||A.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function w(A,y,D,V,q=!1){if(A!==null){if(n[A]!==void 0)return n[A];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let z=y;if(y===n.RED&&(D===n.FLOAT&&(z=n.R32F),D===n.HALF_FLOAT&&(z=n.R16F),D===n.UNSIGNED_BYTE&&(z=n.R8)),y===n.RED_INTEGER&&(D===n.UNSIGNED_BYTE&&(z=n.R8UI),D===n.UNSIGNED_SHORT&&(z=n.R16UI),D===n.UNSIGNED_INT&&(z=n.R32UI),D===n.BYTE&&(z=n.R8I),D===n.SHORT&&(z=n.R16I),D===n.INT&&(z=n.R32I)),y===n.RG&&(D===n.FLOAT&&(z=n.RG32F),D===n.HALF_FLOAT&&(z=n.RG16F),D===n.UNSIGNED_BYTE&&(z=n.RG8)),y===n.RG_INTEGER&&(D===n.UNSIGNED_BYTE&&(z=n.RG8UI),D===n.UNSIGNED_SHORT&&(z=n.RG16UI),D===n.UNSIGNED_INT&&(z=n.RG32UI),D===n.BYTE&&(z=n.RG8I),D===n.SHORT&&(z=n.RG16I),D===n.INT&&(z=n.RG32I)),y===n.RGB_INTEGER&&(D===n.UNSIGNED_BYTE&&(z=n.RGB8UI),D===n.UNSIGNED_SHORT&&(z=n.RGB16UI),D===n.UNSIGNED_INT&&(z=n.RGB32UI),D===n.BYTE&&(z=n.RGB8I),D===n.SHORT&&(z=n.RGB16I),D===n.INT&&(z=n.RGB32I)),y===n.RGBA_INTEGER&&(D===n.UNSIGNED_BYTE&&(z=n.RGBA8UI),D===n.UNSIGNED_SHORT&&(z=n.RGBA16UI),D===n.UNSIGNED_INT&&(z=n.RGBA32UI),D===n.BYTE&&(z=n.RGBA8I),D===n.SHORT&&(z=n.RGBA16I),D===n.INT&&(z=n.RGBA32I)),y===n.RGB&&(D===n.UNSIGNED_INT_5_9_9_9_REV&&(z=n.RGB9_E5),D===n.UNSIGNED_INT_10F_11F_11F_REV&&(z=n.R11F_G11F_B10F)),y===n.RGBA){let oe=q?Fs:Qe.getTransfer(V);D===n.FLOAT&&(z=n.RGBA32F),D===n.HALF_FLOAT&&(z=n.RGBA16F),D===n.UNSIGNED_BYTE&&(z=oe===it?n.SRGB8_ALPHA8:n.RGBA8),D===n.UNSIGNED_SHORT_4_4_4_4&&(z=n.RGBA4),D===n.UNSIGNED_SHORT_5_5_5_1&&(z=n.RGB5_A1)}return(z===n.R16F||z===n.R32F||z===n.RG16F||z===n.RG32F||z===n.RGBA16F||z===n.RGBA32F)&&e.get("EXT_color_buffer_float"),z}function v(A,y){let D;return A?y===null||y===oi||y===ms?D=n.DEPTH24_STENCIL8:y===wn?D=n.DEPTH32F_STENCIL8:y===fs&&(D=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):y===null||y===oi||y===ms?D=n.DEPTH_COMPONENT24:y===wn?D=n.DEPTH_COMPONENT32F:y===fs&&(D=n.DEPTH_COMPONENT16),D}function T(A,y){return g(A)===!0||A.isFramebufferTexture&&A.minFilter!==Xt&&A.minFilter!==qt?Math.log2(Math.max(y.width,y.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?y.mipmaps.length:1}function R(A){let y=A.target;y.removeEventListener("dispose",R),U(y),y.isVideoTexture&&h.delete(y)}function P(A){let y=A.target;y.removeEventListener("dispose",P),b(y)}function U(A){let y=i.get(A);if(y.__webglInit===void 0)return;let D=A.source,V=d.get(D);if(V){let q=V[y.__cacheKey];q.usedTimes--,q.usedTimes===0&&S(A),Object.keys(V).length===0&&d.delete(D)}i.remove(A)}function S(A){let y=i.get(A);n.deleteTexture(y.__webglTexture);let D=A.source,V=d.get(D);delete V[y.__cacheKey],a.memory.textures--}function b(A){let y=i.get(A);if(A.depthTexture&&(A.depthTexture.dispose(),i.remove(A.depthTexture)),A.isWebGLCubeRenderTarget)for(let V=0;V<6;V++){if(Array.isArray(y.__webglFramebuffer[V]))for(let q=0;q<y.__webglFramebuffer[V].length;q++)n.deleteFramebuffer(y.__webglFramebuffer[V][q]);else n.deleteFramebuffer(y.__webglFramebuffer[V]);y.__webglDepthbuffer&&n.deleteRenderbuffer(y.__webglDepthbuffer[V])}else{if(Array.isArray(y.__webglFramebuffer))for(let V=0;V<y.__webglFramebuffer.length;V++)n.deleteFramebuffer(y.__webglFramebuffer[V]);else n.deleteFramebuffer(y.__webglFramebuffer);if(y.__webglDepthbuffer&&n.deleteRenderbuffer(y.__webglDepthbuffer),y.__webglMultisampledFramebuffer&&n.deleteFramebuffer(y.__webglMultisampledFramebuffer),y.__webglColorRenderbuffer)for(let V=0;V<y.__webglColorRenderbuffer.length;V++)y.__webglColorRenderbuffer[V]&&n.deleteRenderbuffer(y.__webglColorRenderbuffer[V]);y.__webglDepthRenderbuffer&&n.deleteRenderbuffer(y.__webglDepthRenderbuffer)}let D=A.textures;for(let V=0,q=D.length;V<q;V++){let z=i.get(D[V]);z.__webglTexture&&(n.deleteTexture(z.__webglTexture),a.memory.textures--),i.remove(D[V])}i.remove(A)}let I=0;function k(){I=0}function X(){let A=I;return A>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+A+" texture units while this GPU supports only "+s.maxTextures),I+=1,A}function Y(A){let y=[];return y.push(A.wrapS),y.push(A.wrapT),y.push(A.wrapR||0),y.push(A.magFilter),y.push(A.minFilter),y.push(A.anisotropy),y.push(A.internalFormat),y.push(A.format),y.push(A.type),y.push(A.generateMipmaps),y.push(A.premultiplyAlpha),y.push(A.flipY),y.push(A.unpackAlignment),y.push(A.colorSpace),y.join()}function K(A,y){let D=i.get(A);if(A.isVideoTexture&&Oe(A),A.isRenderTargetTexture===!1&&A.isExternalTexture!==!0&&A.version>0&&D.__version!==A.version){let V=A.image;if(V===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(V.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{G(D,A,y);return}}else A.isExternalTexture&&(D.__webglTexture=A.sourceTexture?A.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,D.__webglTexture,n.TEXTURE0+y)}function $(A,y){let D=i.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&D.__version!==A.version){G(D,A,y);return}t.bindTexture(n.TEXTURE_2D_ARRAY,D.__webglTexture,n.TEXTURE0+y)}function ne(A,y){let D=i.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&D.__version!==A.version){G(D,A,y);return}t.bindTexture(n.TEXTURE_3D,D.__webglTexture,n.TEXTURE0+y)}function Z(A,y){let D=i.get(A);if(A.version>0&&D.__version!==A.version){J(D,A,y);return}t.bindTexture(n.TEXTURE_CUBE_MAP,D.__webglTexture,n.TEXTURE0+y)}let de={[Kr]:n.REPEAT,[Qn]:n.CLAMP_TO_EDGE,[jr]:n.MIRRORED_REPEAT},xe={[Xt]:n.NEAREST,[Uh]:n.NEAREST_MIPMAP_NEAREST,[ir]:n.NEAREST_MIPMAP_LINEAR,[qt]:n.LINEAR,[Pa]:n.LINEAR_MIPMAP_NEAREST,[ai]:n.LINEAR_MIPMAP_LINEAR},Ce={[kh]:n.NEVER,[Xh]:n.ALWAYS,[zh]:n.LESS,[Fl]:n.LEQUAL,[Vh]:n.EQUAL,[Wh]:n.GEQUAL,[Hh]:n.GREATER,[Gh]:n.NOTEQUAL};function ke(A,y){if(y.type===wn&&e.has("OES_texture_float_linear")===!1&&(y.magFilter===qt||y.magFilter===Pa||y.magFilter===ir||y.magFilter===ai||y.minFilter===qt||y.minFilter===Pa||y.minFilter===ir||y.minFilter===ai)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(A,n.TEXTURE_WRAP_S,de[y.wrapS]),n.texParameteri(A,n.TEXTURE_WRAP_T,de[y.wrapT]),(A===n.TEXTURE_3D||A===n.TEXTURE_2D_ARRAY)&&n.texParameteri(A,n.TEXTURE_WRAP_R,de[y.wrapR]),n.texParameteri(A,n.TEXTURE_MAG_FILTER,xe[y.magFilter]),n.texParameteri(A,n.TEXTURE_MIN_FILTER,xe[y.minFilter]),y.compareFunction&&(n.texParameteri(A,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(A,n.TEXTURE_COMPARE_FUNC,Ce[y.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(y.magFilter===Xt||y.minFilter!==ir&&y.minFilter!==ai||y.type===wn&&e.has("OES_texture_float_linear")===!1)return;if(y.anisotropy>1||i.get(y).__currentAnisotropy){let D=e.get("EXT_texture_filter_anisotropic");n.texParameterf(A,D.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(y.anisotropy,s.getMaxAnisotropy())),i.get(y).__currentAnisotropy=y.anisotropy}}}function Me(A,y){let D=!1;A.__webglInit===void 0&&(A.__webglInit=!0,y.addEventListener("dispose",R));let V=y.source,q=d.get(V);q===void 0&&(q={},d.set(V,q));let z=Y(y);if(z!==A.__cacheKey){q[z]===void 0&&(q[z]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,D=!0),q[z].usedTimes++;let oe=q[A.__cacheKey];oe!==void 0&&(q[A.__cacheKey].usedTimes--,oe.usedTimes===0&&S(y)),A.__cacheKey=z,A.__webglTexture=q[z].texture}return D}function Ae(A,y,D){return Math.floor(Math.floor(A/D)/y)}function De(A,y,D,V){let z=A.updateRanges;if(z.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,y.width,y.height,D,V,y.data);else{z.sort((j,se)=>j.start-se.start);let oe=0;for(let j=1;j<z.length;j++){let se=z[oe],Ee=z[j],ye=se.start+se.count,ue=Ae(Ee.start,y.width,4),Ve=Ae(se.start,y.width,4);Ee.start<=ye+1&&ue===Ve&&Ae(Ee.start+Ee.count-1,y.width,4)===ue?se.count=Math.max(se.count,Ee.start+Ee.count-se.start):(++oe,z[oe]=Ee)}z.length=oe+1;let te=n.getParameter(n.UNPACK_ROW_LENGTH),pe=n.getParameter(n.UNPACK_SKIP_PIXELS),he=n.getParameter(n.UNPACK_SKIP_ROWS);n.pixelStorei(n.UNPACK_ROW_LENGTH,y.width);for(let j=0,se=z.length;j<se;j++){let Ee=z[j],ye=Math.floor(Ee.start/4),ue=Math.ceil(Ee.count/4),Ve=ye%y.width,L=Math.floor(ye/y.width),re=ue,ce=1;n.pixelStorei(n.UNPACK_SKIP_PIXELS,Ve),n.pixelStorei(n.UNPACK_SKIP_ROWS,L),t.texSubImage2D(n.TEXTURE_2D,0,Ve,L,re,ce,D,V,y.data)}A.clearUpdateRanges(),n.pixelStorei(n.UNPACK_ROW_LENGTH,te),n.pixelStorei(n.UNPACK_SKIP_PIXELS,pe),n.pixelStorei(n.UNPACK_SKIP_ROWS,he)}}function G(A,y,D){let V=n.TEXTURE_2D;(y.isDataArrayTexture||y.isCompressedArrayTexture)&&(V=n.TEXTURE_2D_ARRAY),y.isData3DTexture&&(V=n.TEXTURE_3D);let q=Me(A,y),z=y.source;t.bindTexture(V,A.__webglTexture,n.TEXTURE0+D);let oe=i.get(z);if(z.version!==oe.__version||q===!0){t.activeTexture(n.TEXTURE0+D);let te=Qe.getPrimaries(Qe.workingColorSpace),pe=y.colorSpace===Vn?null:Qe.getPrimaries(y.colorSpace),he=y.colorSpace===Vn||te===pe?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,y.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,y.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,he);let j=_(y.image,!1,s.maxTextureSize);j=ft(y,j);let se=r.convert(y.format,y.colorSpace),Ee=r.convert(y.type),ye=w(y.internalFormat,se,Ee,y.colorSpace,y.isVideoTexture);ke(V,y);let ue,Ve=y.mipmaps,L=y.isVideoTexture!==!0,re=oe.__version===void 0||q===!0,ce=z.dataReady,Se=T(y,j);if(y.isDepthTexture)ye=v(y.format===gs,y.type),re&&(L?t.texStorage2D(n.TEXTURE_2D,1,ye,j.width,j.height):t.texImage2D(n.TEXTURE_2D,0,ye,j.width,j.height,0,se,Ee,null));else if(y.isDataTexture)if(Ve.length>0){L&&re&&t.texStorage2D(n.TEXTURE_2D,Se,ye,Ve[0].width,Ve[0].height);for(let ae=0,Q=Ve.length;ae<Q;ae++)ue=Ve[ae],L?ce&&t.texSubImage2D(n.TEXTURE_2D,ae,0,0,ue.width,ue.height,se,Ee,ue.data):t.texImage2D(n.TEXTURE_2D,ae,ye,ue.width,ue.height,0,se,Ee,ue.data);y.generateMipmaps=!1}else L?(re&&t.texStorage2D(n.TEXTURE_2D,Se,ye,j.width,j.height),ce&&De(y,j,se,Ee)):t.texImage2D(n.TEXTURE_2D,0,ye,j.width,j.height,0,se,Ee,j.data);else if(y.isCompressedTexture)if(y.isCompressedArrayTexture){L&&re&&t.texStorage3D(n.TEXTURE_2D_ARRAY,Se,ye,Ve[0].width,Ve[0].height,j.depth);for(let ae=0,Q=Ve.length;ae<Q;ae++)if(ue=Ve[ae],y.format!==hn)if(se!==null)if(L){if(ce)if(y.layerUpdates.size>0){let ve=Hl(ue.width,ue.height,y.format,y.type);for(let He of y.layerUpdates){let tt=ue.data.subarray(He*ve/ue.data.BYTES_PER_ELEMENT,(He+1)*ve/ue.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,ae,0,0,He,ue.width,ue.height,1,se,tt)}y.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,ae,0,0,0,ue.width,ue.height,j.depth,se,ue.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,ae,ye,ue.width,ue.height,j.depth,0,ue.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else L?ce&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,ae,0,0,0,ue.width,ue.height,j.depth,se,Ee,ue.data):t.texImage3D(n.TEXTURE_2D_ARRAY,ae,ye,ue.width,ue.height,j.depth,0,se,Ee,ue.data)}else{L&&re&&t.texStorage2D(n.TEXTURE_2D,Se,ye,Ve[0].width,Ve[0].height);for(let ae=0,Q=Ve.length;ae<Q;ae++)ue=Ve[ae],y.format!==hn?se!==null?L?ce&&t.compressedTexSubImage2D(n.TEXTURE_2D,ae,0,0,ue.width,ue.height,se,ue.data):t.compressedTexImage2D(n.TEXTURE_2D,ae,ye,ue.width,ue.height,0,ue.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):L?ce&&t.texSubImage2D(n.TEXTURE_2D,ae,0,0,ue.width,ue.height,se,Ee,ue.data):t.texImage2D(n.TEXTURE_2D,ae,ye,ue.width,ue.height,0,se,Ee,ue.data)}else if(y.isDataArrayTexture)if(L){if(re&&t.texStorage3D(n.TEXTURE_2D_ARRAY,Se,ye,j.width,j.height,j.depth),ce)if(y.layerUpdates.size>0){let ae=Hl(j.width,j.height,y.format,y.type);for(let Q of y.layerUpdates){let ve=j.data.subarray(Q*ae/j.data.BYTES_PER_ELEMENT,(Q+1)*ae/j.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,Q,j.width,j.height,1,se,Ee,ve)}y.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,j.width,j.height,j.depth,se,Ee,j.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,ye,j.width,j.height,j.depth,0,se,Ee,j.data);else if(y.isData3DTexture)L?(re&&t.texStorage3D(n.TEXTURE_3D,Se,ye,j.width,j.height,j.depth),ce&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,j.width,j.height,j.depth,se,Ee,j.data)):t.texImage3D(n.TEXTURE_3D,0,ye,j.width,j.height,j.depth,0,se,Ee,j.data);else if(y.isFramebufferTexture){if(re)if(L)t.texStorage2D(n.TEXTURE_2D,Se,ye,j.width,j.height);else{let ae=j.width,Q=j.height;for(let ve=0;ve<Se;ve++)t.texImage2D(n.TEXTURE_2D,ve,ye,ae,Q,0,se,Ee,null),ae>>=1,Q>>=1}}else if(Ve.length>0){if(L&&re){let ae=at(Ve[0]);t.texStorage2D(n.TEXTURE_2D,Se,ye,ae.width,ae.height)}for(let ae=0,Q=Ve.length;ae<Q;ae++)ue=Ve[ae],L?ce&&t.texSubImage2D(n.TEXTURE_2D,ae,0,0,se,Ee,ue):t.texImage2D(n.TEXTURE_2D,ae,ye,se,Ee,ue);y.generateMipmaps=!1}else if(L){if(re){let ae=at(j);t.texStorage2D(n.TEXTURE_2D,Se,ye,ae.width,ae.height)}ce&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,se,Ee,j)}else t.texImage2D(n.TEXTURE_2D,0,ye,se,Ee,j);g(y)&&p(V),oe.__version=z.version,y.onUpdate&&y.onUpdate(y)}A.__version=y.version}function J(A,y,D){if(y.image.length!==6)return;let V=Me(A,y),q=y.source;t.bindTexture(n.TEXTURE_CUBE_MAP,A.__webglTexture,n.TEXTURE0+D);let z=i.get(q);if(q.version!==z.__version||V===!0){t.activeTexture(n.TEXTURE0+D);let oe=Qe.getPrimaries(Qe.workingColorSpace),te=y.colorSpace===Vn?null:Qe.getPrimaries(y.colorSpace),pe=y.colorSpace===Vn||oe===te?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,y.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,y.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,pe);let he=y.isCompressedTexture||y.image[0].isCompressedTexture,j=y.image[0]&&y.image[0].isDataTexture,se=[];for(let Q=0;Q<6;Q++)!he&&!j?se[Q]=_(y.image[Q],!0,s.maxCubemapSize):se[Q]=j?y.image[Q].image:y.image[Q],se[Q]=ft(y,se[Q]);let Ee=se[0],ye=r.convert(y.format,y.colorSpace),ue=r.convert(y.type),Ve=w(y.internalFormat,ye,ue,y.colorSpace),L=y.isVideoTexture!==!0,re=z.__version===void 0||V===!0,ce=q.dataReady,Se=T(y,Ee);ke(n.TEXTURE_CUBE_MAP,y);let ae;if(he){L&&re&&t.texStorage2D(n.TEXTURE_CUBE_MAP,Se,Ve,Ee.width,Ee.height);for(let Q=0;Q<6;Q++){ae=se[Q].mipmaps;for(let ve=0;ve<ae.length;ve++){let He=ae[ve];y.format!==hn?ye!==null?L?ce&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,ve,0,0,He.width,He.height,ye,He.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,ve,Ve,He.width,He.height,0,He.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):L?ce&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,ve,0,0,He.width,He.height,ye,ue,He.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,ve,Ve,He.width,He.height,0,ye,ue,He.data)}}}else{if(ae=y.mipmaps,L&&re){ae.length>0&&Se++;let Q=at(se[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,Se,Ve,Q.width,Q.height)}for(let Q=0;Q<6;Q++)if(j){L?ce&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,se[Q].width,se[Q].height,ye,ue,se[Q].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,Ve,se[Q].width,se[Q].height,0,ye,ue,se[Q].data);for(let ve=0;ve<ae.length;ve++){let tt=ae[ve].image[Q].image;L?ce&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,ve+1,0,0,tt.width,tt.height,ye,ue,tt.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,ve+1,Ve,tt.width,tt.height,0,ye,ue,tt.data)}}else{L?ce&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,ye,ue,se[Q]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,Ve,ye,ue,se[Q]);for(let ve=0;ve<ae.length;ve++){let He=ae[ve];L?ce&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,ve+1,0,0,ye,ue,He.image[Q]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,ve+1,Ve,ye,ue,He.image[Q])}}}g(y)&&p(n.TEXTURE_CUBE_MAP),z.__version=q.version,y.onUpdate&&y.onUpdate(y)}A.__version=y.version}function ge(A,y,D,V,q,z){let oe=r.convert(D.format,D.colorSpace),te=r.convert(D.type),pe=w(D.internalFormat,oe,te,D.colorSpace),he=i.get(y),j=i.get(D);if(j.__renderTarget=y,!he.__hasExternalTextures){let se=Math.max(1,y.width>>z),Ee=Math.max(1,y.height>>z);q===n.TEXTURE_3D||q===n.TEXTURE_2D_ARRAY?t.texImage3D(q,z,pe,se,Ee,y.depth,0,oe,te,null):t.texImage2D(q,z,pe,se,Ee,0,oe,te,null)}t.bindFramebuffer(n.FRAMEBUFFER,A),we(y)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,V,q,j.__webglTexture,0,ht(y)):(q===n.TEXTURE_2D||q>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&q<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,V,q,j.__webglTexture,z),t.bindFramebuffer(n.FRAMEBUFFER,null)}function Le(A,y,D){if(n.bindRenderbuffer(n.RENDERBUFFER,A),y.depthBuffer){let V=y.depthTexture,q=V&&V.isDepthTexture?V.type:null,z=v(y.stencilBuffer,q),oe=y.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,te=ht(y);we(y)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,te,z,y.width,y.height):D?n.renderbufferStorageMultisample(n.RENDERBUFFER,te,z,y.width,y.height):n.renderbufferStorage(n.RENDERBUFFER,z,y.width,y.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,oe,n.RENDERBUFFER,A)}else{let V=y.textures;for(let q=0;q<V.length;q++){let z=V[q],oe=r.convert(z.format,z.colorSpace),te=r.convert(z.type),pe=w(z.internalFormat,oe,te,z.colorSpace),he=ht(y);D&&we(y)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,he,pe,y.width,y.height):we(y)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,he,pe,y.width,y.height):n.renderbufferStorage(n.RENDERBUFFER,pe,y.width,y.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function be(A,y){if(y&&y.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(n.FRAMEBUFFER,A),!(y.depthTexture&&y.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let V=i.get(y.depthTexture);V.__renderTarget=y,(!V.__webglTexture||y.depthTexture.image.width!==y.width||y.depthTexture.image.height!==y.height)&&(y.depthTexture.image.width=y.width,y.depthTexture.image.height=y.height,y.depthTexture.needsUpdate=!0),K(y.depthTexture,0);let q=V.__webglTexture,z=ht(y);if(y.depthTexture.format===rs)we(y)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,q,0,z):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,q,0);else if(y.depthTexture.format===gs)we(y)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,q,0,z):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,q,0);else throw new Error("Unknown depthTexture format")}function qe(A){let y=i.get(A),D=A.isWebGLCubeRenderTarget===!0;if(y.__boundDepthTexture!==A.depthTexture){let V=A.depthTexture;if(y.__depthDisposeCallback&&y.__depthDisposeCallback(),V){let q=()=>{delete y.__boundDepthTexture,delete y.__depthDisposeCallback,V.removeEventListener("dispose",q)};V.addEventListener("dispose",q),y.__depthDisposeCallback=q}y.__boundDepthTexture=V}if(A.depthTexture&&!y.__autoAllocateDepthBuffer){if(D)throw new Error("target.depthTexture not supported in Cube render targets");let V=A.texture.mipmaps;V&&V.length>0?be(y.__webglFramebuffer[0],A):be(y.__webglFramebuffer,A)}else if(D){y.__webglDepthbuffer=[];for(let V=0;V<6;V++)if(t.bindFramebuffer(n.FRAMEBUFFER,y.__webglFramebuffer[V]),y.__webglDepthbuffer[V]===void 0)y.__webglDepthbuffer[V]=n.createRenderbuffer(),Le(y.__webglDepthbuffer[V],A,!1);else{let q=A.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,z=y.__webglDepthbuffer[V];n.bindRenderbuffer(n.RENDERBUFFER,z),n.framebufferRenderbuffer(n.FRAMEBUFFER,q,n.RENDERBUFFER,z)}}else{let V=A.texture.mipmaps;if(V&&V.length>0?t.bindFramebuffer(n.FRAMEBUFFER,y.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,y.__webglFramebuffer),y.__webglDepthbuffer===void 0)y.__webglDepthbuffer=n.createRenderbuffer(),Le(y.__webglDepthbuffer,A,!1);else{let q=A.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,z=y.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,z),n.framebufferRenderbuffer(n.FRAMEBUFFER,q,n.RENDERBUFFER,z)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function It(A,y,D){let V=i.get(A);y!==void 0&&ge(V.__webglFramebuffer,A,A.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),D!==void 0&&qe(A)}function C(A){let y=A.texture,D=i.get(A),V=i.get(y);A.addEventListener("dispose",P);let q=A.textures,z=A.isWebGLCubeRenderTarget===!0,oe=q.length>1;if(oe||(V.__webglTexture===void 0&&(V.__webglTexture=n.createTexture()),V.__version=y.version,a.memory.textures++),z){D.__webglFramebuffer=[];for(let te=0;te<6;te++)if(y.mipmaps&&y.mipmaps.length>0){D.__webglFramebuffer[te]=[];for(let pe=0;pe<y.mipmaps.length;pe++)D.__webglFramebuffer[te][pe]=n.createFramebuffer()}else D.__webglFramebuffer[te]=n.createFramebuffer()}else{if(y.mipmaps&&y.mipmaps.length>0){D.__webglFramebuffer=[];for(let te=0;te<y.mipmaps.length;te++)D.__webglFramebuffer[te]=n.createFramebuffer()}else D.__webglFramebuffer=n.createFramebuffer();if(oe)for(let te=0,pe=q.length;te<pe;te++){let he=i.get(q[te]);he.__webglTexture===void 0&&(he.__webglTexture=n.createTexture(),a.memory.textures++)}if(A.samples>0&&we(A)===!1){D.__webglMultisampledFramebuffer=n.createFramebuffer(),D.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,D.__webglMultisampledFramebuffer);for(let te=0;te<q.length;te++){let pe=q[te];D.__webglColorRenderbuffer[te]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,D.__webglColorRenderbuffer[te]);let he=r.convert(pe.format,pe.colorSpace),j=r.convert(pe.type),se=w(pe.internalFormat,he,j,pe.colorSpace,A.isXRRenderTarget===!0),Ee=ht(A);n.renderbufferStorageMultisample(n.RENDERBUFFER,Ee,se,A.width,A.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+te,n.RENDERBUFFER,D.__webglColorRenderbuffer[te])}n.bindRenderbuffer(n.RENDERBUFFER,null),A.depthBuffer&&(D.__webglDepthRenderbuffer=n.createRenderbuffer(),Le(D.__webglDepthRenderbuffer,A,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(z){t.bindTexture(n.TEXTURE_CUBE_MAP,V.__webglTexture),ke(n.TEXTURE_CUBE_MAP,y);for(let te=0;te<6;te++)if(y.mipmaps&&y.mipmaps.length>0)for(let pe=0;pe<y.mipmaps.length;pe++)ge(D.__webglFramebuffer[te][pe],A,y,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+te,pe);else ge(D.__webglFramebuffer[te],A,y,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+te,0);g(y)&&p(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(oe){for(let te=0,pe=q.length;te<pe;te++){let he=q[te],j=i.get(he),se=n.TEXTURE_2D;(A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(se=A.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(se,j.__webglTexture),ke(se,he),ge(D.__webglFramebuffer,A,he,n.COLOR_ATTACHMENT0+te,se,0),g(he)&&p(se)}t.unbindTexture()}else{let te=n.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(te=A.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(te,V.__webglTexture),ke(te,y),y.mipmaps&&y.mipmaps.length>0)for(let pe=0;pe<y.mipmaps.length;pe++)ge(D.__webglFramebuffer[pe],A,y,n.COLOR_ATTACHMENT0,te,pe);else ge(D.__webglFramebuffer,A,y,n.COLOR_ATTACHMENT0,te,0);g(y)&&p(te),t.unbindTexture()}A.depthBuffer&&qe(A)}function rt(A){let y=A.textures;for(let D=0,V=y.length;D<V;D++){let q=y[D];if(g(q)){let z=E(A),oe=i.get(q).__webglTexture;t.bindTexture(z,oe),p(z),t.unbindTexture()}}}let We=[],Fe=[];function Re(A){if(A.samples>0){if(we(A)===!1){let y=A.textures,D=A.width,V=A.height,q=n.COLOR_BUFFER_BIT,z=A.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,oe=i.get(A),te=y.length>1;if(te)for(let he=0;he<y.length;he++)t.bindFramebuffer(n.FRAMEBUFFER,oe.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+he,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,oe.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+he,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,oe.__webglMultisampledFramebuffer);let pe=A.texture.mipmaps;pe&&pe.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,oe.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,oe.__webglFramebuffer);for(let he=0;he<y.length;he++){if(A.resolveDepthBuffer&&(A.depthBuffer&&(q|=n.DEPTH_BUFFER_BIT),A.stencilBuffer&&A.resolveStencilBuffer&&(q|=n.STENCIL_BUFFER_BIT)),te){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,oe.__webglColorRenderbuffer[he]);let j=i.get(y[he]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,j,0)}n.blitFramebuffer(0,0,D,V,0,0,D,V,q,n.NEAREST),l===!0&&(We.length=0,Fe.length=0,We.push(n.COLOR_ATTACHMENT0+he),A.depthBuffer&&A.resolveDepthBuffer===!1&&(We.push(z),Fe.push(z),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,Fe)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,We))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),te)for(let he=0;he<y.length;he++){t.bindFramebuffer(n.FRAMEBUFFER,oe.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+he,n.RENDERBUFFER,oe.__webglColorRenderbuffer[he]);let j=i.get(y[he]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,oe.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+he,n.TEXTURE_2D,j,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,oe.__webglMultisampledFramebuffer)}else if(A.depthBuffer&&A.resolveDepthBuffer===!1&&l){let y=A.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[y])}}}function ht(A){return Math.min(s.maxSamples,A.samples)}function we(A){let y=i.get(A);return A.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&y.__useRenderToTexture!==!1}function Oe(A){let y=a.render.frame;h.get(A)!==y&&(h.set(A,y),A.update())}function ft(A,y){let D=A.colorSpace,V=A.format,q=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||D!==Ai&&D!==Vn&&(Qe.getTransfer(D)===it?(V!==hn||q!==Sn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",D)),y}function at(A){return typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement?(c.width=A.naturalWidth||A.width,c.height=A.naturalHeight||A.height):typeof VideoFrame<"u"&&A instanceof VideoFrame?(c.width=A.displayWidth,c.height=A.displayHeight):(c.width=A.width,c.height=A.height),c}this.allocateTextureUnit=X,this.resetTextureUnits=k,this.setTexture2D=K,this.setTexture2DArray=$,this.setTexture3D=ne,this.setTextureCube=Z,this.rebindTextures=It,this.setupRenderTarget=C,this.updateRenderTargetMipmap=rt,this.updateMultisampleRenderTarget=Re,this.setupDepthRenderbuffer=qe,this.setupFrameBufferTexture=ge,this.useMultisampledRTT=we}function N0(n,e){function t(i,s=Vn){let r,a=Qe.getTransfer(s);if(i===Sn)return n.UNSIGNED_BYTE;if(i===La)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Ua)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Pl)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Dl)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===Cl)return n.BYTE;if(i===Il)return n.SHORT;if(i===fs)return n.UNSIGNED_SHORT;if(i===Da)return n.INT;if(i===oi)return n.UNSIGNED_INT;if(i===wn)return n.FLOAT;if(i===ps)return n.HALF_FLOAT;if(i===Ll)return n.ALPHA;if(i===Ul)return n.RGB;if(i===hn)return n.RGBA;if(i===rs)return n.DEPTH_COMPONENT;if(i===gs)return n.DEPTH_STENCIL;if(i===xs)return n.RED;if(i===Na)return n.RED_INTEGER;if(i===Nl)return n.RG;if(i===Fa)return n.RG_INTEGER;if(i===Oa)return n.RGBA_INTEGER;if(i===sr||i===rr||i===ar||i===or)if(a===it)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===sr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===rr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===ar)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===or)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===sr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===rr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===ar)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===or)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Ba||i===ka||i===za||i===Va)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===Ba)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===ka)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===za)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Va)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Ha||i===Ga||i===Wa)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(i===Ha||i===Ga)return a===it?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===Wa)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Xa||i===qa||i===Ya||i===Za||i===$a||i===Ja||i===Ka||i===ja||i===Qa||i===eo||i===to||i===no||i===io||i===so)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(i===Xa)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===qa)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Ya)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Za)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===$a)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Ja)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Ka)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===ja)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Qa)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===eo)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===to)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===no)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===io)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===so)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===ro||i===ao||i===oo)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(i===ro)return a===it?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===ao)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===oo)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===lo||i===co||i===ho||i===uo)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(i===lo)return r.COMPRESSED_RED_RGTC1_EXT;if(i===co)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===ho)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===uo)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===ms?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}var F0=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,O0=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,tc=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let i=new Ks(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,i=new Zt({vertexShader:F0,fragmentShader:O0,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new st(new er(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},nc=class extends Bn{constructor(e,t){super();let i=this,s=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,u=null,d=null,f=null,m=null,_=typeof XRWebGLBinding<"u",g=new tc,p={},E=t.getContextAttributes(),w=null,v=null,T=[],R=[],P=new Ze,U=null,S=new Ft;S.viewport=new bt;let b=new Ft;b.viewport=new bt;let I=[S,b],k=new Ma,X=null,Y=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(G){let J=T[G];return J===void 0&&(J=new cs,T[G]=J),J.getTargetRaySpace()},this.getControllerGrip=function(G){let J=T[G];return J===void 0&&(J=new cs,T[G]=J),J.getGripSpace()},this.getHand=function(G){let J=T[G];return J===void 0&&(J=new cs,T[G]=J),J.getHandSpace()};function K(G){let J=R.indexOf(G.inputSource);if(J===-1)return;let ge=T[J];ge!==void 0&&(ge.update(G.inputSource,G.frame,c||a),ge.dispatchEvent({type:G.type,data:G.inputSource}))}function $(){s.removeEventListener("select",K),s.removeEventListener("selectstart",K),s.removeEventListener("selectend",K),s.removeEventListener("squeeze",K),s.removeEventListener("squeezestart",K),s.removeEventListener("squeezeend",K),s.removeEventListener("end",$),s.removeEventListener("inputsourceschange",ne);for(let G=0;G<T.length;G++){let J=R[G];J!==null&&(R[G]=null,T[G].disconnect(J))}X=null,Y=null,g.reset();for(let G in p)delete p[G];e.setRenderTarget(w),f=null,d=null,u=null,s=null,v=null,De.stop(),i.isPresenting=!1,e.setPixelRatio(U),e.setSize(P.width,P.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(G){r=G,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(G){o=G,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(G){c=G},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u===null&&_&&(u=new XRWebGLBinding(s,t)),u},this.getFrame=function(){return m},this.getSession=function(){return s},this.setSession=async function(G){if(s=G,s!==null){if(w=e.getRenderTarget(),s.addEventListener("select",K),s.addEventListener("selectstart",K),s.addEventListener("selectend",K),s.addEventListener("squeeze",K),s.addEventListener("squeezestart",K),s.addEventListener("squeezeend",K),s.addEventListener("end",$),s.addEventListener("inputsourceschange",ne),E.xrCompatible!==!0&&await t.makeXRCompatible(),U=e.getPixelRatio(),e.getSize(P),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let ge=null,Le=null,be=null;E.depth&&(be=E.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ge=E.stencil?gs:rs,Le=E.stencil?ms:oi);let qe={colorFormat:t.RGBA8,depthFormat:be,scaleFactor:r};u=this.getBinding(),d=u.createProjectionLayer(qe),s.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),v=new vn(d.textureWidth,d.textureHeight,{format:hn,type:Sn,depthTexture:new Js(d.textureWidth,d.textureHeight,Le,void 0,void 0,void 0,void 0,void 0,void 0,ge),stencilBuffer:E.stencil,colorSpace:e.outputColorSpace,samples:E.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{let ge={antialias:E.antialias,alpha:!0,depth:E.depth,stencil:E.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,t,ge),s.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),v=new vn(f.framebufferWidth,f.framebufferHeight,{format:hn,type:Sn,colorSpace:e.outputColorSpace,stencilBuffer:E.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),De.setContext(s),De.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function ne(G){for(let J=0;J<G.removed.length;J++){let ge=G.removed[J],Le=R.indexOf(ge);Le>=0&&(R[Le]=null,T[Le].disconnect(ge))}for(let J=0;J<G.added.length;J++){let ge=G.added[J],Le=R.indexOf(ge);if(Le===-1){for(let qe=0;qe<T.length;qe++)if(qe>=R.length){R.push(ge),Le=qe;break}else if(R[qe]===null){R[qe]=ge,Le=qe;break}if(Le===-1)break}let be=T[Le];be&&be.connect(ge)}}let Z=new B,de=new B;function xe(G,J,ge){Z.setFromMatrixPosition(J.matrixWorld),de.setFromMatrixPosition(ge.matrixWorld);let Le=Z.distanceTo(de),be=J.projectionMatrix.elements,qe=ge.projectionMatrix.elements,It=be[14]/(be[10]-1),C=be[14]/(be[10]+1),rt=(be[9]+1)/be[5],We=(be[9]-1)/be[5],Fe=(be[8]-1)/be[0],Re=(qe[8]+1)/qe[0],ht=It*Fe,we=It*Re,Oe=Le/(-Fe+Re),ft=Oe*-Fe;if(J.matrixWorld.decompose(G.position,G.quaternion,G.scale),G.translateX(ft),G.translateZ(Oe),G.matrixWorld.compose(G.position,G.quaternion,G.scale),G.matrixWorldInverse.copy(G.matrixWorld).invert(),be[10]===-1)G.projectionMatrix.copy(J.projectionMatrix),G.projectionMatrixInverse.copy(J.projectionMatrixInverse);else{let at=It+Oe,A=C+Oe,y=ht-ft,D=we+(Le-ft),V=rt*C/A*at,q=We*C/A*at;G.projectionMatrix.makePerspective(y,D,V,q,at,A),G.projectionMatrixInverse.copy(G.projectionMatrix).invert()}}function Ce(G,J){J===null?G.matrixWorld.copy(G.matrix):G.matrixWorld.multiplyMatrices(J.matrixWorld,G.matrix),G.matrixWorldInverse.copy(G.matrixWorld).invert()}this.updateCamera=function(G){if(s===null)return;let J=G.near,ge=G.far;g.texture!==null&&(g.depthNear>0&&(J=g.depthNear),g.depthFar>0&&(ge=g.depthFar)),k.near=b.near=S.near=J,k.far=b.far=S.far=ge,(X!==k.near||Y!==k.far)&&(s.updateRenderState({depthNear:k.near,depthFar:k.far}),X=k.near,Y=k.far),k.layers.mask=G.layers.mask|6,S.layers.mask=k.layers.mask&3,b.layers.mask=k.layers.mask&5;let Le=G.parent,be=k.cameras;Ce(k,Le);for(let qe=0;qe<be.length;qe++)Ce(be[qe],Le);be.length===2?xe(k,S,b):k.projectionMatrix.copy(S.projectionMatrix),ke(G,k,Le)};function ke(G,J,ge){ge===null?G.matrix.copy(J.matrixWorld):(G.matrix.copy(ge.matrixWorld),G.matrix.invert(),G.matrix.multiply(J.matrixWorld)),G.matrix.decompose(G.position,G.quaternion,G.scale),G.updateMatrixWorld(!0),G.projectionMatrix.copy(J.projectionMatrix),G.projectionMatrixInverse.copy(J.projectionMatrixInverse),G.isPerspectiveCamera&&(G.fov=ea*2*Math.atan(1/G.projectionMatrix.elements[5]),G.zoom=1)}this.getCamera=function(){return k},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(G){l=G,d!==null&&(d.fixedFoveation=G),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=G)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(k)},this.getCameraTexture=function(G){return p[G]};let Me=null;function Ae(G,J){if(h=J.getViewerPose(c||a),m=J,h!==null){let ge=h.views;f!==null&&(e.setRenderTargetFramebuffer(v,f.framebuffer),e.setRenderTarget(v));let Le=!1;ge.length!==k.cameras.length&&(k.cameras.length=0,Le=!0);for(let C=0;C<ge.length;C++){let rt=ge[C],We=null;if(f!==null)We=f.getViewport(rt);else{let Re=u.getViewSubImage(d,rt);We=Re.viewport,C===0&&(e.setRenderTargetTextures(v,Re.colorTexture,Re.depthStencilTexture),e.setRenderTarget(v))}let Fe=I[C];Fe===void 0&&(Fe=new Ft,Fe.layers.enable(C),Fe.viewport=new bt,I[C]=Fe),Fe.matrix.fromArray(rt.transform.matrix),Fe.matrix.decompose(Fe.position,Fe.quaternion,Fe.scale),Fe.projectionMatrix.fromArray(rt.projectionMatrix),Fe.projectionMatrixInverse.copy(Fe.projectionMatrix).invert(),Fe.viewport.set(We.x,We.y,We.width,We.height),C===0&&(k.matrix.copy(Fe.matrix),k.matrix.decompose(k.position,k.quaternion,k.scale)),Le===!0&&k.cameras.push(Fe)}let be=s.enabledFeatures;if(be&&be.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&_){u=i.getBinding();let C=u.getDepthInformation(ge[0]);C&&C.isValid&&C.texture&&g.init(C,s.renderState)}if(be&&be.includes("camera-access")&&_){e.state.unbindTexture(),u=i.getBinding();for(let C=0;C<ge.length;C++){let rt=ge[C].camera;if(rt){let We=p[rt];We||(We=new Ks,p[rt]=We);let Fe=u.getCameraImage(rt);We.sourceTexture=Fe}}}}for(let ge=0;ge<T.length;ge++){let Le=R[ge],be=T[ge];Le!==null&&be!==void 0&&be.update(Le,J,c||a)}Me&&Me(G,J),J.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:J}),m=null}let De=new vu;De.setAnimationLoop(Ae),this.setAnimationLoop=function(G){Me=G},this.dispose=function(){}}},Ui=new Mn,B0=new Tt;function k0(n,e){function t(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function i(g,p){p.color.getRGB(g.fogColor.value,kl(n)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function s(g,p,E,w,v){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(g,p):p.isMeshToonMaterial?(r(g,p),u(g,p)):p.isMeshPhongMaterial?(r(g,p),h(g,p)):p.isMeshStandardMaterial?(r(g,p),d(g,p),p.isMeshPhysicalMaterial&&f(g,p,v)):p.isMeshMatcapMaterial?(r(g,p),m(g,p)):p.isMeshDepthMaterial?r(g,p):p.isMeshDistanceMaterial?(r(g,p),_(g,p)):p.isMeshNormalMaterial?r(g,p):p.isLineBasicMaterial?(a(g,p),p.isLineDashedMaterial&&o(g,p)):p.isPointsMaterial?l(g,p,E,w):p.isSpriteMaterial?c(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,t(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,t(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===Vt&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,t(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===Vt&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,t(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,t(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);let E=e.get(p),w=E.envMap,v=E.envMapRotation;w&&(g.envMap.value=w,Ui.copy(v),Ui.x*=-1,Ui.y*=-1,Ui.z*=-1,w.isCubeTexture&&w.isRenderTargetTexture===!1&&(Ui.y*=-1,Ui.z*=-1),g.envMapRotation.value.setFromMatrix4(B0.makeRotationFromEuler(Ui)),g.flipEnvMap.value=w.isCubeTexture&&w.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,g.aoMapTransform))}function a(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,t(p.map,g.mapTransform))}function o(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function l(g,p,E,w){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*E,g.scale.value=w*.5,p.map&&(g.map.value=p.map,t(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function c(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,t(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function h(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function u(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function d(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function f(g,p,E){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Vt&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=E.texture,g.transmissionSamplerSize.value.set(E.width,E.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function _(g,p){let E=e.get(p).light;g.referencePosition.value.setFromMatrixPosition(E.matrixWorld),g.nearDistance.value=E.shadow.camera.near,g.farDistance.value=E.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function z0(n,e,t,i){let s={},r={},a=[],o=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(E,w){let v=w.program;i.uniformBlockBinding(E,v)}function c(E,w){let v=s[E.id];v===void 0&&(m(E),v=h(E),s[E.id]=v,E.addEventListener("dispose",g));let T=w.program;i.updateUBOMapping(E,T);let R=e.render.frame;r[E.id]!==R&&(d(E),r[E.id]=R)}function h(E){let w=u();E.__bindingPointIndex=w;let v=n.createBuffer(),T=E.__size,R=E.usage;return n.bindBuffer(n.UNIFORM_BUFFER,v),n.bufferData(n.UNIFORM_BUFFER,T,R),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,w,v),v}function u(){for(let E=0;E<o;E++)if(a.indexOf(E)===-1)return a.push(E),E;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(E){let w=s[E.id],v=E.uniforms,T=E.__cache;n.bindBuffer(n.UNIFORM_BUFFER,w);for(let R=0,P=v.length;R<P;R++){let U=Array.isArray(v[R])?v[R]:[v[R]];for(let S=0,b=U.length;S<b;S++){let I=U[S];if(f(I,R,S,T)===!0){let k=I.__offset,X=Array.isArray(I.value)?I.value:[I.value],Y=0;for(let K=0;K<X.length;K++){let $=X[K],ne=_($);typeof $=="number"||typeof $=="boolean"?(I.__data[0]=$,n.bufferSubData(n.UNIFORM_BUFFER,k+Y,I.__data)):$.isMatrix3?(I.__data[0]=$.elements[0],I.__data[1]=$.elements[1],I.__data[2]=$.elements[2],I.__data[3]=0,I.__data[4]=$.elements[3],I.__data[5]=$.elements[4],I.__data[6]=$.elements[5],I.__data[7]=0,I.__data[8]=$.elements[6],I.__data[9]=$.elements[7],I.__data[10]=$.elements[8],I.__data[11]=0):($.toArray(I.__data,Y),Y+=ne.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,k,I.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function f(E,w,v,T){let R=E.value,P=w+"_"+v;if(T[P]===void 0)return typeof R=="number"||typeof R=="boolean"?T[P]=R:T[P]=R.clone(),!0;{let U=T[P];if(typeof R=="number"||typeof R=="boolean"){if(U!==R)return T[P]=R,!0}else if(U.equals(R)===!1)return U.copy(R),!0}return!1}function m(E){let w=E.uniforms,v=0,T=16;for(let P=0,U=w.length;P<U;P++){let S=Array.isArray(w[P])?w[P]:[w[P]];for(let b=0,I=S.length;b<I;b++){let k=S[b],X=Array.isArray(k.value)?k.value:[k.value];for(let Y=0,K=X.length;Y<K;Y++){let $=X[Y],ne=_($),Z=v%T,de=Z%ne.boundary,xe=Z+de;v+=de,xe!==0&&T-xe<ne.storage&&(v+=T-xe),k.__data=new Float32Array(ne.storage/Float32Array.BYTES_PER_ELEMENT),k.__offset=v,v+=ne.storage}}}let R=v%T;return R>0&&(v+=T-R),E.__size=v,E.__cache={},this}function _(E){let w={boundary:0,storage:0};return typeof E=="number"||typeof E=="boolean"?(w.boundary=4,w.storage=4):E.isVector2?(w.boundary=8,w.storage=8):E.isVector3||E.isColor?(w.boundary=16,w.storage=12):E.isVector4?(w.boundary=16,w.storage=16):E.isMatrix3?(w.boundary=48,w.storage=48):E.isMatrix4?(w.boundary=64,w.storage=64):E.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",E),w}function g(E){let w=E.target;w.removeEventListener("dispose",g);let v=a.indexOf(w.__bindingPointIndex);a.splice(v,1),n.deleteBuffer(s[w.id]),delete s[w.id],delete r[w.id]}function p(){for(let E in s)n.deleteBuffer(s[E]);a=[],s={},r={}}return{bind:l,update:c,dispose:p}}var xo=class{constructor(e={}){let{canvas:t=qh(),context:i=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1}=e;this.isWebGLRenderer=!0;let f;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=i.getContextAttributes().alpha}else f=a;let m=new Uint32Array(4),_=new Int32Array(4),g=null,p=null,E=[],w=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=mn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let v=this,T=!1;this._outputColorSpace=zt;let R=0,P=0,U=null,S=-1,b=null,I=new bt,k=new bt,X=null,Y=new Ke(0),K=0,$=t.width,ne=t.height,Z=1,de=null,xe=null,Ce=new bt(0,0,$,ne),ke=new bt(0,0,$,ne),Me=!1,Ae=new Zs,De=!1,G=!1,J=new Tt,ge=new B,Le=new bt,be={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},qe=!1;function It(){return U===null?Z:1}let C=i;function rt(M,F){return t.getContext(M,F)}try{let M={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"180"}`),t.addEventListener("webglcontextlost",ce,!1),t.addEventListener("webglcontextrestored",Se,!1),t.addEventListener("webglcontextcreationerror",ae,!1),C===null){let F="webgl2";if(C=rt(F,M),C===null)throw rt(F)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(M){throw console.error("THREE.WebGLRenderer: "+M.message),M}let We,Fe,Re,ht,we,Oe,ft,at,A,y,D,V,q,z,oe,te,pe,he,j,se,Ee,ye,ue,Ve;function L(){We=new sg(C),We.init(),ye=new N0(C,We),Fe=new Km(C,We,e,ye),Re=new L0(C,We),Fe.reversedDepthBuffer&&d&&Re.buffers.depth.setReversed(!0),ht=new og(C),we=new v0,Oe=new U0(C,We,Re,we,Fe,ye,ht),ft=new Qm(v),at=new ig(v),A=new ff(C),ue=new $m(C,A),y=new rg(C,A,ht,ue),D=new cg(C,y,A,ht),j=new lg(C,Fe,Oe),te=new jm(we),V=new y0(v,ft,at,We,Fe,ue,te),q=new k0(v,we),z=new b0,oe=new R0(We),he=new Zm(v,ft,at,Re,D,f,l),pe=new P0(v,D,Fe),Ve=new z0(C,ht,Fe,Re),se=new Jm(C,We,ht),Ee=new ag(C,We,ht),ht.programs=V.programs,v.capabilities=Fe,v.extensions=We,v.properties=we,v.renderLists=z,v.shadowMap=pe,v.state=Re,v.info=ht}L();let re=new nc(v,C);this.xr=re,this.getContext=function(){return C},this.getContextAttributes=function(){return C.getContextAttributes()},this.forceContextLoss=function(){let M=We.get("WEBGL_lose_context");M&&M.loseContext()},this.forceContextRestore=function(){let M=We.get("WEBGL_lose_context");M&&M.restoreContext()},this.getPixelRatio=function(){return Z},this.setPixelRatio=function(M){M!==void 0&&(Z=M,this.setSize($,ne,!1))},this.getSize=function(M){return M.set($,ne)},this.setSize=function(M,F,H=!0){if(re.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}$=M,ne=F,t.width=Math.floor(M*Z),t.height=Math.floor(F*Z),H===!0&&(t.style.width=M+"px",t.style.height=F+"px"),this.setViewport(0,0,M,F)},this.getDrawingBufferSize=function(M){return M.set($*Z,ne*Z).floor()},this.setDrawingBufferSize=function(M,F,H){$=M,ne=F,Z=H,t.width=Math.floor(M*H),t.height=Math.floor(F*H),this.setViewport(0,0,M,F)},this.getCurrentViewport=function(M){return M.copy(I)},this.getViewport=function(M){return M.copy(Ce)},this.setViewport=function(M,F,H,W){M.isVector4?Ce.set(M.x,M.y,M.z,M.w):Ce.set(M,F,H,W),Re.viewport(I.copy(Ce).multiplyScalar(Z).round())},this.getScissor=function(M){return M.copy(ke)},this.setScissor=function(M,F,H,W){M.isVector4?ke.set(M.x,M.y,M.z,M.w):ke.set(M,F,H,W),Re.scissor(k.copy(ke).multiplyScalar(Z).round())},this.getScissorTest=function(){return Me},this.setScissorTest=function(M){Re.setScissorTest(Me=M)},this.setOpaqueSort=function(M){de=M},this.setTransparentSort=function(M){xe=M},this.getClearColor=function(M){return M.copy(he.getClearColor())},this.setClearColor=function(){he.setClearColor(...arguments)},this.getClearAlpha=function(){return he.getClearAlpha()},this.setClearAlpha=function(){he.setClearAlpha(...arguments)},this.clear=function(M=!0,F=!0,H=!0){let W=0;if(M){let O=!1;if(U!==null){let le=U.texture.format;O=le===Oa||le===Fa||le===Na}if(O){let le=U.texture.type,_e=le===Sn||le===oi||le===fs||le===ms||le===La||le===Ua,Ie=he.getClearColor(),Te=he.getClearAlpha(),ze=Ie.r,Ge=Ie.g,Ne=Ie.b;_e?(m[0]=ze,m[1]=Ge,m[2]=Ne,m[3]=Te,C.clearBufferuiv(C.COLOR,0,m)):(_[0]=ze,_[1]=Ge,_[2]=Ne,_[3]=Te,C.clearBufferiv(C.COLOR,0,_))}else W|=C.COLOR_BUFFER_BIT}F&&(W|=C.DEPTH_BUFFER_BIT),H&&(W|=C.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),C.clear(W)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",ce,!1),t.removeEventListener("webglcontextrestored",Se,!1),t.removeEventListener("webglcontextcreationerror",ae,!1),he.dispose(),z.dispose(),oe.dispose(),we.dispose(),ft.dispose(),at.dispose(),D.dispose(),ue.dispose(),Ve.dispose(),V.dispose(),re.dispose(),re.removeEventListener("sessionstart",_n),re.removeEventListener("sessionend",Lc),_i.stop()};function ce(M){M.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),T=!0}function Se(){console.log("THREE.WebGLRenderer: Context Restored."),T=!1;let M=ht.autoReset,F=pe.enabled,H=pe.autoUpdate,W=pe.needsUpdate,O=pe.type;L(),ht.autoReset=M,pe.enabled=F,pe.autoUpdate=H,pe.needsUpdate=W,pe.type=O}function ae(M){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",M.statusMessage)}function Q(M){let F=M.target;F.removeEventListener("dispose",Q),ve(F)}function ve(M){He(M),we.remove(M)}function He(M){let F=we.get(M).programs;F!==void 0&&(F.forEach(function(H){V.releaseProgram(H)}),M.isShaderMaterial&&V.releaseShaderCache(M))}this.renderBufferDirect=function(M,F,H,W,O,le){F===null&&(F=be);let _e=O.isMesh&&O.matrixWorld.determinant()<0,Ie=Ad(M,F,H,W,O);Re.setMaterial(W,_e);let Te=H.index,ze=1;if(W.wireframe===!0){if(Te=y.getWireframeAttribute(H),Te===void 0)return;ze=2}let Ge=H.drawRange,Ne=H.attributes.position,Je=Ge.start*ze,ot=(Ge.start+Ge.count)*ze;le!==null&&(Je=Math.max(Je,le.start*ze),ot=Math.min(ot,(le.start+le.count)*ze)),Te!==null?(Je=Math.max(Je,0),ot=Math.min(ot,Te.count)):Ne!=null&&(Je=Math.max(Je,0),ot=Math.min(ot,Ne.count));let Mt=ot-Je;if(Mt<0||Mt===1/0)return;ue.setup(O,W,Ie,H,Te);let pt,ut=se;if(Te!==null&&(pt=A.get(Te),ut=Ee,ut.setIndex(pt)),O.isMesh)W.wireframe===!0?(Re.setLineWidth(W.wireframeLinewidth*It()),ut.setMode(C.LINES)):ut.setMode(C.TRIANGLES);else if(O.isLine){let Be=W.linewidth;Be===void 0&&(Be=1),Re.setLineWidth(Be*It()),O.isLineSegments?ut.setMode(C.LINES):O.isLineLoop?ut.setMode(C.LINE_LOOP):ut.setMode(C.LINE_STRIP)}else O.isPoints?ut.setMode(C.POINTS):O.isSprite&&ut.setMode(C.TRIANGLES);if(O.isBatchedMesh)if(O._multiDrawInstances!==null)as("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),ut.renderMultiDrawInstances(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount,O._multiDrawInstances);else if(We.get("WEBGL_multi_draw"))ut.renderMultiDraw(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount);else{let Be=O._multiDrawStarts,xt=O._multiDrawCounts,et=O._multiDrawCount,jt=Te?A.get(Te).bytesPerElement:1,Xi=we.get(W).currentProgram.getUniforms();for(let Qt=0;Qt<et;Qt++)Xi.setValue(C,"_gl_DrawID",Qt),ut.render(Be[Qt]/jt,xt[Qt])}else if(O.isInstancedMesh)ut.renderInstances(Je,Mt,O.count);else if(H.isInstancedBufferGeometry){let Be=H._maxInstanceCount!==void 0?H._maxInstanceCount:1/0,xt=Math.min(H.instanceCount,Be);ut.renderInstances(Je,Mt,xt)}else ut.render(Je,Mt)};function tt(M,F,H){M.transparent===!0&&M.side===wt&&M.forceSinglePass===!1?(M.side=Vt,M.needsUpdate=!0,Ar(M,F,H),M.side=On,M.needsUpdate=!0,Ar(M,F,H),M.side=wt):Ar(M,F,H)}this.compile=function(M,F,H=null){H===null&&(H=M),p=oe.get(H),p.init(F),w.push(p),H.traverseVisible(function(O){O.isLight&&O.layers.test(F.layers)&&(p.pushLight(O),O.castShadow&&p.pushShadow(O))}),M!==H&&M.traverseVisible(function(O){O.isLight&&O.layers.test(F.layers)&&(p.pushLight(O),O.castShadow&&p.pushShadow(O))}),p.setupLights();let W=new Set;return M.traverse(function(O){if(!(O.isMesh||O.isPoints||O.isLine||O.isSprite))return;let le=O.material;if(le)if(Array.isArray(le))for(let _e=0;_e<le.length;_e++){let Ie=le[_e];tt(Ie,H,O),W.add(Ie)}else tt(le,H,O),W.add(le)}),p=w.pop(),W},this.compileAsync=function(M,F,H=null){let W=this.compile(M,F,H);return new Promise(O=>{function le(){if(W.forEach(function(_e){we.get(_e).currentProgram.isReady()&&W.delete(_e)}),W.size===0){O(M);return}setTimeout(le,10)}We.get("KHR_parallel_shader_compile")!==null?le():setTimeout(le,10)})};let nt=null;function In(M){nt&&nt(M)}function _n(){_i.stop()}function Lc(){_i.start()}let _i=new vu;_i.setAnimationLoop(In),typeof self<"u"&&_i.setContext(self),this.setAnimationLoop=function(M){nt=M,re.setAnimationLoop(M),M===null?_i.stop():_i.start()},re.addEventListener("sessionstart",_n),re.addEventListener("sessionend",Lc),this.render=function(M,F){if(F!==void 0&&F.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(T===!0)return;if(M.matrixWorldAutoUpdate===!0&&M.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),re.enabled===!0&&re.isPresenting===!0&&(re.cameraAutoUpdate===!0&&re.updateCamera(F),F=re.getCamera()),M.isScene===!0&&M.onBeforeRender(v,M,F,U),p=oe.get(M,w.length),p.init(F),w.push(p),J.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),Ae.setFromProjectionMatrix(J,pn,F.reversedDepth),G=this.localClippingEnabled,De=te.init(this.clippingPlanes,G),g=z.get(M,E.length),g.init(),E.push(g),re.enabled===!0&&re.isPresenting===!0){let le=v.xr.getDepthSensingMesh();le!==null&&Wo(le,F,-1/0,v.sortObjects)}Wo(M,F,0,v.sortObjects),g.finish(),v.sortObjects===!0&&g.sort(de,xe),qe=re.enabled===!1||re.isPresenting===!1||re.hasDepthSensing()===!1,qe&&he.addToRenderList(g,M),this.info.render.frame++,De===!0&&te.beginShadows();let H=p.state.shadowsArray;pe.render(H,M,F),De===!0&&te.endShadows(),this.info.autoReset===!0&&this.info.reset();let W=g.opaque,O=g.transmissive;if(p.setupLights(),F.isArrayCamera){let le=F.cameras;if(O.length>0)for(let _e=0,Ie=le.length;_e<Ie;_e++){let Te=le[_e];Nc(W,O,M,Te)}qe&&he.render(M);for(let _e=0,Ie=le.length;_e<Ie;_e++){let Te=le[_e];Uc(g,M,Te,Te.viewport)}}else O.length>0&&Nc(W,O,M,F),qe&&he.render(M),Uc(g,M,F);U!==null&&P===0&&(Oe.updateMultisampleRenderTarget(U),Oe.updateRenderTargetMipmap(U)),M.isScene===!0&&M.onAfterRender(v,M,F),ue.resetDefaultState(),S=-1,b=null,w.pop(),w.length>0?(p=w[w.length-1],De===!0&&te.setGlobalState(v.clippingPlanes,p.state.camera)):p=null,E.pop(),E.length>0?g=E[E.length-1]:g=null};function Wo(M,F,H,W){if(M.visible===!1)return;if(M.layers.test(F.layers)){if(M.isGroup)H=M.renderOrder;else if(M.isLOD)M.autoUpdate===!0&&M.update(F);else if(M.isLight)p.pushLight(M),M.castShadow&&p.pushShadow(M);else if(M.isSprite){if(!M.frustumCulled||Ae.intersectsSprite(M)){W&&Le.setFromMatrixPosition(M.matrixWorld).applyMatrix4(J);let _e=D.update(M),Ie=M.material;Ie.visible&&g.push(M,_e,Ie,H,Le.z,null)}}else if((M.isMesh||M.isLine||M.isPoints)&&(!M.frustumCulled||Ae.intersectsObject(M))){let _e=D.update(M),Ie=M.material;if(W&&(M.boundingSphere!==void 0?(M.boundingSphere===null&&M.computeBoundingSphere(),Le.copy(M.boundingSphere.center)):(_e.boundingSphere===null&&_e.computeBoundingSphere(),Le.copy(_e.boundingSphere.center)),Le.applyMatrix4(M.matrixWorld).applyMatrix4(J)),Array.isArray(Ie)){let Te=_e.groups;for(let ze=0,Ge=Te.length;ze<Ge;ze++){let Ne=Te[ze],Je=Ie[Ne.materialIndex];Je&&Je.visible&&g.push(M,_e,Je,H,Le.z,Ne)}}else Ie.visible&&g.push(M,_e,Ie,H,Le.z,null)}}let le=M.children;for(let _e=0,Ie=le.length;_e<Ie;_e++)Wo(le[_e],F,H,W)}function Uc(M,F,H,W){let O=M.opaque,le=M.transmissive,_e=M.transparent;p.setupLightsView(H),De===!0&&te.setGlobalState(v.clippingPlanes,H),W&&Re.viewport(I.copy(W)),O.length>0&&Tr(O,F,H),le.length>0&&Tr(le,F,H),_e.length>0&&Tr(_e,F,H),Re.buffers.depth.setTest(!0),Re.buffers.depth.setMask(!0),Re.buffers.color.setMask(!0),Re.setPolygonOffset(!1)}function Nc(M,F,H,W){if((H.isScene===!0?H.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[W.id]===void 0&&(p.state.transmissionRenderTarget[W.id]=new vn(1,1,{generateMipmaps:!0,type:We.has("EXT_color_buffer_half_float")||We.has("EXT_color_buffer_float")?ps:Sn,minFilter:ai,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Qe.workingColorSpace}));let le=p.state.transmissionRenderTarget[W.id],_e=W.viewport||I;le.setSize(_e.z*v.transmissionResolutionScale,_e.w*v.transmissionResolutionScale);let Ie=v.getRenderTarget(),Te=v.getActiveCubeFace(),ze=v.getActiveMipmapLevel();v.setRenderTarget(le),v.getClearColor(Y),K=v.getClearAlpha(),K<1&&v.setClearColor(16777215,.5),v.clear(),qe&&he.render(H);let Ge=v.toneMapping;v.toneMapping=mn;let Ne=W.viewport;if(W.viewport!==void 0&&(W.viewport=void 0),p.setupLightsView(W),De===!0&&te.setGlobalState(v.clippingPlanes,W),Tr(M,H,W),Oe.updateMultisampleRenderTarget(le),Oe.updateRenderTargetMipmap(le),We.has("WEBGL_multisampled_render_to_texture")===!1){let Je=!1;for(let ot=0,Mt=F.length;ot<Mt;ot++){let pt=F[ot],ut=pt.object,Be=pt.geometry,xt=pt.material,et=pt.group;if(xt.side===wt&&ut.layers.test(W.layers)){let jt=xt.side;xt.side=Vt,xt.needsUpdate=!0,Fc(ut,H,W,Be,xt,et),xt.side=jt,xt.needsUpdate=!0,Je=!0}}Je===!0&&(Oe.updateMultisampleRenderTarget(le),Oe.updateRenderTargetMipmap(le))}v.setRenderTarget(Ie,Te,ze),v.setClearColor(Y,K),Ne!==void 0&&(W.viewport=Ne),v.toneMapping=Ge}function Tr(M,F,H){let W=F.isScene===!0?F.overrideMaterial:null;for(let O=0,le=M.length;O<le;O++){let _e=M[O],Ie=_e.object,Te=_e.geometry,ze=_e.group,Ge=_e.material;Ge.allowOverride===!0&&W!==null&&(Ge=W),Ie.layers.test(H.layers)&&Fc(Ie,F,H,Te,Ge,ze)}}function Fc(M,F,H,W,O,le){M.onBeforeRender(v,F,H,W,O,le),M.modelViewMatrix.multiplyMatrices(H.matrixWorldInverse,M.matrixWorld),M.normalMatrix.getNormalMatrix(M.modelViewMatrix),O.onBeforeRender(v,F,H,W,M,le),O.transparent===!0&&O.side===wt&&O.forceSinglePass===!1?(O.side=Vt,O.needsUpdate=!0,v.renderBufferDirect(H,F,W,O,M,le),O.side=On,O.needsUpdate=!0,v.renderBufferDirect(H,F,W,O,M,le),O.side=wt):v.renderBufferDirect(H,F,W,O,M,le),M.onAfterRender(v,F,H,W,O,le)}function Ar(M,F,H){F.isScene!==!0&&(F=be);let W=we.get(M),O=p.state.lights,le=p.state.shadowsArray,_e=O.state.version,Ie=V.getParameters(M,O.state,le,F,H),Te=V.getProgramCacheKey(Ie),ze=W.programs;W.environment=M.isMeshStandardMaterial?F.environment:null,W.fog=F.fog,W.envMap=(M.isMeshStandardMaterial?at:ft).get(M.envMap||W.environment),W.envMapRotation=W.environment!==null&&M.envMap===null?F.environmentRotation:M.envMapRotation,ze===void 0&&(M.addEventListener("dispose",Q),ze=new Map,W.programs=ze);let Ge=ze.get(Te);if(Ge!==void 0){if(W.currentProgram===Ge&&W.lightsStateVersion===_e)return Bc(M,Ie),Ge}else Ie.uniforms=V.getUniforms(M),M.onBeforeCompile(Ie,v),Ge=V.acquireProgram(Ie,Te),ze.set(Te,Ge),W.uniforms=Ie.uniforms;let Ne=W.uniforms;return(!M.isShaderMaterial&&!M.isRawShaderMaterial||M.clipping===!0)&&(Ne.clippingPlanes=te.uniform),Bc(M,Ie),W.needsLights=Cd(M),W.lightsStateVersion=_e,W.needsLights&&(Ne.ambientLightColor.value=O.state.ambient,Ne.lightProbe.value=O.state.probe,Ne.directionalLights.value=O.state.directional,Ne.directionalLightShadows.value=O.state.directionalShadow,Ne.spotLights.value=O.state.spot,Ne.spotLightShadows.value=O.state.spotShadow,Ne.rectAreaLights.value=O.state.rectArea,Ne.ltc_1.value=O.state.rectAreaLTC1,Ne.ltc_2.value=O.state.rectAreaLTC2,Ne.pointLights.value=O.state.point,Ne.pointLightShadows.value=O.state.pointShadow,Ne.hemisphereLights.value=O.state.hemi,Ne.directionalShadowMap.value=O.state.directionalShadowMap,Ne.directionalShadowMatrix.value=O.state.directionalShadowMatrix,Ne.spotShadowMap.value=O.state.spotShadowMap,Ne.spotLightMatrix.value=O.state.spotLightMatrix,Ne.spotLightMap.value=O.state.spotLightMap,Ne.pointShadowMap.value=O.state.pointShadowMap,Ne.pointShadowMatrix.value=O.state.pointShadowMatrix),W.currentProgram=Ge,W.uniformsList=null,Ge}function Oc(M){if(M.uniformsList===null){let F=M.currentProgram.getUniforms();M.uniformsList=vs.seqWithValue(F.seq,M.uniforms)}return M.uniformsList}function Bc(M,F){let H=we.get(M);H.outputColorSpace=F.outputColorSpace,H.batching=F.batching,H.batchingColor=F.batchingColor,H.instancing=F.instancing,H.instancingColor=F.instancingColor,H.instancingMorph=F.instancingMorph,H.skinning=F.skinning,H.morphTargets=F.morphTargets,H.morphNormals=F.morphNormals,H.morphColors=F.morphColors,H.morphTargetsCount=F.morphTargetsCount,H.numClippingPlanes=F.numClippingPlanes,H.numIntersection=F.numClipIntersection,H.vertexAlphas=F.vertexAlphas,H.vertexTangents=F.vertexTangents,H.toneMapping=F.toneMapping}function Ad(M,F,H,W,O){F.isScene!==!0&&(F=be),Oe.resetTextureUnits();let le=F.fog,_e=W.isMeshStandardMaterial?F.environment:null,Ie=U===null?v.outputColorSpace:U.isXRRenderTarget===!0?U.texture.colorSpace:Ai,Te=(W.isMeshStandardMaterial?at:ft).get(W.envMap||_e),ze=W.vertexColors===!0&&!!H.attributes.color&&H.attributes.color.itemSize===4,Ge=!!H.attributes.tangent&&(!!W.normalMap||W.anisotropy>0),Ne=!!H.morphAttributes.position,Je=!!H.morphAttributes.normal,ot=!!H.morphAttributes.color,Mt=mn;W.toneMapped&&(U===null||U.isXRRenderTarget===!0)&&(Mt=v.toneMapping);let pt=H.morphAttributes.position||H.morphAttributes.normal||H.morphAttributes.color,ut=pt!==void 0?pt.length:0,Be=we.get(W),xt=p.state.lights;if(De===!0&&(G===!0||M!==b)){let kt=M===b&&W.id===S;te.setState(W,M,kt)}let et=!1;W.version===Be.__version?(Be.needsLights&&Be.lightsStateVersion!==xt.state.version||Be.outputColorSpace!==Ie||O.isBatchedMesh&&Be.batching===!1||!O.isBatchedMesh&&Be.batching===!0||O.isBatchedMesh&&Be.batchingColor===!0&&O.colorTexture===null||O.isBatchedMesh&&Be.batchingColor===!1&&O.colorTexture!==null||O.isInstancedMesh&&Be.instancing===!1||!O.isInstancedMesh&&Be.instancing===!0||O.isSkinnedMesh&&Be.skinning===!1||!O.isSkinnedMesh&&Be.skinning===!0||O.isInstancedMesh&&Be.instancingColor===!0&&O.instanceColor===null||O.isInstancedMesh&&Be.instancingColor===!1&&O.instanceColor!==null||O.isInstancedMesh&&Be.instancingMorph===!0&&O.morphTexture===null||O.isInstancedMesh&&Be.instancingMorph===!1&&O.morphTexture!==null||Be.envMap!==Te||W.fog===!0&&Be.fog!==le||Be.numClippingPlanes!==void 0&&(Be.numClippingPlanes!==te.numPlanes||Be.numIntersection!==te.numIntersection)||Be.vertexAlphas!==ze||Be.vertexTangents!==Ge||Be.morphTargets!==Ne||Be.morphNormals!==Je||Be.morphColors!==ot||Be.toneMapping!==Mt||Be.morphTargetsCount!==ut)&&(et=!0):(et=!0,Be.__version=W.version);let jt=Be.currentProgram;et===!0&&(jt=Ar(W,F,O));let Xi=!1,Qt=!1,Rs=!1,_t=jt.getUniforms(),on=Be.uniforms;if(Re.useProgram(jt.program)&&(Xi=!0,Qt=!0,Rs=!0),W.id!==S&&(S=W.id,Qt=!0),Xi||b!==M){Re.buffers.depth.getReversed()&&M.reversedDepth!==!0&&(M._reversedDepth=!0,M.updateProjectionMatrix()),_t.setValue(C,"projectionMatrix",M.projectionMatrix),_t.setValue(C,"viewMatrix",M.matrixWorldInverse);let Gt=_t.map.cameraPosition;Gt!==void 0&&Gt.setValue(C,ge.setFromMatrixPosition(M.matrixWorld)),Fe.logarithmicDepthBuffer&&_t.setValue(C,"logDepthBufFC",2/(Math.log(M.far+1)/Math.LN2)),(W.isMeshPhongMaterial||W.isMeshToonMaterial||W.isMeshLambertMaterial||W.isMeshBasicMaterial||W.isMeshStandardMaterial||W.isShaderMaterial)&&_t.setValue(C,"isOrthographic",M.isOrthographicCamera===!0),b!==M&&(b=M,Qt=!0,Rs=!0)}if(O.isSkinnedMesh){_t.setOptional(C,O,"bindMatrix"),_t.setOptional(C,O,"bindMatrixInverse");let kt=O.skeleton;kt&&(kt.boneTexture===null&&kt.computeBoneTexture(),_t.setValue(C,"boneTexture",kt.boneTexture,Oe))}O.isBatchedMesh&&(_t.setOptional(C,O,"batchingTexture"),_t.setValue(C,"batchingTexture",O._matricesTexture,Oe),_t.setOptional(C,O,"batchingIdTexture"),_t.setValue(C,"batchingIdTexture",O._indirectTexture,Oe),_t.setOptional(C,O,"batchingColorTexture"),O._colorsTexture!==null&&_t.setValue(C,"batchingColorTexture",O._colorsTexture,Oe));let ln=H.morphAttributes;if((ln.position!==void 0||ln.normal!==void 0||ln.color!==void 0)&&j.update(O,H,jt),(Qt||Be.receiveShadow!==O.receiveShadow)&&(Be.receiveShadow=O.receiveShadow,_t.setValue(C,"receiveShadow",O.receiveShadow)),W.isMeshGouraudMaterial&&W.envMap!==null&&(on.envMap.value=Te,on.flipEnvMap.value=Te.isCubeTexture&&Te.isRenderTargetTexture===!1?-1:1),W.isMeshStandardMaterial&&W.envMap===null&&F.environment!==null&&(on.envMapIntensity.value=F.environmentIntensity),Qt&&(_t.setValue(C,"toneMappingExposure",v.toneMappingExposure),Be.needsLights&&Rd(on,Rs),le&&W.fog===!0&&q.refreshFogUniforms(on,le),q.refreshMaterialUniforms(on,W,Z,ne,p.state.transmissionRenderTarget[M.id]),vs.upload(C,Oc(Be),on,Oe)),W.isShaderMaterial&&W.uniformsNeedUpdate===!0&&(vs.upload(C,Oc(Be),on,Oe),W.uniformsNeedUpdate=!1),W.isSpriteMaterial&&_t.setValue(C,"center",O.center),_t.setValue(C,"modelViewMatrix",O.modelViewMatrix),_t.setValue(C,"normalMatrix",O.normalMatrix),_t.setValue(C,"modelMatrix",O.matrixWorld),W.isShaderMaterial||W.isRawShaderMaterial){let kt=W.uniformsGroups;for(let Gt=0,Xo=kt.length;Gt<Xo;Gt++){let yi=kt[Gt];Ve.update(yi,jt),Ve.bind(yi,jt)}}return jt}function Rd(M,F){M.ambientLightColor.needsUpdate=F,M.lightProbe.needsUpdate=F,M.directionalLights.needsUpdate=F,M.directionalLightShadows.needsUpdate=F,M.pointLights.needsUpdate=F,M.pointLightShadows.needsUpdate=F,M.spotLights.needsUpdate=F,M.spotLightShadows.needsUpdate=F,M.rectAreaLights.needsUpdate=F,M.hemisphereLights.needsUpdate=F}function Cd(M){return M.isMeshLambertMaterial||M.isMeshToonMaterial||M.isMeshPhongMaterial||M.isMeshStandardMaterial||M.isShadowMaterial||M.isShaderMaterial&&M.lights===!0}this.getActiveCubeFace=function(){return R},this.getActiveMipmapLevel=function(){return P},this.getRenderTarget=function(){return U},this.setRenderTargetTextures=function(M,F,H){let W=we.get(M);W.__autoAllocateDepthBuffer=M.resolveDepthBuffer===!1,W.__autoAllocateDepthBuffer===!1&&(W.__useRenderToTexture=!1),we.get(M.texture).__webglTexture=F,we.get(M.depthTexture).__webglTexture=W.__autoAllocateDepthBuffer?void 0:H,W.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(M,F){let H=we.get(M);H.__webglFramebuffer=F,H.__useDefaultFramebuffer=F===void 0};let Id=C.createFramebuffer();this.setRenderTarget=function(M,F=0,H=0){U=M,R=F,P=H;let W=!0,O=null,le=!1,_e=!1;if(M){let Te=we.get(M);if(Te.__useDefaultFramebuffer!==void 0)Re.bindFramebuffer(C.FRAMEBUFFER,null),W=!1;else if(Te.__webglFramebuffer===void 0)Oe.setupRenderTarget(M);else if(Te.__hasExternalTextures)Oe.rebindTextures(M,we.get(M.texture).__webglTexture,we.get(M.depthTexture).__webglTexture);else if(M.depthBuffer){let Ne=M.depthTexture;if(Te.__boundDepthTexture!==Ne){if(Ne!==null&&we.has(Ne)&&(M.width!==Ne.image.width||M.height!==Ne.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Oe.setupDepthRenderbuffer(M)}}let ze=M.texture;(ze.isData3DTexture||ze.isDataArrayTexture||ze.isCompressedArrayTexture)&&(_e=!0);let Ge=we.get(M).__webglFramebuffer;M.isWebGLCubeRenderTarget?(Array.isArray(Ge[F])?O=Ge[F][H]:O=Ge[F],le=!0):M.samples>0&&Oe.useMultisampledRTT(M)===!1?O=we.get(M).__webglMultisampledFramebuffer:Array.isArray(Ge)?O=Ge[H]:O=Ge,I.copy(M.viewport),k.copy(M.scissor),X=M.scissorTest}else I.copy(Ce).multiplyScalar(Z).floor(),k.copy(ke).multiplyScalar(Z).floor(),X=Me;if(H!==0&&(O=Id),Re.bindFramebuffer(C.FRAMEBUFFER,O)&&W&&Re.drawBuffers(M,O),Re.viewport(I),Re.scissor(k),Re.setScissorTest(X),le){let Te=we.get(M.texture);C.framebufferTexture2D(C.FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_CUBE_MAP_POSITIVE_X+F,Te.__webglTexture,H)}else if(_e){let Te=F;for(let ze=0;ze<M.textures.length;ze++){let Ge=we.get(M.textures[ze]);C.framebufferTextureLayer(C.FRAMEBUFFER,C.COLOR_ATTACHMENT0+ze,Ge.__webglTexture,H,Te)}}else if(M!==null&&H!==0){let Te=we.get(M.texture);C.framebufferTexture2D(C.FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_2D,Te.__webglTexture,H)}S=-1},this.readRenderTargetPixels=function(M,F,H,W,O,le,_e,Ie=0){if(!(M&&M.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Te=we.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&_e!==void 0&&(Te=Te[_e]),Te){Re.bindFramebuffer(C.FRAMEBUFFER,Te);try{let ze=M.textures[Ie],Ge=ze.format,Ne=ze.type;if(!Fe.textureFormatReadable(Ge)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Fe.textureTypeReadable(Ne)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=M.width-W&&H>=0&&H<=M.height-O&&(M.textures.length>1&&C.readBuffer(C.COLOR_ATTACHMENT0+Ie),C.readPixels(F,H,W,O,ye.convert(Ge),ye.convert(Ne),le))}finally{let ze=U!==null?we.get(U).__webglFramebuffer:null;Re.bindFramebuffer(C.FRAMEBUFFER,ze)}}},this.readRenderTargetPixelsAsync=async function(M,F,H,W,O,le,_e,Ie=0){if(!(M&&M.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Te=we.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&_e!==void 0&&(Te=Te[_e]),Te)if(F>=0&&F<=M.width-W&&H>=0&&H<=M.height-O){Re.bindFramebuffer(C.FRAMEBUFFER,Te);let ze=M.textures[Ie],Ge=ze.format,Ne=ze.type;if(!Fe.textureFormatReadable(Ge))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Fe.textureTypeReadable(Ne))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let Je=C.createBuffer();C.bindBuffer(C.PIXEL_PACK_BUFFER,Je),C.bufferData(C.PIXEL_PACK_BUFFER,le.byteLength,C.STREAM_READ),M.textures.length>1&&C.readBuffer(C.COLOR_ATTACHMENT0+Ie),C.readPixels(F,H,W,O,ye.convert(Ge),ye.convert(Ne),0);let ot=U!==null?we.get(U).__webglFramebuffer:null;Re.bindFramebuffer(C.FRAMEBUFFER,ot);let Mt=C.fenceSync(C.SYNC_GPU_COMMANDS_COMPLETE,0);return C.flush(),await Yh(C,Mt,4),C.bindBuffer(C.PIXEL_PACK_BUFFER,Je),C.getBufferSubData(C.PIXEL_PACK_BUFFER,0,le),C.deleteBuffer(Je),C.deleteSync(Mt),le}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(M,F=null,H=0){let W=Math.pow(2,-H),O=Math.floor(M.image.width*W),le=Math.floor(M.image.height*W),_e=F!==null?F.x:0,Ie=F!==null?F.y:0;Oe.setTexture2D(M,0),C.copyTexSubImage2D(C.TEXTURE_2D,H,0,0,_e,Ie,O,le),Re.unbindTexture()};let Pd=C.createFramebuffer(),Dd=C.createFramebuffer();this.copyTextureToTexture=function(M,F,H=null,W=null,O=0,le=null){le===null&&(O!==0?(as("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),le=O,O=0):le=0);let _e,Ie,Te,ze,Ge,Ne,Je,ot,Mt,pt=M.isCompressedTexture?M.mipmaps[le]:M.image;if(H!==null)_e=H.max.x-H.min.x,Ie=H.max.y-H.min.y,Te=H.isBox3?H.max.z-H.min.z:1,ze=H.min.x,Ge=H.min.y,Ne=H.isBox3?H.min.z:0;else{let ln=Math.pow(2,-O);_e=Math.floor(pt.width*ln),Ie=Math.floor(pt.height*ln),M.isDataArrayTexture?Te=pt.depth:M.isData3DTexture?Te=Math.floor(pt.depth*ln):Te=1,ze=0,Ge=0,Ne=0}W!==null?(Je=W.x,ot=W.y,Mt=W.z):(Je=0,ot=0,Mt=0);let ut=ye.convert(F.format),Be=ye.convert(F.type),xt;F.isData3DTexture?(Oe.setTexture3D(F,0),xt=C.TEXTURE_3D):F.isDataArrayTexture||F.isCompressedArrayTexture?(Oe.setTexture2DArray(F,0),xt=C.TEXTURE_2D_ARRAY):(Oe.setTexture2D(F,0),xt=C.TEXTURE_2D),C.pixelStorei(C.UNPACK_FLIP_Y_WEBGL,F.flipY),C.pixelStorei(C.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),C.pixelStorei(C.UNPACK_ALIGNMENT,F.unpackAlignment);let et=C.getParameter(C.UNPACK_ROW_LENGTH),jt=C.getParameter(C.UNPACK_IMAGE_HEIGHT),Xi=C.getParameter(C.UNPACK_SKIP_PIXELS),Qt=C.getParameter(C.UNPACK_SKIP_ROWS),Rs=C.getParameter(C.UNPACK_SKIP_IMAGES);C.pixelStorei(C.UNPACK_ROW_LENGTH,pt.width),C.pixelStorei(C.UNPACK_IMAGE_HEIGHT,pt.height),C.pixelStorei(C.UNPACK_SKIP_PIXELS,ze),C.pixelStorei(C.UNPACK_SKIP_ROWS,Ge),C.pixelStorei(C.UNPACK_SKIP_IMAGES,Ne);let _t=M.isDataArrayTexture||M.isData3DTexture,on=F.isDataArrayTexture||F.isData3DTexture;if(M.isDepthTexture){let ln=we.get(M),kt=we.get(F),Gt=we.get(ln.__renderTarget),Xo=we.get(kt.__renderTarget);Re.bindFramebuffer(C.READ_FRAMEBUFFER,Gt.__webglFramebuffer),Re.bindFramebuffer(C.DRAW_FRAMEBUFFER,Xo.__webglFramebuffer);for(let yi=0;yi<Te;yi++)_t&&(C.framebufferTextureLayer(C.READ_FRAMEBUFFER,C.COLOR_ATTACHMENT0,we.get(M).__webglTexture,O,Ne+yi),C.framebufferTextureLayer(C.DRAW_FRAMEBUFFER,C.COLOR_ATTACHMENT0,we.get(F).__webglTexture,le,Mt+yi)),C.blitFramebuffer(ze,Ge,_e,Ie,Je,ot,_e,Ie,C.DEPTH_BUFFER_BIT,C.NEAREST);Re.bindFramebuffer(C.READ_FRAMEBUFFER,null),Re.bindFramebuffer(C.DRAW_FRAMEBUFFER,null)}else if(O!==0||M.isRenderTargetTexture||we.has(M)){let ln=we.get(M),kt=we.get(F);Re.bindFramebuffer(C.READ_FRAMEBUFFER,Pd),Re.bindFramebuffer(C.DRAW_FRAMEBUFFER,Dd);for(let Gt=0;Gt<Te;Gt++)_t?C.framebufferTextureLayer(C.READ_FRAMEBUFFER,C.COLOR_ATTACHMENT0,ln.__webglTexture,O,Ne+Gt):C.framebufferTexture2D(C.READ_FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_2D,ln.__webglTexture,O),on?C.framebufferTextureLayer(C.DRAW_FRAMEBUFFER,C.COLOR_ATTACHMENT0,kt.__webglTexture,le,Mt+Gt):C.framebufferTexture2D(C.DRAW_FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_2D,kt.__webglTexture,le),O!==0?C.blitFramebuffer(ze,Ge,_e,Ie,Je,ot,_e,Ie,C.COLOR_BUFFER_BIT,C.NEAREST):on?C.copyTexSubImage3D(xt,le,Je,ot,Mt+Gt,ze,Ge,_e,Ie):C.copyTexSubImage2D(xt,le,Je,ot,ze,Ge,_e,Ie);Re.bindFramebuffer(C.READ_FRAMEBUFFER,null),Re.bindFramebuffer(C.DRAW_FRAMEBUFFER,null)}else on?M.isDataTexture||M.isData3DTexture?C.texSubImage3D(xt,le,Je,ot,Mt,_e,Ie,Te,ut,Be,pt.data):F.isCompressedArrayTexture?C.compressedTexSubImage3D(xt,le,Je,ot,Mt,_e,Ie,Te,ut,pt.data):C.texSubImage3D(xt,le,Je,ot,Mt,_e,Ie,Te,ut,Be,pt):M.isDataTexture?C.texSubImage2D(C.TEXTURE_2D,le,Je,ot,_e,Ie,ut,Be,pt.data):M.isCompressedTexture?C.compressedTexSubImage2D(C.TEXTURE_2D,le,Je,ot,pt.width,pt.height,ut,pt.data):C.texSubImage2D(C.TEXTURE_2D,le,Je,ot,_e,Ie,ut,Be,pt);C.pixelStorei(C.UNPACK_ROW_LENGTH,et),C.pixelStorei(C.UNPACK_IMAGE_HEIGHT,jt),C.pixelStorei(C.UNPACK_SKIP_PIXELS,Xi),C.pixelStorei(C.UNPACK_SKIP_ROWS,Qt),C.pixelStorei(C.UNPACK_SKIP_IMAGES,Rs),le===0&&F.generateMipmaps&&C.generateMipmap(xt),Re.unbindTexture()},this.initRenderTarget=function(M){we.get(M).__webglFramebuffer===void 0&&Oe.setupRenderTarget(M)},this.initTexture=function(M){M.isCubeTexture?Oe.setTextureCube(M,0):M.isData3DTexture?Oe.setTexture3D(M,0):M.isDataArrayTexture||M.isCompressedArrayTexture?Oe.setTexture2DArray(M,0):Oe.setTexture2D(M,0),Re.unbindTexture()},this.resetState=function(){R=0,P=0,U=null,Re.reset(),ue.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return pn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=Qe._getDrawingBufferColorSpace(e),t.unpackColorSpace=Qe._getUnpackColorSpace()}};var sc="#c98ca7",V0=.055,H0=8192,Eu=()=>new Error("参考路线数据无效，请重试。");function G0(n){if(n?.available===!1)return{available:!1};if(!n||n.available!==!0||typeof n.seconds!="number"||!Number.isFinite(n.seconds)||n.seconds<0||n.seconds>86400||typeof n.approximate!="boolean"||!Array.isArray(n.path)||!n.path.length||n.path.length>H0)throw Eu();let e=n.path.map(t=>{if(!Array.isArray(t)||t.length!==2||t.some(i=>typeof i!="number"||!Number.isFinite(i)||i<0||i>=512))throw Eu();return[...t]});return{available:!0,seconds:n.seconds,approximate:n.approximate,path:e}}function Tu({load:n,onChange:e=()=>{}}){let t="",i=!1,s=!1,r="idle",a=null,o=null,l=0,c=()=>({id:t,enabled:i,status:r,data:a}),h=()=>e(c());function u(){l++,o?.controller.abort(),o=null,r==="loading"&&(r="idle")}function d(){if(!i||s||!t||a)return Promise.resolve(a);if(o)return o.task;let f=++l,m=new AbortController,_=t;r="loading";let g={controller:m,task:null};return o=g,h(),g.task=Promise.resolve().then(()=>n(_,{signal:m.signal})).then(p=>l!==f||t!==_||m.signal.aborted?null:(a=G0(p),r=a.available?"ready":"unavailable",a.available||(i=!1),h(),a)).catch(p=>(l!==f||t!==_||m.signal.aborted||(r="error",i=!1,h()),null)).finally(()=>{o===g&&(o=null)}),g.task}return{snapshot:c,reset(f=""){u(),t=/^[a-f0-9]{24}$/.test(f)?f:"",i=!1,a=null,r="idle",h()},select(f){return i=!!f&&!!t&&r!=="unavailable",i?(h(),d()):(u(),h(),Promise.resolve(a))},suspend(){s=!0,u(),h()},resume(){return s=!1,h(),d()}}}function Au(n,e=Path2D){if(!n?.available)return null;let t=new e;for(let[r,a]of n.path.entries())r?t.lineTo(...a):t.moveTo(...a);let i=n.path[0],s=n.path.every(r=>r[0]===i[0]&&r[1]===i[1]);return{path:t,point:s?[...i]:null}}function Ru(n,e,t){!e||!Number.isFinite(t)||t<=0||(n.save(),n.strokeStyle=sc,n.fillStyle=sc,n.lineWidth=1.7/t,n.lineJoin="round",n.lineCap="round",n.globalAlpha=.9,n.stroke(e.path),e.point&&(n.beginPath(),n.arc(e.point[0],e.point[1],1.4/t,0,Math.PI*2),n.fill()),n.restore())}function Cu(n){if(!n?.available)return null;let e=[],t=.02,i=V0,s=(l,c,h)=>e.push(l[0],i,-l[1],c[0],i,-c[1],h[0],i,-h[1]);for(let l=1;l<n.path.length;l++){let c=n.path[l-1],h=n.path[l],u=h[0]-c[0],d=h[1]-c[1],f=Math.hypot(u,d);if(f<1e-8)continue;let m=-d/f*t,_=u/f*t,g=[c[0]+m,c[1]+_],p=[c[0]-m,c[1]-_],E=[h[0]+m,h[1]+_],w=[h[0]-m,h[1]-_];s(g,p,E),s(p,w,E)}if(!e.length){let[l,c]=n.path[0],h=[l-t,c-t],u=[l+t,c-t],d=[l+t,c+t],f=[l-t,c+t];s(h,u,d),s(h,d,f)}let r=new gt().setAttribute("position",new lt(e,3)),a=new St({color:sc,side:wt,transparent:!0,opacity:.86,depthTest:!0,depthWrite:!1}),o=new st(r,a);return o.name="race-reference-route",o.renderOrder=1,o}var Iu=(n,e)=>Number.isFinite(n)&&n>=0&&e>=n,vo=(n,e)=>Iu(n.pickupTime,e);function Mo(n,e=null,t=n,i=0){let s=Iu(e,t),r=s?t-e:0,a=Math.min(1,r/.75);return{collected:s,visible:!s||r<.75,progress:a,yaw:n*1.55+i*1.7+(s?a*7:0),height:1.05+(s?a*.38:Math.sin(n*2.3+i)*.045),scale:s?Math.sqrt(Math.max(0,1-a/.48)):1}}function Pu(n){let e=new Map((n.coinPickups||[]).map(t=>[t.id,t.time]));return(n.coins||[]).map(t=>({...t,pickupTime:e.get(t.id)??null}))}function Du(n){let e=new Lt,t=new Lt,i=new Lt;e.add(t,i),e.position.set(n.position[0],0,-n.position[1]);let s=new St({color:15767071}),r=new St({color:9133083}),a=new St({color:7224330}),o=new St({color:7224330}),l=new St({color:16111993}),c=(d,f,m,_=0)=>{let g=new st(new ds(d,d,f,20),m);g.rotation.x=Math.PI/2,g.position.z=_,t.add(g)};c(.23,.054,[r,s,s]);for(let d of[-1,1]){c(.195,.008,a,d*.038);let f=new st(new ii(.153,.167,20),s);f.position.z=d*.045,f.rotation.y=d<0?Math.PI:0,t.add(f);let m=new gt;m.setAttribute("position",new lt([0,.112,0,.075,0,0,0,-.112,0,-.075,0,0],3)),m.setIndex([0,2,1,0,3,2]);let _=new st(m,l);_.rotation.y=d<0?Math.PI:0,_.position.z=d*.052,t.add(_)}let h=new Qs(.025),u=new St({color:15911261,transparent:!0});for(let d=0;d<12;d++){let f=new st(h,u);i.add(f)}return e.userData={coin:n,body:t,sparks:i,particleMaterial:u},e}function Lu(n,e,t,i){let{body:s,sparks:r,particleMaterial:a}=n.userData,o=Mo(e,t,i,n.userData.coin.id);if(n.visible=o.visible,!!o.visible&&(s.position.y=o.height,s.rotation.y=o.yaw,s.scale.setScalar(o.scale),r.visible=o.collected,a.opacity=1-o.progress,o.collected))for(let[l,c]of r.children.entries()){let h=l*Math.PI*2/12+n.userData.coin.id,u=o.progress*(.6+.14*(l%3));c.position.set(Math.cos(h)*u,1.05+o.progress*(.45+.16*(l%2))-.32*o.progress**2,Math.sin(h)*u),c.scale.setScalar(Math.sqrt(1-o.progress))}}var ac="#a4d484",bo="#f49b78",rc=(n,e)=>!!n&&!!e&&n[0]===e[0]&&n[1]===e[1];function W0(n,e){let t=n.exitEvents||[];if(!t.length)return n.exit;let i=0,s=t.length-1;for(;i<s;){let r=Math.ceil((i+s)/2);t[r].time<=e?i=r:s=r-1}return t[i].cell}function ur(n,e){let t=W0(n,e),i=n.canonicalExit||null,s=!!n.exitEvents?.length,r=i?!rc(t,i):s&&!rc(t,n.exitEvents[0].cell);return{cell:t,canonical:i,recorded:s,altered:r,showOriginal:!!i&&!rc(t,i),color:r?bo:ac}}function So(n,e=!1,t=!1){return e?t?"ORIGINAL EXIT":"原始出口":n.altered?n.recorded?t?"CURRENT EXIT":"当前出口":t?"DECLARED EXIT":"声明出口":t?"EXIT":"出口"}function Uu(n=document,e=window){let t=n.getElementById("ui-fonts");if(!t)return;let s=[...(t.textContent||[...t.sheet?.cssRules||[]].map(h=>h.cssText).join("")).matchAll(/U\+([0-9A-F]+)(?:-([0-9A-F]+))?/gi)].map(h=>[parseInt(h[1],16),parseInt(h[2]||h[1],16)]),r=new Set,a=!1;function o(h){if(!a)for(let u of h){let d=u.codePointAt(0);if(!(d<32||r.has(d))&&(r.add(d),!s.some(([f,m])=>d>=f&&d<=m))){a=!0;let f=n.createElement("link");f.rel="stylesheet",f.href="/assets/fonts/noto.css",n.head.insertBefore(f,t);break}}}function l(h){if(h.nodeType===3){h.parentElement&&!h.parentElement.closest("script,style,template,[hidden]")&&h.parentElement.getClientRects().length&&o(h.textContent);return}if(!(h.nodeType!==1||h.matches("script,style,template,[hidden]")))for(let u of h.childNodes)l(u)}l(n.body);let c=new e.MutationObserver(h=>{for(let u of h)if(u.type==="characterData")l(u.target);else for(let d of u.addedNodes)l(d);a&&c.disconnect()});a||c.observe(n.body,{subtree:!0,childList:!0,characterData:!0}),n.addEventListener("input",h=>{a||o(h.target.value||"")})}function oc(n){let e=Math.max(0,Math.min(1,n));return e*e*e*(e*(e*6-15)+10)}function lc(n){return Math.min(900,Math.max(325,275+Math.log1p(Math.max(0,n))*90))}function Nu(n,e,t){return{camera:Math.max(0,Math.min(.1,n)),playback:t?Math.max(0,n)*e:0}}function Fu(n,e,t){return Math.hypot(e.x-n.x,e.z-n.z)>Math.max(2,20*Math.max(0,t))}function Ou(n,e,t,i,s=r=>r){let r=0,a=n.length-1;for(;r<a;){let f=Math.ceil((r+a)/2);n[f]<=e?r=f:a=f-1}let o=s(t)-s(e),l=o>0?Math.max(1,i/o):0,c=[],h=s(e),u=r;for(let f=r+1;f<n.length&&n[f]<=t;f++){let m=s(n[f]);m>h&&c.push({index:f,time:n[f],dt:(m-h)*l}),h=m,u=f}let d=s(t);return d>h&&c.push({index:u,time:t,dt:(d-h)*l}),c.length||c.push({index:u,time:t,dt:i}),c}function wo(n,e,t,i,s){let r=Math.max(.7,Math.min(18,n.zoom*Math.exp(-s*.001))),a=r/n.zoom;return{zoom:r,pan:[(e.x-t/2)*(1-a)+n.pan[0]*a,(e.y-i/2)*(1-a)+n.pan[1]*a]}}function Eo(n){let e=[...n];if(!e.length)return null;let t=e[0],i=e[1]||t;return{count:e.length,x:(t.x+i.x)/2,y:(t.y+i.y)/2,distance:e.length>1?Math.hypot(t.x-i.x,t.y-i.y):0}}function cc(n,e){return!n||!e||n.count!==e.count?null:{dx:e.x-n.x,dy:e.y-n.y,ratio:n.distance>4?Math.max(.25,Math.min(4,e.distance/n.distance)):1,multi:e.count>1}}function Bu(n,e,t,i,s){let r=cc(e,t);if(!r)return{zoom:n.zoom,pan:[...n.pan]};let a=wo(n,e,i,s,-Math.log(r.ratio)*1e3);return a.pan[0]+=r.dx,a.pan[1]+=r.dy,a}var dr=n=>[6,7,8,9,10,12,13,14,15,16,17,18,19,22,...Array.from({length:n},(e,t)=>Array.from({length:7},(i,s)=>24+t*12+s)).flat(),3],rM=dr(4),yt=()=>new Error("回放数据格式无效或不完整，请刷新后重试。"),fr=class{constructor(e){this.bytes=e instanceof Uint8Array?e:new Uint8Array(e),this.view=new DataView(this.bytes.buffer,this.bytes.byteOffset,this.bytes.byteLength),this.at=0}take(e){if(!Number.isSafeInteger(e)||e<0||this.at+e>this.bytes.length)throw yt();let t=this.bytes.subarray(this.at,this.at+e);return this.at+=e,t}u8(){return this.take(1)[0]}u16(){let e=this.at;return this.take(2),this.view.getUint16(e,!0)}u32(){let e=this.at;return this.take(4),this.view.getUint32(e,!0)}f64(){let e=this.at;return this.take(8),this.view.getFloat64(e,!0)}magic(e){if([...e].some(t=>this.u8()!==t.charCodeAt(0)))throw yt()}integer(e=Number.MAX_SAFE_INTEGER){let t=0,i=1;for(let s=0;s<8;s++){let r=this.u8();if(t+=(r&127)*i,!Number.isSafeInteger(t)||t>e)throw yt();if(r<128){if(s&&r===0)throw yt();return t}i*=128}throw yt()}end(){if(this.at!==this.bytes.length)throw yt()}};function hc(n,e,t){let i=0,s=0;for(;s<e;){let r=n.integer(4294967295);if(r===0){let a=n.integer(e-s);if(!a)throw yt();for(let o=0;o<a;o++)t(s++,i)}else i=(i^r)>>>0,t(s++,i)}}function X0(n){let e=new fr(n);e.magic("HVM5");let t=e.u8(),i=e.u8(),s=e.u8(),r=e.u8(),a=e.u32(),o=e.u32(),l=e.u32(),c=e.u32(),h=e.u32();if(t&-128||![4,5].includes(i)||s!==dr(i).length||r||a<1||a>2e5||o>1e6||l>a||c>1e6||h>5e3)throw yt();let u=[e.u8(),e.u8()],d=Array.from({length:i},()=>e.u16()),f=Array.from({length:9},()=>e.f64());if(f.some(Me=>!Number.isFinite(Me))||f.slice(0,3).some(Me=>Me<0)||f[3]<=0||f[4]<=0||d.some(Me=>Me>=997))throw yt();let[m,_,g,p,E,w,v,T,R]=f,P=e.take(8192).slice(),U=e.take(8192).slice();function S(Me,Ae=!0){let De=new Float64Array(Me),G=0;for(let J=0;J<Me;J++){if(t&4)De[J]=e.f64();else{let ge=e.integer();if(G=Ae?G+ge:ge,!Number.isSafeInteger(G))throw yt();De[J]=G/1e6}if(!Number.isFinite(De[J])||De[J]<0)throw yt()}return De}let b=S(a);for(let Me=1;Me<a;Me++)if(b[Me]<=b[Me-1])throw yt();let I=S(o),k=new Uint32Array(o);hc(e,o,(Me,Ae)=>k[Me]=Ae);let X=new Float32Array(k.buffer);if(X.some(Me=>!Number.isFinite(Me)))throw yt();let Y=Array.from(I,(Me,Ae)=>[Me,X[Ae]]),K=S(l*2,!1),$=S(c*2,!1),ne=Array.from({length:h},()=>[0,0]);for(let Me=0;Me<2;Me++){let Ae=0;for(let De of ne){if(t&8)De[Me]=e.f64();else{let G=e.integer(4294967295);Ae+=G%2?-(Math.floor(G/2)+1):G/2,De[Me]=Ae/1e4}if(!Number.isFinite(De[Me]))throw yt()}}let Z=[],de=[];if(t&32){let Me=e.u8();if(Me<1||Me>3)throw yt();let Ae=new Set,De=new Set;for(let G=0;G<Me;G++){let J=e.u8(),ge=e.u8(),Le=e.u8(),be=e.f64(),qe=Le*256+ge;if(J>=3||Ae.has(J)||De.has(qe)||!Number.isFinite(be)||be!==-1&&(be<0||be>m+1e-6))throw yt();Ae.add(J),De.add(qe),Z.push({id:J,cell:[ge,Le],position:[(ge+.5)*E,(Le+.5)*E]}),be>=0&&de.push({id:J,time:be})}}let xe=null,Ce=null,ke=[];if(t&64){let Me=e.u8();if(Me<1||Me>7)throw yt();if(Me&1&&(xe=[e.u8(),e.u8()]),Me&2){let Ae=e.integer(9e5);if(!Ae)throw yt();let De=null;for(let G=0;G<Ae;G++){let J=e.f64(),ge=[e.u8(),e.u8()];if(!Number.isFinite(J)||J<0||J>m+1e-6||!De&&J!==0||De&&(J<=De.time||ge.every((Le,be)=>Le===De.cell[be])))throw yt();De={time:J,cell:ge},ke.push(De)}}if(Me&4){let Ae=[e.f64(),e.f64()];if(Ae.some(De=>!Number.isFinite(De)||De<0||De>=512))throw yt();Ce={position:Ae}}}return e.end(),{format:"HVR5",canonicalExit:xe,exitEvents:ke,exitCompletionMismatch:Ce,coins:Z,coinPickups:de,terrainLighting:!!(t&16),inputMode:t&1?"events":"held",timeBasis:t&2?"recorded_wall":"simulation_legacy",samples:a,chunks:Math.ceil(a/360),duration:m,activeDuration:_,simulationDuration:g,rate:p,tile:E,ceiling:w,eye:v,entities:i,exit:u,forms:d,spawnPosition:[T,R],bitmap:P,lampBits:U,times:b,healthEvents:Y,idleRanges:Array.from({length:l},(Me,Ae)=>[K[Ae*2],K[Ae*2+1]]),chaseRanges:Array.from({length:c},(Me,Ae)=>[$[Ae*2],$[Ae*2+1]]),path:ne,fields:dr(i),words:24+12*i}}function uc(n,e,t){let i=new fr(n);i.magic("HVC5");let s=i.u16(),r=i.u16();if(!Number.isInteger(t)||t<0||t>=e.chunks||s!==Math.min(360,e.samples-t*360)||s<1||s>360||r!==dr(e.entities).length)throw yt();let a=24+12*e.entities,o=dr(e.entities),l=new Uint32Array(s*a);for(let h of o)hc(i,s,(u,d)=>l[u*a+h]=d);hc(i,s,(h,u)=>{if(u>>>18+2*e.entities)throw yt();let d=h*a;l[d+1]=u&1023,l[d+2]=u>>>10&255;for(let f=0;f<e.entities;f++)l[d+35+f*12]=u>>>18+2*f&3}),i.end();let c=new Float32Array(l.buffer);for(let h=0;h<s;h++){let u=t*360+h;c[h*a]=u?e.times[u]-e.times[u-1]:0}if(o.some(h=>{for(let u=0;u<s;u++)if(!Number.isFinite(c[u*a+h]))return!0;return!1}))throw yt();return l}function ku(n){let e=new fr(n);e.magic("HVI5");let t=e.u32(),i=e.u32(),s=X0(e.take(t)),r=uc(e.take(i),s,0);return e.end(),{meta:s,first:r}}var q0=new Set([429,500,502,503,504]),li=(n,e)=>Object.assign(new Error(n),{status:e});async function bs(n){if(!(n.headers.get("Content-Type")||"").includes("application/json"))throw li(`服务器暂未返回有效的回放信息（HTTP ${n.status}），请重试。`,n.status);try{return await n.json()}catch{throw li("回放信息不完整，请重试。",n.status)}}function zu(n,e){return new Promise((t,i)=>{if(e?.aborted){i(e.reason||new DOMException("Aborted","AbortError"));return}let s=()=>{clearTimeout(r),i(e.reason||new DOMException("Aborted","AbortError"))},r=setTimeout(()=>{e?.removeEventListener("abort",s),t()},n);e?.addEventListener("abort",s,{once:!0})})}async function Ao(n,e={},t=fetch,i=zu){for(let s=0;;s++){let r;try{r=await t(n,e)}catch(a){if(a.name==="AbortError"||e.signal?.aborted)throw a;if(s>=2)throw li("网络连接中断，请重新尝试播放。",0);await i(500*(s+1),e.signal);continue}if(q0.has(r.status)&&s<2){let a=Number(r.headers.get("Retry-After")),o=a>0?Math.min(1e4,a*1e3):500*(s+1);await r.body?.cancel(),await i(o,e.signal);continue}return r}}function Ro(n,e){return typeof n=="string"&&/^\/replay-public\/[a-f0-9]{24}\/[a-f0-9]{64}\/$/.test(n)&&(!e||n.split("/")[2]===e)?n:""}var To=class{constructor(e,t,i=fetch,s=zu){this.base=e,this.publicBase=Ro(e.publicBase),this.signal=t,this.fetcher=i,this.sleep=s,this.ticket="",this.expires=0,this.renewing=null}async request(e,t={}){return Ao(e,{...t,headers:{Accept:"application/vnd.halls.replay.v5",...t.headers},signal:t.signal||this.signal},this.fetcher,this.sleep)}async authorize(){if(this.renewing)return this.renewing;this.renewing=(async()=>{let e=await this.request(this.base.session,{method:"POST"}),t=await bs(e);if(!e.ok)throw li(t.error||"回放不可访问或已下架。",e.status);if(typeof t.ticket!="string")throw li("回放授权信息不完整，请重试。",e.status);this.ticket=t.ticket,this.expires=Date.now()+Math.max(1e3,((t.expiresIn||900)-60)*1e3)})();try{await this.renewing}finally{this.renewing=null}}async fetch(e,t={}){if(this.publicBase){if(!/^(manifest|[1-9]\d{0,3})$/.test(String(e)))throw li("回放分段超出范围。",404);let r=await this.request(this.publicBase+e+".bin",{...t,credentials:"omit"});if(!r.ok){let a=await bs(r);throw li(a.error||"回放暂不可用，请稍后重试。",r.status)}return r}(!this.ticket||Date.now()>=this.expires)&&await this.authorize();let i=this.ticket,s=await this.request(this.base.parts+e,{...t,headers:{...t.headers,"X-Replay-Ticket":i}});if(s.status===404&&(await s.body?.cancel(),this.ticket===i&&(this.ticket=""),this.ticket||await this.authorize(),s=await this.request(this.base.parts+e,{...t,headers:{...t.headers,"X-Replay-Ticket":this.ticket}})),!s.ok){let r=await bs(s);throw li(r.error||"回放暂不可用，请稍后重试。",s.status)}return s}};var Co=()=>new DOMException("Buffer request cancelled","AbortError"),Io=class{constructor({times:e,duration:t,loaded:i,load:s,display:r=h=>h,onChange:a=()=>{},onError:o=()=>{},clock:l=()=>performance.now(),concurrency:c=2}){Object.assign(this,{times:e,duration:t,loaded:i,load:s,display:r,onChange:a,onError:o,clock:l,concurrency:c}),this.jobs=new Map,this.failures=new Map,this.running=0,this.latency=1,this.active=!0,this.disposed=!1,this.target={index:0,time:0,speed:1}}get chunks(){return Math.ceil(this.times.length/360)}get resumeSeconds(){return Math.max(4,Math.min(10,this.latency*3))}ahead(){let e=Math.floor(this.target.index/360);if(!this.loaded.has(e))return 0;for(;e+1<this.chunks&&this.loaded.has(e+1);)e++;let t=e===this.chunks-1?this.duration:this.times[Math.min(this.times.length-1,(e+1)*360-1)];return Math.max(0,(this.display(t)-this.display(this.target.time))/this.target.speed)}canResume(){let e=Math.max(0,(this.display(this.duration)-this.display(this.target.time))/this.target.speed);return this.loaded.has(Math.floor(this.target.index/360))&&this.ahead()+1e-6>=Math.min(this.resumeSeconds,e)}update(e){let t=Math.floor(this.target.index/360);Object.assign(this.target,e);let i=Math.floor(this.target.index/360);if(i!==t&&!this.loaded.has(i))for(let[s,r]of this.jobs)r.started&&(s<i||s>i+1)&&r.controller.abort();this.fill()}fill(){if(!this.active||this.disposed)return;let e=Math.floor(this.target.index/360);for(let t=0;t<this.chunks;t++){if(this.loaded.has(t)||(this.failures.get(t)?.retryAt||0)>this.clock())continue;let i=(t-e+this.chunks)%this.chunks,s=this.jobs.get(t);s&&!s.controller.signal.aborted?s.priority=i:this.enqueue(t,i).catch(()=>{})}this.pump()}request(e){if(!Number.isInteger(e)||e<0||e>=this.chunks)return Promise.reject(Error("回放分段超出范围。"));if(this.loaded.has(e))return Promise.resolve();if(!this.active||this.disposed)return Promise.reject(Co());let t=this.failures.get(e);if(t&&t.retryAt>this.clock())return Promise.reject(t.error);let i=this.enqueue(e,0);return this.pump(),i}enqueue(e,t){let i=this.jobs.get(e);return i&&!i.controller.signal.aborted?(i.priority=Math.min(i.priority,t),i.promise):(i={priority:t,controller:new AbortController,started:!1},i.promise=new Promise((s,r)=>{i.resolve=s,i.reject=r}),this.jobs.set(e,i),i.promise)}pump(){if(!(!this.active||this.disposed))for(;this.running<this.concurrency;){let e=[...this.jobs].filter(([,o])=>!o.started).sort(([o,l],[c,h])=>l.priority-h.priority||o-c)[0];if(!e)break;let[t,i]=e;i.started=!0,this.running++;let s=this.clock(),r=i.controller.signal,a=new Promise((o,l)=>{i.abort=()=>l(Co()),r.addEventListener("abort",i.abort,{once:!0})});Promise.race([Promise.resolve().then(()=>this.load(t,r,i.priority)),a]).then(()=>{if(r.aborted||this.disposed)throw Co();this.loaded.add(t),this.failures.delete(t),this.latency=this.latency*.7+Math.max(.01,(this.clock()-s)/1e3)*.3,i.resolve()}).catch(o=>{if(o.name!=="AbortError"&&!this.disposed){let l=(this.failures.get(t)?.attempts||0)+1;this.failures.set(t,{error:o,attempts:l,retryAt:this.clock()+Math.min(3e4,2e3*2**(l-1))}),this.onError(t,o)}i.reject(o)}).finally(()=>{r.removeEventListener("abort",i.abort),this.running--,this.jobs.get(t)===i&&this.jobs.delete(t),this.onChange(),this.fill()})}}suspend(){this.active=!1;for(let[e,t]of this.jobs)t.controller.abort(),t.started||(this.jobs.delete(e),t.reject(Co()))}resume(e){this.active=!0,this.update(e)}dispose(){this.disposed=!0,this.suspend()}};var Ss=class{constructor(e,t=[],i=[]){this.duration=Math.max(0,e),this.ranges=[],this.removed=[],this.starts=[];let s=0;for(let[r,a]of t.filter(o=>o.length===2&&o.every(Number.isFinite)).sort((o,l)=>o[0]-l[0])){let o=Math.max(0,r),l=Math.min(this.duration,a),c=this.ranges.at(-1);l<=o||(c&&o<=c[1]?c[1]=Math.max(c[1],l):this.ranges.push([o,l]))}for(let[r,a]of this.ranges)this.starts.push(r-s),s+=a-r,this.removed.push(s);this.active=this.duration-s,this.chaseRanges=i.filter(r=>r.length===2&&r.every(Number.isFinite)&&r[1]>r[0])}upper(e,t){let i=0,s=e.length;for(;i<s;){let r=i+s>>1;e[r]<=t?i=r+1:s=r}return i}index(e){let t=0,i=this.ranges.length;for(;t<i;){let s=t+i>>1;this.ranges[s][0]<=e?t=s+1:i=s}return t-1}pauseAt(e){let t=this.index(e);return t>=0&&e<this.ranges[t][1]?this.ranges[t]:null}display(e,t=!1){if(e=Math.max(0,Math.min(this.duration,e)),!t)return e;let i=this.index(e);return i<0?e:e-(i?this.removed[i-1]:0)-Math.min(e-this.ranges[i][0],this.ranges[i][1]-this.ranges[i][0])}wall(e,t=!1){if(!t)return Math.max(0,Math.min(this.duration,e));e=Math.max(0,Math.min(this.active,e));let i=this.upper(this.starts,e);return Math.min(this.duration,e+(i?this.removed[i-1]:0))}background(e=!1){let t=e?this.active:this.duration,i=new Uint8Array(1024),s=(l,c)=>{if(!(t<=0))for(let h of l){let u=this.display(h[0],e),d=this.display(h[1],e);d>u&&i.fill(c,Math.max(0,Math.floor(u/t*1024)),Math.min(1024,Math.ceil(d/t*1024)))}};s(this.chaseRanges,2),e||s(this.ranges,1);let r=["#647143","#c9ac72","#b94d42"],a=[],o=0;for(let l=1;l<=1024;l++)(l===1024||i[l]!==i[o])&&(a.push(`${r[i[o]]} ${o/10.24}% ${l/10.24}%`),o=l);return`linear-gradient(to right,${a.join(",")})`}};function Vu(n,e,t,i,s){let r=e/2,a=t/2,o=Math.max(Math.abs(n.z),.001),l=n.x*i/o*r,c=-n.y*s/o*a;if(n.z<-.04&&Math.abs(l)<r-60&&Math.abs(c)<a-48)return{x:r+l,y:a+c,edge:!1,angle:0};Math.abs(l)+Math.abs(c)<1e-8&&(l=0,c=1);let d=Math.min(Math.max(1,r-22)/Math.max(Math.abs(l),1e-9),Math.max(1,a-44)/Math.max(Math.abs(c),1e-9));return{x:r+l*d,y:a+c*d,edge:!0,angle:Math.atan2(c,l)}}function Hu(n,e,t){return n.map(i=>{let s=Math.max(58,Math.min(e-58,i.x)),r=Math.max(8,Math.min(t-30,i.y>t-66?i.y-32:i.y+16));return{x:s-i.x,y:r-i.y}})}function Gu(n,e,t){return n.edge&&n.x<60?{x:12,y:-8,transform:"none"}:n.edge&&n.x>e-60?{x:-12,y:-8,transform:"translateX(-100%)"}:{x:0,y:n.y>t-66?-30:12,transform:"translateX(-50%)"}}var gn=()=>localStorage.getItem("halls-language")==="en"?"en":"zh",Po={最优路线:"Optimal route",理论最短时间:"Theoretical minimum time",约:"Approx.","正在更新下载列表…":"Updating downloads…",积分总榜:"Overall leaderboard",公开成绩:"Published runs",非排名成绩:"Unranked runs",选择榜单:"Select leaderboard","玩家 / 榜单":"Player / Board","所有公开通关成绩与回放。":"All published runs and replays.","汇总 RANKED 与 UNRANKED 的公开成绩，保留各记录的榜单归属。":"Published RANKED and UNRANKED runs together, with each run's board clearly marked.","这里的成绩不参与正式排名。疑点标签并不等于确认作弊；仅展示获准公开的记录。":"These runs are unranked. Suspicion tags are not proof of cheating; only approved-for-publication records appear here.","出口或通关状态未通过校验，竞速、金币与战术奖励未计入。":"Exit or completion checks failed; pace, coin and tactics bonuses are excluded.","独立违规项超过 10 项，得分归零。":"More than 10 independent checks failed; the score is zero.","已按通关保底结算。":"The completion minimum has been applied.","已按通关保底结算；重复地图另按对应规则折减。":"The completion minimum was applied, followed by repeat-map scoring.","初始出口一致；此版本未记录运行中的出口变化。":"The initial exit matches; this version did not record exit changes during the run.","初始出口一致，但胜利位置不在该处；旧版未记录变化过程。":"The initial exit matches, but victory occurred elsewhere; this older version did not record the changes.","客户端触发通关 · 通关完整性未通过":"Client reported victory · Completion integrity failed","该偏差已与“路线与碰撞”合并计分，不重复扣分。":"This discrepancy is grouped with route and collision; no duplicate deduction is applied.","该偏差已与“游戏变速”合并计分，不重复扣分。":"This discrepancy is grouped with game speed; no duplicate deduction is applied.","该偏差已与“攻击与伤害”合并计分，不重复扣分。":"This discrepancy is grouped with combat and damage; no duplicate deduction is applied.",金币生成复算:"Coin placement verification",金币拾取复算:"Coin pickup verification","已复算金币位置与可达性。":"Coin positions and reachability have been verified.","金币生成结果未通过校验。":"Coin placement verification failed.","已完成金币拾取复算。":"Coin pickup verification is complete.","金币拾取未通过校验，金币奖励未计入。":"Coin pickup verification failed; no coin bonus was awarded.","关联的游戏校验未通过，金币奖励未计入。":"A required gameplay check failed; no coin bonus was awarded.","金币有效性尚未完成核实，金币奖励未计入。":"Coin validity could not be confirmed; no coin bonus was awarded.","金币拾取或生存状态未完成有效校验，金币奖励未计入。":"Coin pickups or survival could not be verified; no coin bonus was awarded.","路线、移动或时间记录存在异常，对应奖励未计入。":"Route, movement or timing anomalies exclude the corresponding bonuses.","实体或战斗记录存在异常，战术奖励未计入。":"Entity or combat anomalies exclude the tactics bonus.","已确认拾取 0 / 3 枚金币。":"Confirmed 0 / 3 coins collected.","已确认拾取 1 / 3 枚金币。":"Confirmed 1 / 3 coins collected.","已确认拾取 2 / 3 枚金币。":"Confirmed 2 / 3 coins collected.","已确认拾取 3 / 3 枚金币。":"Confirmed 3 / 3 coins collected.",本次得分:"Your score",本次参考分:"Your reference score","此分数不参与正式排名。":"This score does not count toward the ranked leaderboard.",彻底删除:"Delete permanently","彻底删除成绩？":"Permanently delete this run?",确认彻底删除:"Confirm permanent deletion","将删除成绩、凭证、回放及关联预览和赛事提交记录，无法恢复。":"The run, proof, replay, linked previews and competition submissions will be deleted. This cannot be undone.",记录及关联文件已彻底删除:"Run and associated files permanently deleted",删除待重试:"Deletion needs retry","撤销 API Key":"Revoke API key","恢复 API Key":"Restore API key",恢复:"Restore",取消:"Cancel",确认撤销:"Confirm revocation",确认恢复:"Confirm restoration","Key 已恢复":"Key restored","使用这把 Key 的程序将无法提交。可在列表中恢复。":"Programs using this key will be unable to submit. You can restore it from the list.","恢复后，使用这把 Key 的程序可继续提交。":"Restoring this key lets programs using it submit again.",存储空间:"Storage",磁盘信息暂不可用:"Disk information unavailable",服务器磁盘:"Server disk",可用空间:"Free space",保留空间:"Safety reserve",平台文件配额:"Platform file quota",处理中预留:"Job reservations",可分配空间:"Available for uploads","成绩 / 预览":"Runs / previews",处理队列:"Queued jobs",存储容量正常:"Storage capacity normal","空间不足，已停止接收新文件":"Storage full; new uploads are paused",无扣分:"No deductions",移动速度:"Movement speed",收起:"Collapse",展开:"Expand",自动化可疑度:"Automation suspicion",重复地图:"Repeated map",成绩有效性:"Score validity","地图、路线或移动记录存在异常。":"Map, route or movement records contain anomalies.","时间或速度记录存在异常。":"Timing or speed records contain anomalies.","攻击、生命值或受伤记录存在不一致。":"Attack, health or damage records are inconsistent.","实体的运动或行为记录存在异常。":"Entity movement or behavior records contain anomalies.","多项操作特征呈现自动化倾向。":"Multiple input features suggest automation.","操作记录呈现自动化倾向，按可疑度扣分。":"The input record suggests automation; points are deducted according to suspicion.","地图与已有成绩高度相似。":"The map closely matches an existing run.","行走路线与已有成绩高度相似。":"The route closely matches an existing run.","地图种子与已有成绩重复，按重复地图规则折减。":"The map seed is repeated; repeat-map scoring applies.","路线或移动记录存在异常，竞速与路线奖励未计入。":"Route or movement anomalies exclude pace and navigation bonuses.","时间或速度记录存在异常，竞速奖励未计入。":"Timing or speed anomalies exclude the pace bonus.","扣分超过当前得分，最终按零分计算。":"Deductions exceed the current score; the result is zero.","通关记录未满足成绩要求，得分归零。":"The recording does not meet score requirements; the result is zero.","普通成绩按最高分上限结算。":"The ordinary score ceiling applies.",玩家移速:"Player speed",已有地图种子:"Existing map seed","地图种子未发现重复。":"No repeated map seed was found.","地图种子与已有记录重复。":"The map seed matches an earlier run.",异常扣分上限:"Penalty limits",同种子成绩上限:"Repeated seed score cap",地图与运动:"Map and movement",时间与速度:"Timing and speed",生命值与战斗:"Health and combat",实体行为:"Entity behavior",自动化行为:"Automation",地图相似:"Map similarity",路径相似:"Route similarity",检查重复地图种子:"Check repeated map seeds","KOH 比赛":"KOH contest",成绩上传:"Score upload",用途:"Purpose","合计 100；竞速和路线按效率平方加分。":"Weights sum to 100; race and route bonuses use squared efficiency.",按下:"Pressed",短按:"Tapped",松开:"Released","忽略实体与转向耗时，采用可通行导航图的最短路；连续空间贴角路线可能更快。":"Uses the shortest route on the walkable navigation graph, ignoring entities and turn time. Continuous corner-cutting can be faster.","空格播放 / 暂停，左右方向键跳转 5 秒。自由相机：右键按住 + WASD 飞行，Q/E 升降，Shift 加速，滚轮调速；Alt + 左键环绕，鼠标中键平移，F 聚焦。实体第一人称是根据朝向重建的观察视角。":"Space plays or pauses; left/right seek by 5 seconds. Free camera: hold RMB + WASD; Q/E move vertically, Shift boosts speed, scroll adjusts speed; Alt + LMB orbits, MMB pans, F focuses. Entity first person is reconstructed from its orientation.","空格 播放 / 暂停 · ← / → 5 秒":"Space: play / pause · ← / → 5 seconds",操作效率:"Execution efficiency","北方朝上，南方朝下":"North up, south down","正在缓冲…":"Buffering…",竞速基准:"Race reference",理论用时:"Reference time",实际用时:"Actual time",用时倍率:"Time ratio",理论路线长度:"Reference route length",显示暂停时段:"Show pauses",跳过暂停:"Skip pause",已隐藏暂停:"Pauses hidden",操作时段:"Active",全自动审核模式:"Fully automatic review",修改密码:"Change password",当前密码:"Current password",新密码:"New password",确认新密码:"Confirm new password",更新密码:"Update password",密码已更新:"Password updated",重新登录:"Sign in again","14–256 个字符。修改后重新登录。":"14–256 characters. Sign in again after updating.","两次输入的新密码不一致。":"The new passwords do not match.","当前密码不正确。":"The current password is incorrect.","全自动模式：符合条件进入 ranked，其余有效记录进入 unranked。无效文件和处理失败仅后台可见。对新提交与重新评判生效。":"Full automation sends qualifying runs to ranked and other valid records to unranked. Invalid files and processing failures stay private. Applies to new submissions and rejudging.","单指平移 · 双指缩放":"Drag to pan · Pinch to zoom","轻触播放 / 暂停 · 拖动下方进度条":"Tap to play / pause · Drag the timeline to seek","单指旋转 · 双指调整高度":"Drag to orbit · Pinch to adjust height","单指转向 · 双指平移和推拉":"Drag to look · Two fingers to pan and dolly","后退 5 秒":"Back 5 seconds","前进 5 秒":"Forward 5 seconds","显示 HUD":"Show HUD",追逐时段:"Chase",玩家输入:"Player input",步行:"Walking",奔跑:"Running",金币:"Coins",战术:"Tactics",竞速:"Race pace",评判调整:"Judge adjustment",评分权重:"Score weights","合计 100；评判结果另作整体调整。":"Total: 100. Judge results adjust the overall score.","正在评分…":"Scoring…","完成后显示成绩报告。":"Your report will appear when scoring is complete.",输入记录暂不可用:"Input recording is unavailable",访问设置:"Access settings",开放游戏下载:"Enable game downloads",游戏下载暂未开放:"Game downloads are currently closed",提交前确认公开:"Require publication confirmation","记录符合正式成绩要求。":"The production recording check passed.","记录未满足正式成绩要求。":"The production recording check found an issue.","地图记录一致。":"The map consistency check passed.","地图记录存在不一致。":"The map consistency check found an issue.","开局状态正常。":"The initial state check passed.","开局状态存在异常。":"The initial state check found an issue.","出口记录一致。":"The exit record check passed.","出口记录存在异常。":"The exit record check found an issue.","已确认完成通关。":"The completion check passed.","通关过程未能通过确认。":"The completion check found an issue.","时间与状态记录正常。":"The timing and state check passed.","时间或状态记录存在异常。":"The timing and state check found an issue.","行走路线未发现碰撞异常。":"The route and collisions check passed.","行走路线存在需要核实的碰撞异常。":"The route and collisions check found an issue.","操作记录与运动表现一致。":"The input consistency check passed.","操作记录与运动表现存在不一致。":"The input consistency check found an issue.","玩家移动速度正常。":"The player speed check passed.","玩家移动速度存在异常。":"The player speed check found an issue.","玩家运动记录一致。":"The player movement check passed.","玩家运动记录存在异常。":"The player movement check found an issue.","实体移动速度正常。":"The entity speed check passed.","实体移动速度存在异常。":"The entity speed check found an issue.","实体运动记录一致。":"The entity movement check passed.","实体运动记录存在异常。":"The entity movement check found an issue.","实体行为记录一致。":"The entity behavior check passed.","实体行为记录存在异常。":"The entity behavior check found an issue.","攻击与受伤记录一致。":"The combat and damage check passed.","攻击与受伤记录存在不一致。":"The combat and damage check found an issue.","视角变化与游戏过程一致。":"The camera movement check passed.","视角变化存在异常。":"The camera movement check found an issue.","未发现需要复核的自动化行为特征。":"No automation-like patterns requiring review were found.","存在类似自动化操作的特征，需要人工复核。":"Automation-like patterns were found and require human review.","未发现需要复核的相似地图记录。":"The map similarity check passed.","与已有地图记录相似，需要人工复核。":"The map similarity check found an issue.","未发现需要复核的相似路线记录。":"The route similarity check passed.","与已有行走路线相似，需要人工复核。":"The route similarity check found an issue.","通关日期正常。":"The completion date check passed.","通关日期需要进一步核实。":"The completion date check found an issue.","本次未启用此项检查。":"This check was disabled for this run.","记录信息不足，此项暂不作判断。":"There is not enough information to assess this check.","此项检查未能完成，需要进一步复核。":"This check could not be completed and needs review.","此项尚未完成评判。":"This check has not been assessed.","凭证校验未通过，无法评判此记录。":"The proof could not be validated. This run cannot be assessed.",观察对象:"Subject",视角:"Camera",当前状态:"Status",手电筒电量:"Flashlight battery",手电筒与电池:"Flashlight and battery",生存资源与战斗:"Resources and combat","手电筒电量与开关记录一致。":"Battery and flashlight records are consistent.","电量消耗、充电或开关时序存在异常。":"Battery consumption, charging or switching is inconsistent.","电池、攻击、生命值或受伤记录存在不一致。":"Battery, attacks, health or damage records are inconsistent.",手电筒开启:"Flashlight on",手电筒关闭:"Flashlight off",实际经过时间:"Real elapsed time","游戏计时（旧凭证）":"Game time (legacy proof)","游戏计时（现实计时异常）":"Game time (clock anomaly)",暂停时段:"Recorded pause",现实计时一致性:"Clock-source consistency",游戏变速校验:"Game speed verification",回放预览:"Replay preview","仅预览，不提交成绩。":"Preview only. No score is submitted.",上传并预览:"Upload and preview","正在准备回放…":"Preparing replay…",预览其他文件:"Preview another file",重新选择文件:"Choose another file","此预览仅当前浏览器可访问，24 小时内有效。":"This private preview is accessible in this browser for 24 hours.",暂未开放回放预览:"Replay previews are closed",允许独立预览:"Allow private previews",允许成绩上传:"Allow score submissions",游戏介绍:"Game guide",下载:"Download",排行榜:"Leaderboard",提交成绩:"Submit run",游戏下载:"Game downloads",下载游戏:"Download game",第一人称后室终端迷宫:"First-person Backrooms terminal maze","探索随机生成的房间，避开实体，找到出口。":"Explore procedurally generated rooms, avoid entities, and find the exit.","操作、实体与出口。":"Controls, entities, and the exit.","查看成绩与完整回放。":"Browse results and replays.","上传你的通关凭证。":"Upload your victory proof.","HALLS 主菜单背景与标题":"HALLS menu background and title",成绩排行榜:"Leaderboard","已审核的通关成绩与回放。":"Reviewed runs and replays.",正式成绩:"Ranked runs",最快用时:"Best time",最高分:"Best score",正式榜:"Ranked",非排名榜:"Unranked",按得分:"Score",按用时:"Time",最近提交:"Newest",搜索玩家名字:"Search players",搜索:"Search",排名:"Rank",玩家:"Player",平台:"Platform",得分:"Score",参考分:"Reference score",有效用时:"Run time",成绩标签:"Tags",回放:"Replay",查看记录:"View run",这里还没有公开记录:"No published runs yet",没有找到这个名字:"No matching players","只有经过审核、获准展示的成绩才会出现在这里。":"Only reviewed and published runs appear here.",提交第一份记录:"Submit a run",条:"runs",玩家名字:"Player name",输入展示名字:"Enter a display name",拖入通关凭证:"Drop a victory proof here",选择文件:"Choose file","公开我的名字、成绩和回放":"Publish my name, result, and replay",请选择凭证文件:"Choose a proof file",暂未开放提交:"Submissions are closed",网页提交暂未开放:"Web submissions are closed",查看上次提交:"View previous submission","正在查询…":"Checking…","正在计算 SHA-256…":"Calculating SHA-256…","已接收，正在排队":"Received and queued","保留此页面即可查看完整报告。原始凭证不会公开下载。":"The full report will appear here. Original proof files are kept private.",保存查询回执:"Save receipt",保存完整报告:"Save full report",查看公开记录:"View published run",排队中:"Queued",正在评判:"Judging",接收文件:"Receiving",评判完成:"Complete",凭证无效:"Invalid proof",处理未完成:"Processing incomplete",重复记录:"Duplicate",待审核:"Pending review",已通过:"Approved",未通过:"Rejected",通过全部规则:"All checks passed",部分规则通过:"Partially verified",待复核:"Review required",未判定:"Not assessed",未公开:"Private",通过:"Passed",已关闭:"Disabled",样本不足:"Insufficient data",未完成:"Incomplete",无伤脱出:"Unscathed escape",负伤脱出:"Injured escape",经历追逐:"Pursuit encountered",探索型路线:"Exploratory route",路线高效:"Efficient route",疑似自动化:"Suspected automation",数据异常:"Data anomaly",人工复核通过:"Manually verified",相似记录待复核:"Similar run detected",开发演示:"Developer demo",非正式成绩:"Not ranked",返回成绩榜:"Back to leaderboard",完整评判报告:"Full judge report",成绩评价:"Performance",参考评价:"Reference evaluation",回放操作说明:"Replay controls",导出公开报告:"Export public report",通关:"Completion",存活:"Survival",路线:"Navigation",节奏:"Pace",逐项评判:"Checks","全部模拟帧参与评判。行为相似度属于复核线索，不代表作弊概率。":"Every simulation tick is assessed. Behavioral similarity is a review signal, not a cheating probability.","有效用时不含暂停，非现实时间计时赛。地图每局随机，路线难度可能不同。":"Run time excludes pauses. Maps are randomized and route difficulty varies.",管理后台:"Administration",管理控制台:"Administration",管理员账号:"Username",密码:"Password",登录:"Sign in",退出登录:"Sign out",记录审核:"Submissions",自动审核与规则:"Review policy",上传权限:"Upload access",后台上传:"Admin upload",操作日志:"Audit log",全部:"All",已公开:"Published",导入异常:"Import errors",刷新:"Refresh",提交者:"Player","处理 / 审核":"Processing / review",发布:"Visibility","用时 / 得分":"Time / score",操作:"Action",审核:"Review",暂无提交:"No submissions",查看回放:"View replay",审核结论:"Decision",发布到:"Publish to","公开标签（逗号分隔，最多 8 项）":"Public tags (comma-separated, up to 8)",内部审核备注:"Internal review note",保存审核与发布:"Save review",立即下架:"Unpublish",按当前规则重新评判:"Rejudge with current policy",下载完整报告:"Download full report",审核已保存:"Review saved","已下架，回放访问凭据已撤销":"Unpublished; replay tickets revoked",已下架并重新进入评判队列:"Unpublished and queued for rejudging",自动审核与展示:"Automatic review",启用自动审批:"Enable auto-approval",自动通过后立即上架:"Publish auto-approved runs",允许部分检查未完成的成绩自动通过:"Allow partially assessed runs","开启公开 unranked 榜":"Enable the public unranked board","允许的最高 Bot 相似分":"Maximum bot similarity score",自动通过最低得分:"Minimum score for approval","自动通过最长有效用时（秒）":"Maximum run time (seconds)",跨记录与时间:"Cross-run and timestamp checks",检查与已有地图相似度:"Compare existing maps",检查与已有路径相似度:"Compare existing routes","地图相似阈值（%）":"Map similarity threshold (%)","路径相似阈值（%）":"Route similarity threshold (%)","路径分析最小距离（米）":"Minimum route distance (m)",相似命中动作:"Similarity action",人工复核:"Manual review",拒绝:"Reject",检查客户端通关日期:"Check completion timestamp","允许超前服务器时间（秒）":"Allowed clock lead (seconds)","最晚提交期限（天，0 为不限）":"Submission age limit (days, 0 = unlimited)",日期异常动作:"Timestamp action",策略版本:"Policy version",保存当前策略:"Save policy","逐帧 Judge 子项":"Per-tick judge checks",启用此检查:"Enable check",命中动作:"Failure action",策略已保存:"Policy saved",允许公开上传:"Allow public submissions",本站网页上传:"Website submissions","API Key 上传":"API-key submissions",保存设置:"Save settings","生成 API Key":"Create API key",名称:"Name","例如：比赛客户端":"For example: tournament client","生成 Key":"Generate key",操作指南:"API guide",下载指南:"Download guide",创建时间:"Created",最近使用:"Last used",使用次数:"Uses",状态:"Status",可用:"Active",已撤销:"Revoked",撤销:"Revoke","暂无 API Key":"No API keys","仅显示这一次，请保存。":"Shown once. Save it now.","复制 Key":"Copy key",已保存:"Saved",已复制:"Copied","Key 已撤销":"Key revoked",上传并评判:"Upload and judge","最近 100 条操作":"Latest 100 actions",正式玩家录制:"Production recording",地图重生成:"Seed-to-map reconstruction",出生状态:"Spawn state",真实出口:"Canonical exit",通关完整性:"Completion integrity",时间与状态范围:"Clock and state bounds",路线与碰撞:"Route and collisions",输入约束:"Input constraints",玩家速度:"Player speed",玩家运动复算:"Player simulation",实体速度:"Entity speed",实体寻路与运动:"Entity navigation",实体感知与仇恨:"Entity perception and aggression",攻击与伤害:"Combat and damage",视角一致性:"Camera consistency","Bot 行为相似度":"Bot-like behavior",已有地图相似度:"Map similarity",已有路径相似度:"Route similarity",通关时间戳:"Completion timestamp","macOS 13 及以上":"macOS 13 or later","Windows 10 / 11 · 64 位":"Windows 10 / 11 · 64-bit","通用版 · Apple Silicon / Intel":"Universal · Apple Silicon / Intel","载入中…":"Loading…",暂时无法打开:"Unable to load",返回首页:"Back home","账号或密码不正确。":"Incorrect username or password.","此凭证已提交，不能重复上传。":"This proof has already been submitted.","此记录暂不支持安全回放。":"This run cannot be replayed safely.",俯视全图:"Map",第一人称:"First person",第三人称:"Third person",自由视角:"Free camera",跟随对象:"Follow subject",剖视:"Cutaway",重置:"Reset",放大预览:"Full screen",退出全屏:"Exit full screen",播放:"Play",暂停:"Pause",速度:"Speed",完整轨迹:"Route",当前玩家:"Player",实体:"Entities",游荡:"Roaming",调查:"Investigating",追逐:"Chasing",通关记录:"Run",有效记录时长:"Run time",地图:"Map",回放说明:"Replay details","上一 tick":"Previous sample","下一 tick":"Next sample",恢复当前视角:"Reset view",回放时间轴:"Replay timeline",完整地图与轨迹:"Map and route",三维回放画面:"3D replay","空格 播放 / 暂停":"Space: play / pause","正在载入回放…":"Loading replay…","玩家记录视角 / 实体朝向重建 · 拖动时间轴定位":"Recorded player view / reconstructed entity view · Seek with the timeline","拖动旋转跟随视角 · 滚轮调整高度":"Drag to orbit · Scroll to adjust height","滚轮缩放 · 拖动平移 · 双击定位自由视角":"Scroll to zoom · Drag to pan · Double-click for free view","右键 + WASD 飞行 · Q/E 升降 · Shift 加速 · 滚轮调速 · Alt 左键环绕 · 中键平移 · F 聚焦":"RMB + WASD · Q/E vertical · Shift boost · Scroll speed · Alt + LMB orbit · MMB pan · F focus","这里的成绩不参与正式排名。疑点标签并不等于确认作弊；仅展示管理员主动公开的记录。":"These runs are unranked. Suspicion tags are not proof of cheating; records are published manually."},Wu=new WeakMap,Xu=new WeakMap;function Yu(n){let e=n.trim();if(Po[e])return n.replace(e,Po[e]);let t=n;for(let[i,s]of Object.entries(Po))i.length>3&&t===i&&(t=s);return t=t.replace(/^磁盘 /,"Disk ").replace(/ · 可用 /," · Free ").replace(/^(实体) (E\d+)/,"Entity $2").replace(/^通关于 /,"Completed ").replace(/^通关 /,"Completed ").replace(/^上传 /,"Uploaded ").replace(/(\d+) 条记录/g,"$1 records").replace(/^审核 /,"Review ").replace(/^仇恨 /,"Aggression ").replace(/检查 (\d+) 项 · 发现 (\d+) 项疑点/,"$1 checks · $2 findings").replace(/正式玩家录制/g,"Production recording"),t.includes(" · ")&&t===n&&(t=t.split(" · ").map(i=>Po[i]||i).join(" · ")),t}function Y0(n){return n.parentElement?.closest("script,style,pre,code,textarea,[data-no-i18n],.name,.user-content")}function dc(n){if(Y0(n))return;let e=Wu.get(n);(!e||n.nodeValue!==e.output)&&(e={original:n.nodeValue,output:n.nodeValue});let t=gn()==="en"?Yu(e.original):e.original;t!==n.nodeValue&&(n.nodeValue=t),e.output=t,Wu.set(n,e)}function qu(n){if(n.closest("[data-no-i18n],.user-content"))return;let e=Xu.get(n)||{};for(let t of["placeholder","title","aria-label","alt"]){if(!n.hasAttribute(t))continue;let i=n.getAttribute(t),s=e[t];(!s||i!==s.output)&&(e[t]={original:i,output:i});let r=e[t],a=gn()==="en"?Yu(r.original):r.original;a!==i&&n.setAttribute(t,a),r.output=a}Xu.set(n,e)}function Zu(n){if(n.nodeType===Node.TEXT_NODE){dc(n);return}if(n.nodeType!==Node.ELEMENT_NODE&&n!==document.body)return;qu(n);let e=document.createTreeWalker(n,NodeFilter.SHOW_TEXT),t;for(;t=e.nextNode();)dc(t);for(let i of n.querySelectorAll("[placeholder],[title],[aria-label],[alt]"))qu(i)}function fc(){document.documentElement.lang=gn()==="en"?"en":"zh-CN",Zu(document.body);let n=document.querySelector("#language");n&&(n.textContent=gn()==="en"?"中文":"EN",n.setAttribute("aria-label",gn()==="en"?"Switch to Chinese":"切换为英文"));for(let e of document.querySelectorAll("iframe"))e.contentWindow?.postMessage({type:"halls-language"},location.origin)}var Z0=new MutationObserver(n=>{for(let e of n)if(e.type==="characterData")dc(e.target);else for(let t of e.addedNodes)Zu(t)});Z0.observe(document.body,{subtree:!0,childList:!0,characterData:!0});window.addEventListener("message",n=>{n.origin===location.origin&&n.data?.type==="halls-language"&&fc()});document.querySelector("#language")?.addEventListener("click",()=>{localStorage.setItem("halls-language",gn()==="en"?"zh":"en"),fc(),window.dispatchEvent(new Event("halls-language"))});fc();var Do=(n,e,t)=>n+(e-n)*t,ju=n=>((n+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI;function pr(n,e,t,i,s=.18){let r=1,a=Math.hypot(e.x-n.x,e.y-n.y,e.z-n.z);for(let o=Math.floor((Math.min(n.z,e.z)-s)/2);o<=Math.floor((Math.max(n.z,e.z)+s)/2);o++)for(let l=Math.floor((Math.min(n.x,e.x)-s)/2);l<=Math.floor((Math.max(n.x,e.x)+s)/2);l++){if(!t(l,o))continue;let c=0,h=1;for(let[u,d,f,m]of[[n.x,e.x-n.x,l*2-s,(l+1)*2+s],[n.y,e.y-n.y,-s,i+s],[n.z,e.z-n.z,o*2-s,(o+1)*2+s]])if(Math.abs(d)<1e-9){if(u<f||u>m){c=1,h=0;break}}else{let _=(f-u)/d,g=(m-u)/d;c=Math.max(c,Math.min(_,g)),h=Math.min(h,Math.max(_,g))}c<=h&&(r=Math.min(r,Math.max(0,c-.025/Math.max(a,1e-9))))}return r}function mc(n,e,t,i=.22){return pr(n,n,e,t,Math.max(.18,i-.003))<1}var Hn=(n,e)=>Math.hypot(n.x-e.x,n.y-e.y,n.z-e.z),Bi=(n,e,t)=>({x:Do(n.x,e.x,t),y:Do(n.y,e.y,t),z:Do(n.z,e.z,t)}),pc=(n,e,t,i=3.2)=>({x:n.x-Math.sin(e)*i,y:t,z:n.z-Math.cos(e)*i}),Oi=(n,e,t,i)=>pr(n,e,t,i)>.9999;function $0(n,e,t,i,s){let r=pc(e,n.angle,n.height),a=Oi(e,r,t,i);if(n.freeTime=a?(n.freeTime||0)+s:0,a&&(n.avoidAngle==null||n.freeTime>.25))return n.avoidAngle=null,r;let o=n.position||r,l=[n.angle];n.avoidAngle!=null&&l.push(n.avoidAngle);for(let u of[15,30,45,60,80,100,130,160,180])for(let d of[-1,1])l.push(n.angle+u*d*Math.PI/180);let c=null,h=1/0;for(let u of l){let d=pc(e,u,n.height),f=pr(e,d,t,i),m=Bi(e,d,f),_=3.2*f,g=n.avoidAngle==null?0:Math.abs(ju(u-n.avoidAngle))*.25,p=Hn(m,r)**2*.22+Hn(m,o)**2*.4+(3.2-_)**2*4+g;p<h&&(h=p,c=m,n.nextAngle=u)}return n.avoidAngle=n.nextAngle,c}function $u(n,e,t,i){if(Oi(n,e,t,i))return e;let s=d=>[Math.floor(d.x/2),Math.floor(d.z/2)],r=s(n),a=s(e),o=(d,f)=>d+","+f;if(t(...r)||t(...a))return e;let l=[r],c=new Map([[o(...r),null]]),h=!1;for(let d=0;d<l.length&&d<100;d++){let[f,m]=l[d];if(f===a[0]&&m===a[1]){h=!0;break}for(let[_,g]of[[1,0],[0,1],[-1,0],[0,-1]]){let p=f+_,E=m+g,w=o(p,E);Math.abs(p-r[0])>5||Math.abs(E-r[1])>5||t(p,E)||c.has(w)||(c.set(w,[f,m]),l.push([p,E]))}}if(!h)return e;let u=[e];for(let d=a;d;d=c.get(o(...d)))u.push({x:d[0]*2+1,y:e.y,z:d[1]*2+1});for(let d of u)if(Oi(n,d,t,i))return d;return e}function Ju(n,e,t,i){let s=Bi(n,e,pr(n,e,t,i)),r=s;for(let a of[["x","z","y"],["z","x","y"]]){let o={...s};for(let l of a){let c={...o,[l]:e[l]};o=Bi(o,c,pr(o,c,t,i))}Hn(o,e)<Hn(r,e)&&(r=o)}return r}function J0(n,e){let t=n,i=1/0,s=Math.floor(n.x/2),r=Math.floor(n.z/2);for(let a=-1;a<=1;a++)for(let o=-1;o<=1;o++){let l=s+o,c=r+a;if(e(l,c))continue;let h={x:Math.max(l*2+.22,Math.min(l*2+1.78,n.x)),y:n.y,z:Math.max(c*2+.22,Math.min(c*2+1.78,n.z))},u=Hn(h,n);u<i&&(i=u,t=h)}return t}function Ku(n,{focus:e,yaw:t,height:i,ceiling:s=2.65,cutaway:r=!1,targetRadius:a=.22,allowNoclip:o=!0,isWall:l,dt:c}){c=Math.max(0,Math.min(.1,c)),i=Math.max(.4,Math.min(r?12:s-.2,i));let h=!n||n.cutaway!==r,u=h?{angle:t,height:i,distance:3.2,freeTime:0}:{...n};h||(u.angle+=ju(t-u.angle)*(1-Math.exp(-20*c)),u.height=Do(u.height,i,1-Math.exp(-16*c))),r||(u.height=Math.min(u.height,s-.2));let d=pc(e,u.angle,u.height),f=mc(e,l,s,a);if(f&&o&&(u.penetrationSeen=!0),f&&u.penetrationSeen&&(u.noclip=!0,u.noclipClearTime=0),u.noclip){let g=!f&&Oi(e,d,l,s)&&(!u.position||Oi(u.position,u.position,l,s));u.noclipClearTime=g?(u.noclipClearTime||0)+c:0,u.noclipClearTime>=.2&&(u.noclip=!1,u.freeTime=0,u.avoidAngle=null)}let m=f?u.anchor||J0(e,l):e;f||(u.anchor={...e});let _=u.noclip?d:$0(u,m,l,s,c);if(u.noclip){let g=h?d:{x:u.position.x+e.x-n.focus.x,y:u.position.y+e.y-n.focus.y,z:u.position.z+e.z-n.focus.z},p=Hn(g,d);u.position=Bi(g,d,h?1:Math.min(1-Math.exp(-16*c),4.8*c/Math.max(p,1e-9)))}else if(h||!Oi(u.position,u.position,l,s))u.position=_;else{let g=Hn(e,n.focus),p=Math.max(0,g-5*c),E=p/Math.max(g,1e-9),w={x:u.position.x+(e.x-n.focus.x)*E,y:u.position.y+(e.y-n.focus.y)*E,z:u.position.z+(e.z-n.focus.z)*E};if(Oi(u.position,w,l,s))u.position=w;else{let P=$u(u.position,_,l,s),U=Hn(u.position,P);u.position=Ju(u.position,Bi(u.position,P,Math.min(1,p/Math.max(U,1e-9))),l,s)}let v=$u(u.position,_,l,s),T=Hn(u.position,v),R=u.avoidAngle==null?14:28;u.position=Ju(u.position,Bi(u.position,v,Math.min(1-Math.exp(-R*c),16*c/Math.max(T,1e-9))),l,s)}return u.distance=Math.hypot(u.position.x-e.x,u.position.z-e.z),u.focus={...e},u.cutaway=r,u}function Qu(n,e){let t=Math.max(0,Math.min(1,Number.isFinite(e.dt)?e.dt:0));if(!n||e.cut)return Ku(null,{...e,dt:t});let i=Math.max(1,Math.ceil(t*60)),s=n.focus,r=n;for(let a=1;a<=i;a++)r=Ku(r,{...e,focus:Bi(s,e.focus,a/i),dt:t/i});return r}var K0="attribute float illumination;attribute float surface;attribute vec2 lightUv;varying vec2 vLightUv;varying vec2 vUV;varying vec3 vWorld;varying vec3 vN;varying float vLight;varying float vKind;void main(){vLightUv=lightUv;vUV=uv;vWorld=(modelMatrix*vec4(position,1.)).xyz;vN=normalize(mat3(modelMatrix)*normal);vLight=illumination;vKind=surface;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",ed=`
uniform sampler2D wallMap;uniform vec3 torchPosition;uniform vec3 torchDirection;uniform float torchOn;
float solid(vec2 cell){if(any(lessThan(cell,vec2(0.)))||any(greaterThanEqual(cell,vec2(256.))))return 1.;return texture2D(wallMap,(cell+.5)/256.).r;}
float torchVisible(vec3 target){
 vec2 a=torchPosition.xz*vec2(.5,-.5),b=target.xz*vec2(.5,-.5),d=b-a;
 a+=d*.00001;vec2 cell=floor(a),stepDir=mix(vec2(-1.),vec2(1.),step(vec2(0.),d)),delta=1./max(abs(d),vec2(.00000001));
 vec2 next=(cell+step(vec2(0.),d)-a)*stepDir*delta;
 for(int i=0;i<32;i++){
  if(solid(cell)>.5)return 0.;if(min(next.x,next.y)>=.99999)return 1.;
  if(abs(next.x-next.y)<.000001){if(solid(cell+vec2(stepDir.x,0.))>.5||solid(cell+vec2(0.,stepDir.y))>.5)return 0.;cell+=stepDir;next+=delta;}
  else if(next.x<next.y){cell.x+=stepDir.x;next.x+=delta.x;}else{cell.y+=stepDir.y;next.y+=delta.y;}
 }return 0.;
}
float torchLight(vec3 at,vec3 normal){
 if(torchOn<.5)return 0.;vec3 delta=at-torchPosition;float d2=dot(delta,delta);if(d2>=196.)return 0.;
 vec3 ray=delta*inversesqrt(max(d2,.000001));float cone=clamp((dot(ray,torchDirection)-.79)/.17,0.,1.);float facing=max(dot(-ray,normalize(normal)),0.);
 if(cone*facing<=0.)return 0.;return 1.8*cone*cone*facing*(1.-smoothstep(100.,196.,d2))*torchVisible(at+normal*.025)/(1.+d2*.12);
}`,j0=`
${ed}
uniform float brightness;uniform sampler2D lightMap;uniform vec2 lightMapSize;uniform vec2 exitCell;uniform vec3 exitColor;varying vec2 vLightUv;
varying vec2 vUV;varying vec3 vWorld;varying vec3 vN;varying float vLight;varying float vKind;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
void main(){
 vec2 uv=vUV;vec3 base;float light=vLightUv.x<0.?vLight:texture2D(lightMap,vLightUv/lightMapSize).r*1.9921875;
 float fine=1.-smoothstep(.06,.3,length(fwidth(uv)));float grain=(noise(uv*160.)-.5)*.035*fine;
 if(vKind<.5){
  vec2 p=fract(uv*5.)-.5;float edge=abs(abs(p.x)+abs(p.y)-.31);float aa=max(fwidth(edge),.005);float pattern=1.-smoothstep(.045-aa,.055+aa,edge);
  float stain=max(sin(uv.x*.61+.3)*sin(uv.y*1.9),0.);float dirt=1.-.22*stain-.17*clamp(1.-uv.y/.55,0.,1.);
  float trim=clamp((.12-uv.y)/max(fwidth(uv.y),.000001)+.5,0.,1.);base=mix((vec3(.64,.48,.19)+grain)*(1.-.24*pattern)*dirt,vec3(.025,.029,.031),trim);
 }else if(vKind<1.5){
  float fiber=(noise(uv*120.)-.5)*.045*fine;float damp=max(sin(uv.x*.71)*sin(uv.y*.83+1.),0.);
  base=(vec3(.16,.115,.058)+vec3(fiber,fiber*.8,fiber*.5))*(1.-.36*damp);
  if(all(equal(floor(vec2(vWorld.x,-vWorld.z)*.5),exitCell))){base=exitColor;light=1.;}
 }else if(vKind<2.5){
  vec2 p=mod(uv,.6);float seam=min(min(p.x,.6-p.x),min(p.y,.6-p.y));float aa=max(length(fwidth(uv)),.001);
  float panel=smoothstep(.006-aa,.016+aa,seam);float stain=.035*max(sin(uv.x*1.1)*sin(uv.y*.73),0.);
  base=(vec3(.43,.40,.29)+grain-stain)*mix(.42,1.,panel);
 }else if(vKind<4.5){base=vec3(.045,.65,.085);light=1.;}
 else if(vKind<5.5){base=vec3(.12,.13,.105);}
 else if(vKind<6.5){float tube=1.-smoothstep(.08,.105,min(abs(uv.y-.28),abs(uv.y-.72)));base=mix(vec3(.27,.28,.22),vec3(1.2,1.15,1.02),tube);light=1.;}
 else{base=vec3(.46,.38,.23)+grain;light=.85;}
 if(vKind<3.5){if(dot(vN,cameraPosition-vWorld)<0.)light=.025;else light+=torchLight(vWorld,vN);}
 float dist=distance(cameraPosition,vWorld);float fog=1.-exp(-dist*.055);vec3 result=mix(base*light*1.05*brightness,vec3(.012,.009,.004),fog);
 gl_FragColor=vec4(result,1.);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}`;function Q0(n,e,t,i=2){let s=Math.floor(e[0]/i),r=Math.floor(e[2]/i),a=e[0]-s*i<1e-4,o=e[2]-r*i<1e-4;if(n(s,r)||a&&n(s-1,r)||o&&n(s,r-1)||a&&o&&n(s-1,r-1))return!1;let l=t[0]-e[0],c=t[2]-e[2],h=Math.floor((e[0]+l*1e-5)/i),u=Math.floor((e[2]+c*1e-5)/i),d=l>0?1:-1,f=c>0?1:-1,m=Math.abs(l)<1e-6?1/0:i/Math.abs(l),_=Math.abs(c)<1e-6?1/0:i/Math.abs(c),g=Number.isFinite(m)?((h+(d>0?1:0))*i-e[0])/l:1/0,p=Number.isFinite(_)?((u+(f>0?1:0))*i-e[2])/c:1/0;for(;;){if(n(h,u))return!1;if(Math.min(g,p)>=.99999)return!0;if(Math.abs(g-p)<1e-6){if(n(h+d,u)||n(h,u+f))return!1;h+=d,u+=f,g+=m,p+=_}else g<p?(h+=d,g+=m):(u+=f,p+=_)}}function ex(n,e,t,i=!1,s=!1){return(n+2*e)%4===0||n===t[0]&&e===t[1]||s&&i}var Lo=class{constructor(e,t,i){this.renderer=e,this.meta=t,this.wall=i,this.scene=new Ys,this.scene.background=new Ke().setRGB(.012,.009,.004),this.scene.fog=new qs(2038546,.026),this.roof=new Lt,this.scene.add(this.roof),this.wallCaps=new Lt,this.wallCaps.visible=!1,this.scene.add(this.wallCaps),this.lamps=new Array(65536),this.fixtures=[],this.patches=[],this.floorPatches=new Int32Array(65536).fill(-1),this.disposed=!1;let s=t.spawnPosition.map(o=>Math.floor(o/t.tile)),r=t.lampBits;for(let o=0;o<256;o++)for(let l=0;l<256;l++){if(i(l,o))continue;let c=!!(r[o*256+l>>3]&1<<(o*256+l&7));if(!ex(l,o,s,c,t.terrainLighting))continue;let h=[(l+.5)*2,t.ceiling-.15,(o+.5)*2];this.fixtures.push({x:l,z:o,at:h,active:c}),c&&(this.lamps[o*256+l]=h)}let a=new Uint8Array(65536);for(let o=0;o<256;o++)for(let l=0;l<256;l++)a[o*256+l]=i(l,o)?255:0;this.wallTexture=new hs(a,256,256,xs),this.wallTexture.needsUpdate=!0,this.lightTexture=new hs(new Uint8Array(1),1,1,xs),this.lightTexture.magFilter=qt,this.lightTexture.minFilter=qt,this.lightTexture.needsUpdate=!0,this.uniforms={torchPosition:{value:new B},torchDirection:{value:new B(0,0,-1)},torchOn:{value:1},brightness:{value:1},wallMap:{value:this.wallTexture},lightMap:{value:this.lightTexture},lightMapSize:{value:new Ze(2e3,1)},exitCell:{value:new Ze(...t.exit)},exitColor:{value:new Ke().setRGB(.045,.65,.085)}},this.material=new Zt({vertexShader:K0,fragmentShader:j0,uniforms:this.uniforms,side:wt})}setExit(e,t=!1){this.uniforms.exitCell.value.set(...e),this.uniforms.exitColor.value.setRGB(...t?[.9,.28,.09]:[.045,.65,.085])}visible(e,t){return Q0(this.wall,e,t,this.meta.tile)}illumination(e,t){let i=e.map((o,l)=>o+t[l]*.025),s=Math.floor(i[0]/2),r=Math.floor(i[2]/2),a=.025+.015*(t[1]*.5+.5);for(let o=Math.max(0,r-4);o<=Math.min(255,r+4);o++)for(let l=Math.max(0,s-4);l<=Math.min(255,s+4);l++){let c=this.lamps[o*256+l];if(!c)continue;let h=c[0]-i[0],u=c[1]-i[1],d=c[2]-i[2],f=h*h+u*u+d*d;if(f>49)continue;let m=Math.max(0,(t[0]*h+t[1]*u+t[2]*d)/Math.sqrt(f));if(this.visible(i,c)){let _=Math.max(0,1-f/49);a+=2.7*(.12+.88*m)*_*_/(1+f*.35)}}return Math.min(a,1.6)}actorMaterial(){return new Zt({side:wt,uniforms:{...this.uniforms,actorAmbient:{value:.04}},vertexShader:"varying vec3 vWorld;varying vec3 vN;void main(){vWorld=(modelMatrix*vec4(position,1.)).xyz;vN=normalize(mat3(modelMatrix)*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",fragmentShader:`${ed}
 uniform float actorAmbient;varying vec3 vWorld;varying vec3 vN;
 void main(){float beam=torchLight(vWorld,vN);float light=actorAmbient*(.75+.25*max(vN.y,0.))+beam;vec3 base=vec3(.009,.011,.009)*light;if(beam>0.)base+=vec3(.01*beam*pow(max(dot(normalize(torchPosition-vWorld),vN),0.),20.));float dist=distance(cameraPosition,vWorld);gl_FragColor=vec4(mix(base,vec3(.012,.009,.004),1.-exp(-dist*.055)),1.);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
 }`})}probe(e,t){let i=Math.floor(e/2),s=Math.floor(t/2);if(i<0||s<0||i>=256||s>=256)return .035;let r=this.floorPatches[s*256+i];if(r<0)return .035;let a=Math.min(4,Math.max(0,(e-i*2)*2)),o=Math.min(4,Math.max(0,(t-s*2)*2)),l=Math.min(3,Math.floor(a)),c=Math.min(3,Math.floor(o)),h=(Math.floor(r/400)*5+c)*2e3+r%400*5+l,u=this.lightTexture.image.data,d=a-l,f=o-c;return((u[h]+(u[h+1]-u[h])*d)*(1-f)+(u[h+2e3]+(u[h+2001]-u[h+2e3])*d)*f)/128}bucket(){return{positions:[],normals:[],uv:[],light:[],kind:[],lightUv:[]}}quad(e,t,i,s){let r=new B(...t[1]).sub(new B(...t[0])),a=new B(...t[2]).sub(new B(...t[0])),o=r.cross(a).normalize().toArray(),l=-1;if(s<=2){l=this.patches.length;let h=new Uint8Array(25),u=i[1][0]===i[0][0];for(let d=0;d<5;d++)for(let f=0;f<5;f++){let m=(u?d:f)/4,_=(u?f:d)/4,g=t[0].map((p,E)=>(t[0][E]*(1-m)+t[1][E]*m)*(1-_)+(t[3][E]*(1-m)+t[2][E]*m)*_);h[d*5+f]=Math.round(this.illumination(g,o)*128)}this.patches.push(h),s===1&&(this.floorPatches[Math.floor(t[0][2]/2)*256+Math.floor(t[0][0]/2)]=l)}let c=t.map(h=>s===4||s===6||s===7?1:this.illumination(h,o));for(let h of[0,1,2,0,2,3])e.positions.push(t[h][0],t[h][1],-t[h][2]),e.normals.push(o[0],o[1],-o[2]),e.uv.push(...i[h]),e.light.push(c[h]),e.kind.push(s),e.lightUv.push(...l<0?[-1,-1]:[l%400*5+.5+(i[h][0]-i[0][0])*4/(i[2][0]-i[0][0]||1),Math.floor(l/400)*5+.5+(i[h][1]-i[0][1])*4/(i[2][1]-i[0][1]||1)])}wallFace(e,t){this.quad(e,t,t.map(i=>[i[0]+i[2],i[1]]),0)}attach(e,t){if(!e.positions.length)return;let i=new gt;for(let[s,r,a]of[["position",e.positions,3],["normal",e.normals,3],["uv",e.uv,2],["illumination",e.light,1],["surface",e.kind,1],["lightUv",e.lightUv,2]])i.setAttribute(s,new lt(r,a));i.computeBoundingSphere(),t.add(new st(i,this.material))}async build(e=()=>{},t=()=>!1){let i=this.meta.ceiling,s=0,r=[],[a,o]=this.meta.spawnPosition;for(let d=0;d<256;d+=16)for(let f=0;f<256;f+=16)r.push([f,d]);r.sort((d,f)=>Math.hypot(d[0]*2-a,d[1]*2-o)-Math.hypot(f[0]*2-a,f[1]*2-o));for(let[d,f]of r){if(t())return;let m=this.bucket(),_=this.bucket(),g=this.bucket();for(let p=f;p<f+16;p++)for(let E=d;E<d+16;E++){let w=E*2,v=p*2,T=w+2,R=v+2;if(this.wall(E,p)){this.quad(g,[[w,i,v],[w,i,R],[T,i,R],[T,i,v]],[[w,v],[w,R],[T,R],[T,v]],7);continue}this.quad(m,[[w,0,v],[w,0,R],[T,0,R],[T,0,v]],[[w,v],[w,R],[T,R],[T,v]],1),this.quad(_,[[w,i,v],[T,i,v],[T,i,R],[w,i,R]],[[w,v],[T,v],[T,R],[w,R]],2),this.wall(E,p-1)&&this.wallFace(m,[[w,0,v],[T,0,v],[T,i,v],[w,i,v]]),this.wall(E+1,p)&&this.wallFace(m,[[T,0,v],[T,0,R],[T,i,R],[T,i,v]]),this.wall(E,p+1)&&this.wallFace(m,[[T,0,R],[w,0,R],[w,i,R],[T,i,R]]),this.wall(E-1,p)&&this.wallFace(m,[[w,0,R],[w,0,v],[w,i,v],[w,i,R]])}this.attach(m,this.scene),this.attach(_,this.roof),this.attach(g,this.wallCaps),++s%8===0&&(e(Math.round(s/256*100)),await new Promise(p=>requestAnimationFrame(p)))}if(t())return;let l=this.bucket();for(let d of this.fixtures){let f=d.at[0],m=d.at[2],_=i-.015;this.quad(l,[[f-.59,_+.005,m-.31],[f+.59,_+.005,m-.31],[f+.59,_+.005,m+.31],[f-.59,_+.005,m+.31]],[[0,0],[1,0],[1,1],[0,1]],5),this.quad(l,[[f-.55,_,m-.27],[f+.55,_,m-.27],[f+.55,_,m+.27],[f-.55,_,m+.27]],[[0,0],[1,0],[1,1],[0,1]],d.active?6:5)}this.attach(l,this.roof);let c=2e3,h=Math.max(5,Math.ceil(this.patches.length/400)*5),u=new Uint8Array(c*h);this.patches.forEach((d,f)=>{for(let m=0;m<5;m++)u.set(d.subarray(m*5,m*5+5),(Math.floor(f/400)*5+m)*c+f%400*5)}),this.patches=[],this.lightTexture.image={data:u,width:c,height:h},this.lightTexture.needsUpdate=!0,this.uniforms.lightMapSize.value.set(c,h),e(100)}update(e,t,i,s,r,a){this.roof.visible=!a,this.wallCaps.visible=a,this.uniforms.torchPosition.value.set(t.x,t.y,-t.z),this.uniforms.torchDirection.value.set(Math.sin(i)*Math.cos(s),Math.sin(s),-Math.cos(i)*Math.cos(s)),this.uniforms.torchOn.value=r?1:0}dispose(){this.disposed=!0;let e=new Set;this.scene.traverse(t=>{if(t.geometry?.dispose(),t.material)for(let i of[].concat(t.material))e.add(i)});for(let t of e)t.dispose();this.lightTexture.dispose(),this.wallTexture.dispose(),this.patches=[]}};function td(n,e){let t=e.length/144,i=t*16;if(!Number.isInteger(t))throw Error("Invalid procedural tube topology");if(n.getAttribute("position")?.count!==i){n.dispose(),n.setAttribute("position",new Dt(new Float32Array(i*3),3).setUsage(lr)),n.setAttribute("normal",new Dt(new Float32Array(i*3),3).setUsage(lr));let a=new Uint32Array(t*48);for(let o=0;o<t;o++)for(let l=0;l<8;l++){let c=o*16,h=c+l,u=c+(l+1)%8;a.set([h,u,u+8,h,u+8,h+8],o*48+l*6)}n.setIndex(new Dt(a,1))}let s=n.getAttribute("position"),r=s.array;for(let a=0;a<t;a++)for(let o=0;o<8;o++)for(let l=0;l<3;l++){let c=a*144+o*18;r[a*48+o*3+l]=e[c+l],r[a*48+24+o*3+l]=e[c+15+l]}return s.needsUpdate=!0,n.computeVertexNormals(),n.computeBoundingSphere(),n.setDrawRange(0,t*48),n}function Uo(n,e){let t=n.getAttribute("position");return(!t||t.array.length<e.length)&&(n.dispose(),t=new Dt(new Float32Array(Math.max(e.length,1296)),3).setUsage(lr),n.setAttribute("position",t)),t.array.fill(0),t.array.set(e),t.needsUpdate=!0,n.setDrawRange(0,e.length/3),n.computeBoundingSphere(),n}var tx=[["envelope","文件封装"],["authentication","解密认证"],["compression","压缩数据"],["signature","客户端签名"],["format","数据格式"]];function nd(n,e){let t=document.createElement("div");t.className="import-checks";for(let[i,s]of tx){let r=document.createElement("div"),a=e?.[i]||"not_run";r.className=a;let o=document.createElement("span");o.textContent=a==="passed"?"✓":a==="failed"?"×":"—",r.append(o,document.createTextNode(s+(a==="not_run"?" · 未执行":""))),t.append(r)}n.append(t)}function id(n=window){if(n.parent!==n||!n.navigator.serviceWorker)return Promise.resolve();let e=n.navigator.serviceWorker,t=e.controller,i=!1;return e.addEventListener("controllerchange",()=>{let s=e.controller;if(!t){t=s;return}s&&s!==t&&!i&&(i=!0,n.location.reload())}),e.getRegistration("/").then(s=>s?s.update():e.register("/sw.js",{updateViaCache:"none"})).catch(()=>{})}var mr=Array.isArray,ie=(n,e)=>mr(n)?[n[0]+e[0],n[1]+e[1],n[2]+e[2]]:n+e,ct=(n,e)=>mr(n)?[n[0]-e[0],n[1]-e[1],n[2]-e[2]]:n-e,N=(n,e)=>mr(n)?[n[0]*e,n[1]*e,n[2]*e]:n*e,vt=(n,e)=>mr(n)?[n[0]/e,n[1]/e,n[2]/e]:n/e,Ct=n=>mr(n)?[-n[0],-n[1],-n[2]]:-n,$e=(n,e,t)=>[n,e,t],ki=(n,e)=>n[0]*e[0]+n[1]*e[1]+n[2]*e[2],No=(n,e)=>[n[1]*e[2]-n[2]*e[1],n[2]*e[0]-n[0]*e[2],n[0]*e[1]-n[1]*e[0]],gc=(n,e)=>(n%e+e)%e;function sd(){let n=Array.from({length:19},()=>[0,0,0]),e=[],t=[],i=(D,V,q,z,oe)=>{for(let te of[V,q,z,V,z,oe])D.push(te[0],te[1],-te[2])},s=(D,V,q,z)=>i(e,D,V,q,z),r=(D,V,q,z)=>i(t,D,V,q,z),a,o,l,c,h,u,d,f,m,_,g,p,E,w,v,T,R,P,U,S,b,I,k,X,Y,K,$,ne,Z,de,xe,Ce,ke,Me,Ae,De,G,J,ge,Le,be,qe;function It(D,V,q,z){let oe,te,pe,he,j,se,Ee,ye,ue,Ve,L,re,ce,Se,ae,Q,ve,He,tt;for(oe=Math.min(Math.max(N(V,3),0),1),ye=N(vt(D,N(1.15,Math.max(z,.1))),N(Math.PI,2)),he=ct(.4,q),j=0,0<q&&(he<.06?j=N(Ct(.12),A(vt(he,.06))):he<.1?j=ie(Ct(.12),N(.5,A(vt(ct(he,.06),.04)))):j=N(.38,ct(1,A(vt(ct(he,.1),.3))))),te=N(N(Math.cos(N(ye,2)),.035),oe),n[0]=$e(N(N(Math.sin(ye),.035),oe),ie(1.28,te),0),n[1]=$e(N(N(Ct(Math.sin(ye)),.04),oe),ie(2.32,te),ie(N(.08,oe),j)),n[2]=ie(n[1],$e(.02,.31,.05)),n[3]=ie(n[2],$e(Ct(.04),.32,.035)),se=0;se<2;se++)re=se===0?Ct(1):1,pe=gc(ie(vt(D,N(1.15,Math.max(z,.1))),N(se,.5)),1),ce=N(1.15,.62),pe<.62?(tt=ct(N(ce,.5),N(vt(pe,.62),ce)),Ee=0):(Q=vt(ct(pe,.62),.38),tt=ie(N(Ct(ce),.5),N(ce,A(Q))),Ee=N(Math.sin(N(Math.PI,Q)),.19)),ve=$e(N(re,.22),ie(.035,N(Ee,oe)),N(tt,oe)),Ve=ie(n[0],$e(N(re,.13),0,0)),n[ie(4,N(se,3))]=Ve,n[ie(5,N(se,3))]=Re(Ve,ve,.77,.75,$e(N(re,.07),0,1)),n[ie(6,N(se,3))]=ve,L=ie(n[1],$e(N(re,.31),.09,0)),ae=N(N(Ct(Math.sin(ie(ye,N(se,Math.PI)))),.26),oe),ue=$e(N(re,ie(.48,N(.03,se))),ie(.58,te),ct(ae,.025)),He=$e(N(re,.51),2.05,ct(j,.47)),Se=$e(N(re,.1),se===0?1.95:2.16,se===0?.85:1.18),ve=ue,0<q&&(he<.06?ve=at(ue,He,A(vt(he,.06))):he<.1?ve=at(He,Se,A(vt(ct(he,.06),.04))):ve=at(Se,ue,A(vt(ct(he,.1),.3)))),n[ie(10,N(se,3))]=L,n[ie(11,N(se,3))]=Re(L,ve,1,1.03,$e(re,.05,Ct(.35))),n[ie(12,N(se,3))]=ve}function C(D){let V,q,z,oe;return q=ki(D,$e(1,0,0)),z=ki(D,$e(0,1,0)),oe=ki(D,$e(0,0,1)),V=N(Y,Math.pow(Math.min(Math.max(vt(z,3),0),1),2)),q=ie(N(q,ie(1,N(V,.18))),N(N(V,Math.sin(ie(N(G,63),N(z,7)))),.065)),z=ie(z,N(N(V,Math.sin(ie(N(G,77),N(q,6)))),.022)),oe=ie(oe,N(N(V,Math.cos(ie(N(G,51),N(z,4)))),.05)),ie(k,N($e(ie(N(q,_),N(oe,Me)),z,ie(N(Ct(q),Me),N(oe,_))),ne))}function rt(D,V,q,z,oe){let te,pe,he,j,se,Ee,ye,ue,Ve;for(pe=ft(ct(V,D)),Ee=ft(No(pe,$e(0,0,1))),Ve=No(pe,Ee),ye=0;ye<z;ye++)for(j=ie(vt(N(ye,N(Math.PI,2)),z),oe),we(N(ie(.018,N(.005,ie(N(Math.sin(j),.5),.5))),ne)),he=0;he<7;he++)ue=vt(he,6),te=ie(j,N(ue,6)),se=N(N(q,ie(.72,N(.22,Math.sin(N(j,1.3))))),ie(.72,N(.28,Math.sin(N(Math.PI,ue))))),Oe(C(ie(at(D,V,ue),N(ie(N(Ee,Math.cos(te)),N(Ve,Math.sin(te))),se))))}function We(D,V,q,z,oe,te,pe,he,j){if(k=D,qe=V,G=q,Z=z,ne=oe,Le=te,S=pe,h=he,Y=j,Y=Math.min(Math.max(Y,0),1),Me=Math.sin(qe),_=Math.cos(qe),b=N(Z,.013),0<ne){for(It(Le,S,h,ne),ke=0;ke<24;ke++)for(I=ie(N(ke,2.399),b),we(N(ie(.021,N(.004,Math.abs(Math.sin(I)))),ne)),T=0;T<11;T++)Ae=vt(T,10),u=Ae<.72?at(n[0],n[1],vt(Ae,.72)):at(n[1],n[2],vt(ct(Ae,.72),.28)),Ce=N(Ae<.5?ie(.12,N(.22,Ae)):ct(.23,N(ct(Ae,.5),.26)),ie(1,N(Y,.45))),o=ie(I,N(Ae,8)),Oe(C(ie(u,$e(N(Math.cos(o),Ce),N(.013,Math.sin(N(o,2))),N(N(Math.sin(o),Ce),.48)))));for(R=0;R<4;R++)if(l=1<R?1:0,T=ct(R,N(l,2)),$=n[ie(4,N(R,3))],P=n[ie(5,N(R,3))],J=n[ie(6,N(R,3))],rt($,P,l?.075:.048,l?6:5,l?ie(1.8,T):T),rt(P,J,l?.048:.035,l?6:5,l?ie(.7,T):ie(T,1.4)),de=T===0?Ct(1):1,l)for(w=0;w<4;w++)v=ie(J,$e(N(ct(w,1.5),.032),0,0)),d=$e(N(de,.035),Ct(.12),.04),p=ie(v,$e(N(de,.07),Ct(.29),0<h?.13:Ct(.035))),we(N(.014,ne)),Oe(C(v)),Oe(C(ie(v,d))),Oe(C(p));else ge=ie(J,$e(N(de,.045),Ct(.015),.17)),ht(C(J),C(ge),N(.045,ne),N(.018,ne));for(rt(n[2],n[3],.045,4,0),ke=0;ke<20;ke++)for(o=vt(N(ke,N(Math.PI,2)),20),f=Fe(Math.cos(o)),m=Fe(Math.sin(o)),we(N(.018,ne)),T=0;T<6;T++)Ae=vt(T,5),g=ie(Ct(.19),N(Ae,.34)),De=ie(.86,N(.12,Math.sin(N(Ae,Math.PI)))),Oe(C(ie(ie(n[3],$e(N(N(f,.22),De),N(N(m,.14),De),g)),$e(N(.014,Math.sin(ie(o,N(Ae,8)))),N(.007,Math.sin(ie(N(o,3),N(Ae,6)))),0))));for(K=0;K<2;K++)for(we(N(.022,ne)),T=0;T<21;T++)a=vt(N(T,N(Math.PI,2)),20),Oe(C(ie(n[3],$e(N(Fe(Math.cos(a)),.22),N(Fe(Math.sin(a)),.14),N(K,.11)))));for(T=0;T<10;T++)I=ie(N(T,2.37),b),v=ie(n[1],$e(N(Math.sin(I),.19),N(Ct(T),.09),.02)),E=N($e(Math.sin(I),ie(.9,N(.35,Math.cos(I))),Math.cos(I)),Y),U=ie(ie(v,$e(N(Math.sin(ie(N(G,1.7),I)),.1),Ct(.3),N(.04,Math.cos(I)))),N(E,.32)),p=ie(ie(ie(U,$e(N(Math.sin(ie(ie(N(G,1.7),I),.7)),.11),Ct(.3),.05)),N(E,.42)),N(N($e(Math.sin(ie(N(G,53),I)),0,Math.cos(ie(N(G,67),I))),Y),.07)),we(N(ie(.011,N(Y,.007)),ne)),Oe(C(v)),Oe(C(U)),Oe(C(p))}if(ne=Math.abs(ne),0<Y)for(T=0;T<36;T++)I=ie(N(T,2.399),b),o=ie(I,N(G,ie(2,N(gc(T,3),.35)))),X=ie(.65,N(.24,Math.sin(ie(I,N(G,1.8))))),be=ie(.35,N(gc(ie(N(T,.173),N(G,.25)),1),2.6)),c=C($e(N(Math.sin(o),X),be,N(Math.cos(o),X))),xe=vt(N(N(ie(.06,N(.025,Math.abs(Math.sin(ie(I,N(G,7)))))),ne),Y),3),y(c,xe)}function Fe(D){return N(Math.pow(Math.abs(D),.55),D<0?Ct(1):1)}function Re(D,V,q,z,oe){let te,pe,he,j,se,Ee;return he=ct(V,D),Ee=Math.min(Math.max(Math.sqrt(ki(he,he)),.001),ct(ie(q,z),.001)),j=ft(he),te=vt(ie(ct(N(q,q),N(z,z)),N(Ee,Ee)),N(2,Ee)),se=Math.sqrt(Math.max(ct(N(q,q),N(te,te)),0)),pe=ft(ct(oe,N(j,ki(oe,j)))),ie(ie(D,N(j,te)),N(pe,se))}function ht(D,V,q,z){let oe,te,pe,he,j,se,Ee,ye;for(oe=ft(ct(V,D)),he=.9<Math.abs(ki(oe,$e(0,1,0)))?$e(1,0,0):$e(0,1,0),se=ft(No(oe,he)),ye=No(oe,se),pe=se,te=0;te<8;te++)Ee=vt(N(ie(te,1),N(Math.PI,2)),8),j=ie(N(se,Math.cos(Ee)),N(ye,Math.sin(Ee))),s(ie(D,N(pe,q)),ie(D,N(j,q)),ie(V,N(j,z)),ie(V,N(pe,z))),pe=j}function we(D){n[17]=D,n[18]=0}function Oe(D){n[18]&&ht(n[16],D,n[17],N(n[17],.95)),n[16]=D,n[18]=1}function ft(D){return N(D,vt(1,Math.max(Math.sqrt(ki(D,D)),1e-8)))}function at(D,V,q){return ie(N(D,ct(1,q)),N(V,q))}function A(D){return D=Math.min(Math.max(D,0),1),N(N(D,D),ct(3,N(2,D)))}function y(D,V){let q,z,oe;for(oe=$e(0,V,0),q=0;q<2;q++)z=q===0?$e(V,0,0):$e(0,0,V),r(ct(ct(D,z),oe),ct(ie(D,z),oe),ie(ie(D,z),oe),ie(ct(D,z),oe))}return(...D)=>(e=[],t=[],We(...D),{vertices:e,particles:t,rig:n.slice(0,16)})}function rd(n,e,{position:t,time:i,available:s=()=>!0,paused:r=!1}){if(r||e<2||n<0||n>=e)return 0;for(let[a,o]of[[n,n+1],[n-1,n]]){if(a<0||o>=e||!s(a)||!s(o))continue;let l=i(o)-i(a),c=t(a),h=t(o);if(l<=1e-6||!c.every(Number.isFinite)||!h.every(Number.isFinite))continue;let u=Math.hypot(h[0]-c[0],h[1]-c[1])/l;if(Number.isFinite(u))return u}return 0}function nx(n){let e=Number.isFinite(n),t=e?Math.ceil(Math.max(0,Math.min(100,n))/20):0;return{cells:t,level:t>=4?"green":t>=2?"yellow":"red",label:e?`${Number(n.toFixed(1))}%`:"—",abnormal:!e||n<0||n>100}}function xc(n,e){let t=nx(e);n.dataset.level=t.level,n.classList.toggle("battery-anomaly",t.abnormal),n.querySelector("output").textContent=t.label,n.querySelectorAll("[data-cell]").forEach((i,s)=>i.style.opacity=s<t.cells?"1":".14"),n.setAttribute("aria-label",`Battery ${t.label}`)}var ad=n=>![0,32,66,100].some(e=>Math.abs(n-e)<.001),od=n=>`HP ${Number.isInteger(n)?n:Number(n.toFixed(4))}`;function ld(n,e,t){if(!n?.length||e<n[0][0])return t;let i=0,s=n.length-1;for(;i<s;){let r=Math.ceil((i+s)/2);n[r][0]<=e?i=r:s=r-1}return n[i][1]}var ee=n=>document.getElementById(n),zo=[...document.querySelectorAll("[data-mode]")],x={active:window.parent===window,meta:null,f:null,u:null,times:null,index:0,time:0,playing:!1,speed:1,mode:"top",zoom:1,pan:[0,0],drag:null,keys:new Set,freeYaw:0,freePitch:0,orbit:0,orbitHeight:4.5,subject:-1,flySpeed:7,mouseButton:-1},ix=sd(),Tn=0,hi=null,ui=null,Wn=null,_c=0,Rn=null,pi=null,Ht=null,rn=null,fe=null,fd=null,di=null;var _r=[],ci=null,yr=null;var Sr=-1,ws=[],wc=[],fi=null,zi=null,Gn=null,vc=null,gr=null,Hi=Tu({load:async(n,{signal:e})=>{let t=await Ao("/api/runs/"+n+"/race-reference",{signal:e}),i=await bs(t);if(!t.ok)throw Error("参考路线暂不可用，请重试。");return i},onChange:pd});function pd(n){let e=ee("optimal-route"),t=gn()==="en";e.checked=n.enabled,e.disabled=!x.ready||!n.id||n.status==="unavailable",e.setAttribute("aria-busy",String(n.status==="loading")),e.title=n.status==="loading"?t?"Loading route…":"正在载入参考路线…":n.status==="error"?t?"Route unavailable; select to retry.":"路线载入失败，点击重试。":!n.id||n.status==="unavailable"?t?"This replay has no reference route.":"此回放没有参考路线。":t?"Spawn to original exit.":"出生点至原始出口。",gr!==n.data&&(Gn&&(rn?.remove(Gn),Gn.geometry.dispose(),Gn.material.dispose(),Gn=null),gr=n.data,vc=null,gr?.available&&(vc=Au(gr),rn&&(Gn=Cu(gr),rn.add(Gn)))),Gn&&(Gn.visible=n.enabled&&x.active)}ee("optimal-route").onchange=()=>Hi.select(ee("optimal-route").checked);function sx(n){ee("free-markers").replaceChildren(),ws=Array.from({length:n+4+(x.coins?.length||0)},(e,t)=>{let i=t>=n+4?x.coins[t-n-4]:null,s=t===n+1?"current":t===n+2?"original":t===n+3?"mismatch":null,r=document.createElement("div");r.className="hud-marker "+(i?"hud-coin":s==="mismatch"?"hud-exit-mismatch":s?"hud-exit":t===0?"hud-player":"hud-entity"),r.dataset.noI18n="",i&&(r.dataset.coinId=i.id);let a=i?'<circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="m8 4 2.5 4L8 12 5.5 8Z" fill="currentColor"/>':'<path d="M8 1 15 8 8 15 1 8Z" fill="none" stroke="currentColor" stroke-width="1.5"/>';return r.innerHTML='<svg class="hud-dot" viewBox="0 0 16 16">'+a+'</svg><svg class="hud-arrow" viewBox="0 0 20 20"><path d="m5 4 10 6-10 6" fill="none" stroke="currentColor" stroke-width="2"/></svg><span class="hud-label"><b></b><small></small></span>',ee("free-markers").append(r),{node:r,coin:i,exit:s,label:r.querySelector(".hud-label"),name:r.querySelector("b"),distance:r.querySelector("small"),arrow:r.querySelector(".hud-arrow")}})}function md(){let n=x.coins||[],e=ee("coin-status");if(e.hidden=!x.ready||!n.length||!ee("show-hud").checked,e.hidden)return;let t=n.reduce((o,l)=>o+Number(vo(l,x.time)),0),i=gn()==="en",s=i?"Coins":"金币",r=`${t} / ${n.length}`;ee("coin-status-label").textContent!==s&&(ee("coin-status-label").textContent=s),ee("coin-count").textContent!==r&&(ee("coin-count").textContent=r);let a=i?`Coins collected: ${t} of ${n.length}`:`已拾取 ${t} / ${n.length} 枚金币`;e.getAttribute("aria-label")!==a&&e.setAttribute("aria-label",a)}var vr=matchMedia("(pointer: coarse), (max-width:700px)"),cd=new B;function rx(n,e){if(x.mode==="top"||!ee("show-hud").checked)return;fe.updateMatrixWorld();let t=x.index,i=ur(x.meta,x.time),s=i.canonical||i.cell,r=x.meta.exitCompletionMismatch?.position||[0,0],a=[[Ue(t,6),Ue(t,7),-Ue(t,8)],...Array.from({length:x.meta.entities},(f,m)=>[Ue(t,24+12*m),2.15,-Ue(t,25+12*m)]),[i.cell[0]*2+1,.15,-i.cell[1]*2-1],[s[0]*2+1,.15,-s[1]*2-1],[r[0],.15,-r[1]],...(x.coins||[]).map(f=>[f.position[0],Mo(Ue(t,22),null,Ue(t,22),f.id).height,-f.position[1]])],o=a.map(f=>(cd.set(...f).applyMatrix4(fe.matrixWorldInverse),Vu(cd,n,e,fe.projectionMatrix.elements[0],fe.projectionMatrix.elements[5]))),l=a.map(f=>Math.hypot(f[0]-fe.position.x,f[1]-fe.position.y,f[2]-fe.position.z)),c=o.map((f,m)=>m).filter(f=>ws[f].exit==="original"?i.showOriginal:ws[f].exit==="mismatch"?!!x.meta.exitCompletionMismatch:ws[f].coin?!vo(ws[f].coin,x.time):x.mode==="free"?l[f]>=.3:f!==x.subject+1),h=c.map(f=>Gu(o[f],n,e)),u=Object.fromEntries(c.map((f,m)=>[f,h[m]])),d=gn()==="en";ws.forEach((f,m)=>{if(f.node.hidden=!u[m],f.node.hidden)return;let _=l[m],g=o[m];f.node.classList.toggle("edge",g.edge),f.node.style.transform=`translate(${g.x}px,${g.y}px)`,f.arrow.style.transform=`translate(-50%,-50%) rotate(${g.angle}rad)`,f.node.classList.toggle("hud-exit-altered",f.exit==="current"&&i.altered),f.label.style.transform=u[m].transform||"translateX(-50%)",f.label.style.left=u[m].x+"px",f.label.style.top=u[m].y+"px";let p=f.coin?`${d?"COIN":"金币"} ${f.coin.id+1}`:f.exit==="mismatch"?d?"VICTORY POSITION":"胜利位置":f.exit?So(i,f.exit==="original",d):m===0?d?"PLAYER":"玩家":`E${String(m).padStart(2,"0")}`,E=_<1e3?`${Math.round(_)} m`:`${(_/1e3).toFixed(1)} km`;f.name.textContent!==p&&(f.name.textContent=p),f.distance.textContent!==E&&(f.distance.textContent=E)})}var dt=new Ss(0),Jt=()=>!ee("show-pauses").checked;function wr(n){return!!dt.pauseAt(n)}function gd(){let n=Jt();ee("timeline").max=n?dt.active:dt.duration,ee("timeline").style.background=dt.background(n),ee("duration").textContent=Ec(n?dt.active:dt.duration),ee("time-basis").textContent=n?"已隐藏暂停":"实际经过时间",Ac(!0),Xn(!0)}var Vi=ee("map"),Pe=Vi.getContext("2d"),Oo=document.createElement("canvas"),Bt=(n,e,t)=>Math.max(e,Math.min(t,n)),Ue=(n,e)=>{let t=x.f[n*x.meta.words+e];if(e===19)return ld(An?.healthEvents,n===x.index?x.time:x.times[n],t);if(n!==x.index||n+1>=x.meta.frames||!$t.has(Math.floor((n+1)/360)))return t;let i=e>=6&&e<=18?-1:e>=24&&(e-24)%12<=2?Math.floor((e-24)/12):null;if(i!==null&&Pc(n,i))return t;let s=Bt((x.time-x.times[n])/(x.times[n+1]-x.times[n]),0,1),r=x.f[(n+1)*x.meta.words+e];return t+(e===9||e===15||e>=24&&(e-24)%12===2?((r-t+Math.PI)%(Math.PI*2)+Math.PI*2)%(Math.PI*2)-Math.PI:r-t)*s},Es=(n,e)=>x.u[n*x.meta.words+e],Ec=n=>{let e=Math.floor(Math.max(0,n)*1e3);return`${String(Math.floor(e/6e4)).padStart(2,"0")}:${String(Math.floor(e/1e3)%60).padStart(2,"0")}.${String(e%1e3).padStart(3,"0")}`};function As(n,e){ee("error").hidden=!1,ee("error").textContent=n,e&&nd(ee("error"),e)}function gi(n){x.buffering=n,ee("buffering").hidden=!n}function xi(n){x.playing=n,ee("play").textContent=n?"暂停":"播放",!n&&x.seekTargetTime==null&&(x.pendingPlayback=null,x.waitingChunk=null,gi(!1)),n&&x.ready&&(Xn(!0),an.canResume()||gi(!0))}function Tc(n){let e=0,t=x.meta.frames-1;for(;e<t;){let i=Math.ceil((e+t)/2);x.times[i]<=n?e=i:t=i-1}return e}var Ts=0;async function Vo(n,e=null){let t=++Ts;if(Rn=null,pi=null,ee("error").hidden=!0,!x.meta||!x.meta.playbackSafe)return;let i=Bt(Math.round(n),0,x.meta.frames-1);x.pendingPlayback=null,x.waitingChunk=null,x.seekTargetTime=e==null?x.times[i]:Bt(e,0,x.meta.duration),Xn(!0),gi(!$t.has(Math.floor(i/360)));try{if(await Sc(Math.floor(i/360)),i%360===359&&i+1<x.meta.frames&&await Sc(Math.floor(i/360)+1),t!==Ts)return;x.index=i,x.time=x.seekTargetTime,Sr=-1,Wn=null,Gi()}catch(s){t===Ts&&s.name!=="AbortError"&&(xi(!1),As(s.message))}finally{t===Ts&&(x.seekTargetTime=null,Xn(!0),gi(x.playing&&!an?.canResume()))}}function Er(n){return Vo(Tc(Bt(n,0,x.meta.duration)),n)}function Ac(n=!1){ee("timeline").value=dt.display(x.time,Jt());let e=Math.floor(x.time*20);(n||x.displayClock!==e)&&(ee("time").textContent=Ec(dt.display(x.time,Jt())),x.displayClock=e)}function hd(){Hi.reset(),an?.dispose(),an=null,x.pendingPlayback=null,ee("recorded-pause").hidden=!0,ee("time-basis").textContent="",++Ts,x.waitingChunk=null,x.seekTargetTime=null,gi(!1),ee("input-panel").hidden=!0,xc(ee("battery-status"),NaN),ee("battery-status").hidden=!1,ee("current-subject").textContent="玩家",x.ready=!1,xi(!1),x.meta=null,x.coins=[],ee("coin-status").hidden=!0,x.f=null,x.u=null,x.times=null,x.playedPath=null,x.index=0,x.time=0,x.subject=-1,x.paths=[],x.bitmap=null,x.keys.clear(),fx(),rn=null,fe=null,fd=null,di=null,yr=null,_r=[],wc=[],ci=null,fi=null,zi=null,zo.forEach(n=>n.disabled=!0),Ht?.clear(),Pe.clearRect(0,0,Vi.width,Vi.height),ee("timeline").disabled=!0,ee("play").disabled=!0,ee("empty").hidden=!1,ee("subjects").replaceChildren();for(let n of["subject-speed","focus-detail","time","tick","duration"])ee(n).textContent="—";Wi("top")}async function ax(n,e=null,t=0,i=""){if(!n&&!e)return;n&&history.replaceState(null,"",location.pathname);let s=++Tn;hi?.abort(),hi=new AbortController,hd(),Hi.reset(!xr&&e?e:""),ee("loading").hidden=!1,ee("loading").textContent="正在载入回放…",ee("error").hidden=!0;try{if(n&&n.size>64*1024*1024)throw Error("文件超过 64 MiB 导入限制。");let r=await Mx(e,hi.signal,s,i);if(s!==Tn)return;x.meta=r,x.coins=Pu(r),sx(r.entities),dt=new Ss(r.duration,r.idleRanges,r.chaseRanges),x.index=0,x.time=0,x.pan=[0,0],x.zoom=1,x.orbit=0,Sr=-1,ee("duration").textContent=Ec(r.duration),ee("time-basis").textContent=r.timeBasis==="recorded_wall"?"实际经过时间":"计时信息不可用";for(let a=-1;a<r.entities;a++){let o=document.createElement("button");o.className="subject-row",o.dataset.subject=a,o.disabled=!0,o.setAttribute("aria-pressed",String(a===x.subject)),o.innerHTML=`<span class="subject-name">${a<0?"玩家":`E${String(a+1).padStart(2,"0")}`}</span><span class="subject-state">—</span><span class="subject-meter" aria-hidden="true"><i></i></span>`,o.onclick=()=>lx(a),ee("subjects").append(o)}if(!r.playbackSafe){ee("empty-title").textContent="这份记录需要复核",ee("empty-description").textContent="部分坐标、时钟或相机参数超出安全播放范围。三维播放已停用，仍可进入 Judge 查看逐项证据。",Gi();return}if(ee("empty").hidden=!0,ux(),await px(()=>s!==Tn),s!==Tn)return;zo.forEach(a=>a.disabled=a.dataset.mode!=="top"&&!fe),[...ee("subjects").children].forEach(a=>a.disabled=!1),ee("timeline").disabled=!1,gd(),ee("timeline").step="0.001",ee("timeline").value=0,ee("play").disabled=!1,x.ready=!0,pd(Hi.snapshot()),Wi("first"),Vo(t),Gi()}catch(r){if(s!==Tn||r.name==="AbortError")return;hd(),ee("empty-title").textContent="回放加载失败",ee("empty-description").textContent="请重试；如果仍无法加载，请重新提交凭证。",As(r.message,r.checks)}finally{s===Tn&&(ee("loading").hidden=!0)}}ee("play").onclick=()=>{x.meta&&(x.playing||(ee("error").hidden=!0),x.time>=x.meta.duration&&Vo(0),xi(!x.playing))};function xd(n){if(!x.ready)return;xi(!1);let e=Bt(x.index+n,0,x.meta.frames-1);if(Jt())for(;e>0&&e<x.meta.frames-1&&wr(x.times[e]);)e+=n;Vo(e)}ee("previous").onclick=()=>xd(-1);ee("next").onclick=()=>xd(1);ee("timeline").oninput=n=>{xi(!1),Er(dt.wall(+n.target.value,Jt()))};ee("speed").onchange=n=>{x.speed=+n.target.value,Xn(!0)};function _d(n){x.ready&&Er(dt.wall(dt.display(x.seekTargetTime??x.time,Jt())+n,Jt()))}ee("back-five").onclick=()=>_d(-5);ee("forward-five").onclick=()=>_d(5);function yd(){ee("free-markers").hidden=x.mode==="top"||!ee("show-hud").checked,document.querySelector(".legend").hidden=x.mode!=="top"&&!ee("show-hud").checked,md()}ee("show-hud").onchange=yd;ee("show-pauses").onchange=()=>{x.meta&&(gd(),Jt()&&wr(x.time)&&Er(dt.pauseAt(x.time)[1]))};ee("skip-pause").onclick=n=>{n.stopPropagation();let e=dt.pauseAt(x.time);e&&Er(e[1])};ee("skip-pause").addEventListener("pointerdown",n=>n.stopPropagation());ee("expand").onclick=async()=>{try{document.fullscreenElement?await document.exitFullscreen():await document.documentElement.requestFullscreen()}catch{document.body.classList.toggle("theatre")}};document.addEventListener("fullscreenchange",()=>{ee("expand").textContent=document.fullscreenElement?"退出全屏":"放大预览"});ee("home").onclick=()=>Ho();zo.forEach(n=>n.onclick=()=>Wi(n.dataset.mode));function ox(n){return n<0?"玩家":`实体 E${String(n+1).padStart(2,"0")}`}function vd(){if(!x.meta)return;let n=x.subject<0,e=n?6:24+x.subject*12,t=n?8:e+1,i=rd(x.index,x.meta.frames,{paused:wr(x.time),available:s=>$t.has(Math.floor(s/360)),position:s=>[x.f[s*x.meta.words+e],x.f[s*x.meta.words+t]],time:s=>dt.display(x.times[s],!0)}).toFixed(2)+" m/s";ee("subject-speed").textContent!==i&&(ee("subject-speed").textContent=i)}function Gi(){if(!x.meta)return;let n=x.index,e=x.subject<0;x.displayHealth=Ue(n,19),Ac(!0),vd(),ee("battery-status").hidden=!e,e&&xc(ee("battery-status"),Ue(n,3)),[...ee("subjects").children].forEach(t=>{let i=Number(t.dataset.subject),s=24+i*12,r=i<0?Ue(n,19):Ue(n,s+6),a=i===x.subject;t.classList.toggle("active",a),t.setAttribute("aria-pressed",String(a)),t.querySelector("i").style.width=`${Bt(r,0,100)}%`,t.classList.toggle("health-anomaly",i<0&&ad(r)),t.querySelector(".subject-state").title=i<0?String(r):"",t.querySelector(".subject-state").textContent=i<0?od(r):["游荡","调查","追逐","搜索"][Es(n,s+11)]||"—"}),ee("current-subject").textContent=ox(x.subject),ee("focus-detail").textContent=x.subject<0?Es(n,1)&512?"手电筒开启":"手电筒关闭":`仇恨 ${Math.round(Ue(n,24+x.subject*12+6))}%`,ee("input-panel").hidden=!e,e&&(ee("input-unavailable").hidden=x.meta.format==="HVR5",ee("input-keys").hidden=x.meta.format!=="HVR5",document.querySelectorAll("[data-input]").forEach(t=>{let i=Number(t.dataset.input),s=!!(Es(n,1)&i),r=!!(Es(n,2)&i);t.classList.toggle("held",s),t.classList.toggle("tap",r&&!s),t.setAttribute("aria-label",t.dataset.label+(s?" · 按下":r?" · 短按":" · 松开"))}),ee("run-state").hidden=x.meta.format!=="HVR5",ee("run-state").textContent=Es(n,1)&256?"奔跑":"步行")}function lx(n){if(n===x.subject&&x.mode==="first")return;let e=xn(),t=fe&&x.mode!=="top"?{position:fe.position.clone(),rotation:fe.quaternion.clone(),fov:fe.fov}:null,i=[...x.pan],s=x.zoom;if(x.subject=n,Gi(),x.mode==="free"&&fe)gx();else if(x.mode==="top"){pi={pan:i,zoom:s,toZoom:Math.max(s,2),started:performance.now(),duration:Math.min(500,lc(Math.hypot(xn().x-e.x,xn().z-e.z)))};return}else Ho();t&&(Rn={...t,destination:fe.position.clone(),subjectStart:xn(),started:performance.now(),duration:lc(t.position.distanceTo(fe.position))},fe.position.copy(t.position),fe.quaternion.copy(t.rotation),fe.fov=t.fov)}function cx(){if(!pi)return;let n=pi,e=(performance.now()-n.started)/n.duration,t=oc(e),i=ee("viewport").getBoundingClientRect(),s=xn(),r=Math.min(i.width-50,i.height-50)/512*n.toZoom;x.zoom=n.zoom+(n.toZoom-n.zoom)*t,x.pan=[n.pan[0]+((256-s.x)*r-n.pan[0])*t,n.pan[1]+((s.z-256)*r-n.pan[1])*t],e>=1&&(pi=null)}function Rc(){if(pi=null,!Rn||x.mode!=="free"||!fe)return;let n=fe.getWorldDirection(new B);x.freeYaw=Math.atan2(n.x,-n.z),x.freePitch=Math.asin(Bt(n.y,-1,1)),Rn=null}function hx(){if(!Rn)return;let n=Rn,e=(performance.now()-n.started)/n.duration,t=oc(e),i=fe.position.clone(),s=fe.quaternion.clone(),r=fe.fov;fe.position.lerpVectors(n.position,i,t),fe.quaternion.slerpQuaternions(n.rotation,s,t),fe.fov=n.fov+(r-n.fov)*t,e>=1&&(Rn=null)}function ux(){let n=x.meta;x.bitmap=n.bitmap,Oo.width=256,Oo.height=256,x.pathStep=Math.max(1,Math.ceil(n.frames/3e4)),x.paths=[];for(let i=-1;i<x.meta.entities;i++){let s=new Path2D,r=i<0?6:24+i*12,a=i<0?8:r+1;for(let[o,l]of(i<0?An.path:[]).entries())o===0?s.moveTo(...l):s.lineTo(...l);x.paths.push(s)}x.playedPath=new Path2D,x.playedUntil=-1;let e=Oo.getContext("2d"),t=e.createImageData(256,256);for(let i=0;i<65536;i++){let r=x.bitmap[i>>3]&1<<(i&7)?[35,43,29]:[87,91,64];t.data.set([...r,255],((255-Math.floor(i/256))*256+i%256)*4)}e.putImageData(t,0,0)}function Mr(n,e){if(n<0||e<0||n>=256||e>=256)return!0;let t=e*256+n;return!!(x.bitmap[t>>3]&1<<(t&7))}function Md(){let n=ee("viewport").getBoundingClientRect(),e=Math.min(n.width-50,n.height-50)/512*x.zoom;return{w:n.width,h:n.height,s:e,x:n.width/2-256*e+x.pan[0],y:n.height/2-256*e+x.pan[1]}}function dx(){if(!x.meta)return;cx();let{w:n,h:e,s:t,x:i,y:s}=Md(),r=Math.min(devicePixelRatio,2);if((Vi.width!==Math.round(n*r)||Vi.height!==Math.round(e*r))&&(Vi.width=Math.round(n*r),Vi.height=Math.round(e*r)),Pe.setTransform(r,0,0,r,0,0),Pe.fillStyle="#0c100b",Pe.fillRect(0,0,n,e),Pe.imageSmoothingEnabled=!1,Pe.drawImage(Oo,i,s,512*t,512*t),Pe.save(),Pe.translate(i,s+512*t),Pe.scale(t,-t),Pe.lineWidth=1.3/t,ee("trails").checked){for(let m=0;m<x.paths.length;m++)Pe.strokeStyle=m===0?"#d9d39f":"#a66454",Pe.globalAlpha=.3,Pe.stroke(x.paths[m]);Pe.globalAlpha=1}x.index<x.playedUntil&&(x.playedPath=new Path2D,x.playedUntil=-1);for(let m=x.playedUntil+1;m<=x.index;m++)$t.has(Math.floor(m/360))&&(m===0||m%360===0?x.playedPath.moveTo(Ue(m,6),Ue(m,8)):m%x.pathStep===0&&x.playedPath.lineTo(Ue(m,6),Ue(m,8)));x.playedUntil=x.index,Pe.strokeStyle="#eee8aa",Pe.stroke(x.playedPath),Hi.snapshot().enabled&&Ru(Pe,vc,t),Pe.restore();let a=(m,_)=>({x:i+m*t,y:s+(512-_)*t}),o=gn()==="en",l=vr.matches?7:6,c=[{...a(Ue(x.index,6),Ue(x.index,8)),color:"#fff1af",name:o?"PLAYER":"玩家",yaw:Ue(x.index,9)}];for(let m=0;m<x.meta.entities;m++){let _=24+m*12;c.push({...a(Ue(x.index,_),Ue(x.index,_+1)),color:"#e4a18c",name:`E${String(m+1).padStart(2,"0")}`})}let h=ur(x.meta,x.time),u=a(h.cell[0]*2+1,h.cell[1]*2+1);if(h.showOriginal){let m=a(h.canonical[0]*2+1,h.canonical[1]*2+1);Pe.save(),Pe.strokeStyle=bo,Pe.globalAlpha=.6,Pe.setLineDash([5,5]),Pe.beginPath(),Pe.moveTo(m.x,m.y),Pe.lineTo(u.x,u.y),Pe.stroke(),Pe.restore(),c.push({...m,color:ac,name:So(h,!0,o),exit:!0})}c.push({...u,color:h.color,name:So(h,!1,o),exit:!0}),x.meta.exitCompletionMismatch&&c.push({...a(...x.meta.exitCompletionMismatch.position),color:"#e6a0d2",name:o?"VICTORY POSITION":"胜利位置",exit:!0});for(let m of x.coins||[])vo(m,x.time)||c.push({...a(...m.position),color:"#e5bd5c",name:o?"COIN":"金币",coin:!0});let d=c.filter(m=>m.x>=0&&m.x<=n&&m.y>=0&&m.y<=e),f=Hu(d,n,e);Pe.font=`600 ${vr.matches?15:13}px "Noto Sans SC",sans-serif`,Pe.textBaseline="middle",d.forEach((m,_)=>{Pe.save(),Pe.translate(m.x,m.y),Pe.fillStyle=m.color,Pe.strokeStyle="#10140c",Pe.lineWidth=2,Pe.beginPath(),m.yaw!=null?(Pe.rotate(m.yaw),Pe.moveTo(0,-l*1.8),Pe.lineTo(-l,l),Pe.lineTo(0,l*.45),Pe.lineTo(l,l),Pe.closePath()):m.coin?(Pe.moveTo(0,-l*1.25),Pe.lineTo(l,0),Pe.lineTo(0,l*1.25),Pe.lineTo(-l,0),Pe.closePath()):m.exit?Pe.rect(-l,-l,l*2,l*2):Pe.arc(0,0,l,0,Math.PI*2),Pe.fill(),Pe.stroke(),Pe.restore();let g=f[_],p=Pe.measureText(m.name).width+12,E=m.x+g.x-p/2,w=m.y+g.y;Pe.fillStyle="#171b10ed",Pe.fillRect(E,w,p,23),Pe.strokeStyle=m.color,Pe.lineWidth=1,Pe.strokeRect(E,w,p,23),Pe.fillStyle=m.color,Pe.fillText(m.name,E+6,w+11.5)})}function fx(){ui&&(ui.dispose(),ui=null)}function Cc(){if(Ht)return!0;try{return Ht=new xo({canvas:ee("scene"),antialias:!0,powerPreference:"high-performance"}),Ht.setPixelRatio(Math.min(devicePixelRatio,2)),Ht.outputColorSpace=zt,Ht.toneMapping=mn,!0}catch{return As("WebGL 不可用，仍可使用俯视轨迹。"),!1}}async function px(n){if(!Cc())return;let e=ui=new Lo(Ht,x.meta,Mr);if(rn=e.scene,fd=e.roof,fe=new Ft(80,1,.04,1e3),await e.build(r=>{ee("loading").textContent=`正在重建场景 · ${r}%`},n),n())return;di=new Lt;let t=new st(new ii(.2,.245,32),new St({color:12179123,side:wt,transparent:!0,opacity:.85}));t.rotation.x=-Math.PI/2;let i=new st(new js(.07,.18,3),new St({color:13952190}));if(i.rotation.x=-Math.PI/2,i.position.z=-.12,di.add(t,i),rn.add(di),wc=(x.coins||[]).map(r=>{let a=Du(r);return rn.add(a),a}),ci=new st(new gt,new St({color:3921489,side:wt})),rn.add(ci),fi=new st(new gt,new St({color:3921489,side:wt})),fi.visible=!1,rn.add(fi),zi=new st(new ii(.55,.62,4),new St({color:15114450,side:wt})),zi.rotation.x=-Math.PI/2,zi.visible=!!x.meta.exitCompletionMismatch,zi.visible){let r=x.meta.exitCompletionMismatch.position;zi.position.set(r[0],.035,-r[1])}rn.add(zi);let s=[];for(let r of An.path)s.push(r[0],.04,-r[1]);yr=new $s(new gt().setAttribute("position",new lt(s,3)),new us({color:14668699,transparent:!0,opacity:.6})),rn.add(yr),_r=[];for(let r=0;r<x.meta.entities;r++){let a=new Lt,o=new st(new gt,e.actorMaterial()),l=new st(new gt,new St({color:0,side:wt}));a.add(o,l),a.userData.wire=o,a.userData.particles=l,rn.add(a),_r.push(a)}Ho()}function yc(n,e=!1,t=null){let i=x.index,s=24+n*12,r=t||ur(x.meta,x.time).cell,a=e?[[r[0]*2+1,0,r[1]*2+1],0,Ue(i,22),0,-x.meta.ceiling/3.5,0,0,0,1]:[[Ue(i,s),0,Ue(i,s+1)],Ue(i,s+2),Ue(i,22),Number(BigInt(x.meta.formSeeds[n])%997n),x.meta.ceiling/3.5,Ue(i,s+3),Ue(i,s+4),Ue(i,s+5),Bt((Ue(i,s+6)-70)/30,0,1)];return ix(...a)}function Wi(n){if(n!==x.mode&&Go(),n!=="top"&&x.meta&&!x.meta.playbackSafe){As("记录含超出安全播放范围的状态，请在 Judge 中查看证据。");return}if(n!=="top"&&x.meta&&!Ht){As("当前浏览器不支持 WebGL，可继续使用俯视地图。");return}x.mode=n,yd(),ee("cutaway").disabled=n==="first"||n==="top",ee("map-compass").hidden=n!=="top",zo.forEach(e=>{e.classList.toggle("active",e.dataset.mode===n),e.setAttribute("aria-pressed",String(e.dataset.mode===n))}),ee("map").style.visibility=n==="top"?"visible":"hidden",ee("scene").style.visibility=n==="top"?"hidden":"visible",ee("crosshair").hidden=n!=="first",ee("view-label").textContent={top:"俯视全图",first:"第一人称",third:"第三人称",free:"自由视角"}[n],ee("hint").textContent={top:"滚轮缩放 · 拖动平移 · 双击定位自由视角",first:"玩家记录视角 / 实体朝向重建 · 拖动时间轴定位",third:"拖动旋转跟随视角 · 滚轮调整高度",free:"右键 + WASD 飞行 · Q/E 升降 · Shift 加速 · 滚轮调速 · Alt 左键环绕 · 中键平移 · F 聚焦"}[n],Ho(),mx()}function mx(){vr.matches&&(ee("hint").textContent={top:"单指平移 · 双指缩放",first:"轻触播放 / 暂停 · 拖动下方进度条",third:"单指旋转 · 双指调整高度",free:"单指转向 · 双指平移和推拉"}[x.mode])}vr.addEventListener("change",()=>Wi(x.mode));function Ho(){if(Rn=null,pi=null,Wn=null,x.zoom=1,x.pan=[0,0],x.orbit=0,x.orbitHeight=1.8,x.meta&&fe){fe.position.set(Ue(x.index,6),Ue(x.index,7),-Ue(x.index,8));let n=xn();fe.position.set(n.x,n.y,-n.z),x.freeYaw=n.yaw,x.freePitch=-.15,Sr=-1}}function gx(){if(!fe)return;Wi("free");let{x:n,z:e,yaw:t}=xn(),i=!1;for(let s of[2.8,1.6]){for(let r of[t,t+Math.PI/2,t+Math.PI,t-Math.PI/2,0,Math.PI/2,Math.PI,Math.PI*1.5]){let a=Math.sin(r)*s,o=Math.cos(r)*s,l=!0;for(let c=0;c<=20;c++)if(Mr(Math.floor((n+a*c/20)/2),Math.floor((e+o*c/20)/2))){l=!1;break}if(l){fe.position.set(n+a,1.4,-e-o),i=!0;break}}if(i)break}i||fe.position.set(n+.01,5,-e),Ic(n,1.35,e)}function Ic(n,e,t){let i=new B(n,e,-t).sub(fe.position);x.freeYaw=Math.atan2(i.x,-i.z),x.freePitch=Math.atan2(i.y,Math.hypot(i.x,i.z))}function xx(n,e,t=x.index){if(Mr(Math.floor(n.x/2),Math.floor(n.z/2)))return!0;let i=x.subject<0?6:24+x.subject*12,s=x.subject<0?8:i+1;for(let r of[t,t+1]){if(r>=x.meta.frames||!$t.has(Math.floor(r/360)))continue;let a=r*x.meta.words;if(mc({x:x.f[a+i],y:n.y,z:x.f[a+s]},Mr,x.meta.ceiling,e))return!0}return!1}function Pc(n,e=x.subject){let t=n+1;if(n<0||t>=x.meta.frames||!$t.has(Math.floor(n/360))||!$t.has(Math.floor(t/360)))return!1;let i=e<0?6:24+e*12,s=e<0?8:i+1,r=n*x.meta.words,a=t*x.meta.words,o=dt.display(x.times[t],!0)-dt.display(x.times[n],!0);return Fu({x:x.f[r+i],z:x.f[r+s]},{x:x.f[a+i],z:x.f[a+s]},o)}function _x(n){if(!x.meta||!x.meta.playbackSafe||!Ht||!fe||!ui||!di||!yr||!ci||_r.length!==x.meta.entities||x.mode==="top")return;let e=ee("viewport").getBoundingClientRect();(Ht.domElement.width!==Math.round(e.width*Ht.getPixelRatio())||Ht.domElement.height!==Math.round(e.height*Ht.getPixelRatio()))&&Ht.setSize(e.width,e.height,!1),fe.aspect=e.width/e.height;let t=x.index,i=Ue(t,6),s=Ue(t,8),r=Ue(t,9),a=xn();if(x.mode==="first"){fe.position.set(x.subject<0?Ue(t,12):a.x,x.subject<0?Ue(t,13):a.y,-(x.subject<0?Ue(t,14):a.z));let h=x.subject<0?Ue(t,15):a.yaw,u=x.subject<0?Ue(t,16):0;fe.up.set(0,1,0),fe.lookAt(fe.position.x+Math.sin(h)*Math.cos(u),fe.position.y+Math.sin(u),fe.position.z-Math.cos(h)*Math.cos(u)),x.subject<0&&fe.rotateZ(Ue(t,17)),fe.fov=2*Math.atan(Math.tan(Ue(t,18)/2)/fe.aspect)*180/Math.PI}else if(x.mode==="third"){Wn||(_c=x.time);let h=Jt(),u=x.subject<0?.22:.26;for(let f of Ou(x.times,_c,x.time,n,m=>dt.display(m,h))){if(!$t.has(Math.floor(f.index/360))){Wn=null;continue}let m=xn(f.index,f.time),_={x:m.x,y:x.subject<0?1.2:1.45,z:m.z},g=!1;for(let p=Wn?.recordedIndex??f.index;p<f.index;p++)if(Pc(p)){g=!0;break}Wn=Qu(Wn,{focus:_,yaw:m.yaw+x.orbit,height:x.orbitHeight,ceiling:x.meta.ceiling,cutaway:ee("cutaway").checked,targetRadius:u,allowNoclip:xx(_,u,f.index),isWall:Mr,dt:f.dt,cut:g}),Wn.recordedIndex=f.index}_c=x.time;let d=Wn.position;fe.position.set(d.x,d.y,-d.z),fe.up.set(0,1,0),fe.lookAt(a.x,x.subject<0?1.2:1.45,-a.z),fe.fov=65}else{if(Rn){let m=Rn;fe.position.set(m.destination.x+a.x-m.subjectStart.x,m.destination.y,m.destination.z-a.z+m.subjectStart.z),Ic(a.x,1.35,a.z)}let h=x.mouseButton===2?x.flySpeed*(x.keys.has("Shift")?3:1)*n:0,u=x.freeYaw,d=+x.keys.has("w")-+x.keys.has("s"),f=+x.keys.has("d")-+x.keys.has("a");fe.position.x+=(Math.sin(u)*Math.cos(x.freePitch)*d+Math.cos(u)*f)*h,fe.position.z+=(-Math.cos(u)*Math.cos(x.freePitch)*d+Math.sin(u)*f)*h,fe.position.y+=(Math.sin(x.freePitch)*d+(+x.keys.has("e")-+x.keys.has("q")))*h,fe.up.set(0,1,0),fe.lookAt(fe.position.x+Math.sin(u)*Math.cos(x.freePitch),fe.position.y+Math.sin(x.freePitch),fe.position.z-Math.cos(u)*Math.cos(x.freePitch)),fe.fov=70}hx(),fe.updateProjectionMatrix(),ui.update(fe,{x:Ue(t,12),y:Ue(t,13),z:Ue(t,14)},Ue(t,15),Ue(t,16),!!(Es(t,1)&512),x.mode!=="first"&&ee("cutaway").checked),di.visible=x.mode!=="first"||x.subject>=0,di.position.set(i,.025,-s),di.rotation.y=-r,yr.visible=ee("trails").checked;let o=wr(x.time)?"pause:"+t:x.playing?Math.floor(x.time*30):x.time;for(let h=0;h<x.meta.entities;h++){let u=24+h*12,d=_r[h],f=Math.hypot(Ue(t,u)-fe.position.x,-Ue(t,u+1)-fe.position.z)<60;if(d.visible=f&&!(x.mode==="first"&&x.subject===h),d.visible&&(d.userData.wire.material.uniforms.actorAmbient.value=ui.probe(Ue(t,u),Ue(t,u+1))),d.visible&&d.userData.tick!==o){let m=yc(h),{wire:_,particles:g}=d.userData;td(_.geometry,m.vertices),Uo(g.geometry,m.particles),d.userData.tick=o}}for(let h of wc){let u=h.userData.coin.pickupTime;Lu(h,Ue(t,22),u==null?null:dt.display(u,!0),dt.display(x.time,!0))}let l=ur(x.meta,x.time),c=`${t}:${l.cell.join(":")}`;ui.setExit(l.cell,l.altered),ci.material.color.set(l.altered?bo:3921489),ci.userData.tick!==c&&(Uo(ci.geometry,yc(0,!0,l.cell).particles),ci.userData.tick=c),fi.visible=l.showOriginal,l.showOriginal&&fi.userData.tick!==t&&(Uo(fi.geometry,yc(0,!0,l.canonical).particles),fi.userData.tick=t),Sr=t,Ht.render(rn,fe),rx(e.width,e.height)}function xn(n=x.index,e=x.time){let t=x.subject<0,i=t?6:24+x.subject*12,s=t?9:i+2,r=Math.min(n+1,x.meta.frames-1),a=r>n&&$t.has(Math.floor(r/360))&&!Pc(n)?Bt((e-x.times[n])/(x.times[r]-x.times[n]),0,1):0,o=l=>{let c=x.f[n*x.meta.words+l],h=x.f[r*x.meta.words+l];return c+(l===s?((h-c+Math.PI)%(Math.PI*2)+Math.PI*2)%(Math.PI*2)-Math.PI:h-c)*a};return{x:o(i),y:t?o(7):2.05,z:o(t?8:i+1),yaw:o(s)}}var Cn=new Map,mi=null,Bo=null,br=!1;function yx(n){if(!x.ready)return;Rc(),n.preventDefault();let e=Kt.getBoundingClientRect();Cn.set(n.pointerId,{x:n.clientX-e.left,y:n.clientY-e.top}),Kt.setPointerCapture(n.pointerId),mi=Eo(Cn.values()),Cn.size===1?(Bo=mi,br=!1):br=!0}function vx(n){if(!Cn.has(n.pointerId))return;n.preventDefault();let e=Kt.getBoundingClientRect();Cn.set(n.pointerId,{x:n.clientX-e.left,y:n.clientY-e.top});let t=Eo(Cn.values()),i=cc(mi,t);if(Bo&&Math.hypot(t.x-Bo.x,t.y-Bo.y)>6&&(br=!0),i){let{dx:s,dy:r,ratio:a,multi:o}=i;if(x.mode==="top")Object.assign(x,Bu(x,mi,t,e.width,e.height));else if(x.mode==="third")x.orbit+=s*.008,x.orbitHeight=Bt(o?x.orbitHeight/a:x.orbitHeight+r*.012,.6,12);else if(x.mode==="free"&&fe)if(!o)x.freeYaw+=s*.004,x.freePitch=Bt(x.freePitch-r*.004,-1.5,1.5);else{let l=.006*x.flySpeed,c=Math.log(a)*6,h=x.freeYaw;fe.position.x-=Math.cos(h)*s*l,fe.position.z-=Math.sin(h)*s*l,fe.position.y+=r*l,fe.position.x+=Math.sin(h)*Math.cos(x.freePitch)*c,fe.position.z-=Math.cos(h)*Math.cos(x.freePitch)*c,fe.position.y+=Math.sin(x.freePitch)*c}}mi=t}function Dc(n){if(n.pointerType!=="touch"){Go();return}Cn.has(n.pointerId)&&(Cn.delete(n.pointerId),mi=Eo(Cn.values()),!mi&&!br&&x.mode==="first"&&n.type==="pointerup"&&ee("play").click())}var Kt=ee("viewport");Kt.addEventListener("contextmenu",n=>n.preventDefault());Kt.addEventListener("pointerdown",n=>{if(n.pointerType==="touch"){yx(n);return}x.meta&&(Rc(),x.drag=[n.clientX,n.clientY],x.mouseButton=n.button,x.alt=n.altKey,Kt.setPointerCapture(n.pointerId),n.preventDefault())});Kt.addEventListener("pointermove",n=>{if(n.pointerType==="touch"){vx(n);return}if(!x.drag)return;let e=n.clientX-x.drag[0],t=n.clientY-x.drag[1];if(x.drag=[n.clientX,n.clientY],x.mode==="top")x.pan[0]+=e,x.pan[1]+=t;else if(x.mode==="free"){if(x.mouseButton===2)x.freeYaw+=e*.004,x.freePitch=Bt(x.freePitch-t*.004,-1.5,1.5);else if(x.mouseButton===1){let i=.012*x.flySpeed;fe.position.x-=Math.cos(x.freeYaw)*e*i,fe.position.z-=Math.sin(x.freeYaw)*e*i,fe.position.y+=t*i}else if(x.alt&&x.mouseButton===0){let i=xn(),s=Math.max(.5,Math.hypot(fe.position.x-i.x,fe.position.y-1.2,fe.position.z+i.z));x.freeYaw+=e*.005,x.freePitch=Bt(x.freePitch-t*.005,-1.45,1.45),fe.position.set(i.x-Math.sin(x.freeYaw)*Math.cos(x.freePitch)*s,1.2-Math.sin(x.freePitch)*s,-i.z+Math.cos(x.freeYaw)*Math.cos(x.freePitch)*s)}}else x.mode==="third"&&(x.orbit+=e*.008,x.orbitHeight=Bt(x.orbitHeight+t*.012,.6,12))});function Go(){Cn.clear(),mi=null,br=!0,x.drag=null,x.mouseButton=-1,x.keys.clear()}Kt.addEventListener("pointerup",Dc);Kt.addEventListener("pointercancel",Dc);Kt.addEventListener("lostpointercapture",Dc);window.addEventListener("blur",Go);Kt.addEventListener("wheel",n=>{if(pi=null,n.preventDefault(),x.mode==="top"){let e=Kt.getBoundingClientRect();Object.assign(x,wo(x,{x:n.clientX-e.left,y:n.clientY-e.top},e.width,e.height,n.deltaY))}x.mode==="free"&&(x.flySpeed=Bt(x.flySpeed*Math.exp(-n.deltaY*.001),.2,100),ee("hint").textContent=`飞行速度 ${x.flySpeed.toFixed(1)} m/s · 右键 + WASD · Q/E · Shift · F 聚焦`),x.mode==="third"&&(x.orbitHeight=Bt(x.orbitHeight+n.deltaY*.005,.6,12))},{passive:!1});Kt.addEventListener("dblclick",n=>{if(x.mode!=="top"||!x.meta)return;let e=Kt.getBoundingClientRect(),t=Md(),i=(n.clientX-e.left-t.x)/t.s,s=512-(n.clientY-e.top-t.y)/t.s;Wi("free"),fe.position.set(i,3,-s)});function bd(n){return!!n?.closest('textarea,select,[contenteditable="true"],input:not([type="range"]):not([type="checkbox"]):not([type="radio"])')}function Sd(n){if(!x.active||n.ctrlKey||n.metaKey||n.altKey||!["Space","ArrowLeft","ArrowRight"].includes(n.code))return!1;if(!x.ready)return!0;if(n.code==="Space")n.repeat||ee("play").click();else{let e=dt.display(x.seekTargetTime??x.time,Jt())+(n.code==="ArrowRight"?5:-5);Er(dt.wall(e,Jt()))}return!0}window.addEventListener("keydown",n=>{if(!x.active||bd(n.target))return;if(Sd(n)){n.preventDefault(),n.stopImmediatePropagation();return}"1234".includes(n.key)&&Wi(["top","first","third","free"][+n.key-1]);let e=n.key==="Shift"?"Shift":n.key.toLowerCase();if(x.keys.add(e),e==="f"&&x.mode==="free"&&fe){Rc();let t=xn();fe.position.set(t.x-Math.sin(t.yaw)*3,1.8,-t.z+Math.cos(t.yaw)*3),Ic(t.x,1.2,t.z)}},{capture:!0});window.addEventListener("keyup",n=>{n.code==="Space"&&!bd(n.target)&&!n.ctrlKey&&!n.metaKey&&!n.altKey&&(n.preventDefault(),n.stopImmediatePropagation()),x.keys.delete(n.key==="Shift"?"Shift":n.key.toLowerCase())},{capture:!0});function wd(n){if(document.body.classList.toggle("parked",!n),n){x.active=!0,Hi.resume(),bc=performance.now(),x.ready&&ko&&hi?.signal.aborted&&(hi=new AbortController,ko.signal=hi.signal),an?.resume(Td()),Xn(!0),Sr=-1;return}x.active=!1,Hi.suspend(),an?.suspend(),xi(!1),Go(),++Tn,++Ts,hi?.abort(),x.waitingChunk=null,x.seekTargetTime=null,gi(!1),ee("loading").hidden=!0}function Mc(n,e,t=""){if(!["run","preview"].includes(n)||typeof e!="string"||!/^[a-f0-9]{24}$/.test(e))return;t=n==="run"?Ro(t,e):"",wd(!0),Cc();let i=n+":"+e+":"+t;i===ud&&x.ready||(ud=i,xr=n==="preview",ax(null,e,0,t))}window.addEventListener("message",n=>{n.origin!==location.origin||n.source!==window.parent||(n.data?.type==="halls-replay-key"&&Sd(n.data),n.data?.type==="halls-replay-visibility"&&wd(n.data.visible===!0),n.data?.type==="halls-replay-open"&&Mc(n.data.kind,n.data.id,n.data.publicBase))});for(let n of document.querySelectorAll("input[type=checkbox]"))n.addEventListener("keydown",e=>{e.key==="Enter"&&(e.preventDefault(),n.click())});var bc=performance.now();function Ed(n){let e=(n-bc)/1e3,{camera:t,playback:i}=Nu(e,x.speed,x.playing);if(bc=n,x.active&&x.ready&&x.meta&&x.meta.playbackSafe){if(Xn(),x.playing&&x.seekTargetTime==null&&!x.buffering){let s=Math.min(x.meta.duration,dt.wall(dt.display(x.time,Jt())+i,Jt())),r=Tc(s),a=Math.floor((r%360===359&&r+1<x.meta.frames&&s>x.times[r]?r+1:r)/360);$t.has(a)?(x.time=s,r!==x.index&&(x.index=r,Gi()),x.time>=x.meta.duration&&xi(!1)):(x.pendingPlayback={index:r,time:s},x.waitingChunk=a,gi(!0),Xn(!0),Sc(a).catch(()=>{}))}md(),Ac(),ee("recorded-pause").hidden=!wr(x.time),vd(),Ue(x.index,19)!==x.displayHealth&&Gi(),x.mode==="top"?dx():_x(t)}requestAnimationFrame(Ed)}requestAnimationFrame(Ed);var xr=new URLSearchParams(location.search).has("preview"),ud="",An=null,ko=null,an=null,dd=0,$t=new Set;function Td(){let n=x.seekTargetTime??x.pendingPlayback?.time??x.time;return{index:x.seekTargetTime!=null?Tc(n):x.pendingPlayback?.index??x.index,time:n,speed:x.speed}}function Xn(n=!1){if(!an||!x.meta||!x.active)return;let e=performance.now();(n||e-dd>250)&&(dd=e,an.update(Td())),x.buffering&&x.playing&&x.seekTargetTime==null&&(x.waitingChunk==null||$t.has(x.waitingChunk))&&an.canResume()&&(x.pendingPlayback&&(x.index=x.pendingPlayback.index,x.time=x.pendingPlayback.time,x.pendingPlayback=null,Gi()),x.waitingChunk=null,gi(!1))}async function Mx(n,e,t,i=""){if(!xr&&!i){let h=await Ao("/api/runs/"+n,{signal:e}),u=await bs(h);if(!h.ok)throw Error(u.error||"回放不可访问。");i=Ro(u.replayBase,n)}let s=new To({session:(xr?"/api/previews/":"/api/runs/")+n+"/replay-session",parts:xr?"/api/previews/"+n+"/replay/":"/api/replay/"+n+"/",publicBase:i},e),r=await(await s.fetch("manifest")).arrayBuffer();if(e.aborted||t!==Tn)throw new DOMException("Replay changed","AbortError");let{meta:a,first:o}=ku(r);ko=s,An=a,$t.clear();let l={...An,frames:An.samples,words:An.words,formSeeds:An.forms.map(String),playbackSafe:!0,fileBytes:0,violations:[],testFixture:!1};x.f=new Float32Array(l.frames*l.words),x.u=new Uint32Array(x.f.buffer),x.u.set(o),$t.add(0),x.times=An.times,x.meta=l,dt=new Ss(l.duration,l.idleRanges,l.chaseRanges);let c=new Io({times:x.times,duration:l.duration,loaded:$t,display:h=>dt.display(h,Jt()),load:bx,onChange:()=>{an===c&&Xn(!0)},onError:(h,u)=>{an===c&&(x.waitingChunk===h||x.buffering&&x.playing)&&u.status!==0&&u.status!==429&&!(u.status>=500)&&(xi(!1),As(u.message))}});return an=c,c.update({index:0,time:0,speed:x.speed}),l}function Sc(n){return an.request(n)}async function bx(n,e,t){if(e.aborted)throw new DOMException("Aborted","AbortError");let i=Tn,s=hi.signal,r=ko,a=An,o=new AbortController,l=()=>o.abort();e.addEventListener("abort",l,{once:!0}),s.addEventListener("abort",l,{once:!0}),s.aborted&&l();try{let c=await(await r.fetch(String(n),{signal:o.signal,priority:t===0?"high":"low"})).arrayBuffer();if(o.signal.aborted||i!==Tn)throw new DOMException("Aborted","AbortError");x.u.set(uc(c,a,n),n*360*a.words)}finally{e.removeEventListener("abort",l),s.removeEventListener("abort",l)}}window.parent!==window&&document.body.classList.add("parked");Uu();id();var Fo=new URLSearchParams(location.search);window.parent===window&&Cc();Fo.has("preview")?Mc("preview",Fo.get("preview")):Fo.has("run")&&Mc("run",Fo.get("run"));window.parent!==window&&window.parent.postMessage({type:"halls-replay-ready"},location.origin);new ResizeObserver(()=>{window.parent!==window&&vr.matches&&window.parent.postMessage({type:"halls-replay-height",height:Math.ceil(document.querySelector("main").getBoundingClientRect().height)},location.origin)}).observe(document.querySelector("main"));
/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */
