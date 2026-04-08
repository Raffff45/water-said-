import { useEffect, useRef } from 'react';
import * as THREE from 'three';

function Fountain3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    const W = canvas.parentElement!.clientWidth;
    const H = canvas.parentElement!.clientHeight;
    renderer.setSize(W, H);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 100);
    camera.position.set(1.4, 1.2, 6.0);
    camera.lookAt(0, 0.2, 0);

    scene.add(new THREE.AmbientLight(0xc8d8e8, 1.8));
    const key = new THREE.DirectionalLight(0xffffff, 3.5);
    key.position.set(4, 8, 6);
    key.castShadow = true;
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x6688aa, 1.5);
    fill.position.set(-5, 2, -4);
    scene.add(fill);
    const top = new THREE.DirectionalLight(0xddeeff, 2.0);
    top.position.set(0, 10, 0);
    scene.add(top);
    const front = new THREE.PointLight(0xffffff, 1.2, 12);
    front.position.set(0, 2, 5);
    scene.add(front);
    const basinL = new THREE.PointLight(0x88ccff, 2.5, 3);
    basinL.position.set(0, 2.2, 0.6);
    scene.add(basinL);

    const steelMat = new THREE.MeshStandardMaterial({
      color: 0xb8c8d0,
      metalness: 0.85,
      roughness: 0.18,
      envMapIntensity: 1.0,
    });
    const steelDarkMat = new THREE.MeshStandardMaterial({
      color: 0x8899a8,
      metalness: 0.9,
      roughness: 0.15,
    });
    const steelTopMat = new THREE.MeshStandardMaterial({
      color: 0xc8d8e0,
      metalness: 0.8,
      roughness: 0.12,
    });
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x55aadd,
      metalness: 0.0,
      roughness: 0.05,
      transparent: true,
      opacity: 0.65,
      emissive: 0x003355,
      emissiveIntensity: 0.3,
    });
    const darkMat = new THREE.MeshStandardMaterial({
      color: 0x1a2530,
      metalness: 0.6,
      roughness: 0.4,
    });
    const ventMat = new THREE.MeshStandardMaterial({
      color: 0x7a8e9a,
      metalness: 0.7,
      roughness: 0.35,
    });

    const g = new THREE.Group();
    scene.add(g);

    const bodyGeo = new THREE.BoxGeometry(1.8, 3.6, 1.8);
    const body = new THREE.Mesh(bodyGeo, steelMat);
    body.position.y = -0.2;
    body.castShadow = true;
    g.add(body);

    const edgeW = 0.04;
    const edgePositions = [
      { x: 0.9, z: 0.9 }, { x: -0.9, z: 0.9 },
      { x: 0.9, z: -0.9 }, { x: -0.9, z: -0.9 },
    ];
    edgePositions.forEach(({ x, z }) => {
      const edge = new THREE.Mesh(
        new THREE.BoxGeometry(edgeW, 3.62, edgeW),
        steelTopMat
      );
      edge.position.set(x, -0.2, z);
      g.add(edge);
    });

    const baseGeo = new THREE.BoxGeometry(1.86, 0.12, 1.86);
    const base = new THREE.Mesh(baseGeo, darkMat);
    base.position.y = -2.06;
    g.add(base);

    [[-0.7, -0.82], [0.7, -0.82], [-0.7, 0.82], [0.7, 0.82]].forEach(([x, z]) => {
      const foot = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.07, 0.06, 10),
        darkMat
      );
      foot.position.set(x, -2.15, z);
      g.add(foot);
    });

    const topSurfaceGeo = new THREE.BoxGeometry(1.86, 0.1, 1.86);
    const topSurface = new THREE.Mesh(topSurfaceGeo, steelTopMat);
    topSurface.position.y = 1.65;
    g.add(topSurface);

    const basinRimGeo = new THREE.BoxGeometry(1.3, 0.08, 1.1);
    const basinRim = new THREE.Mesh(basinRimGeo, steelTopMat);
    basinRim.position.set(-0.05, 1.72, -0.1);
    g.add(basinRim);

    const basinGeo = new THREE.CylinderGeometry(0.46, 0.38, 0.14, 32);
    const basin = new THREE.Mesh(basinGeo, steelDarkMat);
    basin.position.set(-0.05, 1.68, -0.1);
    g.add(basin);

    const waterGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.03, 32);
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.position.set(-0.05, 1.73, -0.1);
    g.add(water);

    const drainGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.02, 16);
    const drain = new THREE.Mesh(
      drainGeo,
      new THREE.MeshStandardMaterial({ color: 0x445566, metalness: 0.9, roughness: 0.3 })
    );
    drain.position.set(-0.05, 1.62, -0.1);
    g.add(drain);

    const spoutBaseGeo = new THREE.CylinderGeometry(0.05, 0.06, 0.3, 16);
    const spoutBase = new THREE.Mesh(spoutBaseGeo, steelTopMat);
    spoutBase.position.set(0.28, 1.82, -0.1);
    spoutBase.rotation.z = -0.2;
    g.add(spoutBase);

    const spoutNeckGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.22, 12);
    const spoutNeck = new THREE.Mesh(spoutNeckGeo, steelTopMat);
    spoutNeck.position.set(0.18, 1.92, -0.1);
    spoutNeck.rotation.z = 0.6;
    g.add(spoutNeck);

    const spoutTipGeo = new THREE.CylinderGeometry(0.025, 0.035, 0.1, 12);
    const spoutTip = new THREE.Mesh(spoutTipGeo, steelDarkMat);
    spoutTip.position.set(0.06, 1.98, -0.1);
    spoutTip.rotation.z = 0.2;
    g.add(spoutTip);

    const leverGeo = new THREE.BoxGeometry(0.22, 0.06, 0.06);
    const lever = new THREE.Mesh(leverGeo, steelDarkMat);
    lever.position.set(0.26, 2.0, -0.1);
    lever.rotation.z = 0.3;
    g.add(lever);

    const leverTipGeo = new THREE.SphereGeometry(0.04, 10, 10);
    const leverTip = new THREE.Mesh(leverTipGeo, steelDarkMat);
    leverTip.position.set(0.38, 1.98, -0.1);
    g.add(leverTip);

    for (let i = 0; i < 7; i++) {
      const slat = new THREE.BoxGeometry(0.7, 0.04, 0.05);
      const sl = new THREE.Mesh(slat, ventMat);
      sl.position.set(0.5, -1.5 + i * 0.1, 0.92);
      sl.rotation.x = -0.15;
      g.add(sl);
    }

    for (let i = 0; i < 7; i++) {
      const slat = new THREE.BoxGeometry(0.05, 0.04, 0.65);
      const sl = new THREE.Mesh(slat, ventMat);
      sl.position.set(0.93, -1.5 + i * 0.1, 0.4);
      sl.rotation.z = 0.15;
      g.add(sl);
    }

    const ventFrameGeo = new THREE.BoxGeometry(0.74, 0.74, 0.04);
    const ventFrame = new THREE.Mesh(
      ventFrameGeo,
      new THREE.MeshStandardMaterial({ color: 0x99aabb, metalness: 0.7, roughness: 0.3 })
    );
    ventFrame.position.set(0.5, -1.52, 0.91);
    g.add(ventFrame);

    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(1.4, 48),
      new THREE.MeshStandardMaterial({ color: 0x020810, transparent: true, opacity: 0.35 })
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -2.18;
    shadow.receiveShadow = true;
    g.add(shadow);

    const dCount = 40;
    const dPos = new Float32Array(dCount * 3);
    const dVel: Array<{ vx: number; vy: number; vz: number; life: number }> = [];
    for (let i = 0; i < dCount; i++) {
      dPos[i * 3] = 0.06;
      dPos[i * 3 + 1] = 1.98;
      dPos[i * 3 + 2] = -0.1;
      dVel.push({
        vx: (Math.random() - 0.6) * 0.035,
        vy: -0.018 - Math.random() * 0.02,
        vz: (Math.random() - 0.5) * 0.015,
        life: Math.random(),
      });
    }
    const dGeo = new THREE.BufferGeometry();
    dGeo.setAttribute('position', new THREE.BufferAttribute(dPos, 3));
    const dPts = new THREE.Points(
      dGeo,
      new THREE.PointsMaterial({
        color: 0x99ddff,
        size: 0.04,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true,
      })
    );
    g.add(dPts);

    // === INTERACTION — full 360° rotation ===
    let drag = false, pX = 0, pY = 0, rotY = -0.3, rotX = 0.06, autoR = true;

    const handleMouseDown = (e: MouseEvent) => { drag = true; autoR = false; pX = e.clientX; pY = e.clientY; };
    const handleTouchStart = (e: TouchEvent) => { drag = true; autoR = false; pX = e.touches[0].clientX; pY = e.touches[0].clientY; };
    const handleMouseUp = () => { drag = false; setTimeout(() => (autoR = true), 4000); };
    const handleTouchEnd = () => { drag = false; setTimeout(() => (autoR = true), 4000); };
    const handleMouseMove = (e: MouseEvent) => {
      if (!drag) return;
      rotY += (e.clientX - pX) * 0.012;
      rotX += (e.clientY - pY) * 0.012;
      pX = e.clientX;
      pY = e.clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (!drag) return;
      rotY += (e.touches[0].clientX - pX) * 0.012;
      rotX += (e.touches[0].clientY - pY) * 0.012;
      pX = e.touches[0].clientX;
      pY = e.touches[0].clientY;
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    let T = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      T += 0.016;
      if (autoR) rotY += 0.005;
      g.rotation.y = rotY;
      g.rotation.x = rotX;

      const p = dPts.geometry.attributes.position;
      for (let i = 0; i < dCount; i++) {
        dVel[i].life += 0.022;
        if (dVel[i].life > 1) {
          dVel[i].life = 0;
          dVel[i].vx = (Math.random() - 0.6) * 0.035;
          dVel[i].vy = -0.016 - Math.random() * 0.018;
          dVel[i].vz = (Math.random() - 0.5) * 0.015;
          p.setXYZ(i, 0.06, 1.98, -0.1);
        } else {
          p.setX(i, p.getX(i) + dVel[i].vx * 0.5);
          p.setY(i, p.getY(i) + dVel[i].vy);
          p.setZ(i, p.getZ(i) + dVel[i].vz * 0.5);
          if (p.getY(i) < 1.64) dVel[i].life = 0.9;
        }
      }
      p.needsUpdate = true;
      water.position.y = 1.73 + Math.sin(T * 1.8) * 0.005;
      basinL.intensity = 2.2 + Math.sin(T * 2.2) * 0.4;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
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
    key.position.set(4, 8, 6);
    key.castShadow = true;
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xddeeff, 1.5);
    fill.position.set(-5, 2, -3);
    scene.add(fill);
    const top = new THREE.DirectionalLight(0xffffff, 1.8);
    top.position.set(0, 10, 0);
    scene.add(top);
    const panelL = new THREE.PointLight(0x0088cc, 1.8, 6);
    panelL.position.set(0, 1.0, 3);
    scene.add(panelL);

    const whiteMat = new THREE.MeshStandardMaterial({
      color: 0xf0f2f4,
      metalness: 0.05,
      roughness: 0.35,
    });
    const blackMat = new THREE.MeshStandardMaterial({
      color: 0x0d1318,
      metalness: 0.3,
      roughness: 0.25,
    });
    const silverMat = new THREE.MeshStandardMaterial({
      color: 0x8899aa,
      metalness: 0.85,
      roughness: 0.15,
    });
    const redIndicator = new THREE.MeshStandardMaterial({
      color: 0xff2200,
      emissive: 0xcc1100,
      emissiveIntensity: 1.0,
      roughness: 0.1,
    });
    const yellowIndicator = new THREE.MeshStandardMaterial({
      color: 0xddaa00,
      emissive: 0xaa8800,
      emissiveIntensity: 0.9,
      roughness: 0.1,
    });
    const blueIndicator = new THREE.MeshStandardMaterial({
      color: 0x0088ff,
      emissive: 0x0055cc,
      emissiveIntensity: 1.0,
      roughness: 0.1,
    });
    const ventMat = new THREE.MeshStandardMaterial({
      color: 0xd0d5da,
      metalness: 0.1,
      roughness: 0.5,
    });

    const g = new THREE.Group();
    scene.add(g);

    const lowerGeo = new THREE.BoxGeometry(1.75, 2.8, 1.2);
    const lower = new THREE.Mesh(lowerGeo, whiteMat);
    lower.position.y = -0.8;
    lower.castShadow = true;
    g.add(lower);

    const upperGeo = new THREE.BoxGeometry(1.75, 1.6, 1.2);
    const upper = new THREE.Mesh(upperGeo, whiteMat);
    upper.position.y = 1.1;
    g.add(upper);

    const divGeo = new THREE.BoxGeometry(1.77, 0.04, 1.22);
    const div = new THREE.Mesh(
      divGeo,
      new THREE.MeshStandardMaterial({ color: 0xccced0, metalness: 0.1, roughness: 0.5 })
    );
    div.position.y = 0.3;
    g.add(div);

    const panelGeo = new THREE.BoxGeometry(1.6, 1.5, 0.08);
    const panel = new THREE.Mesh(panelGeo, blackMat);
    panel.position.set(0, 1.1, 0.64);
    g.add(panel);

    const panelBorderGeo = new THREE.BoxGeometry(1.63, 1.53, 0.06);
    const panelBorder = new THREE.Mesh(
      panelBorderGeo,
      new THREE.MeshStandardMaterial({
        color: 0x1a2535,
        emissive: 0x001133,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.8,
      })
    );
    panelBorder.position.set(0, 1.1, 0.62);
    g.add(panelBorder);

    const logoAreaGeo = new THREE.BoxGeometry(0.7, 0.14, 0.03);
    const logoArea = new THREE.Mesh(
      logoAreaGeo,
      new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xaaaaaa, emissiveIntensity: 0.5 })
    );
    logoArea.position.set(0, 1.78, 0.69);
    g.add(logoArea);

    [-0.18, 0, 0.18].forEach((x) => {
      const letter = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.09, 0.02),
        new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.3 })
      );
      letter.position.set(x, 1.78, 0.70);
      g.add(letter);
    });

    const indicatorColors = [
      { x: -0.42, mat: redIndicator, col: 0xff2200 },
      { x: 0, mat: yellowIndicator, col: 0xddaa00 },
      { x: 0.42, mat: blueIndicator, col: 0x0088ff },
    ];

    indicatorColors.forEach(({ x, mat, col }) => {
      const rod = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.025, 0.55, 12),
        mat
      );
      rod.position.set(x, 1.4, 0.7);
      g.add(rod);

      const rodLight = new THREE.PointLight(col, 0.8, 1.5);
      rodLight.position.set(x, 1.4, 0.8);
      scene.add(rodLight);
    });

    indicatorColors.forEach(({ x }) => {
      const housing = new THREE.Mesh(
        new THREE.CylinderGeometry(0.07, 0.08, 0.3, 16),
        silverMat
      );
      housing.position.set(x, 1.05, 0.72);
      g.add(housing);

      const tip = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.035, 0.12, 12),
        new THREE.MeshStandardMaterial({ color: 0x556677, metalness: 0.9, roughness: 0.1 })
      );
      tip.position.set(x, 0.95, 0.78);
      tip.rotation.x = Math.PI / 2;
      g.add(tip);

      const btnGeo = new THREE.BoxGeometry(0.16, 0.1, 0.06);
      const btn = new THREE.Mesh(
        btnGeo,
        new THREE.MeshStandardMaterial({ color: 0xd0d8e0, metalness: 0.3, roughness: 0.4 })
      );
      btn.position.set(x, 0.83, 0.72);
      g.add(btn);
    });

    const trayGeo = new THREE.BoxGeometry(1.5, 0.06, 0.45);
    const tray = new THREE.Mesh(
      trayGeo,
      new THREE.MeshStandardMaterial({ color: 0xc0c8d0, metalness: 0.6, roughness: 0.3 })
    );
    tray.position.set(0, 0.72, 0.72);
    g.add(tray);

    for (let i = -5; i <= 5; i++) {
      const bar = new THREE.Mesh(
        new THREE.BoxGeometry(0.03, 0.04, 0.42),
        new THREE.MeshStandardMaterial({ color: 0x889aaa, metalness: 0.7, roughness: 0.3 })
      );
      bar.position.set(i * 0.13, 0.74, 0.72);
      g.add(bar);
    }

    // === BOTTOM VENT — back panel only (side grille removed) ===
    for (let i = 0; i < 6; i++) {
      const slat = new THREE.BoxGeometry(0.7, 0.04, 0.04);
      const sl = new THREE.Mesh(slat, ventMat);
      sl.position.set(0.5, -1.8 + i * 0.1, -0.62);
      g.add(sl);
    }

    const baseGeo = new THREE.BoxGeometry(1.82, 0.1, 1.26);
    const base = new THREE.Mesh(
      baseGeo,
      new THREE.MeshStandardMaterial({ color: 0xe0e4e8, metalness: 0.1, roughness: 0.5 })
    );
    base.position.y = -2.25;
    g.add(base);

    [[-0.7, -0.5], [0.7, -0.5], [-0.7, 0.5], [0.7, 0.5]].forEach(([x, z]) => {
      const foot = new THREE.Mesh(
        new THREE.CylinderGeometry(0.055, 0.065, 0.05, 10),
        new THREE.MeshStandardMaterial({ color: 0xbbbbbb, roughness: 0.6 })
      );
      foot.position.set(x, -2.32, z);
      g.add(foot);
    });

    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(1.3, 48),
      new THREE.MeshStandardMaterial({ color: 0x020810, transparent: true, opacity: 0.3 })
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -2.35;
    g.add(shadow);

    const allDrops: Array<{
      pts: THREE.Points;
      vel: Array<{ vy: number; life: number }>;
      count: number;
      x: number;
    }> = [];

    indicatorColors.forEach(({ x, col }) => {
      const count = 15;
      const pos = new Float32Array(count * 3);
      const vel: Array<{ vy: number; life: number }> = [];
      for (let i = 0; i < count; i++) {
        pos[i * 3] = x;
        pos[i * 3 + 1] = 0.95;
        pos[i * 3 + 2] = 0.82;
        vel.push({ vy: -0.016 - Math.random() * 0.012, life: Math.random() });
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const mat = new THREE.PointsMaterial({
        color: col,
        size: 0.035,
        transparent: true,
        opacity: 0.65,
        sizeAttenuation: true,
      });
      const pts = new THREE.Points(geo, mat);
      g.add(pts);
      allDrops.push({ pts, vel, count, x });
    });

    // === INTERACTION — full 360° rotation ===
    let drag = false, pX = 0, pY = 0, rotY = 0.3, rotX = 0.05, autoR = true;

    const handleMouseDown = (e: MouseEvent) => { drag = true; autoR = false; pX = e.clientX; pY = e.clientY; };
    const handleTouchStart = (e: TouchEvent) => { drag = true; autoR = false; pX = e.touches[0].clientX; pY = e.touches[0].clientY; };
    const handleMouseUp = () => { drag = false; setTimeout(() => (autoR = true), 4000); };
    const handleTouchEnd = () => { drag = false; setTimeout(() => (autoR = true), 4000); };
    const handleMouseMove = (e: MouseEvent) => {
      if (!drag) return;
      rotY += (e.clientX - pX) * 0.01;
      rotX += (e.clientY - pY) * 0.01;
      pX = e.clientX;
      pY = e.clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (!drag) return;
      rotY += (e.touches[0].clientX - pX) * 0.01;
      rotX += (e.touches[0].clientY - pY) * 0.01;
      pX = e.touches[0].clientX;
      pY = e.touches[0].clientY;
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    let T = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      T += 0.016;
      if (autoR) rotY += 0.005;
      g.rotation.y = rotY;
      g.rotation.x = rotX;

      allDrops.forEach(({ pts, vel, count, x }) => {
        const p = pts.geometry.attributes.position;
        for (let i = 0; i < count; i++) {
          vel[i].life += 0.022;
          if (vel[i].life > 1) {
            vel[i].life = 0;
            p.setXYZ(i, x + (Math.random() - 0.5) * 0.03, 0.94, 0.82);
          } else {
            p.setY(i, p.getY(i) + vel[i].vy);
            if (p.getY(i) < 0.73) vel[i].life = 0.9;
          }
        }
        p.needsUpdate = true;
      });

      panelL.intensity = 1.6 + Math.sin(T * 1.5) * 0.3;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return <canvas ref={canvasRef} id="p3d"></canvas>;
}

export default function Products() {
  return (
    <section id="products" className="pad">
      <div className="wrap">
        <div className="prod-intro reveal">
          <span className="sec-tag">Наши продукты</span>
          <h2 className="sec-h2">
            Два решения
            <br />
            для <em>идеальной</em> воды
          </h2>
          <p className="body-t">
            Профессиональное оборудование с полным сервисным циклом — от доставки до замены фильтров.
          </p>
        </div>
        <div className="prod-grid">
          <div className="prod-card reveal">
            <div className="prod-stage">
              <Fountain3D />
              <div className="prod-badge">Для общественных мест</div>
              <div className="prod-drag">вращать</div>
            </div>
            <div className="prod-body">
              <div className="prod-num">01 —</div>
              <div className="prod-name">
                Питьевой
                <br />
                фонтанчик
              </div>
              <div className="prod-sub">Нержавеющая сталь · Бесконтактный</div>
              <p className="prod-desc">
                Настенный питьевой фонтанчик с бесконтактным датчиком и встроенным охлаждением. Корпус из порошкового
                покрытия, вандалоустойчивый. Для коридоров, спортзалов и уличных зон.
              </p>
              <div className="prod-specs">
                <div className="spec-item"><span className="spec-dot"></span>ИК-датчик</div>
                <div className="spec-item"><span className="spec-dot"></span>Фильтр тонкой очистки</div>
                <div className="spec-item"><span className="spec-dot"></span>Охлаждение до +7°C</div>
                <div className="spec-item"><span className="spec-dot"></span>До 600 л/сутки</div>
                <div className="spec-item"><span className="spec-dot"></span>Мед. нержавейка</div>
                <div className="spec-item"><span className="spec-dot"></span>Настенный монтаж</div>
              </div>
              <button className="prod-cta">Узнать подробнее →</button>
            </div>
          </div>

          <div className="prod-card reveal2">
            <div className="prod-stage">
              <Purifier3D />
              <div className="prod-badge">Для офисов и кухонь</div>
              <div className="prod-drag">вращать</div>
            </div>
            <div className="prod-body">
              <div className="prod-num">02 —</div>
              <div className="prod-name">
                Пурификатор
                <br />
                воды
              </div>
              <div className="prod-sub">Обратный осмос · 3 температуры</div>
              <p className="prod-desc">
                Напольный диспенсер BAO с тремя кранами: горячая, нормальная и холодная вода. Встроенная система глубокой
                очистки, LED-индикация, элегантный белый корпус.
              </p>
              <div className="prod-specs">
                <div className="spec-item"><span className="spec-dot"></span>Горячая / Норм / Холодная</div>
                <div className="spec-item"><span className="spec-dot"></span>Обратный осмос</div>
                <div className="spec-item"><span className="spec-dot"></span>УФ-стерилизация</div>
                <div className="spec-item"><span className="spec-dot"></span>99.97% очистки</div>
                <div className="spec-item"><span className="spec-dot"></span>LED-индикация</div>
                <div className="spec-item"><span className="spec-dot"></span>Напольный монтаж</div>
              </div>
              <button className="prod-cta">Узнать подробнее →</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
