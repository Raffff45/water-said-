import { useState } from "react";
import Modal from "./Modal";

export default function Hero() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = async () => {
    if (!name || !phone) {
      alert("Заполни все поля");
      return;
    }

    const digits = phone.replace(/\D/g, "");

    if (digits.length !== 11) {
      alert("Введите полный номер телефона");
      return;
    }

    const text = `
🔥 Новая заявка
👤 ФИО: ${name}
📞 Телефон: +${digits}
    `;

    try {
      const res = await fetch(
        "https://dpbyblauovgdabyyrfai.supabase.co/functions/v1/send-telegram",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: text,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Ошибка сервера");
      }

      alert("Заявка отправлена 🚀");
      setOpen(false);
      setName("");
      setPhone("");
    } catch (error) {
      alert("Ошибка отправки ❌");
      console.error(error);
    }
  };

  return (
    <section className="hero">
      <div className="hero-content">
        <p className="hero-eyebrow">
          Питьевая вода · Казахстан · ВОЗ · СанПиН
        </p>

        <h1 className="hero-title">
          Чистая вода.<br />
          <em className="line2">Везде.</em>
        </h1>

        <p className="hero-sub">
          Поставляем и устанавливаем питьевые фонтанчики и системы очистки воды
          для школ, больниц, офисов и государственных учреждений по всему Казахстану.
        </p>

        <div className="hero-btns">
          <button className="btn-p" onClick={() => setOpen(true)}>
            Оставить заявку
          </button>

          <button
            className="btn-p"
            onClick={() => {
              const el = document.getElementById("products");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Наши продукты
          </button>
        </div>
      </div>

      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <h2 className="modal-title">Оставить заявку</h2>
        <p className="modal-subtitle">Мы свяжемся с вами в течение 5 минут</p>

        <input
          type="text"
          placeholder="Иванов Иван Иванович"
          value={name}
          onChange={(e) => {
            const value = e.target.value;
            if (/^[a-zA-Zа-яА-ЯёЁ\s]*$/.test(value)) {
              setName(value);
            }
          }}
          className="modal-input"
        />

        <input
          type="tel"
          placeholder="+7 (707) 730-68-46"
          value={phone}
          onChange={(e) => {
            let value = e.target.value.replace(/\D/g, "");
            if (value.startsWith("8")) value = "7" + value.slice(1);
            if (!value.startsWith("7")) value = "7" + value;
            value = value.slice(0, 11);

            let formatted = "+7";
            if (value.length > 1) formatted += ` (${value.slice(1, 4)}`;
            if (value.length >= 4) formatted += `) ${value.slice(4, 7)}`;
            if (value.length >= 7) formatted += `-${value.slice(7, 9)}`;
            if (value.length >= 9) formatted += `-${value.slice(9, 11)}`;

            setPhone(formatted);
          }}
          className="modal-input"
        />

        <button onClick={handleSubmit} className="modal-btn">
          Отправить заявку
        </button>
      </Modal>

      <div className="scroll-cue">
        <div className="scroll-line"></div>
        <span>Смотреть</span>
      </div>
    </section>
  );
}