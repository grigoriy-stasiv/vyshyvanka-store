import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container">

        <div className="footer__top">

          {/* Бренд */}
          <div className="footer__brand">
            <a href="/" className="footer__logo">
              ВИШИВАНКА
            </a>

            <p className="footer__description">
              Сучасна українська вишиванка,
              створена з любов'ю до традицій
              та увагою до деталей.
            </p>

            <div className="footer__socials">
              <a href="#" aria-label="Instagram">
                Instagram
              </a>

              <a href="#" aria-label="Facebook">
                Facebook
              </a>

              <a href="#" aria-label="TikTok">
                TikTok
              </a>
            </div>
          </div>

          {/* Магазин */}
          <div className="footer__column">
            <h3 className="footer__title">
              Магазин
            </h3>

            <ul className="footer__list">
              <li>
                <a href="/catalog">Всі товари</a>
              </li>
              <li>
                <a href="/catalog/women">Жіночі</a>
              </li>
              <li>
                <a href="/catalog/men">Чоловічі</a>
              </li>
              <li>
                <a href="/catalog/kids">Дитячі</a>
              </li>
            </ul>
          </div>

          {/* Інформація */}
          <div className="footer__column">
            <h3 className="footer__title">
              Інформація
            </h3>

            <ul className="footer__list">
              <li>
                <a href="/about">Про нас</a>
              </li>
              <li>
                <a href="/delivery">Доставка та оплата</a>
              </li>
              <li>
                <a href="/returns">Повернення</a>
              </li>
              <li>
                <a href="/contacts">Контакти</a>
              </li>
            </ul>
          </div>

          {/* Контакти */}
          <div className="footer__column">
            <h3 className="footer__title">
              Контакти
            </h3>

            <div className="footer__contacts">
              <a href="tel:+380000000000">
                +38 (000) 000-00-00
              </a>

              <a href="mailto:info@vyshyvanka.ua">
                info@vyshyvanka.ua
              </a>

              <span>
                Україна
              </span>
            </div>
          </div>

        </div>

        <div className="footer__bottom">

          <p>
            © 2026 Вишиванка. Всі права захищені.
          </p>

          <div className="footer__legal">
            <a href="/privacy">
              Політика конфіденційності
            </a>

            <a href="/terms">
              Умови використання
            </a>
          </div>

        </div>

      </div>
    </footer>
  );
}

export default Footer;