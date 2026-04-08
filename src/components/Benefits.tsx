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
          <div className="ben-card reveal">
            <span className="ben-icon">💰</span>
            <div className="ben-title">Экономия до 90%</div>
            <p className="ben-text">В 10–15 раз дешевле бутилированной воды. Окупаемость — от 12 месяцев.</p>
          </div>
          <div className="ben-card reveal">
            <span className="ben-icon">🌿</span>
            <div className="ben-title">Ноль пластика</div>
            <p className="ben-text">Одна установка заменяет 40–60 тысяч пластиковых бутылок в год.</p>
          </div>
          <div className="ben-card reveal">
            <span className="ben-icon">🏥</span>
            <div className="ben-title">Медицинская чистота</div>
            <p className="ben-text">Качество воды по нормам ВОЗ и СанПиН. Лабораторный контроль по запросу.</p>
          </div>
          <div className="ben-card reveal2">
            <span className="ben-icon">⚡</span>
            <div className="ben-title">Вода 24/7</div>
            <p className="ben-text">Никаких заказов и перебоев. Чистая вода в любом количестве и в любое время.</p>
          </div>
          <div className="ben-card reveal2">
            <span className="ben-icon">🔧</span>
            <div className="ben-title">Полный сервис</div>
            <p className="ben-text">Консультация, доставка, установка и техобслуживание — всё включено.</p>
          </div>
          <div className="ben-card reveal2">
            <span className="ben-icon">📊</span>
            <div className="ben-title">Аналитика онлайн</div>
            <p className="ben-text">Расход воды и состояние фильтров в личном кабинете. Уведомления заранее.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
