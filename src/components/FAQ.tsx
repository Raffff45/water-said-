import { useState } from 'react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: 'Как часто нужно менять фильтры?',
      answer: 'В среднем раз в 6–12 месяцев. Специалисты сами отслеживают ресурс и приедут на замену.',
    },
    {
      question: 'Сколько стоит установка?',
      answer:
        'Зависит от типа и количества точек. Выезд и консультация — бесплатны. Коммерческое предложение без скрытых платежей.',
    },
    {
      question: 'Нужно ли разрешение для установки?',
      answer:
        'Нет. Оборудование подключается к стандартной водопроводной точке. Работы выполняют сертифицированные монтажники.',
    },
    {
      question: 'Что входит в техобслуживание?',
      answer:
        'Замена фильтров, дезинфекция, диагностика и проверка качества воды. Экстренный вызов — 24 часа.',
    },
    {
      question: 'Работаете за пределами Алматы?',
      answer: 'Да, по всему Казахстану. Уточните сроки и условия при заявке.',
    },
  ];

  return (
    <section className="pad">
      <div className="wrap">
        <div style={{ textAlign: 'center', maxWidth: '560px', margin: '0 auto 1rem' }} className="reveal">
          <span className="sec-tag">Вопросы</span>
          <h2 className="sec-h2">
            Всё, что вы хотели <em>узнать</em>
          </h2>
        </div>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item reveal">
              <button className={`faq-q ${openIndex === index ? 'open' : ''}`} onClick={() => toggleFaq(index)}>
                {faq.question} <span>+</span>
              </button>
              <div className={`faq-a ${openIndex === index ? 'open' : ''}`}>
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
