import "./Hero.css";

function Hero() {
  return (
    <section className="hero">
      <div className="hero__container">
        <div className="hero__content">
          <div className="hero__subtitle">
            <span></span>
            Українська традиція
          </div>

          <h1 className="hero__title">
            Вишиванка,
            <br />
            що розповідає
            <br />
            твою історію
          </h1>

          <p className="hero__description">
            Сучасні вишиванки, створені з любов'ю
            до української культури та традицій.
          </p>

          <a href="/catalog" className="hero__button">
            Переглянути каталог
            <span>→</span>
          </a>

          <div className="hero__advantages">
            <div className="advantage">
              <span className="advantage__icon">✧</span>
              <div>
                <strong>Авторський</strong>
                <small>дизайн</small>
              </div>
            </div>

            <div className="advantage">
              <span className="advantage__icon">♢</span>
              <div>
                <strong>Гарантія</strong>
                <small>якості</small>
              </div>
            </div>

            <div className="advantage">
              <span className="advantage__icon">♧</span>
              <div>
                <strong>Швидка</strong>
                <small>доставка</small>
              </div>
            </div>
          </div>
        </div>

        <div className="hero__image">
          <img src="../../../public/images/hero-vyshyvanka.jpg" alt="Вишиванка для жінок" />
        </div>
      </div>
    </section>
  );
}

export default Hero;