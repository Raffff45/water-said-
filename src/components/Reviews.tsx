export default function Reviews() {
  return (
    <section className="pad">
      <div className="wrap">
        <div style={{ textAlign: 'center', maxWidth: '560px', margin: '0 auto 5rem' }} className="reveal">
          <span className="sec-tag">Отзывы</span>
          <h2 className="sec-h2">
            Нам <em>доверяют</em>
            <br />
            учреждения
          </h2>
        </div>
        <div className="reviews-grid">
          <div className="review reveal">
            <div className="review-stars">★★★★★</div>
            <p className="review-text">
              «Установили 4 фонтанчика и 2 пурификатора. Дети в восторге. Сэкономили больше 300 000 тенге в год.»
            </p>
            <div className="reviewer">
              <div className="ava">АК</div>
              <div>
                <div className="rname">Айгуль Каримова</div>
                <div className="rrole">Директор, СОШ №47, Алматы</div>
              </div>
            </div>
          </div>
          <div className="review reveal">
            <div className="review-stars">★★★★★</div>
            <p className="review-text">
              «Всё установили за один день. Год работает без единого сбоя. Обслуживание приходит само по расписанию.»
            </p>
            <div className="reviewer">
              <div className="ava">СМ</div>
              <div>
                <div className="rname">Серик Мухамеджанов</div>
                <div className="rrole">Управляющий, БЦ "Сентрум"</div>
              </div>
            </div>
          </div>
          <div className="review reveal2">
            <div className="review-stars">★★★★★</div>
            <p className="review-text">
              «Для поликлиники качество воды — вопрос безопасности. Единственные, кто предоставил все сертификаты.»
            </p>
            <div className="reviewer">
              <div className="ava">НБ</div>
              <div>
                <div className="rname">Надежда Белова</div>
                <div className="rrole">Главврач, Городская поликлиника №3</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
