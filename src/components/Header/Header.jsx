import { NavLink, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import "./Header.css";

function Header() {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const [cancelledOrdersCount, setCancelledOrdersCount] = useState(0);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      setNewOrdersCount(0);
      setCancelledOrdersCount(0);
      return;
    }

    let isActive = true;

    const loadNewOrdersCount = async () => {
      try {
        const token = localStorage.getItem("vyshyvanka-token");

        const response = await fetch("http://localhost:5000/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) return;

        const orders = await response.json();

        if (isActive && Array.isArray(orders)) {
          setNewOrdersCount(
            orders.filter((order) => order.status === "Нове" && !order.isRead)
              .length,
          );

          setCancelledOrdersCount(
            orders.filter(
              (order) =>
                order.status === "Скасоване" && order.cancellationUnread,
            ).length,
          );
        }
      } catch (error) {
        console.error("Помилка завантаження нових замовлень:", error);
      }
    };

    loadNewOrdersCount();

    const intervalId = setInterval(loadNewOrdersCount, 5000);

    return () => {
      isActive = false;
      clearInterval(intervalId);
    };
  }, [user]);

  const closeMenu = () => setMenuOpen(false);

  const getNavClass = ({ isActive }) =>
    isActive ? "header__nav-link header__nav-link--active" : "header__nav-link";

  return (
    <header className="header">
      <div className="header__container">
        <NavLink to="/" className="header__logo" onClick={closeMenu}>
          <span className="header__logo-icon">✦</span>

          <span className="header__logo-text">
            <strong>VYSHYVANKA</strong>
            <small>ТРАДИЦІЇ В КОЖНІЙ ДЕТАЛІ</small>
          </span>
        </NavLink>

        <nav
          id="header-navigation"
          className={`header__nav ${menuOpen ? 'header__nav--open' : ''}`}
        >
          <NavLink to="/" end className={getNavClass} onClick={closeMenu}>
            Головна
          </NavLink>

          <NavLink to="/catalog" className={getNavClass} onClick={closeMenu}>
            Каталог
          </NavLink>

          <NavLink to="/about" className={getNavClass} onClick={closeMenu}>
            Про нас
          </NavLink>

          <NavLink to="/contacts" className={getNavClass} onClick={closeMenu}>
            Контакти
          </NavLink>

          {user && (
            <NavLink to="/profile" className={getNavClass} onClick={closeMenu}>
              Мій профіль
            </NavLink>
          )}

          {user && (
            <NavLink
              to="/my-orders"
              className={getNavClass}
              onClick={closeMenu}
            >
              Мої замовлення
            </NavLink>
          )}

          {user?.role === 'admin' && (
            <NavLink
              to="/admin"
              className="header__admin-link"
              onClick={closeMenu}
            >
              Адмін-панель
              {newOrdersCount > 0 && (
                <span className="header__notification">{newOrdersCount}</span>
              )}
              {cancelledOrdersCount > 0 && (
                <span className="header__notification header__notification--cancelled">
                  {cancelledOrdersCount}
                </span>
              )}
            </NavLink>
          )}

          {user && (
            <div className="header__mobile-account">
              <span className="header__user">Привіт, {user.name}</span>
              <button
                type="button"
                className="header__logout"
                onClick={() => {
                  closeMenu();
                  logout();
                }}
              >
                Вийти
              </button>
            </div>
          )}

          {!user && (
            <NavLink
              to="/login"
              className="header__login header__mobile-login"
              onClick={closeMenu}
            >
              Увійти
            </NavLink>
          )}
        </nav>

        <div className="header__actions">
          <button className="header__action" aria-label="Пошук" type="button">
            <span>⌕</span>
          </button>

          <button
            className="header__action header__favorite"
            aria-label="Обране"
            type="button"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
            </svg>
          </button>

          {user && (
            <span className="header__user header__desktop-user">
              Привіт, {user.name}
            </span>
          )}

          {user && (
            <button
              className="header__logout header__desktop-logout"
              onClick={logout}
              type="button"
            >
              Вийти
            </button>
          )}

          {!user && (
            <NavLink
              to="/login"
              className="header__login header__desktop-login"
            >
              Увійти
            </NavLink>
          )}

          <NavLink
            to="/cart"
            className="header__action header__cart"
            aria-label={`Кошик, товарів: ${cartCount}`}
            onClick={closeMenu}
          >
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
              <circle cx="10" cy="20" r="1.2" fill="currentColor" />
              <circle cx="18" cy="20" r="1.2" fill="currentColor" />
            </svg>

            {cartCount > 0 && (
              <span className="header__cart-count">{cartCount}</span>
            )}
          </NavLink>

          <button
            type="button"
            className={`header__burger ${menuOpen ? 'header__burger--open' : ''}`}
            aria-label={menuOpen ? 'Закрити меню' : 'Відкрити меню'}
            aria-expanded={menuOpen}
            aria-controls="header-navigation"
            onClick={() => setMenuOpen(open => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
