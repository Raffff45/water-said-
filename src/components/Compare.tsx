import React from 'react';

const DATA = [
  { criterion: 'Стоимость / 100 чел. в год', us: 'от 60 000 ₸', bottle: '400 000+ ₸', cooler: '180 000 ₸', usGood: true, bottleGood: false, coolerGood: false },
  { criterion: 'Качество очистки',            us: 'ВОЗ, СанПиН',  bottle: 'Непостоянное', cooler: 'Базовое',    usGood: true, bottleGood: false, coolerGood: false },
  { criterion: 'Вода 24/7',                   us: '✓ Да',         bottle: '✗ По запасам', cooler: 'Частично',   usGood: true, bottleGood: false, coolerGood: false },
  { criterion: 'Пластиковые отходы',          us: 'Нет',          bottle: '40 000+ бут.', cooler: 'Есть',       usGood: true, bottleGood: false, coolerGood: false },
  { criterion: 'Техобслуживание',             us: '✓ Включено',   bottle: '—',            cooler: 'Не включено',usGood: true, bottleGood: false, coolerGood: false },
  { criterion: 'Срок установки',              us: '1 день',       bottle: 'Пост. доставки',cooler: '2–3 дня',   usGood: true, bottleGood: false, coolerGood: false },
  { criterion: 'Гарантия качества',           us: '✓ Лаб. контроль', bottle: '✗ Нет',    cooler: '✗ Нет',      usGood: true, bottleGood: false, coolerGood: false },
];

const C = { us: 'var(--cyan)', bottle: '#ff6b6b', cooler: 'var(--silver)' };

const COLS = [
  { label: 'Вода для всех', color: C.us,     valueKey: 'us' as const,     goodKey: 'usGood' as const,     featured: true  },
  { label: 'Бутилированная',color: C.bottle,  valueKey: 'bottle' as const, goodKey: 'bottleGood' as const, featured: false },
  { label: 'Только кулер',  color: C.cooler,  valueKey: 'cooler' as const, goodKey: 'coolerGood' as const, featured: false },
];

export default function ComparisonCards() {
  return (
    <section className="pad">
      <div className="wrap">
        <div style={{ textAlign: 'center', maxWidth: '560px', margin: '0 auto 3rem' }}>
          <span className="sec-tag">Сравнение</span>
          <h2 className="sec-h2">Будущее бесплатной<br /><em>воды</em></h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
          {COLS.map(col => (
            <div key={col.label} className={`cmp-card${col.featured ? ' cmp-card--featured' : ''}`} style={{
              borderRadius: '1.25rem',
              border: col.featured
                ? '1px solid var(--cmp-featured-border)'
                : '1px solid var(--border2)',
              background: col.featured
                ? 'var(--cmp-featured-bg)'
                : 'var(--glass2)',
              padding: '2rem 1.5rem',
              position: 'relative',
              boxShadow: col.featured ? 'var(--cmp-featured-shadow)' : 'none',
            }}>
              {col.featured && (
                <div style={{
                  position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)',
                  background: 'var(--cyan)', color: 'var(--ink)', fontSize: '0.62rem', fontWeight: 700,
                  letterSpacing: '0.14em', padding: '4px 14px', borderRadius: '20px',
                  textTransform: 'uppercase', whiteSpace: 'nowrap',
                }}>★ Лучший выбор</div>
              )}

              <div style={{
                color: col.color, fontWeight: 700, fontSize: '0.8rem',
                letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.5rem',
              }}>{col.label}</div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {DATA.map((d, i) => {
                  const val = d[col.valueKey];
                  const good = d[col.goodKey];
                  return (
                    <div key={i} style={{
                      borderBottom: '1px solid var(--cmp-divider)',
                      paddingBottom: '1rem',
                    }}>
                      <div style={{
                        fontSize: '0.67rem',
                        color: 'var(--cmp-label)',
                        marginBottom: '4px',
                        letterSpacing: '0.04em',
                      }}>
                        {d.criterion}
                      </div>
                      <div style={{
                        fontSize: '0.88rem',
                        color: good ? col.color : 'var(--cmp-neutral)',
                        fontWeight: col.featured ? 600 : 400,
                      }}>{val}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}