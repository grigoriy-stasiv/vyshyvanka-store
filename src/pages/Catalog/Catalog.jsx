import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

import './Catalog.css';

const Catalog = () => {
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category');
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(
    ['Жіноча', 'Чоловіча', 'Дитяча'].includes(categoryFromUrl)
      ? categoryFromUrl
      : 'Усі',
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('default');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');

        if (!response.ok) {
          throw new Error('Не вдалося отримати товари');
        }

        const data = await response.json();

        setProducts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const getProductStock = product => {
    if (Array.isArray(product.stock)) {
      return product.stock.reduce(
        (total, item) => total + (Number(item.quantity) || 0),
        0,
      );
    }

    return product.inStock ? 1 : 0;
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory =
      selectedCategory === 'Усі' || product.category === selectedCategory;

    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === 'price-asc') {
      return a.price - b.price;
    }

    if (sortOrder === 'price-desc') {
      return b.price - a.price;
    }

    return 0;
  });

  return (
    <>
      <Header />

      <main className="catalog-page">
        <section className="catalog-page__hero">
          <div className="catalog-page__container">
            <span className="catalog-page__label">VYSHYVANKA</span>

            <h1>Каталог</h1>

            <p>Оберіть свою вишиванку серед наших колекцій</p>
          </div>
        </section>

        <section className="catalog-page__products">
          <div className="catalog-page__container">
            <div className="catalog-search">
              <input
                type="text"
                placeholder="Пошук вишиванки..."
                value={searchQuery}
                onChange={event => setSearchQuery(event.target.value)}
              />

              {searchQuery && (
                <button
                  type="button"
                  className="catalog-search__clear"
                  onClick={() => setSearchQuery('')}
                  aria-label="Очистити пошук"
                >
                  ×
                </button>
              )}
            </div>

            <div className="catalog-filters">
              <button
                className={
                  selectedCategory === 'Усі'
                    ? 'catalog-filter catalog-filter--active'
                    : 'catalog-filter'
                }
                onClick={() => setSelectedCategory('Усі')}
              >
                Усі
              </button>

              <button
                className={
                  selectedCategory === 'Жіноча'
                    ? 'catalog-filter catalog-filter--active'
                    : 'catalog-filter'
                }
                onClick={() => setSelectedCategory('Жіноча')}
              >
                Жіночі
              </button>

              <button
                className={
                  selectedCategory === 'Чоловіча'
                    ? 'catalog-filter catalog-filter--active'
                    : 'catalog-filter'
                }
                onClick={() => setSelectedCategory('Чоловіча')}
              >
                Чоловічі
              </button>

              <button
                className={
                  selectedCategory === 'Дитяча'
                    ? 'catalog-filter catalog-filter--active'
                    : 'catalog-filter'
                }
                onClick={() => setSelectedCategory('Дитяча')}
              >
                Дитячі
              </button>
            </div>

            <div className="catalog-sort">
              <label htmlFor="sort-price">Сортування:</label>

              <select
                id="sort-price"
                value={sortOrder}
                onChange={event => setSortOrder(event.target.value)}
              >
                <option value="default">За замовчуванням</option>
                <option value="price-asc">Від дешевих до дорогих</option>
                <option value="price-desc">Від дорогих до дешевих</option>
              </select>
            </div>
            {loading && (
              <p className="catalog-page__message">Завантаження товарів...</p>
            )}

            {error && (
              <p className="catalog-page__message catalog-page__message--error">
                {error}
              </p>
            )}

            {!loading && !error && products.length === 0 && (
              <p className="catalog-page__message">Товарів поки немає.</p>
            )}

            {!loading &&
              !error &&
              products.length > 0 &&
              filteredProducts.length === 0 && (
                <p className="catalog-page__message">
                  За вашим запитом товарів не знайдено.
                </p>
              )}

            {!loading && !error && products.length > 0 && (
              <div className="catalog-page__grid">
                {sortedProducts.map(product => (
                  <article className="catalog-product" key={product._id}>
                    <Link
                      to={`/products/${product._id}`}
                      className="catalog-product__image-link"
                    >
                      <div className="catalog-product__image-wrapper">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="catalog-product__image"
                        />
                      </div>
                    </Link>

                    <div className="catalog-product__content">
                      <span className="catalog-product__category">
                        {product.category}
                      </span>

                      {getProductStock(product) > 0 ? (
                        <p className="catalog-product__availability">
                          Є в наявності: {getProductStock(product)} шт.
                        </p>
                      ) : (
                        <p className="catalog-product__availability catalog-product__availability--out">
                          Немає в наявності
                        </p>
                      )}

                      <h2>{product.name}</h2>

                      <p className="catalog-product__description">
                        {product.description}
                      </p>

                      <div className="catalog-product__bottom">
                        <strong>
                          {product.price.toLocaleString('uk-UA')} грн
                        </strong>

                        <Link
                          to={`/products/${product._id}`}
                          className="catalog-product__button"
                        >
                          Детальніше
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Catalog;
