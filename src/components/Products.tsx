import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import Modal from './Modal';

function Fountain3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    const W = canvas.parentElement!.clientWidth;
    const H = canvas.parentElement!.clientHeight;
    renderer.setSize(W, H);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, W / H, 0.1, 100);
    camera.position.set(1.8, 2.2, 5.8);
    camera.lookAt(0, 0.5, 0);

    scene.add(new THREE.AmbientLight(0xd8e4ec, 1.8));
    const key = new THREE.DirectionalLight(0xffffff, 4.0);
    key.position.set(5, 10, 7); key.castShadow = true;
    key.shadow.mapSize.width = 2048; key.shadow.mapSize.height = 2048;
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x9ab0cc, 2.0); fill.position.set(-6, 3, -4); scene.add(fill);
    const top = new THREE.DirectionalLight(0xeef4ff, 2.5); top.position.set(0, 12, 2); scene.add(top);
    const rim = new THREE.DirectionalLight(0xfff8ee, 1.8); rim.position.set(3, 4, 8); scene.add(rim);
    const bowlGlow = new THREE.PointLight(0xaaddff, 4.0, 3.5); bowlGlow.position.set(0.15, 2.35, 0.6); scene.add(bowlGlow);

    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xb8cad4, metalness: 0.82, roughness: 0.22 });
    const topPlateMat = new THREE.MeshStandardMaterial({ color: 0xc5d5de, metalness: 0.88, roughness: 0.14 });
    const bowlMat = new THREE.MeshStandardMaterial({ color: 0xd0dde5, metalness: 0.95, roughness: 0.06 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe0eaf0, metalness: 0.98, roughness: 0.04 });
    const chromeDarkMat = new THREE.MeshStandardMaterial({ color: 0x8899aa, metalness: 0.96, roughness: 0.05 });
    const rubberMat = new THREE.MeshStandardMaterial({ color: 0x1a2028, metalness: 0.0, roughness: 0.95 });
    const waterMat = new THREE.MeshStandardMaterial({ color: 0x55aadd, metalness: 0.0, roughness: 0.02, transparent: true, opacity: 0.55, emissive: 0x002244, emissiveIntensity: 0.5 });
    const drainMat = new THREE.MeshStandardMaterial({ color: 0x5a6a7a, metalness: 0.9, roughness: 0.15 });

    const g = new THREE.Group();
    scene.add(g);

    const body = new THREE.Mesh(new THREE.BoxGeometry(1.55, 3.4, 1.55), bodyMat);
    body.position.y = -0.35; body.castShadow = true; body.receiveShadow = true; g.add(body);

    ([ [-0.775, 0.775], [0.775, 0.775], [-0.775, -0.775], [0.775, -0.775] ] as [number,number][]).forEach(([x, z]) => {
      const e = new THREE.Mesh(new THREE.BoxGeometry(0.03, 3.42, 0.03), topPlateMat);
      e.position.set(x, -0.35, z); g.add(e);
    });

    const basePlate = new THREE.Mesh(new THREE.BoxGeometry(1.60, 0.06, 1.60), new THREE.MeshStandardMaterial({ color: 0x9aacb8, metalness: 0.75, roughness: 0.35 }));
    basePlate.position.y = -2.07; g.add(basePlate);

    ([ [-0.6, -0.6], [0.6, -0.6], [-0.6, 0.6], [0.6, 0.6] ] as [number,number][]).forEach(([x, z]) => {
      const f = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.06, 0.04, 12), rubberMat);
      f.position.set(x, -2.12, z); g.add(f);
    });

    const topPlate = new THREE.Mesh(new THREE.BoxGeometry(1.60, 0.09, 1.60), topPlateMat);
    topPlate.position.y = 1.425; g.add(topPlate);
    const topRim = new THREE.Mesh(new THREE.BoxGeometry(1.62, 0.025, 1.62), chromeMat);
    topRim.position.y = 1.465; g.add(topRim);

    const bowlRim = new THREE.Mesh(new THREE.CylinderGeometry(0.56, 0.58, 0.05, 48), topPlateMat);
    bowlRim.position.set(-0.05, 1.46, 0.04); g.add(bowlRim);

    const bowlPts: THREE.Vector2[] = [[0.53,0.00],[0.52,-0.02],[0.50,-0.06],[0.46,-0.12],[0.38,-0.22],[0.28,-0.32],[0.18,-0.38],[0.10,-0.42],[0.06,-0.44],[0.055,-0.46]].map(([x,y]) => new THREE.Vector2(x,y));
    const bowl = new THREE.Mesh(new THREE.LatheGeometry(bowlPts, 48), bowlMat);
    bowl.position.set(-0.05, 1.46, 0.04); g.add(bowl);

    const bowlBottom = new THREE.Mesh(new THREE.CircleGeometry(0.054, 24), bowlMat);
    bowlBottom.rotation.x = -Math.PI / 2; bowlBottom.position.set(-0.05, 1.00, 0.04); g.add(bowlBottom);

    const waterDisc = new THREE.Mesh(new THREE.CircleGeometry(0.48, 48), waterMat);
    waterDisc.rotation.x = -Math.PI / 2; waterDisc.position.set(-0.05, 1.40, 0.04); g.add(waterDisc);

    const drainRing = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.018, 20), drainMat);
    drainRing.position.set(-0.05, 1.002, 0.04); g.add(drainRing);
    for (let i = 0; i < 4; i++) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.006, 0.012), chromeDarkMat);
      bar.rotation.y = i * Math.PI / 4; bar.position.set(-0.05, 1.012, 0.04); g.add(bar);
    }

    const fBase = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.055, 0.12, 16), chromeMat);
    fBase.position.set(0.42, 1.52, 0.04); g.add(fBase);
    const flange = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.018, 16), chromeMat);
    flange.position.set(0.42, 1.48, 0.04); g.add(flange);
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.036, 0.18, 14), chromeMat);
    neck.position.set(0.42, 1.63, 0.04); neck.rotation.z = 0.12; g.add(neck);
    const elbow = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.030, 12, 24, Math.PI * 0.55), chromeMat);
    elbow.position.set(0.38, 1.72, 0.04); elbow.rotation.z = Math.PI * 0.6; elbow.rotation.y = Math.PI / 2; g.add(elbow);
    const spout = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.030, 0.22, 12), chromeMat);
    spout.position.set(0.20, 1.75, 0.04); spout.rotation.z = Math.PI / 2; g.add(spout);
    const spoutTip = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.026, 0.07, 12), chromeDarkMat);
    spoutTip.position.set(0.06, 1.73, 0.04); spoutTip.rotation.z = 0.35; g.add(spoutTip);
    const aerator = new THREE.Mesh(new THREE.TorusGeometry(0.022, 0.006, 8, 16), chromeDarkMat);
    aerator.position.set(0.04, 1.715, 0.04); aerator.rotation.z = Math.PI / 2; g.add(aerator);
    const leverArm = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.15, 0.038), chromeMat);
    leverArm.position.set(0.44, 1.67, 0.04); leverArm.rotation.z = -0.3; g.add(leverArm);
    const leverTop = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.032, 0.055), chromeDarkMat);
    leverTop.position.set(0.46, 1.74, 0.04); leverTop.rotation.z = -0.3; g.add(leverTop);

    const shadow = new THREE.Mesh(new THREE.CircleGeometry(1.2, 48), new THREE.MeshStandardMaterial({ color: 0x020810, transparent: true, opacity: 0.22 }));
    shadow.rotation.x = -Math.PI / 2; shadow.position.y = -2.14; g.add(shadow);

    const DROPS = 60;
    const dPos = new Float32Array(DROPS * 3);
    const dVel: Array<{ vx: number; vy: number; vz: number; life: number }> = [];
    for (let i = 0; i < DROPS; i++) {
      dPos[i*3]=0.04; dPos[i*3+1]=1.715; dPos[i*3+2]=0.04;
      dVel.push({ vx:-0.018-Math.random()*0.01, vy:-0.012-Math.random()*0.014, vz:(Math.random()-0.5)*0.004, life:Math.random() });
    }
    const dGeo = new THREE.BufferGeometry();
    dGeo.setAttribute('position', new THREE.BufferAttribute(dPos, 3));
    const dPts = new THREE.Points(dGeo, new THREE.PointsMaterial({ color: 0xbbecff, size: 0.032, transparent: true, opacity: 0.85, sizeAttenuation: true }));
    g.add(dPts);

    const SPLASH = 25;
    const sPos = new Float32Array(SPLASH * 3);
    const sVel: Array<{ vx: number; vy: number; vz: number; life: number }> = [];
    for (let i = 0; i < SPLASH; i++) {
      const a = Math.random()*Math.PI*2, r = Math.random()*0.12;
      sPos[i*3]=-0.05+Math.cos(a)*r; sPos[i*3+1]=1.42; sPos[i*3+2]=0.04+Math.sin(a)*r;
      sVel.push({ vx:(Math.random()-0.5)*0.009, vy:0.003+Math.random()*0.005, vz:(Math.random()-0.5)*0.009, life:Math.random() });
    }
    const sGeo = new THREE.BufferGeometry();
    sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
    const sPts = new THREE.Points(sGeo, new THREE.PointsMaterial({ color: 0xddf4ff, size: 0.018, transparent: true, opacity: 0.5, sizeAttenuation: true }));
    g.add(sPts);

    let drag=false, pX=0, pY=0, rotY=0.35, rotX=0.12, autoR=true;
    let touchStartedOnCanvas = false;
    const handleMouseDown = (e: MouseEvent) => { drag=true; autoR=false; pX=e.clientX; pY=e.clientY; };
    const handleTouchStart = (e: TouchEvent) => { touchStartedOnCanvas=true; drag=true; autoR=false; pX=e.touches[0].clientX; pY=e.touches[0].clientY; };
    const handleMouseUp = () => { drag=false; setTimeout(()=>(autoR=true),4500); };
    const handleTouchEnd = () => { touchStartedOnCanvas=false; drag=false; setTimeout(()=>(autoR=true),4500); };
    const handleMouseMove = (e: MouseEvent) => { if(!drag)return; rotY+=(e.clientX-pX)*0.010; rotX+=(e.clientY-pY)*0.008; rotX=Math.max(-0.45,Math.min(0.65,rotX)); pX=e.clientX; pY=e.clientY; };
    const handleTouchMove = (e: TouchEvent) => { if(!touchStartedOnCanvas)return; e.preventDefault(); if(!drag)return; rotY+=(e.touches[0].clientX-pX)*0.010; rotX+=(e.touches[0].clientY-pY)*0.008; rotX=Math.max(-0.45,Math.min(0.65,rotX)); pX=e.touches[0].clientX; pY=e.touches[0].clientY; };
    canvas.addEventListener('mousedown',handleMouseDown);
    canvas.addEventListener('touchstart',handleTouchStart,{passive:false});
    window.addEventListener('mouseup',handleMouseUp);
    window.addEventListener('touchend',handleTouchEnd);
    window.addEventListener('mousemove',handleMouseMove);
    canvas.addEventListener('touchmove',handleTouchMove,{passive:false});

    let T=0;
    const animate = () => {
      requestAnimationFrame(animate); T+=0.016;
      if(autoR) rotY+=0.0035;
      g.rotation.y=rotY; g.rotation.x=rotX;
      const dp=dPts.geometry.attributes.position;
      for(let i=0;i<DROPS;i++){
        dVel[i].life+=0.022;
        if(dVel[i].life>1){ dVel[i].life=0; dVel[i].vx=-0.017-Math.random()*0.009; dVel[i].vy=-0.011-Math.random()*0.013; dVel[i].vz=(Math.random()-0.5)*0.004; dp.setXYZ(i,0.04,1.715,0.04); }
        else { dp.setX(i,dp.getX(i)+dVel[i].vx*0.5); dp.setY(i,dp.getY(i)+dVel[i].vy); dp.setZ(i,dp.getZ(i)+dVel[i].vz*0.3); if(dp.getY(i)<1.41) dVel[i].life=0.88; }
      }
      dp.needsUpdate=true;
      const sp=sPts.geometry.attributes.position;
      for(let i=0;i<SPLASH;i++){
        sVel[i].life+=0.028;
        if(sVel[i].life>1){ sVel[i].life=0; const a=Math.random()*Math.PI*2,r=Math.random()*0.08; sp.setXYZ(i,-0.05+Math.cos(a)*r,1.42,0.04+Math.sin(a)*r); sVel[i].vx=(Math.random()-0.5)*0.008; sVel[i].vy=0.003+Math.random()*0.004; sVel[i].vz=(Math.random()-0.5)*0.008; }
        else { sp.setX(i,sp.getX(i)+sVel[i].vx); sp.setY(i,sp.getY(i)+sVel[i].vy); sp.setZ(i,sp.getZ(i)+sVel[i].vz); }
      }
      sp.needsUpdate=true;
      waterDisc.position.y=1.395+Math.sin(T*1.4)*0.003;
      bowlGlow.intensity=3.5+Math.sin(T*2.0)*0.7;
      renderer.render(scene,camera);
    };
    animate();

    return () => {
      canvas.removeEventListener('mousedown',handleMouseDown);
      canvas.removeEventListener('touchstart',handleTouchStart);
      window.removeEventListener('mouseup',handleMouseUp);
      window.removeEventListener('touchend',handleTouchEnd);
      window.removeEventListener('mousemove',handleMouseMove);
      canvas.removeEventListener('touchmove',handleTouchMove);
    };
  }, []);

  return <canvas ref={canvasRef} id="f3d"></canvas>;
}

function Purifier3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    const W = canvas.parentElement!.clientWidth;
    const H = canvas.parentElement!.clientHeight;
    renderer.setSize(W, H);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 100);
    camera.position.set(-1.2, 0.8, 6.2);
    camera.lookAt(0, 0.2, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 2.0));
    const key = new THREE.DirectionalLight(0xffffff, 3.0);
    key.position.set(4, 8, 6); key.castShadow = true; scene.add(key);
    const fill = new THREE.DirectionalLight(0xddeeff, 1.5); fill.position.set(-5, 2, -3); scene.add(fill);
    const top = new THREE.DirectionalLight(0xffffff, 1.8); top.position.set(0, 10, 0); scene.add(top);
    const panelL = new THREE.PointLight(0x0088cc, 1.8, 6); panelL.position.set(0, 1.0, 3); scene.add(panelL);

    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf0f2f4, metalness: 0.05, roughness: 0.35 });
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x0d1318, metalness: 0.3, roughness: 0.25 });
    const silverMat = new THREE.MeshStandardMaterial({ color: 0x8899aa, metalness: 0.85, roughness: 0.15 });
    const redIndicator = new THREE.MeshStandardMaterial({ color: 0xff2200, emissive: 0xcc1100, emissiveIntensity: 1.0, roughness: 0.1 });
    const yellowIndicator = new THREE.MeshStandardMaterial({ color: 0xddaa00, emissive: 0xaa8800, emissiveIntensity: 0.9, roughness: 0.1 });
    const blueIndicator = new THREE.MeshStandardMaterial({ color: 0x0088ff, emissive: 0x0055cc, emissiveIntensity: 1.0, roughness: 0.1 });
    const ventMat = new THREE.MeshStandardMaterial({ color: 0xd0d5da, metalness: 0.1, roughness: 0.5 });

    const g = new THREE.Group();
    scene.add(g);

    const lower = new THREE.Mesh(new THREE.BoxGeometry(1.75, 2.8, 1.2), whiteMat);
    lower.position.y = -0.8; lower.castShadow = true; g.add(lower);
    const upper = new THREE.Mesh(new THREE.BoxGeometry(1.75, 1.6, 1.2), whiteMat);
    upper.position.y = 1.1; g.add(upper);
    const div = new THREE.Mesh(new THREE.BoxGeometry(1.77, 0.04, 1.22), new THREE.MeshStandardMaterial({ color: 0xccced0, metalness: 0.1, roughness: 0.5 }));
    div.position.y = 0.3; g.add(div);
    const panel = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.5, 0.08), blackMat);
    panel.position.set(0, 1.1, 0.64); g.add(panel);
    const panelBorder = new THREE.Mesh(new THREE.BoxGeometry(1.63, 1.53, 0.06), new THREE.MeshStandardMaterial({ color: 0x1a2535, emissive: 0x001133, emissiveIntensity: 0.3, transparent: true, opacity: 0.8 }));
    panelBorder.position.set(0, 1.1, 0.62); g.add(panelBorder);

    const textCanvas = document.createElement('canvas');
    textCanvas.width = 512; textCanvas.height = 256;
    const tc = textCanvas.getContext('2d')!;
    tc.clearRect(0, 0, 512, 256);
    tc.fillStyle = '#1a3a5c';
    tc.font = 'bold 180px Arial';
    tc.textAlign = 'center';
    tc.textBaseline = 'middle';
    tc.fillText('BAO', 256, 128);
    const textTex = new THREE.CanvasTexture(textCanvas);
    const textMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1.5, 0.75),
      new THREE.MeshStandardMaterial({ map: textTex, transparent: true, depthWrite: false })
    );
    textMesh.position.set(0, 0, 0.615);
    g.add(textMesh);

    const indicatorColors = [
      { x: -0.42, mat: redIndicator, col: 0xff2200 },
      { x: 0, mat: yellowIndicator, col: 0xddaa00 },
      { x: 0.42, mat: blueIndicator, col: 0x0088ff },
    ];

    indicatorColors.forEach(({ x, mat, col }) => {
      const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.55, 12), mat);
      rod.position.set(x, 1.4, 0.7); g.add(rod);
      const rodLight = new THREE.PointLight(col, 0.8, 1.5);
      rodLight.position.set(x, 1.4, 0.8); scene.add(rodLight);
    });

    indicatorColors.forEach(({ x }) => {
      const housing = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.3, 16), silverMat);
      housing.position.set(x, 1.05, 0.72); g.add(housing);
      const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.035, 0.12, 12), new THREE.MeshStandardMaterial({ color: 0x556677, metalness: 0.9, roughness: 0.1 }));
      tip.position.set(x, 0.95, 0.78); tip.rotation.x = Math.PI / 2; g.add(tip);
      const btn = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.1, 0.06), new THREE.MeshStandardMaterial({ color: 0xd0d8e0, metalness: 0.3, roughness: 0.4 }));
      btn.position.set(x, 0.83, 0.72); g.add(btn);
    });

    const tray = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.06, 0.45), new THREE.MeshStandardMaterial({ color: 0xc0c8d0, metalness: 0.6, roughness: 0.3 }));
    tray.position.set(0, 0.72, 0.72); g.add(tray);
    for (let i = -5; i <= 5; i++) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.04, 0.42), new THREE.MeshStandardMaterial({ color: 0x889aaa, metalness: 0.7, roughness: 0.3 }));
      bar.position.set(i * 0.13, 0.74, 0.72); g.add(bar);
    }
    for (let i = 0; i < 6; i++) {
      const sl = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.04, 0.04), ventMat);
      sl.position.set(0.5, -1.8 + i * 0.1, -0.62); g.add(sl);
    }

    const base = new THREE.Mesh(new THREE.BoxGeometry(1.82, 0.1, 1.26), new THREE.MeshStandardMaterial({ color: 0xe0e4e8, metalness: 0.1, roughness: 0.5 }));
    base.position.y = -2.25; g.add(base);
    ([ [-0.7,-0.5],[0.7,-0.5],[-0.7,0.5],[0.7,0.5] ] as [number,number][]).forEach(([x,z]) => {
      const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.065, 0.05, 10), new THREE.MeshStandardMaterial({ color: 0xbbbbbb, roughness: 0.6 }));
      foot.position.set(x, -2.32, z); g.add(foot);
    });

    const shadow = new THREE.Mesh(new THREE.CircleGeometry(1.3, 48), new THREE.MeshStandardMaterial({ color: 0x020810, transparent: true, opacity: 0.3 }));
    shadow.rotation.x = -Math.PI / 2; shadow.position.y = -2.35; g.add(shadow);

    const allDrops: Array<{ pts: THREE.Points; vel: Array<{ vy: number; life: number }>; count: number; x: number }> = [];
    indicatorColors.forEach(({ x, col }) => {
      const count = 15;
      const pos = new Float32Array(count * 3);
      const vel: Array<{ vy: number; life: number }> = [];
      for (let i = 0; i < count; i++) { pos[i*3]=x; pos[i*3+1]=0.95; pos[i*3+2]=0.82; vel.push({ vy:-0.016-Math.random()*0.012, life:Math.random() }); }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const pts = new THREE.Points(geo, new THREE.PointsMaterial({ color: col, size: 0.035, transparent: true, opacity: 0.65, sizeAttenuation: true }));
      g.add(pts);
      allDrops.push({ pts, vel, count, x });
    });

    let drag=false, pX=0, pY=0, rotY=0.3, rotX=0.05, autoR=true;
    let touchStartedOnCanvas = false;
    const handleMouseDown = (e: MouseEvent) => { drag=true; autoR=false; pX=e.clientX; pY=e.clientY; };
    const handleTouchStart = (e: TouchEvent) => { touchStartedOnCanvas=true; drag=true; autoR=false; pX=e.touches[0].clientX; pY=e.touches[0].clientY; };
    const handleMouseUp = () => { drag=false; setTimeout(()=>(autoR=true),4000); };
    const handleTouchEnd = () => { touchStartedOnCanvas=false; drag=false; setTimeout(()=>(autoR=true),4000); };
    const handleMouseMove = (e: MouseEvent) => { if(!drag)return; rotY+=(e.clientX-pX)*0.01; rotX+=(e.clientY-pY)*0.01; pX=e.clientX; pY=e.clientY; };
    const handleTouchMove = (e: TouchEvent) => { if(!touchStartedOnCanvas)return; e.preventDefault(); if(!drag)return; rotY+=(e.touches[0].clientX-pX)*0.01; rotX+=(e.touches[0].clientY-pY)*0.01; pX=e.touches[0].clientX; pY=e.touches[0].clientY; };
    canvas.addEventListener('mousedown',handleMouseDown);
    canvas.addEventListener('touchstart',handleTouchStart,{passive:false});
    window.addEventListener('mouseup',handleMouseUp);
    window.addEventListener('touchend',handleTouchEnd);
    window.addEventListener('mousemove',handleMouseMove);
    canvas.addEventListener('touchmove',handleTouchMove,{passive:false});

    let T=0;
    const animate = () => {
      requestAnimationFrame(animate); T+=0.016;
      if(autoR) rotY+=0.005;
      g.rotation.y=rotY; g.rotation.x=rotX;
      allDrops.forEach(({ pts, vel, count, x }) => {
        const p = pts.geometry.attributes.position;
        for(let i=0;i<count;i++){
          vel[i].life+=0.022;
          if(vel[i].life>1){ vel[i].life=0; p.setXYZ(i,x+(Math.random()-0.5)*0.03,0.94,0.82); vel[i].vy=-0.016-Math.random()*0.012; }
          else { p.setY(i,p.getY(i)+vel[i].vy); if(p.getY(i)<0.73) vel[i].life=0.9; }
        }
        p.needsUpdate=true;
      });
      panelL.intensity=1.6+Math.sin(T*1.5)*0.3;
      renderer.render(scene,camera);
    };
    animate();

    return () => {
      canvas.removeEventListener('mousedown',handleMouseDown);
      canvas.removeEventListener('touchstart',handleTouchStart);
      window.removeEventListener('mouseup',handleMouseUp);
      window.removeEventListener('touchend',handleTouchEnd);
      window.removeEventListener('mousemove',handleMouseMove);
      canvas.removeEventListener('touchmove',handleTouchMove);
    };
  }, []);

  return <canvas ref={canvasRef} id="p3d"></canvas>;
}

// ─── SVG иконки ───────────────────────────────────────────────────────────────

const icons: Record<string, JSX.Element> = {
  ir:       <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>,
  snow:     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="22"/><path d="M17 7l-5 5-5-5"/><path d="M17 17l-5-5-5 5"/><path d="M2 12h20"/><path d="M7 7l-5 5 5 5"/><path d="M17 7l5 5-5 5"/></svg>,
  shield:   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  drop:     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>,
  check:    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  wrench:   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
  temp:     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>,
  filter:   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  sun:      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  led:      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/></svg>,
  building: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>,
};

// ─── типы ─────────────────────────────────────────────────────────────────────

interface SpecItem {
  iconKey: string;
  title: string;
  sub: string;
}

interface ModalContentProps {
  eyebrow: string;
  title: string;
  description: string;
  badge: string;
  imgSrc: string;
  imgAlt: string;
  specs: SpecItem[];
  contactHref: string;
  pdfPath: string;
  onClose: () => void;
}

// ─── модалка с поддержкой тем ─────────────────────────────────────────────────
function useTheme() {
  const [isLight, setIsLight] = useState(
    document.documentElement.getAttribute("data-theme") === "light"
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsLight(document.documentElement.getAttribute("data-theme") === "light");
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  return isLight;
}
function ProductModalContent({
  eyebrow, title, description, badge,
  imgSrc, imgAlt, specs,
  contactHref, pdfPath, onClose,
}: ModalContentProps) {
 const isLight = useTheme();

  const bg           = isLight ? "#f0f8ff"               : "#0c1c2e";
  const footerBg     = isLight ? "#e8f4ff"               : "#0a1826";
  const titleColor   = isLight ? "#04111f"               : "#ffffff";
  const descColor    = isLight ? "rgba(20,60,100,0.7)"   : "rgba(170,205,228,0.75)";
  const eyebrowBg    = isLight ? "rgba(0,80,160,0.12)"   : "rgba(255,255,255,0.13)";
  const eyebrowColor = isLight ? "#0a3a6e"               : "#ffffff";
  const closeBg      = isLight ? "rgba(0,60,120,0.1)"    : "rgba(255,255,255,0.1)";
  const closeColor   = isLight ? "rgba(0,40,80,0.6)"     : "rgba(255,255,255,0.75)";
  const divider      = isLight ? "rgba(0,80,160,0.1)"    : "rgba(255,255,255,0.07)";
  const iconBg       = isLight ? "rgba(0,100,200,0.12)"  : "rgba(30,100,200,0.25)";
  const iconBorder   = isLight ? "rgba(0,120,220,0.35)"  : "rgba(80,150,230,0.6)";
  const iconColor    = isLight ? "#0066bb"               : "#7ec8f0";
  const specTitle    = isLight ? "#0a2540"               : "#ddeeff";
  const specSub      = isLight ? "rgba(20,60,100,0.55)"  : "rgba(140,185,215,0.65)";
  const ghostBg      = isLight ? "rgba(0,60,120,0.07)"   : "rgba(255,255,255,0.04)";
  const ghostBorder  = isLight ? "rgba(0,80,160,0.2)"    : "rgba(255,255,255,0.13)";
  const ghostColor   = isLight ? "rgba(10,50,100,0.8)"   : "rgba(195,222,242,0.85)";

  return (
    <div style={{ display: "flex", flexDirection: "column", borderRadius: "16px", overflow: "hidden", background: bg }}>

      {/* MAIN ROW */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>

        {/* LEFT */}
        <div style={{ padding: "2rem 2rem 1.6rem", display: "flex", flexDirection: "column", gap: "1.4rem" }}>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{
              fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase",
              color: eyebrowColor, background: eyebrowBg,
              padding: "4px 13px", borderRadius: "20px", fontWeight: 500,
            }}>
              {eyebrow}
            </span>
            <button onClick={onClose} style={{
              width: "32px", height: "32px", borderRadius: "50%",
              background: closeBg, border: "none", color: closeColor,
              fontSize: "15px", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>✕</button>
          </div>

          <div>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "2rem", fontWeight: 400, color: titleColor, margin: "0 0 0.6rem", lineHeight: 1.15 }}>
              {title}
            </h2>
            <p style={{ fontSize: "13.5px", color: descColor, lineHeight: 1.7, margin: 0 }}>
              {description}
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem 1.2rem" }}>
            {specs.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <div style={{
                  width: "38px", height: "38px", borderRadius: "50%", flexShrink: 0,
                  background: iconBg, border: `1.5px solid ${iconBorder}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: iconColor,
                }}>
                  {icons[s.iconKey]}
                </div>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: specTitle, lineHeight: 1.3 }}>
                    {s.title}
                  </div>
                  <div style={{ fontSize: "11.5px", color: specSub, marginTop: "3px", lineHeight: 1.45 }}>
                    {s.sub}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ height: "1px", background: divider, marginTop: "auto" }} />
        </div>

        {/* RIGHT — фото */}
        <div style={{ position: "relative", overflow: "hidden", minHeight: "460px" }}>
          <img src={imgSrc} alt={imgAlt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          <div style={{
            position: "absolute", bottom: "14px", left: "14px",
            fontSize: "12px", padding: "5px 14px", borderRadius: "20px",
            background: "rgba(8,18,34,0.72)", color: "rgba(255,255,255,0.9)",
            border: "1px solid rgba(255,255,255,0.14)", backdropFilter: "blur(8px)",
          }}>
            {badge}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: "12px", padding: "14px 16px 16px",
        borderTop: `1px solid ${divider}`,
        background: footerBg,
      }}>
        <a href={contactHref} onClick={onClose} style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: "9px",
          padding: "15px", borderRadius: "10px",
          background: "linear-gradient(135deg, #2272d8, #1a5bbf)",
          color: "#fff", textDecoration: "none", fontWeight: 500, fontSize: "15px",
          boxShadow: "0 4px 22px rgba(30,100,210,0.35)",
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>
          </svg>
          Оставить заявку
        </a>
        <button onClick={() => window.open(pdfPath, "_blank")} style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: "9px",
          padding: "15px", borderRadius: "10px",
          background: ghostBg, border: `1px solid ${ghostBorder}`,
          color: ghostColor, fontSize: "15px", cursor: "pointer", fontWeight: 400,
          fontFamily: "var(--sans)",
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="12" y1="18" x2="12" y2="12"/>
            <polyline points="9 15 12 18 15 15"/>
          </svg>
          Скачать спецификацию
        </button>
      </div>

    </div>
  );
}

// ─── данные ───────────────────────────────────────────────────────────────────

const fountainSpecs: SpecItem[] = [
  { iconKey: "ir",     title: "Бесконтактный ИК-датчик", sub: "Гигиеничное использование" },
  { iconKey: "snow",   title: "Охлаждение до +7°C",      sub: "Комфортная прохладная вода" },
  { iconKey: "shield", title: "Нержавеющая сталь",        sub: "Прочный корпус и долговечность" },
  { iconKey: "drop",   title: "До 600 л/сутки",           sub: "Высокая производительность" },
  { iconKey: "check",  title: "Стандарты ВОЗ и СанПиН",  sub: "Безопасность и качество" },
  { iconKey: "wrench", title: "Установка за 1 день",      sub: "Быстрый монтаж и запуск" },
];

const purifierSpecs: SpecItem[] = [
  { iconKey: "temp",     title: "Горячая / Норм / Холодная", sub: "Три температурных режима" },
  { iconKey: "filter",   title: "Обратный осмос — 99.97%",   sub: "Глубокая очистка воды" },
  { iconKey: "sun",      title: "УФ-стерилизация",           sub: "Уничтожение бактерий и вирусов" },
  { iconKey: "led",      title: "LED-индикация фильтров",     sub: "Контроль состояния фильтров" },
  { iconKey: "building", title: "Элегантный белый корпус",    sub: "Впишется в любой интерьер" },
  { iconKey: "wrench",   title: "Установка за 1 день",        sub: "Быстрый монтаж и запуск" },
];

// ─── главный компонент ────────────────────────────────────────────────────────

export default function Products() {
  const [modal, setModal] = useState<string | null>(null);

  return (
    <section id="products" className="pad">
      <div className="wrap">
        <div className="prod-intro reveal">
          <span className="sec-tag">Наши продукты</span>
          <h2 className="sec-h2">
            Два решения<br />для <em>идеальной</em> воды
          </h2>
          <p className="body-t">
            Профессиональное оборудование с полным сервисным циклом — от доставки до замены фильтров.
          </p>
        </div>

        <div className="prod-grid">
          {/* ФОНТАНЧИК */}
          <div className="prod-card reveal">
            <div className="prod-stage">
              <Fountain3D />
              <div className="prod-badge">Для общественных мест</div>
              <div className="prod-drag">вращать</div>
            </div>
            <div className="prod-body">
              <div className="prod-num">01 —</div>
              <div className="prod-name">Питьевой<br />фонтанчик</div>
              <div className="prod-sub">Нержавеющая сталь · Бесконтактный</div>
              <p className="prod-desc">
                Настенный питьевой фонтанчик с бесконтактным датчиком и встроенным охлаждением. Корпус из порошкового покрытия, вандалоустойчивый. Для коридоров, спортзалов и уличных зон.
              </p>
              <div className="prod-specs">
                <div className="spec-item"><span className="spec-dot"></span>ИК-датчик</div>
                <div className="spec-item"><span className="spec-dot"></span>Фильтр тонкой очистки</div>
                <div className="spec-item"><span className="spec-dot"></span>Охлаждение до +7°C</div>
                <div className="spec-item"><span className="spec-dot"></span>До 600 л/сутки</div>
                <div className="spec-item"><span className="spec-dot"></span>Мед. нержавейка</div>
                <div className="spec-item"><span className="spec-dot"></span>Настенный монтаж</div>
              </div>
              <button className="prod-cta" onClick={() => setModal("fountain")}>
                Узнать подробнее →
              </button>
            </div>
          </div>

          {/* ПУРИФИКАТОР */}
          <div className="prod-card reveal2">
            <div className="prod-stage">
              <Purifier3D />
              <div className="prod-badge">Для офисов и кухонь</div>
              <div className="prod-drag">вращать</div>
            </div>
            <div className="prod-body">
              <div className="prod-num">02 —</div>
              <div className="prod-name">Пурификатор<br />воды</div>
              <div className="prod-sub">Обратный осмос · 3 температуры</div>
              <p className="prod-desc">
                Напольный диспенсер BAO с тремя кранами: горячая, нормальная и холодная вода. Встроенная система глубокой очистки, LED-индикация, элегантный белый корпус.
              </p>
              <div className="prod-specs">
                <div className="spec-item"><span className="spec-dot"></span>Горячая / Норм / Холодная</div>
                <div className="spec-item"><span className="spec-dot"></span>Обратный осмос</div>
                <div className="spec-item"><span className="spec-dot"></span>УФ-стерилизация</div>
                <div className="spec-item"><span className="spec-dot"></span>99.97% очистки</div>
                <div className="spec-item"><span className="spec-dot"></span>LED-индикация</div>
                <div className="spec-item"><span className="spec-dot"></span>Напольный монтаж</div>
              </div>
              <button className="prod-cta" onClick={() => setModal("purifier")}>
                Узнать подробнее →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* МОДАЛКА — ФОНТАНЧИК */}
      <Modal isOpen={modal === "fountain"} onClose={() => setModal(null)}>
        <ProductModalContent
          eyebrow="Продукт 01"
          title="Питьевой фонтанчик"
          description="Компактный и надёжный питьевой фонтанчик для общественных мест и офисных помещений."
          badge="Для общественных мест"
          imgSrc="https://dpbyblauovgdabyyrfai.supabase.co/storage/v1/object/public/images/room1.png"
          imgAlt="Питьевой фонтанчик"
          specs={fountainSpecs}
          contactHref="#contact"
          pdfPath="/spec-fountain.pdf"
          onClose={() => setModal(null)}
        />
      </Modal>

      {/* МОДАЛКА — ПУРИФИКАТОР */}
      <Modal isOpen={modal === "purifier"} onClose={() => setModal(null)}>
        <ProductModalContent
          eyebrow="Продукт 02"
          title="Пурификатор воды"
          description="Элегантная система очистки воды для офисов, кухонь и переговорных комнат."
          badge="Для офисов и кухонь"
          imgSrc="https://dpbyblauovgdabyyrfai.supabase.co/storage/v1/object/public/images/room2.png"
          imgAlt="Пурификатор воды"
          specs={purifierSpecs}
          contactHref="#contact"
          pdfPath="/spec-purifier.pdf"
          onClose={() => setModal(null)}
        />
      </Modal>

    </section>
  );
}