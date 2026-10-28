"""World-space trigger geometry shared by the decoder and adjudicator."""
def exit_bounds(cell,tile=2.0):
 x,z=cell;return [x*tile,z*tile,(x+1)*tile,(z+1)*tile]
def in_exit(x,z,cell,tile=2.0):
 x0,z0,x1,z1=exit_bounds(cell,tile)
 return x0<=x<x1 and z0<=z<z1
