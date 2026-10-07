import "./Newsletter.css";

function Newsletter() {
  return (
    <section className="newsletter">
      <div className="newsletter__container">

        <div className="newsletter__content">
          <div className="newsletter__subtitle">
            <span></span>
            Будь у курсі
          </div>

          <h2 className="newsletter__title">
            Отримуй новини
            <br />
            та особливі пропозиції
          </h2>

          <p className="newsletter__text">
            Підпишись на нашу розсилку та дізнавайся
            першою про нові колекції, знижки та цікаві
            історії української вишиванки.
          </p>
        </div>

        <form className="newsletter__form">
          <label
            htmlFor="newsletter-email"
            className="newsletter__label"
          >
            Твоя електронна пошта
          </label>

          <div className="newsletter__input-wrapper">
            <input
              id="newsletter-email"
              type="email"
              placeholder="example@email.com"
              className="newsletter__input"
            />

            <button
              type="submit"
              className="newsletter__button"
            >
              Підписатися
              <span>→</span>
            </button>
          </div>

          <p className="newsletter__privacy">
            Підписуючись, ти погоджуєшся з нашою політикою
            конфіденційності.
          </p>
        </form>

      </div>
    </section>
  );
}

export default Newsletter;