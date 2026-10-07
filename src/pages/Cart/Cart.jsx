import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./Cart.css";

function Cart() {
  const {
    cartItems,
    cartTotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  if (cartItems.length === 0) {
  return (
    <>
      <Header />

      <div className="cart-page">
        <div className="cart-page__container">
          <div className="cart-empty">
            <div className="cart-empty__icon">🛒</div>

            <h1>Ваш кошик порожній</h1>

            <p>
              Додайте улюблені вишиванки, щоб продовжити покупки.
            </p>

            <Link
              to="/catalog"
              className="cart-empty__button"
            >
              Перейти до каталогу
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

  return (
    <>
      <Header />
      
    <div className="cart-page">
      <div className="cart-page__container">

        <div className="cart-page__header">
          <div>
            <span className="cart-page__label">
              ВАШІ ПОКУПКИ
            </span>

            <h1>Кошик</h1>
          </div>

          <button
            className="cart-page__clear"
            onClick={clearCart}
          >
            Очистити кошик
          </button>
        </div>

        <div className="cart-page__content">

          <div className="cart-items">

            {cartItems.map((item) => (
              <div className="cart-item" key={item._id}>

                <div className="cart-item__image">
                  <img
                    src={item.image}
                    alt={item.name}
                  />
                </div>

                <div className="cart-item__info">
                  <span className="cart-item__category">
                    {item.category}
                  </span>

                  <h2>{item.name}</h2>

                  <p className="cart-item__price">
                    {item.price.toLocaleString("uk-UA")} грн
                  </p>
                </div>

                <div className="cart-item__quantity">

                  <button
                    onClick={() => decreaseQuantity(item._id)}
                    aria-label="Зменшити кількість"
                  >
                    −
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() => increaseQuantity(item._id)}
                    aria-label="Збільшити кількість"
                  >
                    +
                  </button>

                </div>

                <div className="cart-item__total">
                  {(
                    item.price * item.quantity
                  ).toLocaleString("uk-UA")}{" "}
                  грн
                </div>

                <button
                  className="cart-item__remove"
                  onClick={() => removeFromCart(item._id)}
                  aria-label={`Видалити ${item.name}`}
                >
                  ×
                </button>

              </div>
            ))}

          </div>

          <aside className="cart-summary">

            <h2>Підсумок</h2>

            <div className="cart-summary__row">
              <span>Товари</span>

              <strong>
                {cartTotal.toLocaleString("uk-UA")} грн
              </strong>
            </div>

            <div className="cart-summary__row">
              <span>Доставка</span>

              <strong>За тарифами перевізника</strong>
            </div>

            <div className="cart-summary__divider"></div>

            <div className="cart-summary__total">
              <span>Разом</span>

              <strong>
                {cartTotal.toLocaleString("uk-UA")} грн
              </strong>
            </div>

            <button className="cart-summary__checkout">
              Оформити замовлення
            </button>

            <Link
              to="/catalog"
              className="cart-summary__continue"
            >
              ← Продовжити покупки
            </Link>

          </aside>

        </div>
      </div>
      </div>
    <Footer />
  </>
  );
}

export default Cart;