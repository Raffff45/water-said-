import { useEffect, useState } from 'react';
import { toggleTheme } from '../utils/themeToggle';

const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <circle cx="12" cy="12" r="4" />
    <line x1="12" y1="2" x2="12" y2="5" />
    <line x1="12" y1="19" x2="12" y2="22" />
    <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
    <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
    <line x1="2" y1="12" x2="5" y2="12" />
    <line x1="19" y1="12" x2="22" y2="12" />
    <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
    <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [isLight, setIsLight] = useState(document.documentElement.classList.contains('light'));

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleThemeToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    toggleTheme(e.nativeEvent);
    setIsLight((prev) => !prev);
  };

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
          transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s, color 0.3s;
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

        .theme-btn:hover::before {
          opacity: 1;
        }

        .theme-btn:hover {
          color: var(--ink);
          border-color: transparent;
          box-shadow: 0 0 28px rgba(0,200,255,0.45);
          transform: scale(1.08);
        }

        .theme-btn svg {
          position: relative;
          z-index: 1;
          animation: spinIn 0.35s cubic-bezier(.34,1.56,.64,1) both;
        }

        @keyframes spinIn {
          from { transform: rotate(-90deg) scale(0); opacity: 0; }
          to { transform: rotate(0deg) scale(1); opacity: 1; }
        }
      `}</style>

      <nav id="nav" className={scrolled ? 'scrolled' : ''}>
        <a
          href="#"
          className="logo"
          onClick={(e) => {
            e.preventDefault();
            window.location.reload();
          }}
        >
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
          onClick={handleThemeToggle}
          aria-label="Сменить тему"
          key={String(isLight)}
          type="button"
        >
          {isLight ? <MoonIcon /> : <SunIcon />}
        </button>
      </nav>
    </>
  );
}