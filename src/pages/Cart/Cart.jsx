import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./Cart.css";

function Cart() {
  const navigate = useNavigate();

  const { user } = useAuth();

  const [showCheckout, setShowCheckout] = useState(false);
  const [phone, setPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [checkoutSuccess, setCheckoutSuccess] = useState("");
  const {
    cartItems,
    cartTotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const handleCheckout = async (event) => {
    event.preventDefault();
    setCheckoutError("");
    setCheckoutSuccess("");

    if (!user) {
      navigate("/login");
      return;
    }

    const token = localStorage.getItem("vyshyvanka-token");

    if (!token) {
      navigate("/login");
      return;
    }

    setCheckoutLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            productId: item._id,
            quantity: item.quantity,
            size: item.selectedSize || "",
            color: item.selectedColor || "",
          })),
          phone,
          deliveryAddress,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Не вдалося оформити замовлення");
      }

      setCheckoutSuccess("Замовлення успішно оформлено!");
      clearCart();
      navigate("/my-orders");
      setPhone("");
      setDeliveryAddress("");
      setShowCheckout(false);
    } catch (error) {
      setCheckoutError(error.message);
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <>
        <Header />

        <div className="cart-page">
          <div className="cart-page__container">
            <div className="cart-empty">
              <div className="cart-empty__icon">🛒</div>

              <h1>Ваш кошик порожній</h1>

              <p>Додайте улюблені вишиванки, щоб продовжити покупки.</p>

              <Link to="/catalog" className="cart-empty__button">
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
              <span className="cart-page__label">ВАШІ ПОКУПКИ</span>

              <h1>Кошик</h1>
            </div>

            <button className="cart-page__clear" onClick={clearCart}>
              Очистити кошик
            </button>
          </div>

          <div className="cart-page__content">
            <div className="cart-items">
              {cartItems.map((item) => (
                <div className="cart-item" key={item._id}>
                  <div className="cart-item__image">
                    <img src={item.image} alt={item.name} />
                  </div>

                  <div className="cart-item__info">
                    <span className="cart-item__category">{item.category}</span>

                    <h2>{item.name}</h2>

                    {(item.selectedSize || item.selectedColor) && (
                      <div className="cart-item__options">
                        {item.selectedSize && (
                          <p>
                            Розмір: <strong>{item.selectedSize}</strong>
                          </p>
                        )}

                        {item.selectedColor && (
                          <p>
                            Колір: <strong>{item.selectedColor}</strong>
                          </p>
                        )}
                      </div>
                    )}

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
                    {(item.price * item.quantity).toLocaleString("uk-UA")} грн
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

                <strong>{cartTotal.toLocaleString("uk-UA")} грн</strong>
              </div>

              <div className="cart-summary__row">
                <span>Доставка</span>

                <strong>За тарифами перевізника</strong>
              </div>

              <div className="cart-summary__divider"></div>

              <div className="cart-summary__total">
                <span>Разом</span>

                <strong>{cartTotal.toLocaleString("uk-UA")} грн</strong>
              </div>

              <button
                type="button"
                className="cart-summary__checkout"
                onClick={() => {
                  setCheckoutError("");
                  setShowCheckout((current) => !current);
                }}
              >
                {showCheckout ? "Закрити форму" : "Оформити замовлення"}
              </button>

              {checkoutSuccess && (
                <p className="checkout-success">{checkoutSuccess}</p>
              )}

              {checkoutError && (
                <p className="checkout-error">{checkoutError}</p>
              )}

              {showCheckout && (
                <form className="checkout-form" onSubmit={handleCheckout}>
                  <label htmlFor="checkout-phone">Номер телефону</label>
                  <input
                    id="checkout-phone"
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="+380..."
                    required
                  />

                  <label htmlFor="checkout-address">Адреса доставки</label>
                  <textarea
                    id="checkout-address"
                    value={deliveryAddress}
                    onChange={(event) => setDeliveryAddress(event.target.value)}
                    placeholder="Місто, відділення або адреса"
                    rows={3}
                    required
                  />

                  <button type="submit" disabled={checkoutLoading}>
                    {checkoutLoading
                      ? "Оформлення..."
                      : "Підтвердити замовлення"}
                  </button>
                </form>
              )}

              <Link to="/catalog" className="cart-summary__continue">
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
