import * as T from './vendor/three/three.module.js';

// A real lit 3D emblem: solid cubies, a hollow portal and a tubular ascending route.
const img=document.querySelector('.course-identity>img');
if(img){
 const root=document.documentElement,reduced=matchMedia('(prefers-reduced-motion:reduce)'),host=document.createElement('button');
 host.type='button';host.className='core-motion core-solid';host.setAttribute('aria-label','Game Core — เล่นฉากคิวบ์ระเบิดและดึงกลับ');img.replaceWith(host);host.append(img);
 let renderer,raf=0,last=0,time=0,visible=false,ready=false,frames=0;
 const clamp=v=>Math.max(0,Math.min(1,v)),smooth=v=>{v=clamp(v);return v*v*(3-2*v);};
 try{
  renderer=new T.WebGLRenderer({alpha:true,antialias:true,preserveDrawingBuffer:true,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));renderer.setSize(280,252,false);renderer.setClearColor(0,0);renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.35;
  const canvas=renderer.domElement;canvas.setAttribute('aria-hidden','true');host.append(canvas);
  const scene=new T.Scene(),camera=new T.OrthographicCamera(-3.75,3.75,3.375,-3.375,.1,40);camera.position.set(4,3.1,7);camera.lookAt(0,0,0);
  scene.add(new T.HemisphereLight('#d2faff','#123067',2.2));const key=new T.DirectionalLight('#ecfaff',4);key.position.set(3,5,6);scene.add(key);const rim=new T.DirectionalLight('#19bbff',5);rim.position.set(-4,1,-3);scene.add(rim);
  const model=new T.Group();model.rotation.y=-.12;scene.add(model);
  const blue=new T.MeshStandardMaterial({color:'#1256dd',metalness:.62,roughness:.28}),dark=new T.MeshStandardMaterial({color:'#06172d',metalness:.55,roughness:.31}),ice=new T.MeshStandardMaterial({color:'#c1f5ff',emissive:'#5be0ff',emissiveIntensity:.35,metalness:.5,roughness:.24});
  const cyan=new T.MeshBasicMaterial({color:'#58dcff'}),white=new T.MeshBasicMaterial({color:'#d8ffff'}),edgeMat=new T.LineBasicMaterial({color:'#47cfff',transparent:true,opacity:.65});
  const shape=new T.Shape();shape.moveTo(-.24,-.24);shape.lineTo(.24,-.24);shape.lineTo(.24,.24);shape.lineTo(-.24,.24);shape.closePath();const block=new T.ExtrudeGeometry(shape,{depth:.41,bevelEnabled:true,bevelSize:.026,bevelThickness:.026,bevelSegments:1,steps:1});block.center();
  const pieces=[];
  function piece(mesh,home){const index=pieces.length,dir=home.clone();if(dir.length()<.1)dir.set(Math.sin(index*2.4),.5,Math.cos(index*1.7));dir.normalize();const axis=new T.Vector3(Math.sin(index*2.1)+.2,Math.cos(index*1.3),Math.sin(index*.7)).normalize();mesh.position.copy(home);model.add(mesh);pieces.push({mesh,home:home.clone(),dir,axis,dist:1.25+(index%5)*.14,spin:(index%2?1:-1)*(1.9+(index%4)*.6),delay:(index%6)*.018});return mesh;}
  for(let x=-1;x<=1;x++)for(let y=-1;y<=1;y++)for(let z=-1;z<=1;z++){
   if(x===0&&y===0&&z>=0)continue;
   const mesh=new T.Mesh(block,(x+y+z)%3===0?dark:blue);const edge=new T.LineSegments(new T.EdgesGeometry(block,25),edgeMat);mesh.add(edge);piece(mesh,new T.Vector3(x*.51,y*.51,z*.51));
  }
  // The front portal has a true recess, with four physical illuminated jambs.
  for(const [x,y,w,h] of [[-.22,0,.055,.49],[.22,0,.055,.49],[0,.23,.44,.055],[0,-.23,.44,.055]])piece(new T.Mesh(new T.BoxGeometry(w,h,.08),ice),new T.Vector3(x,y,.79));
  const path=new T.CatmullRomCurve3([new T.Vector3(-.85,-.55,.8),new T.Vector3(-1.25,-.3,.45),new T.Vector3(-1.15,-.25,-.55),new T.Vector3(.4,.3,-.7),new T.Vector3(1.0,1.12,-.2)]);
  const arrow=new T.Group();arrow.add(new T.Mesh(new T.TubeGeometry(path,45,.055,6,false),cyan));const tip=new T.Mesh(new T.ConeGeometry(.15,.38,4),ice);tip.position.copy(path.getPoint(1));tip.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),path.getTangent(1).normalize());arrow.add(tip);piece(arrow,new T.Vector3());
  const orb=new T.Mesh(new T.IcosahedronGeometry(.12,1),cyan);model.add(orb);
  const lines=pieces.map(()=>{const geo=new T.BufferGeometry();geo.setAttribute('position',new T.BufferAttribute(new Float32Array(33*3),3));const material=new T.LineBasicMaterial({color:'#86efff',transparent:true,opacity:0,depthTest:false});const line=new T.Line(geo,material);line.frustumCulled=false;model.add(line);const hook=new T.Mesh(new T.SphereGeometry(.032,6,5),white);model.add(hook);return{line,hook};});
  const shock=new T.Mesh(new T.TorusGeometry(1,.012,5,80),new T.MeshBasicMaterial({color:'#a6f4ff',transparent:true,opacity:0,depthTest:false}));shock.rotation.x=Math.PI*.48;model.add(shock);
  const sparkGeo=new T.BufferGeometry();sparkGeo.setAttribute('position',new T.BufferAttribute(new Float32Array(40*3),3));const sparks=new T.Points(sparkGeo,new T.PointsMaterial({color:'#bbf7ff',size:.045,transparent:true,opacity:0,depthTest:false}));model.add(sparks);
  const start=new T.Vector3(),control=new T.Vector3(),end=new T.Vector3(),point=new T.Vector3(),rotation=new T.Quaternion();
  function draw(){
   const t=reduced.matches?0:time%9500;let phase='idle';if(t>=1500&&t<2400)phase='charge';else if(t>=2400&&t<2800)phase='burst';else if(t>=2800&&t<3500)phase='fragments';else if(t>=3500&&t<4100)phase='catch';else if(t>=4100&&t<5450)phase='rebuild';else if(t>=5450&&t<5900)phase='settle';
   const attack=clamp((t-2400)/400),coast=clamp((t-2800)/700),catching=clamp((t-3500)/600),pull=clamp((t-4100)/1350);
   camera.zoom=phase==='charge'?1.3-smooth((t-1500)/900)*.1:phase==='burst'?1.2-attack*.18:['fragments','catch'].includes(phase)?1.02:phase==='rebuild'?1.02+smooth(pull)*.28:1.3;camera.updateProjectionMatrix();
   const exploded=['burst','fragments','catch','rebuild'].includes(phase);model.scale.setScalar(1);model.rotation.y=-.12+Math.sin(time*.0003)*.035;
   if(phase==='charge'){const u=smooth((t-1500)/900);model.scale.set(1-u*.09,1+u*.08,1-u*.09);}
   if(phase==='settle'){const u=(t-5450)/450,k=Math.sin(u*9)*Math.exp(-u*6)*.06;model.scale.setScalar(1+k);}
   pieces.forEach((p,i)=>{
    const u=clamp((pull-p.delay)/(1-p.delay)),out=1-Math.pow(1-clamp((attack-p.delay)/(1-p.delay)),4);
    const amount=phase==='burst'?out:phase==='rebuild'?Math.pow(1-smooth(u),1.55):exploded?1:0;
    const arc=phase==='rebuild'?Math.sin(u*Math.PI)*.38:phase==='fragments'?coast*.1:phase==='catch'?.1:0;
    const d=p.dir.clone().applyAxisAngle(new T.Vector3(0,1,0),arc).multiplyScalar(p.dist*amount);p.mesh.position.copy(p.home).add(d);
    rotation.setFromAxisAngle(p.axis,p.spin*amount);p.mesh.quaternion.copy(rotation);
    const beam=lines[i],show=phase==='catch'||phase==='rebuild';beam.line.visible=show;beam.hook.visible=show;
    if(show){start.set(0,0,0);end.copy(p.mesh.position);control.copy(end).multiplyScalar(.42);control.y+=.45*(1-u);control.x+=Math.sin(i*2.4)*.25;const curve=new T.QuadraticBezierCurve3(start,control,end),a=beam.line.geometry.attributes.position;
     for(let j=0;j<=32;j++){curve.getPoint(j/32,point);a.setXYZ(j,point.x,point.y,point.z);}a.needsUpdate=true;beam.line.geometry.setDrawRange(0,phase==='catch'?Math.max(2,Math.floor(catching*33)):33);beam.line.material.opacity=phase==='catch'?.55:.6*(1-u*.4);curve.getPoint(phase==='catch'?catching:1,point);beam.hook.position.copy(point);
    }
   });
   orb.visible=exploded||phase==='charge'||phase==='settle';orb.scale.setScalar(phase==='charge'?1+(t-1500)/900:phase==='burst'?1.7:1);
   shock.material.opacity=phase==='burst'?(1-attack)*.7:phase==='catch'?.23:phase==='settle'?.4*(1-(t-5450)/450):0;shock.scale.setScalar(phase==='burst'?.2+attack*2.7:phase==='catch'?1.8-catching*.5:1+(t-5450)/450*.5);
   sparks.material.opacity=phase==='burst'?(1-attack)*.9:0;if(phase==='burst'){const a=sparkGeo.attributes.position;for(let i=0;i<40;i++){const angle=i*2.399,r=.3+attack*(1.5+(i%4)*.2);a.setXYZ(i,Math.cos(angle)*r,Math.sin(angle)*r,Math.sin(i*1.7)*r*.5);}a.needsUpdate=true;}
   renderer.render(scene,camera);host.dataset.phase=phase;host.dataset.frame=String(++frames);host.dataset.fragments=String(pieces.length);host.dataset.tethers=String(lines.filter(b=>b.line.visible).length);host.dataset.renderMode='solid-3d';
  }
  function allowed(){return ready&&visible&&!document.hidden&&!reduced.matches&&!root.classList.contains('motion-paused');}
  function tick(now){raf=0;if(!allowed()){last=0;return;}time+=last?Math.min(now-last,50):0;last=now;draw();raf=requestAnimationFrame(tick);}
  function sync(){if(!allowed()){cancelAnimationFrame(raf);raf=0;last=0;if(reduced.matches){time=0;draw();}}else if(!raf)raf=requestAnimationFrame(tick);}
  host.addEventListener('click',()=>{if(reduced.matches||root.classList.contains('motion-paused'))return;time=1500;draw();sync();});new IntersectionObserver(es=>{visible=es.some(e=>e.isIntersecting);sync();},{threshold:.1}).observe(host);
  document.addEventListener('visibilitychange',sync);document.addEventListener('starways:motion-change',sync);reduced.addEventListener('change',sync);canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();ready=false;cancelAnimationFrame(raf);host.classList.remove('core-ready');host.dataset.renderMode='static';});
  ready=true;draw();host.classList.add('core-ready');sync();
 }catch(error){renderer?.dispose();host.classList.remove('core-ready');host.dataset.renderMode='static';console.warn('Game Core fallback:',error.message);}
}
