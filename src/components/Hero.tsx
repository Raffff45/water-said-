export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <p className="hero-eyebrow">Питьевая вода · Казахстан · ВОЗ · СанПиН</p>
        <h1 className="hero-title">
          Чистая вода.<br />
          <em className="line2">Везде.</em>
        </h1>
        <p className="hero-sub">
          Поставляем и устанавливаем питьевые фонтанчики и системы очистки воды для школ, больниц, офисов и
          государственных учреждений по всему Казахстану.
        </p>
        <div className="hero-btns">
          <button className="btn-p">Оставить заявку</button>
          <button className="btn-g">Наши продукты</button>
        </div>
      </div>
      <div className="scroll-cue">
        <div className="scroll-line"></div>
        <span>Смотреть</span>
      </div>
    </section>
  );
}
