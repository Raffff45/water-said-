import React from 'react';

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
  { icon: 'money', title: 'Экономия до 90%',     text: 'В 10–15 раз дешевле бутилированной воды. Окупаемость — от 12 месяцев.' },
  { icon: 'leaf',  title: 'Ноль пластика',        text: 'Одна установка заменяет 40–60 тысяч пластиковых бутылок в год.' },
  { icon: 'shield',title: 'Медицинская чистота',  text: 'Качество воды по нормам ВОЗ и СанПиН. Лабораторный контроль по запросу.' },
  { icon: 'bolt',  title: 'Вода 24/7',            text: 'Никаких заказов и перебоев. Чистая вода в любом количестве и в любое время.' },
  { icon: 'wrench',title: 'Полный сервис',        text: 'Консультация, доставка, установка и техобслуживание — всё включено.' },
  { icon: 'chart', title: 'Аналитика онлайн',     text: 'Расход воды и состояние фильтров в личном кабинете. Уведомления заранее.' },
];

export default function Benefits() {
  return (
    <section className="pad">
      <div className="wrap">
        <div style={{ textAlign: 'center', maxWidth: '560px', margin: '0 auto 5rem' }} className="reveal">
          <span className="sec-tag">Преимущества</span>
          <h2 className="sec-h2">
            Почему учреждения
            <br />
            <em>выбирают нас</em>
          </h2>
        </div>

        <div className="ben-grid">
          {CARDS.map((card, i) => (
            <div key={i} className={`ben-card ${i < 3 ? 'reveal' : 'reveal2'}`}>
             <div className="ben-icon-wrap">
  {icons[card.icon as keyof typeof icons]}
</div>
              <div className="ben-title">{card.title}</div>
              <p className="ben-text">{card.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}