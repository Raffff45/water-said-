import React, { useState, useEffect } from 'react';

const PurifierBenefit: React.FC = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Цвета специально для хорошей читаемости в светлой и тёмной теме
  const mainTextColor = '#04111f';        // тёмный для светлой темы
  const secondaryTextColor = '#555';      // для описаний

  const whyItems = [
    {
      svg: <svg viewBox="0 0 24 24" fill="none" stroke="#00b4d8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
      title: 'Дешевле',
      text: 'В 10+ раз ниже цена за литр воды',
    },
    {
      svg: <svg viewBox="0 0 24 24" fill="none" stroke="#00b4d8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C12 2 6 8 6 13a6 6 0 0012 0c0-5-6-11-6-11z"/><path d="M9.5 15.5a3.5 3.5 0 005 0"/></svg>,
      title: 'Экологично',
      text: 'Ноль пластиковых отходов',
    },
    {
      svg: <svg viewBox="0 0 24 24" fill="none" stroke="#00b4d8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>,
      title: 'Удобнее',
      text: 'Вода доступна 24/7 без заказов',
    },
    {
      svg: <svg viewBox="0 0 24 24" fill="none" stroke="#00b4d8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>,
      title: 'Просто',
      text: 'Без логистики и хранения бутылей',
    },
    {
      svg: <svg viewBox="0 0 24 24" fill="none" stroke="#00b4d8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>,
      title: 'Качество',
      text: 'Всегда свежая вода по нормам ВОЗ',
    },
    {
      svg: <svg viewBox="0 0 24 24" fill="none" stroke="#00b4d8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8m-4-4v4"/><path d="M7 8l3 3 2-2 3 3"/></svg>,
      title: 'Контроль',
      text: 'Мониторинг состояния в реальном времени',
    },
  ];

  return (
    <div style={{ marginTop: isMobile ? '1rem' : '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: isMobile ? '2rem' : '3.5rem' }}>
        <span className="sec-tag">Сравнение</span>
        <h3 style={{
          fontSize: isMobile ? '1.6rem' : '2.2rem',
          fontFamily: "'Playfair Display',Georgia,serif",
          fontWeight: 300,
          color: mainTextColor,
          lineHeight: 1.2,
        }}>
          Почему пурифайер <em style={{ fontStyle: 'italic', color: '#00c8ff' }}>лучше</em>
        </h3>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
        gap: isMobile ? '1rem' : '1.4rem',
      }}>
        {whyItems.map((item, idx) => (
          <div key={idx} className="ben-card" style={{ padding: isMobile ? '1.6rem' : '2.2rem' }}>
            <div className="ben-icon-wrap">{item.svg}</div>
            <div className="ben-title" style={{ 
              fontSize: '1.15rem', 
              marginBottom: '0.5rem', 
              color: mainTextColor 
            }}>
              {item.title}
            </div>
            <p className="ben-text" style={{ color: secondaryTextColor }}>
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PurifierBenefit;