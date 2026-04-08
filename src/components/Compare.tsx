export default function Compare() {
  return (
    <section className="pad">
      <div className="wrap reveal">
        <div style={{ textAlign: 'center', maxWidth: '560px', margin: '0 auto' }}>
          <span className="sec-tag">Сравнение</span>
          <h2 className="sec-h2">
            Мы против
            <br />
            <em>бутилированной</em> воды
          </h2>
        </div>
        <table className="cmp-table">
          <thead>
            <tr>
              <th>Критерий</th>
              <th>Вода для всех</th>
              <th>Бутилированная</th>
              <th>Только кулер</th>
            </tr>
          </thead>
          <tbody>
            <tr className="cmp-ours">
              <td>Стоимость / 100 чел. в год</td>
              <td className="hi">от 60 000 ₸</td>
              <td className="lo">400 000+ ₸</td>
              <td>180 000 ₸</td>
            </tr>
            <tr>
              <td>Качество очистки</td>
              <td className="hi">ВОЗ, СанПиН</td>
              <td>Непостоянное</td>
              <td>Базовое</td>
            </tr>
            <tr>
              <td>Вода 24/7</td>
              <td className="hi">✓ Да</td>
              <td className="lo">✗ По запасам</td>
              <td>Частично</td>
            </tr>
            <tr>
              <td>Пластиковые отходы</td>
              <td className="hi">Нет</td>
              <td className="lo">40 000+ бутылок</td>
              <td>Есть</td>
            </tr>
            <tr>
              <td>Техобслуживание</td>
              <td className="hi">✓ Включено</td>
              <td className="lo">—</td>
              <td className="lo">Не включено</td>
            </tr>
            <tr>
              <td>Срок установки</td>
              <td className="hi">1 день</td>
              <td className="lo">Постоянные доставки</td>
              <td>2–3 дня</td>
            </tr>
            <tr>
              <td>Гарантия качества</td>
              <td className="hi">✓ Лаб. контроль</td>
              <td className="lo">✗ Нет</td>
              <td className="lo">✗ Нет</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
