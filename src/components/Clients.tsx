import { useEffect, useRef } from 'react';

function ClientCanvas({ hue }: { hue: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = canvas.width = canvas.parentElement!.clientWidth;
    let H = canvas.height = canvas.parentElement!.clientHeight;
    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < 9; i++) {
        const p = ((t * 0.006 + i / 9) % 1);
        ctx.beginPath();
        ctx.ellipse(
          W / 2,
          H * 0.45 + p * H * 0.32,
          W * 0.44 * (1 - p * 0.5),
          W * 0.1 * (1 - p * 0.4),
          0,
          0,
          Math.PI * 2
        );
        ctx.strokeStyle = `hsla(${hue},75%,60%,${p * 0.45 * (1 - p)})`;
        ctx.lineWidth = 0.9;
        ctx.stroke();
      }
      t++;
      requestAnimationFrame(draw);
    };

    draw();
  }, [hue]);

  return <canvas ref={canvasRef} className="client-canvas"></canvas>;
}

export default function Clients() {
  return (
    <section id="clients" className="pad">
      <div className="wrap">
        <div style={{ textAlign: 'center', maxWidth: '560px', margin: '0 auto 5rem' }} className="reveal">
          <span className="sec-tag">Наши клиенты</span>
          <h2 className="sec-h2">
            Решение для
            <br />
            <em>вашего</em> учреждения
          </h2>
        </div>
        <div className="clients-grid">
          <div className="client-card reveal">
            <ClientCanvas hue={200} />
            <div className="client-overlay"></div>
            <div className="client-content">
              <span className="client-tag">Образование</span>
              <div className="client-title">Школы и университеты</div>
              <p className="client-text">Фонтанчики в коридорах, пурификаторы в столовых.</p>
            </div>
          </div>
          <div className="client-card reveal2">
            <ClientCanvas hue={160} />
            <div className="client-overlay"></div>
            <div className="client-content">
              <span className="client-tag">Здравоохранение</span>
              <div className="client-title">Больницы и клиники</div>
              <p className="client-text">Медицинская чистота воды в палатах и зонах ожидания.</p>
            </div>
          </div>
          <div className="client-card reveal">
            <ClientCanvas hue={220} />
            <div className="client-overlay"></div>
            <div className="client-content">
              <span className="client-tag">Бизнес</span>
              <div className="client-title">Офисы и бизнес-центры</div>
              <p className="client-text">Забота о сотрудниках. Идеально для ESG-стратегии.</p>
            </div>
          </div>
          <div className="client-card reveal2">
            <ClientCanvas hue={35} />
            <div className="client-overlay"></div>
            <div className="client-content">
              <span className="client-tag">Госсектор</span>
              <div className="client-title">Госучреждения и мэрии</div>
              <p className="client-text">Долгосрочные сервисные контракты. Полная документация.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
