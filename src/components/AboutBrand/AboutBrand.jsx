import "./AboutBrand.css";

function AboutBrand() {
  return (
    <section className="about-brand">
      <div className="about-brand__container">

        <div className="about-brand__image">
          <img
            src="/images/category-women.jpg"
            alt="Українська вишиванка"
          />

          <div className="about-brand__badge">
            <span>✣</span>
            <strong>100%</strong>
            <small>українська<br />традиція</small>
          </div>
        </div>

        <div className="about-brand__content">

          <div className="about-brand__subtitle">
            <span></span>
            Наша історія
          </div>

          <h2 className="about-brand__title">
            Вишиванка —
            <br />
            більше, ніж одяг
          </h2>

          <p className="about-brand__text">
            Ми створюємо сучасні вишиванки, зберігаючи
            красу українських традицій. Кожен орнамент
            має свою історію, а кожна сорочка створена
            для того, щоб ця історія продовжувалась.
          </p>

          <p className="about-brand__text">
            Поєднуємо традиційні мотиви, натуральні
            матеріали та сучасний дизайн, щоб українська
            вишиванка органічно вписувалась у гардероб
            сьогоднішньої людини.
          </p>

          <a
            href="/about"
            className="about-brand__button"
          >
            Дізнатися більше
            <span>→</span>
          </a>

        </div>

      </div>
    </section>
  );
}

export default AboutBrand;