
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { useAuth } from "../../context/AuthContext";
import "./MyOrders.css";

function MyOrders() {
  const { user, loading } = useAuth();

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [error, setError] = useState("");

  
const handleDeleteOrder = async (orderId) => {
  const confirmed = window.confirm(
    "Ви справді хочете видалити це замовлення?"
  );

  if (!confirmed) return;

  try {
    const token = localStorage.getItem("vyshyvanka-token");

    const response = await fetch(
      `http://localhost:5000/api/orders/my/${orderId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Не вдалося видалити замовлення."
      );
    }

    setOrders((previousOrders) =>
      previousOrders.filter((order) => order._id !== orderId)
    );
  } catch (err) {
    window.alert(err.message || "Сталася помилка.");
  }
  };
  
  
const handleCancelOrder = async (orderId) => {
  const confirmed = window.confirm(
    "Ви справді хочете скасувати це замовлення?"
  );

  if (!confirmed) return;

  try {
    const token = localStorage.getItem("vyshyvanka-token");

    const response = await fetch(
      `http://localhost:5000/api/orders/my/${orderId}/cancel`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Не вдалося скасувати замовлення."
      );
    }

    setOrders((previousOrders) =>
      previousOrders.map((order) =>
        order._id === orderId ? data.order : order
      )
    );
  } catch (err) {
    window.alert(err.message || "Сталася помилка.");
  }
};


useEffect(() => {
  if (loading) return;

  if (!user) {
    setOrdersLoading(false);
    setError("Увійдіть в акаунт, щоб переглянути свої замовлення.");
    return;
  }

  let isActive = true;

  const loadOrders = async (showLoader = false) => {
    if (showLoader && isActive) {
      setOrdersLoading(true);
    }

    try {
      const token = localStorage.getItem("vyshyvanka-token");

      const response = await fetch(
        "http://localhost:5000/api/orders/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Не вдалося завантажити замовлення."
        );
      }

      if (isActive) {
        setOrders(data);
        setError("");
      }
    } catch (err) {
      if (isActive) {
        setError(err.message || "Сталася помилка.");
      }
    } finally {
      if (isActive) {
        setOrdersLoading(false);
      }
    }
  };

  loadOrders(true);

  const intervalId = setInterval(() => {
    loadOrders();
  }, 5000);

  return () => {
    isActive = false;
    clearInterval(intervalId);
  };
}, [user, loading]);


  return (
    <>
      <Header />

      <main className="my-orders">
        <div className="my-orders__container">
          <h1>Мої замовлення</h1>

          {ordersLoading && <p>Завантаження замовлень...</p>}

          {!ordersLoading && error && (
            <div className="my-orders__message">
              <p>{error}</p>
              {!user && <Link to="/login">Увійти</Link>}
            </div>
          )}

          {!ordersLoading && !error && orders.length === 0 && (
            <div className="my-orders__empty">
              <h2>Замовлень поки немає</h2>
              <p>Ваші покупки з’являться тут після оформлення.</p>
              <Link to="/catalog">Перейти до каталогу</Link>
            </div>
          )}

          {!ordersLoading &&
            !error &&
            orders.map((order) => (
              <article className="my-order" key={order._id}>
                <div className="my-order__header">
                  <h2>Замовлення №{order._id.slice(-6)}</h2>
                  <span
  className={`my-order__status my-order__status--${{
    "Нове": "new",
    "Підтверджене": "confirmed",
    "Відправлене": "shipped",
    "Виконане": "completed",
    "Скасоване": "cancelled",
  }[order.status] || "new"}`}
>
  {order.status}
</span>
                </div>

                <p className="my-order__date">
                  Дата:{" "}
                  {new Date(order.createdAt).toLocaleString("uk-UA")}
                </p>

                <div className="my-order__items">
                  {order.items.map((item, index) => (
                    <div
                      className="my-order__item"
                      key={`${order._id}-${index}`}
                    >
                      {item.image && (
                        <img src={item.image} alt={item.name} />
                      )}

                      <div className="my-order__item-info">
                        <h3>{item.name}</h3>
                        {item.size && <p>Розмір: {item.size}</p>}
                        {item.color && <p>Колір: {item.color}</p>}
                        <p>Кількість: {item.quantity}</p>
                        <strong>
                          {item.price * item.quantity} грн
                        </strong>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="my-order__footer">
                  <span>Сума замовлення</span>
                  <strong>{order.totalAmount} грн</strong>
                </div>

                
{order.status === "Нове" && (
  <button
    type="button"
    className="my-order__cancel"
    onClick={() => handleCancelOrder(order._id)}
  >
    Скасувати замовлення
  </button>
)}

                
{["Виконане", "Скасоване"].includes(order.status) && (
  <button
    type="button"
    className="my-order__delete"
    onClick={() => handleDeleteOrder(order._id)}
  >
    Видалити замовлення
  </button>
)}

              </article>
            ))}
        </div>
      </main>

      <Footer />
    </>
  );
}

export default MyOrders;
