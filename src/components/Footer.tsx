export default function Footer() {
  return (
    <>
      <footer>
        <div>
          <span className="flogo">
            Вода <em>для всех</em>
          </span>
          <p className="fdesc">
            Поставка и установка питьевых фонтанчиков и систем очистки воды для учреждений по всему Казахстану.
          </p>
        </div>
        <div className="fc">
          <h4>Продукты</h4>
          <ul>
            <li>
              <a href="#">Питьевые фонтанчики</a>
            </li>
            <li>
              <a href="#">Пурификаторы воды</a>
            </li>
            <li>
              <a href="#">Замена фильтров</a>
            </li>
            <li>
              <a href="#">Сервисный договор</a>
            </li>
          </ul>
        </div>
        <div className="fc">
          <h4>Клиенты</h4>
          <ul>
            <li>
              <a href="#">Школы и университеты</a>
            </li>
            <li>
              <a href="#">Больницы и клиники</a>
            </li>
            <li>
              <a href="#">Офисы и БЦ</a>
            </li>
            <li>
              <a href="#">Госучреждения</a>
            </li>
          </ul>
        </div>
        <div className="fc">
          <h4>Компания</h4>
          <ul>
            <li>
              <a href="#">О нас</a>
            </li>
            <li>
              <a href="#">Сертификаты</a>
            </li>
            <li>
              <a href="#">Контакты</a>
            </li>
            <li>
              <a href="#">Рассчитать стоимость</a>
            </li>
          </ul>
        </div>
      </footer>
      <div className="fbot">
        <span>© 2025 Вода для всех. Все права защищены.</span>
        <span>г. Алматы, Казахстан</span>
      </div>
    </>
  );
}
