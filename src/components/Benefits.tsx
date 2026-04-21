import React, { useState, useRef, useCallback, useEffect } from 'react';

const icons = {
  money: (
    <svg viewBox="0 0 24 24" fill="none" stroke="#00b4d8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/>
      <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
    </svg>
  ),
  leaf: (
    <svg viewBox="0 0 24 24" fill="none" stroke="#00b4d8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C12 2 6 8 6 13a6 6 0 0012 0c0-5-6-11-6-11z"/>
      <path d="M9.5 15.5a3.5 3.5 0 005 0"/>
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" fill="none" stroke="#00b4d8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <path d="M9 12l2 2 4-4"/>
    </svg>
  ),
  bolt: (
    <svg viewBox="0 0 24 24" fill="none" stroke="#00b4d8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
    </svg>
  ),
  wrench: (
    <svg viewBox="0 0 24 24" fill="none" stroke="#00b4d8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
    </svg>
  ),
  chart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="#00b4d8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2"/>
      <path d="M8 21h8m-4-4v4"/>
      <path d="M7 8l3 3 2-2 3 3"/>
    </svg>
  ),
};

const CARDS = [
  { icon: 'money', title: 'Экономия до 90%',    text: 'В 10–15 раз дешевле бутилированной воды. Окупаемость — от 12 месяцев.' },
  { icon: 'leaf',  title: 'Ноль пластика',       text: 'Одна установка заменяет 40–60 тысяч пластиковых бутылок в год.' },
  { icon: 'shield',title: 'Медицинская чистота', text: 'Качество воды по нормам ВОЗ и СанПиН. Лабораторный контроль по запросу.' },
  { icon: 'bolt',  title: 'Вода 24/7',           text: 'Никаких заказов и перебоев. Чистая вода в любом количестве и в любое время.' },
  { icon: 'wrench',title: 'Полный сервис',       text: 'Консультация, доставка, установка и техобслуживание — всё включено.' },
  { icon: 'chart', title: 'Аналитика онлайн',    text: 'Расход воды и состояние фильтров в личном кабинете. Уведомления заранее.' },
];

export default function Benefits() {
  const [current, setCurrent] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const currentRef = useRef(0);
  const cooldownRef = useRef(false);
  // Track whether we've "snapped" the section to top
  const snappedRef = useRef(false);

  useEffect(() => { currentRef.current = current; }, [current]);

  const goTo = useCallback((i: number) => {
    setCurrent(i);
    currentRef.current = i;
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const snapToSection = () => {
      const top = section.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top, behavior: 'smooth' });
    };

    const onWheel = (e: WheelEvent) => {
      const rect = section.getBoundingClientRect();
      const scrollingDown = e.deltaY > 0;
      const scrollingUp   = e.deltaY < 0;

      // Section hasn't reached top yet — let normal scroll happen,
      // but if it's close (within 80px) snap it into place when scrolling down
      if (rect.top > 1) {
        if (scrollingDown && rect.top < 80 && !snappedRef.current) {
          e.preventDefault();
          snappedRef.current = true;
          snapToSection();
        }
        return;
      }

      // Section must actually be on screen (not already scrolled past)
      if (rect.bottom < 0) return;

      // Section is at top — we're in control
      const atFirst = currentRef.current === 0;
      const atLast  = currentRef.current === CARDS.length - 1;

      // Always release scroll up — never hijack it
      if (scrollingUp) {
        snappedRef.current = false;
        return;
      }

      // Release on last card + scroll down
      if (scrollingDown && atLast) {
        snappedRef.current = false;
        return;
      }

      e.preventDefault();

      if (cooldownRef.current) return;
      cooldownRef.current = true;
      setTimeout(() => { cooldownRef.current = false; }, 600);

      goTo(Math.min(CARDS.length - 1, currentRef.current + 1));
    };

    // Touch support
    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => { touchStartY = e.touches[0].clientY; };
    const onTouchEnd = (e: TouchEvent) => {
      const rect = section.getBoundingClientRect();
      if (rect.top > 1) return;

      const dy = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(dy) < 35) return;

      const atFirst = currentRef.current === 0;
      const atLast  = currentRef.current === CARDS.length - 1;
      if (dy > 0 && atLast) return;
      if (dy < 0 && atFirst) return;

      if (dy > 0) goTo(Math.min(CARDS.length - 1, currentRef.current + 1));
      else        goTo(Math.max(0, currentRef.current - 1));
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [goTo]);

  // Swipe horizontal on card
  const swipeX = useRef<number | null>(null);
  const onCardTouchStart = (e: React.TouchEvent) => { swipeX.current = e.touches[0].clientX; };
  const onCardTouchEnd = (e: React.TouchEvent) => {
    if (swipeX.current === null) return;
    const dx = swipeX.current - e.changedTouches[0].clientX;
    if (dx > 40) goTo(Math.min(CARDS.length - 1, currentRef.current + 1));
    else if (dx < -40) goTo(Math.max(0, currentRef.current - 1));
    swipeX.current = null;
  };

  const progress = ((current + 1) / CARDS.length) * 100;

  return (
    <>
      <section
        ref={sectionRef}
        className="pad"
        style={{ overflow: 'hidden', position: 'relative' }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '560px', margin: '0 auto 2.5rem' }} className="reveal">
          <span className="sec-tag">Преимущества</span>
          <h2 className="sec-h2">
            Почему учреждения<br /><em>выбирают нас</em>
          </h2>
        </div>

        {/* Scroll hint */}
        <div style={{
          textAlign: 'center',
          marginBottom: '1rem',
          fontSize: '0.75rem',
          letterSpacing: '0.1em',
          color: 'rgba(255,255,255,0.28)',
          textTransform: 'uppercase',
          opacity: current === 0 ? 1 : 0,
          transition: 'opacity 0.5s',
          pointerEvents: 'none',
          userSelect: 'none',
        }}>
          Прокрутите вниз, чтобы листать&nbsp;
          <span style={{ display: 'inline-block', animation: 'scrollBounce 1.5s ease-in-out infinite' }}>↓</span>
        </div>

        {/* Slider */}
        <div
          style={{ position: 'relative', width: '100vw', marginLeft: 'calc(-50vw + 50%)' }}
          onTouchStart={onCardTouchStart}
          onTouchEnd={onCardTouchEnd}
        >
          <div style={{
            display: 'flex',
            transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: `translateX(-${current * 100}%)`,
            willChange: 'transform',
          }}>
            {CARDS.map((card, i) => (
              <div key={i} style={{ minWidth: '100%', width: '100%', flexShrink: 0, padding: '0 2rem', boxSizing: 'border-box' }}>
                <div
                  className="ben-card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    minHeight: '300px',
                    padding: '3rem 4rem',
                    borderRadius: '1.25rem',
                    opacity: i === current ? 1 : 0.25,
                    transform: i === current ? 'scale(1)' : 'scale(0.97)',
                    transition: 'opacity 0.45s ease, transform 0.45s ease',
                    boxSizing: 'border-box',
                  }}
                >
                  <div className="ben-icon-wrap" style={{ marginBottom: '1.5rem' }}>
                    {icons[card.icon as keyof typeof icons]}
                  </div>
                  <div className="ben-title" style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{card.title}</div>
                  <p className="ben-text" style={{ fontSize: '1.125rem', maxWidth: '540px' }}>{card.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Arrows */}
          <button onClick={() => goTo(Math.max(0, current - 1))} disabled={current === 0} aria-label="Назад" style={arrowBtn('left', current === 0)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <button onClick={() => goTo(Math.min(CARDS.length - 1, current + 1))} disabled={current === CARDS.length - 1} aria-label="Вперёд" style={arrowBtn('right', current === CARDS.length - 1)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>

        {/* Bottom controls */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginTop: '2rem' }}>
          <div style={{ width: '200px', height: '2px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #0077b6, #00b4d8)',
              borderRadius: '2px',
              transition: 'width 0.4s ease',
            }}/>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            {CARDS.map((_, i) => (
              <button key={i} onClick={() => goTo(i)} aria-label={`Слайд ${i + 1}`} style={{
                width: i === current ? '28px' : '10px',
                height: '10px',
                borderRadius: '5px',
                border: 'none',
                background: i === current ? '#00b4d8' : 'rgba(255,255,255,0.18)',
                cursor: 'pointer',
                padding: 0,
                transition: 'width 0.3s ease, background 0.3s ease',
              }}/>
            ))}
          </div>

          <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.12em' }}>
            {String(current + 1).padStart(2, '0')} / {String(CARDS.length).padStart(2, '0')}
          </div>

          <div style={{
            fontSize: '0.72rem',
            color: 'rgba(255,255,255,0.28)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            opacity: current === CARDS.length - 1 ? 1 : 0,
            transition: 'opacity 0.5s',
            pointerEvents: 'none',
          }}>
            Прокрутите вниз, чтобы продолжить&nbsp;
            <span style={{ display: 'inline-block', animation: 'scrollBounce 1.5s ease-in-out infinite' }}>↓</span>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(5px); }
        }
      `}</style>
    </>
  );
}

function arrowBtn(side: 'left' | 'right', disabled: boolean): React.CSSProperties {
  return {
    position: 'absolute',
    top: '50%',
    [side]: '1.5rem',
    transform: 'translateY(-50%)',
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.06)',
    color: disabled ? 'rgba(255,255,255,0.15)' : '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: disabled ? 'default' : 'pointer',
    backdropFilter: 'blur(8px)',
    transition: 'all 0.2s',
    zIndex: 10,
    opacity: disabled ? 0.3 : 1,
  };
}