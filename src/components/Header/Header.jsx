import { NavLink } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import "./Header.css";

function Header() {
  const { cartCount } = useCart();
const { user, logout } = useAuth();
  return (
    <header className="header">
      <div className="header__container">

       <NavLink to="/" className="header__logo">
  <span className="header__logo-icon">✦</span>

  <span className="header__logo-text">
    <strong>VYSHYVANKA</strong>
    <small>ТРАДИЦІЇ В КОЖНІЙ ДЕТАЛІ</small>
  </span>
</NavLink>

        <nav className="header__nav">
  <NavLink
    to="/"
    end
    className={({ isActive }) =>
      isActive
        ? "header__nav-link header__nav-link--active"
        : "header__nav-link"
    }
  >
    Головна
  </NavLink>

  <NavLink
    to="/catalog"
    className={({ isActive }) =>
      isActive
        ? "header__nav-link header__nav-link--active"
        : "header__nav-link"
    }
  >
    Каталог
  </NavLink>

  <NavLink
    to="/about"
    className={({ isActive }) =>
      isActive
        ? "header__nav-link header__nav-link--active"
        : "header__nav-link"
    }
  >
    Про нас
  </NavLink>

  <NavLink
    to="/contacts"
    className={({ isActive }) =>
      isActive
        ? "header__nav-link header__nav-link--active"
        : "header__nav-link"
    }
  >
    Контакти
  </NavLink>
</nav>

        <div className="header__actions">

          <button
            className="header__action"
            aria-label="Пошук"
          >
            <span>⌕</span>
          </button>

          <button
            className="header__action"
            aria-label="Обране"
          >
            <span>♡</span>
          </button>

          {user ? (
  <>
    <span className="header__user">
      Привіт, {user.name}
    </span>

    {user.role === "admin" && (
      <NavLink
        to="/admin"
        className="header__admin-link"
      >
        Адмін-панель
      </NavLink>
    )}

    <button
      className="header__logout"
      onClick={logout}
    >
      Вийти
    </button>
  </>
) : (
  <NavLink
    to="/login"
    className="header__login"
  >
    Увійти
  </NavLink>
)}

          <NavLink to="/cart" className="header__action header__cart">
  <svg
  className="header__cart-icon"
  viewBox="0 0 24 24"
  aria-hidden="true"
>
  <path
    d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.4L21 7H7"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
  <circle
    cx="10"
    cy="20"
    r="1.2"
    fill="currentColor"
  />
  <circle
    cx="18"
    cy="20"
    r="1.2"
    fill="currentColor"
  />
</svg>

  {cartCount > 0 && (
    <span className="header__cart-count">
      {cartCount}
    </span>
  )}
</NavLink>

        </div>

      </div>
    </header>
  );
}

export default Header;