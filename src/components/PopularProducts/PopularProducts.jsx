import { useEffect, useState } from "react";
import "./PopularProducts.css";

const PopularProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        
        const response = await fetch(
          "http://localhost:5000/api/products"
        );

        if (!response.ok) {
          throw new Error("Не вдалося отримати товари");
        }

        const data = await response.json();

        setProducts(data);
      } catch (error) {
        console.error(error);
        setError("Не вдалося завантажити товари");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="popular-products">
        <div className="popular-products__container">
          <p>Завантаження товарів...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="popular-products">
        <div className="popular-products__container">
          <p>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="popular-products">
      <div className="popular-products__container">
        <div className="popular-products__header">
          <div>
            <span className="popular-products__subtitle">
              НАШ ВИБІР
            </span>

            <h2 className="popular-products__title">
              Популярні товари
            </h2>
          </div>

          <button className="popular-products__all">
            Дивитися всі →
          </button>
        </div>

        <div className="popular-products__grid">
          {products.map((product) => (
            <article
              className="product-card"
              key={product._id}
            >
              <div className="product-card__image-wrapper">
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-card__image"
                />

                <span className="product-card__badge">
                  Популярне
                </span>

                <button
                  className="product-card__favorite"
                  aria-label="Додати в обране"
                >
                  ♡
                </button>

                <button className="product-card__cart">
                  Додати в кошик
                </button>
              </div>

              <div className="product-card__info">
                <span className="product-card__category">
                  {product.category}
                </span>

                <h3 className="product-card__name">
                  {product.name}
                </h3>

                <div className="product-card__bottom">
                  <span className="product-card__price">
                    {product.price.toLocaleString("uk-UA")} грн
                  </span>

                  <span className="product-card__rating">
                    ★ {product.rating}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularProducts;