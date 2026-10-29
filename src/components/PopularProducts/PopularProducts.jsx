import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './PopularProducts.css';

const PopularProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState('');
  const [isClosing, setIsClosing] = useState(false);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');

        if (!response.ok) {
          throw new Error('Не вдалося отримати товари');
        }

        const data = await response.json();

        const popularProducts = [...data]
          .sort((a, b) => {
            if (b.rating !== a.rating) {
              return b.rating - a.rating;
            }

            return b.reviewsCount - a.reviewsCount;
          })
          .slice(0, 4);

        setProducts(popularProducts);
      } catch (error) {
        console.error(error);
        setError('Не вдалося завантажити товари');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (!notification) return;

    setIsClosing(false);

    const closeTimer = setTimeout(() => {
      setIsClosing(true);
    }, 2700);

    const removeTimer = setTimeout(() => {
      setNotification('');
      setIsClosing(false);
    }, 3000);

    return () => {
      clearTimeout(closeTimer);
      clearTimeout(removeTimer);
    };
  }, [notification]);

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
        {notification && (
          <div
            className={`popular-products__notification ${
              isClosing ? 'popular-products__notification--closing' : ''
            }`}
          >
            <span>✓</span>
            {notification}
          </div>
        )}
        <div className="popular-products__header">
          <div>
            <span className="popular-products__subtitle">НАШ ВИБІР</span>

            <h2 className="popular-products__title">Популярні товари</h2>
          </div>

          <button
            className="popular-products__all"
            onClick={() => navigate('/catalog')}
          >
            Дивитися всі →
          </button>
        </div>

        <div className="popular-products__grid">
          {products.map(product => (
            <article className="product-card" key={product._id}>
              <div className="product-card__image-wrapper">
                <Link to={`/products/${product._id}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-card__image"
                  />
                </Link>

                <span className="product-card__badge">Популярне</span>

                <button
                  className="product-card__favorite"
                  aria-label={
                    favoriteProducts.includes(product._id)
                      ? 'Видалити з обраного'
                      : 'Додати в обране'
                  }
                  onClick={() => {
                    setFavoriteProducts(prev =>
                      prev.includes(product._id)
                        ? prev.filter(id => id !== product._id)
                        : [...prev, product._id],
                    );
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="23"
                    height="23"
                    fill={
                      favoriteProducts.includes(product._id)
                        ? '#9b1c31'
                        : 'none'
                    }
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
                  </svg>
                </button>

                <button
                  className="product-card__cart"
                  onClick={() => {
                    addToCart(product);
                    setNotification(`${product.name} додано до кошика!`);
                  }}
                >
                  Додати в кошик
                </button>
              </div>

              <div className="product-card__info">
                <span className="product-card__category">
                  {product.category}
                </span>

                <h3 className="product-card__name">{product.name}</h3>

                <div className="product-card__bottom">
                  <span className="product-card__price">
                    {product.price.toLocaleString('uk-UA')} грн
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
