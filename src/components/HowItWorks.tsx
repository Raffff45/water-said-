export default function HowItWorks() {
  return (
    <section id="how" className="pad how-wrap">
      <div className="wrap">
        <div style={{ textAlign: 'center', maxWidth: '560px', margin: '0 auto' }} className="reveal">
          <span className="sec-tag">Технология очистки</span>
          <h2 className="sec-h2">
            От водопровода
            <br />
            до <em>чистейшей</em> воды
          </h2>
        </div>
        <div className="how-flow">
          <div className="how-step reveal">
            <div className="step-icon" data-n="1">
              💧
            </div>
            <div className="step-title">Подача воды</div>
            <p className="step-text">Водопроводная вода поступает через предфильтр, задерживающий частицы крупнее 5 мкм.</p>
          </div>
          <div className="how-step reveal">
            <div className="step-icon" data-n="2">
              🧪
            </div>
            <div className="step-title">Угольный блок</div>
            <p className="step-text">Активированный уголь поглощает хлор, тяжёлые металлы и органические соединения.</p>
          </div>
          <div className="how-step reveal">
            <div className="step-icon" data-n="3">
              ⚙️
            </div>
            <div className="step-title">Обратный осмос</div>
            <p className="step-text">Мембрана задерживает бактерии и вирусы. Минерализатор восстанавливает pH.</p>
          </div>
          <div className="how-step reveal">
            <div className="step-icon" data-n="4">
              ✨
            </div>
            <div className="step-title">УФ-стерилизация</div>
            <p className="step-text">УФ-излучение уничтожает 99,99% патогенов. Вода безопасна и свежа.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
