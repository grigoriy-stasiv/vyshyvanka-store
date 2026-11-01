import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../../context/FavoritesContext';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './Favorites.css';

const Favorites = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { favoriteIds, removeFavorite } = useFavorites();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');

        if (!response.ok) {
          throw new Error('Не вдалося завантажити товари');
        }

        const data = await response.json();
        setProducts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const favoriteProducts = products.filter(product =>
    favoriteIds.includes(product._id),
  );

  return (
    <>
      <Header />

      <main className="favorites">
        <div className="favorites__container">
          <h1>Обране</h1>

          {loading && <p>Завантаження товарів...</p>}

          {error && <p>{error}</p>}

          {!loading && !error && favoriteProducts.length === 0 && (
            <div className="favorites__empty">
              <p>У вас поки немає обраних товарів.</p>
              <Link to="/catalog">Перейти до каталогу</Link>
            </div>
          )}

          {!loading && !error && favoriteProducts.length > 0 && (
            <div className="favorites__grid">
              {favoriteProducts.map(product => (
                <article className="favorites__card" key={product._id}>
                  <Link to={`/products/${product._id}`}>
                    <img src={product.image} alt={product.name} />
                    <h3>{product.name}</h3>
                  </Link>

                  <p>{product.price} грн</p>

                  <button
                    type="button"
                    onClick={() => removeFavorite(product._id)}
                  >
                    Видалити з обраного
                  </button>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Favorites;
