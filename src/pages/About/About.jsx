import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

import "./About.css";

const About = () => {
  return (
    <>
      <Header />

      <main className="about-page">
        <section className="about-page__hero">
          <div className="about-page__container">
            <span className="about-page__label">НАША ІСТОРІЯ</span>

            <h1>Про нас</h1>

            <p>
              Ми створюємо сучасну українську вишиванку, яка поєднує
              традиції наших предків із сучасним стилем.
            </p>
          </div>
        </section>

        <section className="about-page__content">
          <div className="about-page__image">
            <img
              src="/images/category-women.jpg"
              alt="Українська вишиванка"
            />
          </div>

          <div className="about-page__text">
            <span className="about-page__label">VYSHYVANKA</span>

            <h2>Традиції в кожній деталі</h2>

            <p>
              Вишиванка — це більше, ніж просто одяг. Це частина української
              культури, історії та родинної пам'яті.
            </p>

            <p>
              Ми прагнемо зберігати традиційні орнаменти та водночас створювати
              речі, які легко вписуються в сучасний гардероб.
            </p>

            <p>
              Кожна наша модель створена з увагою до деталей, якості матеріалів
              та українських традицій.
            </p>
          </div>
        </section>

        <section className="about-page__values">
          <div className="about-page__container">
            <span className="about-page__label">НАШІ ЦІННОСТІ</span>

            <h2>Що для нас важливо</h2>

            <div className="about-page__values-grid">
              <article className="about-page__value">
                <span>01</span>
                <h3>Українські традиції</h3>
                <p>
                  Поважаємо культурну спадщину та передаємо її через сучасний
                  дизайн.
                </p>
              </article>

              <article className="about-page__value">
                <span>02</span>
                <h3>Якість</h3>
                <p>
                  Обираємо якісні матеріали та приділяємо увагу кожній деталі.
                </p>
              </article>

              <article className="about-page__value">
                <span>03</span>
                <h3>Сучасність</h3>
                <p>
                  Створюємо вишиванки, які комфортно носити щодня та на особливі
                  події.
                </p>
              </article>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default About;