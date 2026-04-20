import { useEffect, useState, useCallback } from 'react';

const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <circle cx="12" cy="12" r="4"/>
    <line x1="12" y1="2" x2="12" y2="5"/>
    <line x1="12" y1="19" x2="12" y2="22"/>
    <line x1="4.22" y1="4.22" x2="6.34" y2="6.34"/>
    <line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/>
    <line x1="2" y1="12" x2="5" y2="12"/>
    <line x1="19" y1="12" x2="22" y2="12"/>
    <line x1="4.22" y1="19.78" x2="6.34" y2="17.66"/>
    <line x1="17.66" y1="6.34" x2="19.78" y2="4.22"/>
  </svg>
);

const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

function launchWaterfallTransition(toLight: boolean) {
  // Create overlay container
  const overlay = document.createElement('div');
  overlay.id = 'waterfall-transition';
  document.body.appendChild(overlay);

  const W = window.innerWidth;
  const streamCount = Math.floor(W / 28) + 2;

  // Launch streams with staggered timing
  for (let i = 0; i < streamCount; i++) {
    const stream = document.createElement('div');
    stream.className = 'wt-stream';

    const x = (i / (streamCount - 1)) * 100;
    const delay = (Math.abs(x - 50) / 50) * 0.18 + Math.random() * 0.08; // center first
    const duration = 0.55 + Math.random() * 0.2;
    const height = 30 + Math.random() * 50; // % of viewport
    const width = 1.5 + Math.random() * 3;
    const opacity = 0.6 + Math.random() * 0.4;

    stream.style.cssText = `
      left: ${x}%;
      width: ${width}px;
      height: ${height}vh;
      opacity: ${opacity};
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
      filter: blur(${Math.random() * 0.5}px);
    `;

    // Add ripple at bottom for each stream
    const ripple = document.createElement('div');
    ripple.className = 'wt-ripple';
    ripple.style.cssText = `
      left: ${x}%;
      width: ${20 + Math.random() * 30}px;
      height: ${20 + Math.random() * 30}px;
      animation-delay: ${delay + duration - 0.15}s;
      animation-duration: ${0.5 + Math.random() * 0.3}s;
    `;
    overlay.appendChild(ripple);
    overlay.appendChild(stream);
  }

  // Bloom flash at theme switch moment
  const midTime = 250;
  setTimeout(() => {
    const bloom = document.createElement('div');
    bloom.className = 'wt-bloom';
    bloom.style.background = toLight
      ? 'radial-gradient(ellipse at 50% 30%, rgba(180,235,255,0.5), transparent 70%)'
      : 'radial-gradient(ellipse at 50% 30%, rgba(0,200,255,0.25), transparent 70%)';
    document.body.appendChild(bloom);
    setTimeout(() => bloom.remove(), 500);
  }, midTime);

  // Cleanup
  setTimeout(() => {
    overlay.remove();
  }, 1100);
}

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  }, [dark]);

  const handleToggle = useCallback(() => {
    const toLight = dark; // switching from dark to light
    launchWaterfallTransition(toLight);

    // Switch theme slightly after streams begin falling
    setTimeout(() => {
      setDark(prev => !prev);
    }, 250);
  }, [dark]);

  return (
    <>
      <style>{`
        .theme-btn {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          border: 1px solid rgba(0,200,255,0.3);
          background: rgba(255,255,255,0.06);
          backdrop-filter: blur(12px);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--cyan);
          flex-shrink: 0;
          position: relative;
          overflow: hidden;
          transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s;
        }
        .theme-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--cyan), var(--teal));
          opacity: 0;
          transition: opacity 0.3s;
        }
        .theme-btn:hover::before { opacity: 1; }
        .theme-btn:hover {
          color: var(--ink);
          border-color: transparent;
          box-shadow: 0 0 28px rgba(0,200,255,0.45);
          transform: scale(1.08);
        }
        .theme-btn svg {
          position: relative;
          z-index: 1;
        }
        @keyframes spinIn {
          from { transform: rotate(-90deg) scale(0); opacity: 0; }
          to   { transform: rotate(0deg) scale(1); opacity: 1; }
        }
        .theme-btn svg {
          animation: spinIn 0.35s cubic-bezier(.34,1.56,.64,1) both;
        }
        [data-theme="light"] .theme-btn {
          border-color: rgba(0,119,170,0.3);
          color: var(--cyan);
        }
        [data-theme="light"] nav { color: var(--pearl); }
        [data-theme="light"] .nav-cta { color: #fff; }
      `}</style>

      <nav id="nav" className={scrolled ? 'scrolled' : ''}>
        <a href="#" className="logo" onClick={() => window.location.reload()}>
          Вода <em>для всех</em>
        </a>

        <ul className="nav-links">
          <li><a href="#products">Продукты</a></li>
          <li><a href="#how">Технология</a></li>
          <li><a href="#install">Установка</a></li>
          <li><a href="#clients">Клиенты</a></li>
          <li><a href="#contact">Контакт</a></li>
        </ul>

        <button
          className="theme-btn"
          onClick={handleToggle}
          aria-label="Сменить тему"
          key={String(dark)}
        >
          {dark ? <SunIcon /> : <MoonIcon />}
        </button>
      </nav>
    </>
  );
}