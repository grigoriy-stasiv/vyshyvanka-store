import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

import "./Contacts.css";

const Contacts = () => {
  return (
    <>
      <Header />

      <main className="contacts-page">
        <section className="contacts-page__hero">
          <div className="contacts-page__container">
            <span className="contacts-page__label">МИ НА ЗВ'ЯЗКУ</span>

            <h1>Контакти</h1>

            <p>
              Маєте запитання щодо замовлення або хочете дізнатися більше про
              наші вишиванки? Напишіть нам.
            </p>
          </div>
        </section>

        <section className="contacts-page__content">
          <div className="contacts-page__info">
            <span className="contacts-page__label">КОНТАКТНА ІНФОРМАЦІЯ</span>

            <h2>Будемо раді вам допомогти</h2>

            <div className="contacts-page__items">
              <div className="contacts-page__item">
                <span>Телефон</span>
                <a href="tel:+380000000000">+38 (000) 000-00-00</a>
              </div>

              <div className="contacts-page__item">
                <span>Email</span>
                <a href="mailto:info@vyshyvanka.com">
                  info@vyshyvanka.com
                </a>
              </div>

              <div className="contacts-page__item">
                <span>Графік роботи</span>
                <p>Пн–Пт: 09:00–18:00</p>
              </div>

              <div className="contacts-page__item">
                <span>Місто</span>
                <p>Україна</p>
              </div>
            </div>
          </div>

          <form className="contacts-page__form">
            <div className="contacts-page__field">
              <label htmlFor="name">Ваше ім'я</label>
              <input
                id="name"
                type="text"
                placeholder="Введіть ваше ім'я"
              />
            </div>

            <div className="contacts-page__field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="your@email.com"
              />
            </div>

            <div className="contacts-page__field">
              <label htmlFor="message">Повідомлення</label>
              <textarea
                id="message"
                rows="6"
                placeholder="Напишіть ваше повідомлення..."
              />
            </div>

            <button type="submit" className="contacts-page__button">
              Надіслати повідомлення
            </button>
          </form>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Contacts;