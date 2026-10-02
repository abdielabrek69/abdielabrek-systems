import * as THREE from 'three';
const canvas=document.querySelector('#hero-canvas');
if(canvas){
const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(55,innerWidth/innerHeight,.1,100);camera.position.set(0,0,7);
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(innerWidth,innerHeight);renderer.setClearColor(0x000000,0);
const count=24000, pos=new Float32Array(count*3), base=new Float32Array(count*3), phase=new Float32Array(count);for(let i=0;i<count;i++){const r=5.5*Math.sqrt(Math.random()),a=Math.random()*Math.PI*2,x=Math.cos(a)*r,y=Math.sin(a)*r*.55,z=(Math.random()-.5)*5;const k=i*3;pos[k]=base[k]=x;pos[k+1]=base[k+1]=y;pos[k+2]=base[k+2]=z;phase[i]=Math.random()*Math.PI*2}
const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(pos,3));const mat=new THREE.PointsMaterial({color:0x4cc9ff,size:.018,sizeAttenuation:true,transparent:true,opacity:.72,depthWrite:false});const points=new THREE.Points(geo,mat);scene.add(points);
const ringGeo=new THREE.TorusGeometry(2.6,.006,8,180);const ringMat=new THREE.MeshBasicMaterial({color:0x4cc9ff,transparent:true,opacity:.16});const ring=new THREE.Mesh(ringGeo,ringMat);ring.rotation.x=.9;scene.add(ring);
const mouse=new THREE.Vector2(),target=new THREE.Vector2();window.addEventListener('pointermove',e=>{target.x=(e.clientX/innerWidth-.5)*2;target.y=-(e.clientY/innerHeight-.5)*2},{passive:true});
const clock=new THREE.Clock();function animate(){requestAnimationFrame(animate);const t=clock.getElapsedTime();mouse.lerp(target,.035);const a=geo.attributes.position.array;for(let i=0;i<count;i++){const k=i*3;const drift=Math.sin(t*.7+phase[i]+base[k]*1.4)*.025;a[k]=base[k]+Math.sin(t*.18+phase[i])*.035+mouse.x*(Math.max(0,1-Math.abs(base[k+2])/5))*0.18;a[k+1]=base[k+1]+Math.cos(t*.55+phase[i])*.025+mouse.y*.12;a[k+2]=base[k+2]+drift}geo.attributes.position.needsUpdate=true;points.rotation.y=t*.025+mouse.x*.05;points.rotation.x=mouse.y*.035;ring.rotation.z=t*.12;ring.rotation.y=t*.08;renderer.render(scene,camera)}animate();
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
}
