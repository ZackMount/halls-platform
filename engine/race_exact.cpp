// Euclidean shortest path in the radius-expanded wall union. Visibility graph
// includes all exposed convex obstacle corners, not only a grid A* corridor.
// Tangency is allowed: the result is the continuous-motion time infimum.
#include <algorithm>
#include <array>
#include <cmath>
#include <iostream>
#include <iomanip>
#include <limits>
#include <queue>
#include <vector>
#ifdef _WIN32
#include <fcntl.h>
#include <io.h>
#endif
using namespace std;
struct P{double x,z;};
constexpr double R=.22, EPS=1e-10;
array<unsigned char,8192> bits{};
bool wall(int x,int z){return x<0||z<0||x>=256||z>=256||((bits[(z*256+x)/8]>>(x%8))&1);}
bool inside(P p,int x,int z){return p.x>x*2-R+EPS&&p.x<(x+1)*2+R-EPS&&p.z>z*2-R+EPS&&p.z<(z+1)*2+R-EPS;}
bool freepoint(P p){int x=floor(p.x/2),z=floor(p.z/2);for(int j=z-1;j<=z+1;j++)for(int i=x-1;i<=x+1;i++)if(wall(i,j)&&inside(p,i,j))return false;return true;}
double dist(P a,P b){return hypot(a.x-b.x,a.z-b.z);}
bool blocked(P a,P b,int x,int z){
 double lo=0,hi=1;double pos[2]={a.x,a.z},delta[2]={b.x-a.x,b.z-a.z},mn[2]={x*2-R,z*2-R},mx[2]={(x+1)*2+R,(z+1)*2+R};
 for(int d=0;d<2;d++){
  // Only the open interior blocks visibility; boundary grazing is optimal.
  mn[d]+=EPS;mx[d]-=EPS;
  if(abs(delta[d])<1e-14){if(pos[d]<=mn[d]||pos[d]>=mx[d])return false;}
  else{double u=(mn[d]-pos[d])/delta[d],v=(mx[d]-pos[d])/delta[d];lo=max(lo,min(u,v));hi=min(hi,max(u,v));}
 }
 return lo<hi;
}
bool visible(P a,P b){
 int x=floor(a.x/2),z=floor(a.z/2),tx=floor(b.x/2),tz=floor(b.z/2);
 double dx=b.x-a.x,dz=b.z-a.z;int sx=dx>0?1:-1,sz=dz>0?1:-1;
 double ax=abs(dx)<1e-14?INFINITY:((sx>0?(x+1)*2:x*2)-a.x)/dx;
 double az=abs(dz)<1e-14?INFINITY:((sz>0?(z+1)*2:z*2)-a.z)/dz;
 double ix=abs(dx)<1e-14?INFINITY:2/abs(dx),iz=abs(dz)<1e-14?INFINITY:2/abs(dz);
 for(int step=0;step<1100;step++){
  for(int j=z-1;j<=z+1;j++)for(int i=x-1;i<=x+1;i++)if(wall(i,j)&&blocked(a,b,i,j))return false;
  if((x==tx&&z==tz)||min(ax,az)>=1-EPS)return true;
  if(ax<az){x+=sx;ax+=ix;}else{z+=sz;az+=iz;}
 }
 return false;
}
int main(){
#ifdef _WIN32
 _setmode(_fileno(stdin),_O_BINARY);
#endif
 P start;int ex,ez;double upper;
 if(!(cin>>start.x>>start.z>>ex>>ez>>upper)||!isfinite(start.x)||!isfinite(start.z)||!isfinite(upper)||upper<0||start.x<0||start.x>=512||start.z<0||start.z>=512||ex<0||ex>=256||ez<0||ez>=256)return 2;
 cin.get();cin.read(reinterpret_cast<char*>(bits.data()),bits.size());if(cin.gcount()!=8192||!freepoint(start)||wall(ex,ez))return 3;
 double x0=ex*2,z0=ez*2,x1=x0+2,z1=z0+2;
 auto heuristic=[&](P p){return hypot(max({x0-p.x,0.,p.x-x1}),max({z0-p.z,0.,p.z-z1}));};
 vector<pair<P,P>> targets;
 double xs[]={x0,x0+R,x1-R,x1},zs[]={z0,z0+R,z1-R,z1};
 for(int k=0;k<3;k++)for(int side=0;side<2;side++){
  P a{xs[k],side?z1:z0},b{xs[k+1],side?z1:z0};if(freepoint({(a.x+b.x)/2,a.z}))targets.push_back({a,b});
  a={side?x1:x0,zs[k]};b={side?x1:x0,zs[k+1]};if(freepoint({a.x,(a.z+b.z)/2}))targets.push_back({a,b});
 }
 if(heuristic(start)==0){cout<<"0 1\n"<<start.x<<" "<<start.z<<"\n";return 0;}
 vector<P> nodes{start};
 for(int z=0;z<256;z++)for(int x=0;x<256;x++)if(wall(x,z))for(int dz:{-1,1})for(int dx:{-1,1}){
  if(wall(x+dx,z)||wall(x,z+dz)||wall(x+dx,z+dz))continue;
  P p{dx<0?x*2-R:(x+1)*2+R,dz<0?z*2-R:(z+1)*2+R};if(freepoint(p))nodes.push_back(p);
 }
 vector<double> cost(nodes.size(),INFINITY);vector<int> parent(nodes.size(),-1);vector<bool> done(nodes.size(),false);
 using Q=pair<double,int>;priority_queue<Q,vector<Q>,greater<Q>> queue;cost[0]=0;queue.push({heuristic(start),0});
 double best=INFINITY;int last=-1;P finish{};
 while(!queue.empty()){
  auto [f,u]=queue.top();queue.pop();if(done[u])continue;if(f>=best-EPS)break;done[u]=true;P a=nodes[u];
  for(auto edge:targets){P b{clamp(a.x,min(edge.first.x,edge.second.x),max(edge.first.x,edge.second.x)),clamp(a.z,min(edge.first.z,edge.second.z),max(edge.first.z,edge.second.z))};double candidate=cost[u]+dist(a,b);if(candidate<best&&visible(a,b)){best=candidate;last=u;finish=b;}}
  // Full visibility graph searched lazily; no neighbour count/radius cutoff.
  for(size_t v=1;v<nodes.size();v++)if(!done[v]){double candidate=cost[u]+dist(a,nodes[v]);if(candidate+EPS<cost[v]&&candidate+heuristic(nodes[v])<min(best,upper+1e-6)&&visible(a,nodes[v])){cost[v]=candidate;parent[v]=u;queue.push({candidate+heuristic(nodes[v]),int(v)});}}
 }
 if(last<0)return 4;
 vector<P> path{finish};for(int i=last;i>=0;i=parent[i])path.push_back(nodes[i]);reverse(path.begin(),path.end());
 cout<<setprecision(15)<<best<<" "<<path.size()<<"\n";for(auto p:path)cout<<p.x<<" "<<p.z<<"\n";
}
