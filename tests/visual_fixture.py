from visual_codec import fields_for_entities,save_replay

def write_visual(folder,health=(100,100),entities=4):
 fields=fields_for_entities(entities)
 times=[round(i*.1,6) for i in range(len(health))]
 meta={'samples':len(health),'times':times,'duration':times[-1],'activeDuration':times[-1],'simulationDuration':times[-1],'rate':12,'tile':2,'ceiling':2.65,'eye':1.55,'spawnPosition':[3,3],'exit':[5,1],'entities':entities,'forms':list(range(1,entities+1)),'bitmap':bytes(8192),'lampBits':bytes(8192),'path':[[3,3]],'healthEvents':list(zip(times,health)),'idleRanges':[],'chaseRanges':[],'timeBasis':'recorded_wall','inputMode':'held'}
 rows=[]
 for time,hp in zip(times,health):
  values={3:100,6:3,7:1.55,8:3,12:3,13:1.55,14:3,18:1.396,19:hp}
  rows.append([time]+[values.get(k,0) for k in fields]+[1]+[0]*entities+[513,1])
 return save_replay(folder,meta,rows)
