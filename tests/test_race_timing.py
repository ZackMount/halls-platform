import copy,math,sys,unittest
from pathlib import Path
from unittest.mock import patch
sys.path[:0]=[str(Path(__file__).resolve().parents[1]/'engine')]
from race_reference import reference_route,segment_clear
from race_timing import exact_distance,timing_reference,solver_path
from test_competitive import world,sample
from scoring import evaluate_report
class RaceTimingTests(unittest.TestCase):
 @unittest.skipUnless(solver_path().is_file(),'Build with tools/build_race_exact.py')
 def test_exact_detour_uses_expanded_wall_corners(self):
  w=world({(3,z) for z in range(1,4)});start=(3.,3.);ref=reference_route(w,start,(5,1));d=exact_distance(w,start,(5,1),ref['distance'])
  expected=math.dist(start,(5.78,8.22))+2.44+math.dist((8.22,8.22),(10.,4.))
  self.assertAlmostEqual(d,expected,places=6);self.assertLess(d,ref['distance'])
 @unittest.skipUnless(solver_path().is_file(),'Build with tools/build_race_exact.py')
 def test_direct_exit_area_and_start_inside(self):
  for start,exit,expected in [((3.,3.),(5,1),7.),((11.,3.),(5,1),0.)]:
   w=world();ref=reference_route(w,start,exit);self.assertAlmostEqual(exact_distance(w,start,exit,ref['distance']),expected,places=6)
 def test_tightening_is_bounded_and_public_route_is_immutable(self):
  ref={'available':True,'distance':500.,'seconds':100.,'path':[[3.,3.],[11.,3.]]};before=copy.deepcopy(ref)
  with patch('race_timing.exact_distance',return_value=450.):result=timing_reference(None,(3,3),(5,1),ref,5)
  self.assertEqual(ref,before);self.assertEqual(result['exactSeconds'],90);self.assertEqual(result['scoringSeconds'],95);self.assertTrue(result['tighteningLimited'])
 def test_legacy_reports_keep_scores_and_new_timing_only_changes_pace(self):
  r=sample();before=copy.deepcopy(r);old=evaluate_report(r)
  r['metrics']['raceTiming']={'version':'visibility-timing-1','scoringSeconds':95.,'exactSeconds':90.}
  new=evaluate_report(r);self.assertLess(new['components']['pace'],old['components']['pace']);self.assertGreater(new['components']['pace'],42)
  for k in ('completion','coins','tactics'):self.assertEqual(new['components'][k],old['components'][k])
  self.assertEqual(evaluate_report(before),old)
 def test_solver_failure_does_not_silently_use_an_easy_reference(self):
  with patch('race_timing.solver_path',return_value=Path('/nonexistent/race-solver')),self.assertRaises(RuntimeError):exact_distance(world(),(3.,3.),(5,1),7.)

 @unittest.skipUnless(solver_path().is_file(),'Build with tools/build_race_exact.py')
 def test_random_maps_match_independent_dense_visibility_graph(self):
  import heapq,random
  for seed in range(12):
   rng=random.Random(seed);walls={(x,z) for z in range(2,10) for x in range(3,10) if rng.random()<.18};w=world(walls);start=(3.,3.);exit=(11,6);ref=reference_route(w,start,exit)
   points=[start]
   def free(p):
    for z in range(math.floor(p[1]/2)-1,math.floor(p[1]/2)+2):
     for x in range(math.floor(p[0]/2)-1,math.floor(p[0]/2)+2):
      if w.wall(x,z) and x*2-.22+1e-9<p[0]<(x+1)*2+.22-1e-9 and z*2-.22+1e-9<p[1]<(z+1)*2+.22-1e-9:return False
    return True
   for x,z in walls:
    for a in (x*2-.22,(x+1)*2+.22):
     for b in (z*2-.22,(z+1)*2+.22):
      if free((a,b)):points.append((a,b))
   # Independent dense graph, bounding-box slab collision tests and Dijkstra.
   size=len(points);goals=set()
   for p in list(points):
    q=(max(22.,min(24.,p[0])),max(12.,min(14.,p[1])))
    if q not in points:points.append(q)
    goals.add(points.index(q))
   d=[math.inf]*len(points);d[0]=0;queue=[(0.,0)]
   while queue:
    cost,i=heapq.heappop(queue)
    if cost!=d[i]:continue
    if i in goals:break
    for j,p in enumerate(points):
     length=math.dist(points[i],p)
     if cost+length<d[j] and segment_clear(w,points[i],p,radius=.22-1e-9):d[j]=cost+length;heapq.heappush(queue,(d[j],j))
   got=exact_distance(w,start,exit,ref['distance']);assert abs(got-cost)<1e-6,(seed,got,cost)
