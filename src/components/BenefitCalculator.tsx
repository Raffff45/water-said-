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
          
          {/* === ДИСПЕНСЕР (серый в светлой теме) === */}
          <div style={{
            padding: isMobile ? '1.5rem' : '2.4rem',
            borderRadius: '20px',
            border: isLight 
              ? '2px solid rgba(100, 110, 130, 0.35)' 
              : '2px solid rgba(255,100,100,.3)',
            background: isLight 
              ? 'rgba(70, 80, 95, 0.07)' 
              : 'rgba(255,100,100,.05)',
            backdropFilter: 'blur(16px)',
            position: 'relative',
            opacity: teamSizeNum ? 1 : 0.6,
            transform: teamSizeNum ? 'scale(1)' : 'scale(0.98)',
            transition: 'all .4s',
          }}>
            <div style={{ position: 'absolute', top: '1rem', right: '1.2rem', color: isLight ? '#5f6b7a' : '#ff6464', fontSize: '1.2rem' }}>✗</div>
            <h3 style={{ fontSize: '1.4rem', fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 300, color: mainTextColor, marginBottom: '1.8rem' }}>
              Диспенсер
            </h3>

            <div style={{ marginBottom: '1.6rem', paddingBottom: '1.6rem', borderBottom: isLight ? '1px solid rgba(100,110,130,.15)' : '1px solid rgba(255,100,100,.15)' }}>
              <p style={{ fontSize: '.7rem', color: mutedTextColor, marginBottom: '.4rem', textTransform: 'uppercase', letterSpacing: '.1em' }}>Кол-во бутылей</p>
              <p style={{ fontSize: isMobile ? '1.6rem' : '2rem', fontWeight: 700, color: isLight ? '#5f6b7a' : '#ff6464' }}>{formatOrDash(bottlesNeeded)}</p>
            </div>
            <div style={{ marginBottom: '1.6rem', paddingBottom: '1.6rem', borderBottom: isLight ? '1px solid rgba(100,110,130,.15)' : '1px solid rgba(255,100,100,.15)' }}>
              <p style={{ fontSize: '.7rem', color: mutedTextColor, marginBottom: '.4rem', textTransform: 'uppercase', letterSpacing: '.1em' }}>Цена за литр</p>
              <p style={{ fontSize: '1.3rem', fontWeight: 600, color: mainTextColor }}>
                {teamSizeNum ? `${dispenserPricePerLiter.toFixed(0)} ₸/л` : "—"}
              </p>
            </div>
            <div style={{ 
              padding: '1.4rem', 
              background: isLight ? 'rgba(70,80,95,.09)' : 'rgba(255,100,100,.15)', 
              borderRadius: '12px', 
              border: isLight ? '1px solid rgba(100,110,130,.25)' : '1px solid rgba(255,100,100,.25)' 
            }}>
              <p style={{ fontSize: '.7rem', color: isLight ? '#5f6b7a' : 'rgba(255,100,100,.7)', marginBottom: '.6rem', textTransform: 'uppercase', letterSpacing: '.1em', fontWeight: 500 }}>Ежемесячно</p>
              <p style={{ fontSize: isMobile ? '1.8rem' : '2.2rem', fontWeight: 700, color: isLight ? '#5f6b7a' : '#ff6464' }}>{formatOrDash(dispenserCost)} ₸</p>
            </div>
          </div>

          {/* === ПУРИФАЙЕР (синий в светлой теме) === */}
          <div style={{
            padding: isMobile ? '1.5rem' : '2.4rem',
            borderRadius: '20px',
            border: isLight 
              ? '2px solid rgba(0, 110, 170, 0.45)' 
              : '2px solid rgba(0,229,204,.4)',
            background: isLight 
              ? 'rgba(0, 120, 190, 0.09)' 
              : 'rgba(0,229,204,.08)',
            backdropFilter: 'blur(16px)',
            position: 'relative',
            transform: (teamSizeNum && !isMobile) ? 'scale(1.02)' : 'scale(1)',
            transition: 'all .4s',
            boxShadow: (teamSizeNum && !isMobile) ? '0 0 40px rgba(0, 120, 190, .18)' : 'none',
          }}>
            <div style={{ position: 'absolute', top: '1rem', right: '1.2rem', color: isLight ? '#0077bb' : '#00e5cc', fontSize: '1.2rem' }}>✓</div>
            <h3 style={{ fontSize: '1.4rem', fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 300, color: mainTextColor, marginBottom: '1.8rem' }}>
              Пурифайер
            </h3>

            <div style={{ marginBottom: '1.6rem', paddingBottom: '1.6rem', borderBottom: isLight ? '1px solid rgba(0,110,170,.15)' : '1px solid rgba(0,229,204,.15)' }}>
              <p style={{ fontSize: '.7rem', color: mutedTextColor, marginBottom: '.4rem', textTransform: 'uppercase', letterSpacing: '.1em' }}>Бутыли не нужны</p>
              <p style={{ fontSize: isMobile ? '1.6rem' : '2rem', fontWeight: 700, color: isLight ? '#0077bb' : '#00e5cc' }}>0</p>
            </div>
            <div style={{ marginBottom: '1.6rem', paddingBottom: '1.6rem', borderBottom: isLight ? '1px solid rgba(0,110,170,.15)' : '1px solid rgba(0,229,204,.15)' }}>
              <p style={{ fontSize: '.7rem', color: mutedTextColor, marginBottom: '.4rem', textTransform: 'uppercase', letterSpacing: '.1em' }}>Цена за литр</p>
              <p style={{ fontSize: '1.3rem', fontWeight: 600, color: mainTextColor }}>{purifierCost} ₸/л</p>
            </div>
            <div style={{ 
              padding: '1.4rem', 
              background: isLight ? 'rgba(0,120,190,.11)' : 'rgba(0,229,204,.12)', 
              borderRadius: '12px', 
              border: isLight ? '1px solid rgba(0,110,170,.3)' : '1px solid rgba(0,229,204,.3)' 
            }}>
              <p style={{ fontSize: '.7rem', color: isLight ? '#0077bb' : '#00c8ff', marginBottom: '.6rem', textTransform: 'uppercase', letterSpacing: '.1em', fontWeight: 600 }}>Ежемесячно</p>
              <p style={{ fontSize: isMobile ? '1.8rem' : '2.2rem', fontWeight: 700, color: isLight ? '#0077bb' : '#00e5cc' }}>{formatOrDash(purifierTotalCost)} ₸</p>
            </div>
          </div>
        </div>

        {/* Блок экономии */}
        {teamSizeNum ? (
          <div style={{
            padding: isMobile ? '2rem 1rem' : '3.2rem 2rem',
            background: isLight 
              ? 'linear-gradient(135deg, rgba(0,110,170,.14), rgba(0,160,200,.12))' 
              : 'linear-gradient(135deg, rgba(0,200,255,.12), rgba(0,229,204,.12))',
            border: isLight 
              ? '2px solid rgba(0,110,170,.35)' 
              : '2px solid rgba(0,229,204,.3)',
            borderRadius: '24px',
            textAlign: 'center',
            marginBottom: isMobile ? '3rem' : '4rem',
            backdropFilter: 'blur(20px)',
          }}>
            <p style={{ fontSize: '.75rem', letterSpacing: '.16em', color: isLight ? '#0077bb' : '#00c8ff', marginBottom: '1rem', textTransform: 'uppercase', fontWeight: 600 }}>
              Экономия в месяц
            </p>
            <p style={{ fontSize: isMobile ? '2.4rem' : '3.6rem', fontWeight: 800, color: isLight ? '#0077bb' : '#00e5cc', marginBottom: '.6rem', lineHeight: 1 }}>
              {monthlySavings.toLocaleString()} ₸
            </p>
            <p style={{ fontSize: isMobile ? '1rem' : '1.1rem', color: secondaryTextColor, marginBottom: '1.2rem' }}>
              Это <strong style={{ color: isLight ? '#0077bb' : '#00e5cc' }}>{savingsPercent}%</strong> экономии
            </p>
            <p style={{ fontSize: '.85rem', color: secondaryTextColor, lineHeight: 1.8 }}>
              При коллективе из <strong style={{ color: mainTextColor }}>{teamSizeNum}</strong> человек пурифайер дешевле на{' '}
              <br />
              <strong style={{ color: isLight ? '#0077bb' : '#00e5cc' }}>{(monthlySavings * 12).toLocaleString()} ₸ в год</strong>
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default ComparisonSection;