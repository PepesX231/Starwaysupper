import bpy,math
from pathlib import Path
from mathutils import Vector
R=Path(__file__).resolve().parents[1];A=R/'assets'
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
s=bpy.context.scene;s.render.engine='BLENDER_EEVEE_NEXT';s.render.resolution_x=1600;s.render.resolution_y=900;s.render.resolution_percentage=100
s.world.color=(.01,.01,.01);s.view_settings.view_transform='Standard';s.frame_end=120;s.render.fps=30
def plane(name,file,x,y,z,w):
 im=bpy.data.images.load(str(A/file));ratio=im.size[1]/im.size[0];h=w*ratio
 mesh=bpy.data.meshes.new(name);mesh.from_pydata([(-w/2,0,-h/2),(w/2,0,-h/2),(w/2,0,h/2),(-w/2,0,h/2)],[],[(0,1,2,3)]);mesh.update()
 uv=mesh.uv_layers.new();coords=[(0,0),(1,0),(1,1),(0,1)]
 for i,c in enumerate(coords):uv.data[i].uv=c
 o=bpy.data.objects.new(name,mesh);s.collection.objects.link(o);o.location=(x,y,z)
 m=bpy.data.materials.new(name);m.use_nodes=True;n=m.node_tree.nodes;n.clear();out=n.new('ShaderNodeOutputMaterial');p=n.new('ShaderNodeBsdfPrincipled');t=n.new('ShaderNodeTexImage');t.image=im
 m.node_tree.links.new(t.outputs['Color'],p.inputs['Base Color']);m.node_tree.links.new(t.outputs['Color'],p.inputs['Emission Color']);p.inputs['Emission Strength'].default_value=1;m.node_tree.links.new(t.outputs['Alpha'],p.inputs['Alpha']);m.node_tree.links.new(p.outputs[0],out.inputs[0]);m.surface_render_method='DITHERED';o.data.materials.append(m)
 return o
plane('01_FAR_Graphic_City','graphic-city.webp',0,5,0,30)
plane('02_MID_Original_Hamster','pose-0.webp',4,0,-.4,6.3)
plane('03_NEAR_Ink_Rooftop','graphic-ledge.webp',5,-1,-3.4,8)
# Alternate location kept in its own named collection for editable art direction.
alt=plane('ALT_Graphic_Alley','graphic-alley.webp',0,5,0,30);alt.hide_render=True;alt.hide_viewport=True
bpy.ops.mesh.primitive_cube_add(size=.6,location=(6,-.5,3));cube=bpy.context.object;cube.name='Only_3D_Accent_Cube'
m=bpy.data.materials.new('cyan');m.diffuse_color=(.02,.5,1,1);cube.data.materials.append(m)
cube.rotation_euler=(.3,.4,.1);cube.keyframe_insert('rotation_euler',frame=1);cube.rotation_euler.z+=1.3;cube.keyframe_insert('rotation_euler',frame=120)
bpy.ops.object.camera_add(location=(0,-18,1));cam=bpy.context.object;cam.name='Layered_Dolly_Camera';s.camera=cam;cam.data.type='PERSP';cam.data.lens=30
for f,pos,look in [(1,(-.3,-18,1),(0,2,0)),(60,(.6,-16,.7),(1,2,0)),(120,(1.2,-14,.5),(1.4,2,0))]:
 cam.location=pos;cam.rotation_euler=(Vector(look)-cam.location).to_track_quat('-Z','Y').to_euler();cam.keyframe_insert('location',frame=f);cam.keyframe_insert('rotation_euler',frame=f)
s.frame_set(1);bpy.ops.file.pack_all();bpy.ops.wm.save_as_mainfile(filepath=str(R/'blender/star-up-layered.blend'));print('LAYERED_BLEND_DONE',flush=True)
