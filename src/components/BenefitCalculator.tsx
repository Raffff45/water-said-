import { useState, useEffect } from "react";

const ComparisonSection = () => {
  const [teamSize, setTeamSize] = useState<string>("");
  const [isMobile, setIsMobile] = useState(false);
  const [isLight, setIsLight] = useState(
    document.documentElement.getAttribute("data-theme") === "light"
  );

  // Мобильная адаптация
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Отслеживание темы
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsLight(document.documentElement.getAttribute("data-theme") === "light");
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  const bottlePrice = 1100;
  const bottleVolume = 19;
  const purifierCost = 5;
  const dispenserPricePerLiter = bottlePrice / bottleVolume;

  const teamSizeNum = Number(teamSize) || 0;
  const dailyWaterPerPerson = (70 * 30) / 1000;
  const monthlyWaterPerPerson = dailyWaterPerPerson * 22;
  const totalMonthlyWater = monthlyWaterPerPerson * teamSizeNum;
  const bottlesNeeded = Math.ceil(totalMonthlyWater / 19);
  const dispenserCost = bottlesNeeded * bottlePrice;
  const purifierTotalCost = totalMonthlyWater * purifierCost;

  const monthlySavings = Math.max(0, dispenserCost - purifierTotalCost);
  const savingsPercent = dispenserCost > 0 ? Math.round((monthlySavings / dispenserCost) * 100) : 0;

  const formatOrDash = (val: number) => {
    if (!teamSizeNum || !isFinite(val)) return "—";
    return val.toLocaleString();
  };

  // Цвета специально для читаемости в светлой теме
  const mainTextColor = isLight ? "#04111f" : "#f0faff";
  const secondaryTextColor = isLight ? "#1a4a6e" : "#9fc0d4";
  const mutedTextColor = isLight ? "#456274" : "rgba(159,192,212,.5)";

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
    <section className="pad" style={{ padding: isMobile ? '3rem 1rem' : undefined }}>
      <div className="wrap">
        {/* Заголовок */}
        <div style={{ textAlign: 'center', maxWidth: '560px', margin: isMobile ? '0 auto 3rem' : '0 auto 5rem' }} className="reveal">
          <span className="sec-tag">Калькулятор</span>
          <h2 className="sec-h2" style={{ fontSize: isMobile ? '1.8rem' : undefined }}>
            Докажем вам выгоду
            <br />
            <em>пурифайера</em>
          </h2>
        </div>

        {/* Инпут */}
        <div style={{
          padding: isMobile ? '1.5rem' : '2rem',
          borderRadius: '20px',
          border: '1px solid rgba(0,200,255,.15)',
          background: 'rgba(0,200,255,.03)',
          backdropFilter: 'blur(20px)',
          maxWidth: '420px',
          margin: `0 auto ${isMobile ? '2.5rem' : '4rem'}`,
        }}>
          <label style={{
            display: 'block',
            fontSize: '.7rem',
            letterSpacing: '.16em',
            color: '#00c8ff',
            marginBottom: '1rem',
            textTransform: 'uppercase',
            fontWeight: 600,
          }}>
            Количество человек в офисе
          </label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="введите число (напр. 30)"
            value={teamSize}
            onChange={(e) => setTeamSize(e.target.value.replace(/\D+/g, ""))}
            style={{
              width: '100%',
              padding: '1rem 1.4rem',
              borderRadius: '10px',
              fontSize: isMobile ? '1rem' : '1.1rem',
              color: isLight ? "#04111f" : "#f0faff",
              background: isLight ? "rgba(255,255,255,0.95)" : "rgba(0,200,255,.06)",
              border: isLight ? "1px solid rgba(0,60,120,0.3)" : "1px solid rgba(0,200,255,.3)",
              outline: 'none',
              transition: 'all .3s',
              fontFamily: "'Outfit',sans-serif",
              fontWeight: 500,
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = isLight ? '#0077aa' : 'rgba(0,200,255,.5)';
              e.currentTarget.style.background = isLight ? 'white' : 'rgba(0,200,255,.12)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = isLight ? "rgba(0,60,120,0.3)" : "rgba(0,200,255,.3)";
              e.currentTarget.style.background = isLight ? "rgba(255,255,255,0.95)" : "rgba(0,200,255,.06)";
            }}
          />
        </div>

        {/* Сравнение карточек */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? '1.5rem' : '2.4rem',
          marginBottom: isMobile ? '2.5rem' : '4rem',
          alignItems: 'start',
        }}>
          {/* ДИСПЕНСЕР */}
          <div style={{
            padding: isMobile ? '1.5rem' : '2.4rem',
            borderRadius: '20px',
            border: '2px solid rgba(255,100,100,.3)',
            background: isLight ? 'rgba(255,100,100,.07)' : 'rgba(255,100,100,.05)',
            backdropFilter: 'blur(16px)',
            position: 'relative',
            opacity: teamSizeNum ? 1 : 0.6,
            transform: teamSizeNum ? 'scale(1)' : 'scale(0.98)',
            transition: 'all .4s',
          }}>
            <div style={{ position: 'absolute', top: '1rem', right: '1.2rem', color: '#ff6464', fontSize: '1.2rem' }}>✗</div>
            <h3 style={{ fontSize: '1.4rem', fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 300, color: mainTextColor, marginBottom: '1.8rem' }}>
              Диспенсер
            </h3>
            {/* ... остальное содержимое карточки без изменений */}
            <div style={{ marginBottom: '1.6rem', paddingBottom: '1.6rem', borderBottom: '1px solid rgba(255,100,100,.15)' }}>
              <p style={{ fontSize: '.7rem', color: mutedTextColor, marginBottom: '.4rem', textTransform: 'uppercase', letterSpacing: '.1em' }}>Кол-во бутылей</p>
              <p style={{ fontSize: isMobile ? '1.6rem' : '2rem', fontWeight: 700, color: '#ff6464' }}>{formatOrDash(bottlesNeeded)}</p>
            </div>
            <div style={{ marginBottom: '1.6rem', paddingBottom: '1.6rem', borderBottom: '1px solid rgba(255,100,100,.15)' }}>
              <p style={{ fontSize: '.7rem', color: mutedTextColor, marginBottom: '.4rem', textTransform: 'uppercase', letterSpacing: '.1em' }}>Цена за литр</p>
              <p style={{ fontSize: '1.3rem', fontWeight: 600, color: mainTextColor }}>
                {teamSizeNum ? `${dispenserPricePerLiter.toFixed(0)} ₸/л` : "—"}
              </p>
            </div>
            <div style={{ padding: '1.4rem', background: 'rgba(255,100,100,.15)', borderRadius: '12px', border: '1px solid rgba(255,100,100,.25)' }}>
              <p style={{ fontSize: '.7rem', color: 'rgba(255,100,100,.7)', marginBottom: '.6rem', textTransform: 'uppercase', letterSpacing: '.1em', fontWeight: 500 }}>Ежемесячно</p>
              <p style={{ fontSize: isMobile ? '1.8rem' : '2.2rem', fontWeight: 700, color: '#ff6464' }}>{formatOrDash(dispenserCost)} ₸</p>
            </div>
          </div>

          {/* ПУРИФАЙЕР — аналогично с mainTextColor */}
          <div style={{
            padding: isMobile ? '1.5rem' : '2.4rem',
            borderRadius: '20px',
            border: '2px solid rgba(0,229,204,.4)',
            background: 'rgba(0,229,204,.08)',
            backdropFilter: 'blur(16px)',
            position: 'relative',
            transform: (teamSizeNum && !isMobile) ? 'scale(1.02)' : 'scale(1)',
            transition: 'all .4s',
            boxShadow: (teamSizeNum && !isMobile) ? '0 0 40px rgba(0,229,204,.15)' : 'none',
          }}>
            <div style={{ position: 'absolute', top: '1rem', right: '1.2rem', color: '#00e5cc', fontSize: '1.2rem' }}>✓</div>
            <h3 style={{ fontSize: '1.4rem', fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 300, color: mainTextColor, marginBottom: '1.8rem' }}>
              Пурифайер
            </h3>
            {/* Остальные части карточки аналогично */}
            <div style={{ marginBottom: '1.6rem', paddingBottom: '1.6rem', borderBottom: '1px solid rgba(0,229,204,.15)' }}>
              <p style={{ fontSize: '.7rem', color: mutedTextColor, marginBottom: '.4rem', textTransform: 'uppercase', letterSpacing: '.1em' }}>Бутыли не нужны</p>
              <p style={{ fontSize: isMobile ? '1.6rem' : '2rem', fontWeight: 700, color: '#00e5cc' }}>0</p>
            </div>
            <div style={{ marginBottom: '1.6rem', paddingBottom: '1.6rem', borderBottom: '1px solid rgba(0,229,204,.15)' }}>
              <p style={{ fontSize: '.7rem', color: mutedTextColor, marginBottom: '.4rem', textTransform: 'uppercase', letterSpacing: '.1em' }}>Цена за литр</p>
              <p style={{ fontSize: '1.3rem', fontWeight: 600, color: mainTextColor }}>{purifierCost} ₸/л</p>
            </div>
            <div style={{ padding: '1.4rem', background: 'rgba(0,229,204,.12)', borderRadius: '12px', border: '1px solid rgba(0,229,204,.3)' }}>
              <p style={{ fontSize: '.7rem', color: '#00c8ff', marginBottom: '.6rem', textTransform: 'uppercase', letterSpacing: '.1em', fontWeight: 600 }}>Ежемесячно</p>
              <p style={{ fontSize: isMobile ? '1.8rem' : '2.2rem', fontWeight: 700, color: '#00e5cc' }}>{formatOrDash(purifierTotalCost)} ₸</p>
            </div>
          </div>
        </div>

        {/* Блок экономии */}
        {teamSizeNum ? (
          <div style={{
            padding: isMobile ? '2rem 1rem' : '3.2rem 2rem',
            background: 'linear-gradient(135deg, rgba(0,200,255,.12), rgba(0,229,204,.12))',
            border: '2px solid rgba(0,229,204,.3)',
            borderRadius: '24px',
            textAlign: 'center',
            marginBottom: isMobile ? '3rem' : '4rem',
            backdropFilter: 'blur(20px)',
          }}>
            <p style={{ fontSize: '.75rem', letterSpacing: '.16em', color: '#00c8ff', marginBottom: '1rem', textTransform: 'uppercase', fontWeight: 600 }}>
              Экономия в месяц
            </p>
            <p style={{ fontSize: isMobile ? '2.4rem' : '3.6rem', fontWeight: 800, color: '#00e5cc', marginBottom: '.6rem', lineHeight: 1 }}>
              {monthlySavings.toLocaleString()} ₸
            </p>
            <p style={{ fontSize: isMobile ? '1rem' : '1.1rem', color: secondaryTextColor, marginBottom: '1.2rem' }}>
              Это <strong style={{ color: '#00e5cc' }}>{savingsPercent}%</strong> экономии
            </p>
            <p style={{ fontSize: '.85rem', color: secondaryTextColor, lineHeight: 1.8 }}>
              При коллективе из <strong style={{ color: mainTextColor }}>{teamSizeNum}</strong> человек пурифайер дешевле на{' '}
              <br />
              <strong style={{ color: '#00e5cc' }}>{(monthlySavings * 12).toLocaleString()} ₸ в год</strong>
            </p>
          </div>
        ) : null}

      </div>
    </section>
  );
};

export default ComparisonSection;