import { useEffect, useRef } from 'react';

interface Drop {
  x: number;
  y: number;
  vy: number;
  life: number;
}

interface StageConfig {
  label: string;
  sub: string;
  water: string;
  glow: string;
}

export default function HowItWorks() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const btnGoRef = useRef<HTMLButtonElement | null>(null);
  const btnRstRef = useRef<HTMLButtonElement | null>(null);
  const pillsRef = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const cv = canvasRef.current;
    const btnGo = btnGoRef.current;
    const btnRst = btnRstRef.current;
    const pills = pillsRef.current;

    if (!cv || !btnGo || !btnRst) return;

    const rawCtx = cv.getContext('2d');
    if (!rawCtx) return;

    const ctx: CanvasRenderingContext2D = rawCtx;

    const W = 620;
    const H = 740;
    const CX = W / 2;
    const CR_TOP = 26;
    const CRANE_BOT = CR_TOP + 70;
    const FW = 200;
    const FH = 240;
    const FX = CX - FW / 2;
    const FY = CRANE_BOT + 16;
    const STAGE_H = FH / 4;
    const GW = 82;
    const GH = 118;
    const GX = CX - GW / 2;
    const PIPE_LEN = 40;
    const GY = FY + FH + PIPE_LEN;
    const RING_CY = GY + GH + 40;

    let prog = 0;
    let running = false;
    let startT: number | null = null;
    let raf: number | null = null;
    const DUR = 9000;
    let drops: Drop[] = [];
    let glDrops: Drop[] = [];

    const STAGE_CFG: StageConfig[] = [
      { label: 'Предфильтр',      sub: '5 мкм, механика',         water: '#00b4d8', glow: '#00e5ff' },
      { label: 'Активный уголь',  sub: 'Хлор, металлы, органика', water: '#639922', glow: '#97C459' },
      { label: 'Обратный осмос',  sub: 'Бактерии, вирусы, соли',  water: '#D85A30', glow: '#F0997B' },
      { label: 'УФ-стерилизация', sub: '99.99% патогенов',        water: '#7c3aed', glow: '#a78bfa' },
    ];

    function clamp(v: number, a: number, b: number) {
      return Math.max(a, Math.min(b, v));
    }

    function setGlow(color: string, blur: number) {
      ctx.shadowColor = color;
      ctx.shadowBlur = blur;
    }

    function noGlow() {
      ctx.shadowBlur = 0;
    }

    function rrp(x: number, y: number, w: number, h: number, r: number) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    }

    // ── CRANE ──────────────────────────────────────────────
    function drawCrane(flow: number) {
      ctx.save();
      // vertical pipe
      setGlow('#00b4d8', 10 * flow);
      ctx.strokeStyle = '#1e3a5f';
      ctx.lineWidth = 12;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(CX, CR_TOP);
      ctx.lineTo(CX, CR_TOP + 52);
      ctx.stroke();
      noGlow();
      // horizontal handle
      ctx.strokeStyle = '#2a4a72';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(CX - 22, CR_TOP + 18);
      ctx.lineTo(CX + 22, CR_TOP + 18);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(CX + 22, CR_TOP + 18);
      ctx.lineTo(CX + 22, CR_TOP + 7);
      ctx.stroke();
      // nozzle body
      ctx.fillStyle = '#1e3a5f';
      rrp(CX - 9, CR_TOP + 46, 18, 14, 4);
      ctx.fill();
      // nozzle holes
      ctx.fillStyle = '#2a4a72';
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.rect(CX - 6 + i * 5, CR_TOP + 60, 3, 6);
        ctx.fill();
      }
      noGlow();

      // water stream from nozzle to filter top
      if (flow > 0) {
        const t = Date.now() / 400;
        const sy = CR_TOP + 66;
        const ey = FY - 4;
        ctx.save();
        ctx.globalAlpha = flow * 0.9;
        setGlow('#00e5ff', 14);
        const sg = ctx.createLinearGradient(0, sy, 0, ey);
        sg.addColorStop(0, '#00b4d8');
        sg.addColorStop(1, 'rgba(0,180,216,0.25)');
        ctx.fillStyle = sg;
        const hw = 6 * flow;
        ctx.beginPath();
        ctx.moveTo(CX - hw + Math.sin(t) * 2, sy);
        ctx.quadraticCurveTo(
          CX + Math.sin(t + 1) * 3,
          (sy + ey) / 2,
          CX - hw * 0.4 + Math.sin(t + 2) * 2,
          ey
        );
        ctx.lineTo(CX + hw * 0.4 + Math.sin(t + 2) * 2, ey);
        ctx.quadraticCurveTo(
          CX + Math.sin(t + 1) * 3,
          (sy + ey) / 2,
          CX + hw + Math.sin(t) * 2,
          sy
        );
        ctx.closePath();
        ctx.fill();
        noGlow();
        ctx.restore();
      }
      ctx.restore();
    }

    // ── FILTER ──────────────────────────────────────────────
    function drawFilter(fp: number) {
      ctx.save();
      // outer glow
      setGlow('rgba(0,180,216,0.35)', 22 * clamp(fp, 0, 1));
      ctx.strokeStyle = 'rgba(0,180,216,0.35)';
      ctx.lineWidth = 2;
      ctx.fillStyle = 'rgba(10,25,50,0.88)';
      rrp(FX, FY, FW, FH, 12);
      ctx.fill();
      ctx.stroke();
      noGlow();
      // top connector
      ctx.fillStyle = '#0d2040';
      ctx.strokeStyle = 'rgba(0,180,216,0.4)';
      ctx.lineWidth = 1.5;
      rrp(FX - 10, FY - 13, FW + 20, 20, 5);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#0d2040';
      ctx.beginPath();
      ctx.rect(CX - 5, FY - 28, 10, 18);
      ctx.fill();
      // bottom connector
      rrp(FX - 10, FY + FH - 6, FW + 20, 20, 5);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.rect(CX - 5, FY + FH + 12, 10, 22);
      ctx.fill();

      // stage fills
      ctx.save();
      rrp(FX + 2, FY + 2, FW - 4, FH - 4, 10);
      ctx.clip();

      for (let i = 0; i < 4; i++) {
        const sc = STAGE_CFG[i];
        const sy = FY + i * STAGE_H;
        const frac = clamp(fp * 4 - i, 0, 1);
        const t = Date.now() / 700;

        // bg
        ctx.fillStyle = frac > 0 ? sc.water + '15' : 'rgba(255,255,255,0.02)';
        ctx.fillRect(FX + 2, sy + 2, FW - 4, STAGE_H - 4);

        // water fill wave
        if (frac > 0) {
          ctx.save();
          ctx.globalAlpha = 0.22 * frac;
          const wh = (STAGE_H - 6) * frac;
          const wy = sy + STAGE_H - 2 - wh;
          ctx.fillStyle = sc.water;
          ctx.beginPath();
          ctx.moveTo(FX + 2, sy + STAGE_H - 2);
          for (let x = 0; x <= FW - 4; x += 4) {
            ctx.lineTo(FX + 2 + x, wy + Math.sin(x / 14 + t + i * 1.2) * 4);
          }
          ctx.lineTo(FX + FW - 2, sy + STAGE_H - 2);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }

        // divider
        if (i < 3) {
          ctx.strokeStyle = 'rgba(0,180,216,0.1)';
          ctx.lineWidth = 1;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(FX + 6, sy + STAGE_H);
          ctx.lineTo(FX + FW - 6, sy + STAGE_H);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // labels
        ctx.save();
        ctx.globalAlpha = frac > 0 ? 1 : 0.3;
        ctx.fillStyle = frac > 0 ? '#fff' : 'rgba(255,255,255,0.3)';
        ctx.font = '500 12px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(sc.label, FX + 12, sy + 20);
        ctx.font = '400 10px sans-serif';
        ctx.fillStyle = frac > 0 ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)';
        ctx.fillText(sc.sub, FX + 12, sy + 35);
        // badge
        ctx.fillStyle = frac > 0 ? sc.water : 'rgba(255,255,255,0.1)';
        ctx.beginPath();
        ctx.arc(FX + FW - 18, sy + 17, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = frac > 0 ? '#fff' : 'rgba(255,255,255,0.3)';
        ctx.font = '600 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(String(i + 1), FX + FW - 18, sy + 22);
        ctx.restore();
      }

      ctx.restore();
      ctx.restore();
    }

    // ── OUT PIPE (dashed, filter bottom → glass top) ────────
    function drawOutPipe(flow: number) {
      if (flow <= 0) return;
      ctx.save();
      ctx.globalAlpha = flow;
      const t = Date.now() / 350;
      setGlow('#00e595', 10);
      ctx.strokeStyle = '#00b894';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.setLineDash([11, 8]);
      ctx.lineDashOffset = -t * 2;
      const pipeTopY = FY + FH + 14;
      const pipeBotY = GY - 4;
      ctx.beginPath();
      ctx.moveTo(CX, pipeTopY);
      ctx.lineTo(CX, pipeBotY);
      ctx.stroke();
      ctx.setLineDash([]);
      noGlow();
      ctx.restore();

      // animated water stream on top of dashes
      ctx.save();
      ctx.globalAlpha = flow * 0.55;
      setGlow('#00e595', 8);
      const sg = ctx.createLinearGradient(0, FY + FH + 14, 0, GY - 4);
      sg.addColorStop(0, 'rgba(0,229,149,0.7)');
      sg.addColorStop(1, 'rgba(0,184,148,0.2)');
      ctx.fillStyle = sg;
      const hw = 4 * flow;
      const tws = Date.now() / 380;
      ctx.beginPath();
      ctx.moveTo(CX - hw, FY + FH + 14);
      ctx.lineTo(CX - hw + Math.sin(tws) * 2, GY - 4);
      ctx.lineTo(CX + hw + Math.sin(tws) * 2, GY - 4);
      ctx.lineTo(CX + hw, FY + FH + 14);
      ctx.closePath();
      ctx.fill();
      noGlow();
      ctx.restore();
    }

    // ── GLASS ───────────────────────────────────────────────
    function drawGlass(fill: number, pct: number) {
      ctx.save();
      const wallT = 4;
      // shadow
      ctx.globalAlpha = 0.1;
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.ellipse(GX + GW / 2, GY + GH + 11, GW * 0.37, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      // clip to trapezoid
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(GX + wallT, GY);
      ctx.lineTo(GX + GW - wallT, GY);
      ctx.lineTo(GX + GW, GY + GH);
      ctx.lineTo(GX, GY + GH);
      ctx.closePath();
      ctx.clip();

      if (fill > 0) {
        const t = Date.now() / 900;
        const wh = GH * fill;
        const wy = GY + GH - wh;
        const wg = ctx.createLinearGradient(GX, wy, GX, GY + GH);
        wg.addColorStop(0, '#00b894');
        wg.addColorStop(1, '#00796b');
        ctx.fillStyle = wg;
        ctx.save();
        setGlow('#00e595', 16 * fill);
        ctx.beginPath();
        ctx.moveTo(GX, GY + GH);
        ctx.lineTo(GX + GW, GY + GH);
        ctx.lineTo(GX + GW, wy);
        for (let x = GW; x >= 0; x -= 4) {
          ctx.lineTo(GX + x, wy + Math.sin(x / 11 + t) * 4 * fill);
        }
        ctx.closePath();
        ctx.fill();
        noGlow();
        ctx.restore();
      }
      ctx.restore();

      // glass walls
      setGlow('rgba(0,229,255,0.12)', 8);
      ctx.strokeStyle = 'rgba(120,200,255,0.35)';
      ctx.lineWidth = wallT;
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(GX + wallT, GY);
      ctx.lineTo(GX + wallT, GY + GH);
      ctx.lineTo(GX + GW - wallT, GY + GH);
      ctx.lineTo(GX + GW - wallT, GY);
      ctx.stroke();
      // glass rim
      ctx.strokeStyle = 'rgba(180,220,255,0.5)';
      ctx.lineWidth = wallT * 1.4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(GX, GY);
      ctx.lineTo(GX + GW, GY);
      ctx.stroke();
      noGlow();
      ctx.restore();

      // progress ring
      if (pct > 0) {
        const rx = GX + GW / 2;
        const ry = RING_CY;
        const r = 32;
        ctx.save();
        ctx.strokeStyle = 'rgba(255,255,255,0.08)';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(rx, ry, r, 0, Math.PI * 2);
        ctx.stroke();
        setGlow('#00e595', 14);
        const ag = ctx.createLinearGradient(rx - r, ry, rx + r, ry);
        ag.addColorStop(0, '#00b4d8');
        ag.addColorStop(1, '#00b894');
        ctx.strokeStyle = ag;
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(rx, ry, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (pct / 100));
        ctx.stroke();
        noGlow();
        ctx.fillStyle = pct >= 100 ? '#00e595' : '#fff';
        ctx.font = '500 15px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(Math.round(pct) + '%', rx, ry);
        ctx.textBaseline = 'alphabetic';
        ctx.restore();
      }
    }

    function drawLabels(fp: number, gf: number) {
      ctx.save();
      ctx.textAlign = 'center';
      ctx.font = '12px sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ctx.fillText('Водопровод', CX, CR_TOP - 4);
      ctx.fillStyle = fp > 0 ? 'rgba(0,229,255,0.6)' : 'rgba(255,255,255,0.2)';
      ctx.fillText('Фильтр в разрезе', CX, FY - 20);
      ctx.fillStyle = gf > 0.05 ? '#00e595' : 'rgba(255,255,255,0.25)';
      ctx.fillText('Чистая вода', CX, GY - 11);
      ctx.restore();
    }

    function spawnDrops(glassFill: number) {
      // drops from crane to filter
      if (prog > 0 && prog < 0.35 && Math.random() < 0.5) {
        drops.push({
          x: CX + Math.random() * 5 - 2.5,
          y: CR_TOP + 67,
          vy: 2.5 + Math.random(),
          life: 1,
        });
      }
      // drops from filter to glass
      const outFlow = clamp((prog - 0.72) / 0.18, 0, 1);
      if (outFlow > 0 && prog < 1 && Math.random() < 0.55 * outFlow) {
        glDrops.push({
          x: CX + Math.random() * 5 - 2.5,
          y: FY + FH + 16,
          vy: 2.8 + Math.random(),
          life: 1,
        });
      }
      const fillY = GY + GH - GH * glassFill;
      drops = drops.filter((d) => {
        d.y += d.vy;
        d.vy += 0.18;
        d.life -= 0.014;
        return d.y < FY && d.life > 0;
      });
      glDrops = glDrops.filter((d) => {
        d.y += d.vy;
        d.vy += 0.18;
        d.life -= 0.012;
        return d.y < fillY && d.life > 0;
      });
    }

    function drawDrops() {
      drops.forEach((d) => {
        ctx.save();
        ctx.globalAlpha = d.life * 0.75;
        setGlow('#00e5ff', 8);
        ctx.fillStyle = '#00b4d8';
        ctx.beginPath();
        ctx.ellipse(d.x, d.y, 3, 4.5, 0, 0, Math.PI * 2);
        ctx.fill();
        noGlow();
        ctx.restore();
      });
      glDrops.forEach((d) => {
        ctx.save();
        ctx.globalAlpha = d.life * 0.8;
        setGlow('#00e595', 7);
        ctx.fillStyle = '#00b894';
        ctx.beginPath();
        ctx.ellipse(d.x, d.y, 2.5, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        noGlow();
        ctx.restore();
      });
    }

    function updatePills(fp: number) {
      const si = Math.min(3, Math.floor(fp * 4));
      for (let i = 0; i < 4; i++) {
        const el = pills[i];
        if (!el) continue;
        const done = fp >= (i + 1) / 4;
        const active = !done && i === si && fp > 0 && fp < 1;
        el.className = 'pill' + (done ? ' done' : active ? ' active' : '');
      }
    }

    function renderInitial() {
      ctx.clearRect(0, 0, W, H);
      drawCrane(0);
      drawFilter(0);
      drawGlass(0, 0);
      drawLabels(0, 0);
      updatePills(0);
    }

    function render() {
      ctx.clearRect(0, 0, W, H);
      // crane starts flowing immediately, fades out at 0.35
      const craneFlow =
        prog < 0.35
          ? clamp(prog / 0.12, 0, 1)
          : clamp(1 - (prog - 0.35) / 0.15, 0, 1);
      const filterProg = clamp((prog - 0.1) / 0.62, 0, 1);
      const outFlow = clamp((prog - 0.7) / 0.2, 0, 1);
      const glassFill = clamp((prog - 0.55) / 0.45, 0, 1);
      const pct = Math.round(glassFill * 100);
      drawCrane(craneFlow);
      drawFilter(filterProg);
      drawOutPipe(outFlow);
      drawGlass(glassFill, pct);
      drawLabels(filterProg, glassFill);
      spawnDrops(glassFill);
      drawDrops();
      updatePills(filterProg);
    }

    function frame(ts: number) {
      if (startT === null) startT = ts;
      prog = clamp((ts - startT) / DUR, 0, 1);
      render();
      if (prog < 1) {
        raf = requestAnimationFrame(frame);
      } else {
        running = false;
        btnGo!.textContent = '✓ Завершено';
        btnGo!.disabled = true;
      }
    }

    function handleGo() {
      if (running) return;
      running = true;
      startT = null;
      prog = 0;
      drops = [];
      glDrops = [];
      btnGo!.textContent = '⏸ Фильтрация...';
      btnGo!.disabled = true;
      updatePills(0);
      raf = requestAnimationFrame((ts) => {
        startT = ts;
        raf = requestAnimationFrame(frame);
      });
    }

    function handleReset() {
      if (raf !== null) cancelAnimationFrame(raf);
      running = false;
      prog = 0;
      startT = null;
      drops = [];
      glDrops = [];
      btnGo!.textContent = '▶ Демонстрация';
      btnGo!.disabled = false;
      renderInitial();
    }

    btnGo.addEventListener('click', handleGo);
    btnRst.addEventListener('click', handleReset);
    renderInitial();

    return () => {
      if (raf !== null) cancelAnimationFrame(raf);
      btnGo.removeEventListener('click', handleGo);
      btnRst.removeEventListener('click', handleReset);
    };
  }, []);

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }

        .how-scene {
          background: transparent;
          border-radius: 16px;
          padding: 20px 16px 24px;
          font-family: var(--font-sans, sans-serif);
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .top-label {
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--color-text-secondary, rgba(255,255,255,0.5));
          margin-bottom: 6px;
          text-align: center;
        }

        .sec-title {
          font-size: 22px;
          font-weight: 500;
          color: var(--color-text-primary, #fff);
          text-align: center;
          margin-bottom: 10px;
          line-height: 1.3;
        }

        .sec-title em {
          font-style: italic;
          color: #00b4d8;
        }

        .controls {
          display: flex;
          gap: 12px;
          justify-content: center;
          margin-bottom: 10px;
          flex-wrap: wrap;
        }

        .btn-go {
          background: linear-gradient(135deg, #00b4d8, #0077b6);
          color: #fff;
          border: none;
          border-radius: 40px;
          padding: 10px 32px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          min-width: 160px;
          transition: opacity 0.2s, transform 0.1s;
        }

        .btn-go:hover { opacity: 0.88; transform: translateY(-1px); }
        .btn-go:disabled { opacity: 0.45; cursor: default; transform: none; }

        .btn-rst {
          background: transparent;
          color: var(--color-text-secondary, rgba(255,255,255,0.6));
          border: 1px solid var(--color-border-secondary, rgba(255,255,255,0.2));
          border-radius: 40px;
          padding: 10px 28px;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.2s;
          min-width: 120px;
        }

        .btn-rst:hover {
          background: var(--color-background-secondary, rgba(255,255,255,0.06));
          color: var(--color-text-primary, #fff);
          transform: translateY(-1px);
        }

        .canvas-wrap {
          position: relative;
        }

        .canvas-wrap canvas {
          display: block;
          max-width: 100%;
          height: auto;
        }

        .pills-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .pill {
          position: absolute;
          font-size: 11px;
          padding: 4px 12px;
          border-radius: 20px;
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.3);
          border: 1px solid rgba(255,255,255,0.08);
          transition: all 0.4s;
          white-space: nowrap;
          font-weight: 500;
          pointer-events: auto;
        }

        .pill.active {
          background: rgba(0,180,216,0.2);
          color: #00e5ff;
          border-color: rgba(0,180,216,0.4);
        }

        .pill.done {
          background: rgba(0,229,149,0.15);
          color: #00e595;
          border-color: rgba(0,229,149,0.35);
        }

        .pill:nth-child(1) { top: 108px; left: 2px; }
        .pill:nth-child(2) { top: 108px; right: 2px; }
        .pill:nth-child(3) { top: 288px; left: 2px; }
        .pill:nth-child(4) { top: 288px; right: 2px; }

        @media (max-width: 680px) {
          .pill { font-size: 10px; padding: 3px 8px; }
          .sec-title { font-size: 18px; }
          .btn-go, .btn-rst { padding: 9px 20px; font-size: 14px; min-width: auto; }
        }
      `}</style>

      <section id="how">
        <div className="how-scene">
          <div className="top-label">Технология очистки</div>

          <h2 className="sec-title">
            От водопровода до <em>чистейшей</em> воды
          </h2>

          <div className="controls">
            <button ref={btnGoRef} className="btn-go">
              ▶ Демонстрация
            </button>
            <button ref={btnRstRef} className="btn-rst">
              ↺ Сброс
            </button>
          </div>

          <div className="canvas-wrap">
            <canvas ref={canvasRef} width={620} height={740} />
            <div className="pills-overlay">
              <div ref={(el) => { pillsRef.current[0] = el; }} className="pill">
                1 · Предфильтр
              </div>
              <div ref={(el) => { pillsRef.current[1] = el; }} className="pill">
                2 · Активный уголь
              </div>
              <div ref={(el) => { pillsRef.current[2] = el; }} className="pill">
                3 · Обратный осмос
              </div>
              <div ref={(el) => { pillsRef.current[3] = el; }} className="pill">
                4 · УФ-стерилизация
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}