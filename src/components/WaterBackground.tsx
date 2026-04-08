import { useEffect, useRef } from 'react';

export default function WaterBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W: number, H: number, t = 0;
    let mouseX = 400, mouseY = 300;
    let targetX = mouseX, targetY = mouseY;
    let smoothX = mouseX, smoothY = mouseY;

    const ripples: Array<{
      x: number;
      y: number;
      r: number;
      maxR: number;
      life: number;
      speed: number;
      ambient?: boolean;
    }> = [];

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (Math.random() < 0.08) {
        ripples.push({
          x: e.clientX,
          y: e.clientY,
          r: 0,
          maxR: 120 + Math.random() * 80,
          life: 0,
          speed: 2.5 + Math.random() * 2,
        });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);

    const ambientInterval = setInterval(() => {
      ripples.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: 0,
        maxR: 80 + Math.random() * 120,
        life: 0,
        speed: 1 + Math.random() * 1.5,
        ambient: true,
      });
    }, 1400);

    const nodes: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      a: number;
    }> = [];

    for (let i = 0; i < 180; i++) {
      nodes.push({
        x: Math.random() * 4000,
        y: Math.random() * 4000,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        r: 0.5 + Math.random() * 1.2,
        a: 0.03 + Math.random() * 0.12,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      smoothX += (targetX - smoothX) * 0.04;
      smoothY += (targetY - smoothY) * 0.04;

      const bg = ctx.createRadialGradient(smoothX, smoothY, 0, smoothX, smoothY, Math.max(W, H) * 0.8);
      bg.addColorStop(0, 'rgba(0,40,80,.28)');
      bg.addColorStop(0.35, 'rgba(0,20,50,.15)');
      bg.addColorStop(1, 'rgba(4,17,31,.0)');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      const halo = ctx.createRadialGradient(smoothX, smoothY, 0, smoothX, smoothY, 320);
      halo.addColorStop(0, 'rgba(0,200,255,.07)');
      halo.addColorStop(0.5, 'rgba(0,160,200,.03)');
      halo.addColorStop(1, 'transparent');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(smoothX, smoothY, 320, 0, Math.PI * 2);
      ctx.fill();

      nodes.forEach((n) => {
        n.x = (n.x + n.vx + W) % W;
        n.y = (n.y + n.vy + H) % H;
        const d = Math.hypot(n.x - smoothX, n.y - smoothY);
        const boost = Math.max(0, 1 - d / 400) * 0.4;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,200,255,${n.a + boost})`;
        ctx.fill();
      });

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
          if (d < 80) {
            const dc = Math.hypot((nodes[i].x + nodes[j].x) / 2 - smoothX, (nodes[i].y + nodes[j].y) / 2 - smoothY);
            const boost = Math.max(0, 1 - dc / 350) * 0.15;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(0,180,255,${(0.04 + boost) * (1 - d / 80)})`;
            ctx.lineWidth = 0.35;
            ctx.stroke();
          }
        }
      }

      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        rp.r += rp.speed;
        rp.life = rp.r / rp.maxR;
        const alpha = rp.ambient ? 0.12 * (1 - rp.life) : 0.22 * (1 - rp.life);
        if (rp.life >= 1) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
        const col = rp.ambient ? `rgba(0,180,255,${alpha})` : `rgba(0,229,204,${alpha})`;
        ctx.strokeStyle = col;
        ctx.lineWidth = rp.ambient ? 0.6 : 1.2;
        ctx.stroke();

        if (!rp.ambient && rp.r > 10) {
          ctx.beginPath();
          ctx.arc(rp.x, rp.y, rp.r * 0.65, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(0,229,204,${alpha * 0.4})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      for (let i = 0; i < 3; i++) {
        const y = ((t * 0.6 + (i * H) / 3) % H);
        const grad = ctx.createLinearGradient(0, y - 2, 0, y + 2);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(0.5, 'rgba(0,200,255,0.018)');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(0, y - 2, W, 4);
      }

      t++;
      requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('mousemove', handleMouseMove);
      clearInterval(ambientInterval);
    };
  }, []);

  return <canvas ref={canvasRef} id="water-bg"></canvas>;
}
