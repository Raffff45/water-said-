import { useEffect, useRef, useState } from 'react';
import Modal from './Modal';

import schoolImage from '../assets/school.jpg';
import hospitalImage from '../assets/hospital.jpg';
import officeImage from '../assets/office.jpg';
import governmentImage from '../assets/government.jpg';

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
        ctx.ellipse(W / 2, H * 0.45 + p * H * 0.32, W * 0.44 * (1 - p * 0.5), W * 0.1 * (1 - p * 0.4), 0, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${hue},75%,60%,${p * 0.45 * (1 - p)})`;
        ctx.lineWidth = 0.9;
        ctx.stroke();
      }
      t++;
      requestAnimationFrame(draw);
    };

    draw();
  }, [hue]);

  return <canvas ref={canvasRef} className="client-canvas" />;
}

type ClientData = {
  tag: string;
  title: string;
  text: string;
  image: string;
  hue: number;
  modal: {
    subtitle: string;
    points: string[];
    extra: string;
  };
};

const clients: ClientData[] = [
  {
    tag: 'Образование',
    title: 'Школы и университеты',
    text: 'Фонтанчики в коридорах, пурификаторы в столовых.',
    image: schoolImage,
    hue: 200,
    modal: {
      subtitle: 'Чистая вода — часть образовательной среды',
      points: [
        'Настенные и напольные фонтанчики для коридоров',
        'Пурификаторы для столовых и буфетов',
        'Соответствие нормам СанПиН для учебных заведений',
        'Безопасные материалы, сертифицированные для детей',
        'Техобслуживание без отрыва от учебного процесса',
      ],
      extra: 'Работаем со школами, колледжами и университетами Казахстана. Гибкие условия для бюджетных учреждений.',
    },
  },
  {
    tag: 'Здравоохранение',
    title: 'Больницы и клиники',
    text: 'Медицинская чистота воды в палатах и зонах ожидания.',
    image: hospitalImage,
    hue: 160,
    modal: {
      subtitle: 'Качество воды на уровне медицинских стандартов',
      points: [
        'Многоступенчатая очистка до медицинских норм',
        'Установки для палат, ординаторских и зон ожидания',
        'Регулярные лабораторные анализы качества воды',
        'Документация для проверок и аккредитаций',
        'Экстренное обслуживание 24/7',
      ],
      extra: 'Оборудование соответствует требованиям Министерства здравоохранения РК. Полный пакет сертификатов.',
    },
  },
  {
    tag: 'Бизнес',
    title: 'Офисы и бизнес-центры',
    text: 'Забота о сотрудниках. Идеально для ESG-стратегии.',
    image: officeImage,
    hue: 220,
    modal: {
      subtitle: 'Инвестиция в комфорт и имидж компании',
      points: [
        'Стильные диспенсеры под интерьер офиса',
        'Горячая, холодная и газированная вода',
        'Онлайн-мониторинг расхода и состояния фильтров',
        'Снижение углеродного следа — замена бутилированной воды',
        'Поддержка ESG-отчётности компании',
      ],
      extra: 'Более 120 офисов и бизнес-центров уже выбрали нас. Подключение от 3 рабочих дней.',
    },
  },
  {
    tag: 'Госсектор',
    title: 'Госучреждения и мэрии',
    text: 'Долгосрочные сервисные контракты. Полная документация.',
    image: governmentImage,
    hue: 35,
    modal: {
      subtitle: 'Надёжный партнёр для государственных структур',
      points: [
        'Участие в государственных тендерах (ЕИС)',
        'Полный пакет документов для госзакупок',
        'Долгосрочные контракты на обслуживание',
        'Отчётность и акты выполненных работ',
        'Опыт работы с акиматами и министерствами',
      ],
      extra: 'Все необходимые лицензии и сертификаты. Работаем по 44-ФЗ и законодательству РК о госзакупках.',
    },
  },
];

export default function Clients() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section id="clients" className="pad">
      <div className="wrap">
        <div style={{ textAlign: 'center', maxWidth: '560px', margin: '0 auto 5rem' }} className="reveal">
          <span className="sec-tag">Наши клиенты</span>
          <h2 className="sec-h2">
            Решение для<br />
            <em>вашего</em> учреждения
          </h2>
        </div>

        <div className="clients-grid">
          {clients.map((client, index) => (
            <div
              key={index}
              className={`client-card ${index % 2 === 0 ? 'reveal' : 'reveal2'}`}
              onClick={() => setActiveIndex(index)}
              style={{ cursor: 'pointer' }}
            >
              <img src={client.image} alt={client.title} className="client-image" />
              <div className="client-overlay" />
              <div className="client-content">
                <span className="client-tag">{client.tag}</span>
                <div className="client-title">{client.title}</div>
                <p className="client-text">{client.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeIndex !== null && (
        <Modal isOpen={true} onClose={() => setActiveIndex(null)}>
          <div style={{ paddingTop: '0.5rem' }}>

            <span style={{
              display: 'inline-block',
              background: 'rgba(0,200,255,0.1)',
              border: '1px solid rgba(0,200,255,0.25)',
              color: '#00c8ff',
              fontSize: '0.58rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              padding: '0.22rem 0.8rem',
              borderRadius: '2rem',
              marginBottom: '1rem',
            }}>
              {clients[activeIndex].tag}
            </span>

            <h3 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '1.7rem',
              fontWeight: 300,
              color: '#f0faff',
              marginBottom: '0.5rem',
              lineHeight: 1.2,
            }}>
              {clients[activeIndex].title}
            </h3>

            <p style={{
              color: '#9fc0d4',
              fontSize: '0.85rem',
              marginBottom: '1.6rem',
              lineHeight: 1.7,
            }}>
              {clients[activeIndex].modal.subtitle}
            </p>

            <div style={{
              width: '100%',
              height: '1px',
              background: 'rgba(0,200,255,0.1)',
              marginBottom: '1.4rem',
            }} />

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.6rem' }}>
              {clients[activeIndex].modal.points.map((point, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.85rem', color: '#e8f6ff', lineHeight: 1.6 }}>
                  <span style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #00c8ff, #00e5cc)',
                    flexShrink: 0,
                    marginTop: '0.45rem',
                  }} />
                  {point}
                </li>
              ))}
            </ul>

            <div style={{
              width: '100%',
              height: '1px',
              background: 'rgba(0,200,255,0.1)',
              marginBottom: '1.4rem',
            }} />

            <p style={{
              color: '#9fc0d4',
              fontSize: '0.8rem',
              lineHeight: 1.8,
              marginBottom: '1.8rem',
            }}>
              {clients[activeIndex].modal.extra}
            </p>

            <button
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #00c8ff, #00e5cc)',
                border: 'none',
                color: '#04111f',
                padding: '0.9rem',
                borderRadius: '2rem',
                fontFamily: "'Outfit', sans-serif",
                fontSize: '0.75rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                fontWeight: 500,
                cursor: 'pointer',
              }}
              onClick={() => {
                setActiveIndex(null);
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Получить консультацию
            </button>

          </div>
        </Modal>
      )}
    </section>
  );
}