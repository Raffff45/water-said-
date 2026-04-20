import { useEffect, useRef } from 'react';

function InstallationCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W: number, H: number, t = 0, animId: number;

    const resize = () => {
      W = canvas.width = canvas.parentElement!.clientWidth;
      H = canvas.height = canvas.parentElement!.clientHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const orbs: Array<{ a: number; sp: number; rad: number; oy: number }> = [];
    for (let i = 0; i < 22; i++) {
      orbs.push({
        a: Math.random() * Math.PI * 2,
        sp: 0.003 + Math.random() * 0.007,
        rad: 55 + Math.random() * 90,
        oy: (Math.random() - 0.5) * 130,
      });
    }

    const draw = () => {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';

      ctx.clearRect(0, 0, W, H);

      // Фон
      const bg = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, H * 0.72);
      if (isLight) {
        bg.addColorStop(0, 'rgba(180,220,240,.6)');
        bg.addColorStop(1, 'rgba(220,240,255,1)');
      } else {
        bg.addColorStop(0, 'rgba(0,20,48,.95)');
        bg.addColorStop(1, 'rgba(4,17,31,1)');
      }
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      const cx = W / 2, cy = H / 2;

      // Орбы
      const orbColor = isLight ? 'rgba(0,100,160,.5)' : 'rgba(0,200,255,.45)';
      const lineColor = isLight ? 'rgba(0,100,160,.07)' : 'rgba(0,150,200,.05)';
      orbs.forEach((o) => {
        o.a += o.sp;
        const ox = cx + Math.cos(o.a) * o.rad;
        const oy = cy + o.oy + Math.sin(o.a) * o.rad * 0.28;
        ctx.beginPath();
        ctx.arc(ox, oy, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = orbColor;
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(ox, oy);
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      });

      // Пульсирующие кольца вокруг центра
      for (let i = 3; i > 0; i--) {
        const r2 = 32 + i * 20 + Math.sin(t * 0.035) * 4;
        const g2 = ctx.createRadialGradient(cx, cy, 0, cx, cy, r2);
        const alpha = isLight ? 0.1 / i : 0.14 / i;
        const color = isLight ? `rgba(0,100,160,${alpha})` : `rgba(0,200,255,${alpha})`;
        g2.addColorStop(0, color);
        g2.addColorStop(1, 'transparent');
        ctx.fillStyle = g2;
        ctx.beginPath();
        ctx.arc(cx, cy, r2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Центральный шар
      ctx.beginPath();
      ctx.arc(cx, cy, 26, 0, Math.PI * 2);
      const cg = ctx.createRadialGradient(cx - 6, cy - 6, 2, cx, cy, 26);
      if (isLight) {
        cg.addColorStop(0, 'rgba(255,255,255,1)');
        cg.addColorStop(0.4, 'rgba(0,140,200,.9)');
        cg.addColorStop(1, 'rgba(0,80,160,.4)');
      } else {
        cg.addColorStop(0, 'rgba(200,240,255,1)');
        cg.addColorStop(0.4, 'rgba(0,200,255,.9)');
        cg.addColorStop(1, 'rgba(0,60,140,.4)');
      }
      ctx.fillStyle = cg;
      ctx.fill();

      // Расходящиеся волны
      for (let i = 0; i < 3; i++) {
        const rph = (t * 0.018 + i / 3) % 1;
        ctx.beginPath();
        ctx.arc(cx, cy, 48 + rph * 110, 0, Math.PI * 2);
        const waveColor = isLight
          ? `rgba(0,100,160,${0.18 * (1 - rph)})`
          : `rgba(0,200,255,${0.22 * (1 - rph)})`;
        ctx.strokeStyle = waveColor;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // Текст
      const textMain = isLight ? 'rgba(0,80,140,.7)' : 'rgba(0,200,255,.55)';
      const textSub  = isLight ? 'rgba(0,80,140,.45)' : 'rgba(100,180,220,.45)';
      ctx.fillStyle = textMain;
      ctx.font = `400 ${Math.round(W * 0.038)}px Outfit,sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('Умное подключение', cx, cy + H * 0.3);
      ctx.font = `300 ${Math.round(W * 0.03)}px Outfit,sans-serif`;
      ctx.fillStyle = textSub;
      ctx.fillText('IoT · Мониторинг · Сервис', cx, cy + H * 0.37);

      t++;
      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} id="install-canvas"></canvas>;
}

export default function Installation() {
  return (
    <section id="install" className="pad">
      <div className="wrap">
        <div className="install-grid">
          <div className="reveal">
            <span className="sec-tag">Наш процесс</span>
            <h2 className="sec-h2">
              Установили
              <br />и <em>забыли.</em>
            </h2>
            <p className="body-t" style={{ marginBottom: '2.8rem' }}>
              Весь процесс — от первого звонка до запуска — не более 3 рабочих дней.
            </p>
            <div className="isteps">
              <div className="istep">
                <div className="istep-n">1</div>
                <div>
                  <div className="istep-title">Консультация</div>
                  <p className="istep-desc">Бесплатный выезд. Оцениваем помещение и подбираем оптимальное решение.</p>
                </div>
              </div>
              <div className="istep">
                <div className="istep-n">2</div>
                <div>
                  <div className="istep-title">Доставка и монтаж</div>
                  <p className="istep-desc">Устанавливаем за 1 день. Сертифицированные мастера, минимум вмешательства.</p>
                </div>
              </div>
              <div className="istep">
                <div className="istep-n">3</div>
                <div>
                  <div className="istep-title">Запуск и обучение</div>
                  <p className="istep-desc">Проверяем качество воды на месте. Инструктируем сотрудника.</p>
                </div>
              </div>
              <div className="istep">
                <div className="istep-n">4</div>
                <div>
                  <div className="istep-title">Техобслуживание</div>
                  <p className="istep-desc">Плановая замена фильтров по расписанию. Экстренный вызов — 24 часа.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="install-vis reveal2">
            <InstallationCanvas />
          </div>
        </div>
      </div>
    </section>
  );
}
