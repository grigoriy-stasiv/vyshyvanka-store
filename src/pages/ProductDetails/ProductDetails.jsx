import Header from "../../components/Header/Header";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [notification, setNotification] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/products/${id}`
        );

        if (!response.ok) {
          throw new Error("Товар не знайдено");
        }

        const data = await response.json();
        setProduct(data);
        setSelectedSize("");
        setSelectedColor("");
        setNotification("");
      } catch (error) {
        console.error(error);
        setError("Не вдалося завантажити товар");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      setNotification("Будь ласка, виберіть розмір і колір.");
      return;
    }

    addToCart({
      ...product,
      selectedSize,
      selectedColor,
    });

    setNotification(
      `✓ ${product.name} додано до кошика! Розмір: ${selectedSize}, колір: ${selectedColor}.`
    );
  };

  if (loading) {
    return <p>Завантаження товару...</p>;
  }

  if (error || !product) {
    return <p>{error || "Товар не знайдено"}</p>;
  }

  return (
     <>
    <Header />
    <main className="product-details">
      <div className="product-details__container">
        <Link to="/" className="product-details__back">
          ← Повернутися до магазину
        </Link>

        <div className="product-details__content">
          <div className="product-details__image-wrapper">
            <img
              src={product.image}
              alt={product.name}
              className="product-details__image"
            />
          </div>

          <div className="product-details__info">
            <span className="product-details__category">
              {product.category}
            </span>

            <h1 className="product-details__title">
              {product.name}
            </h1>

            <div className="product-details__rating">
              ★ {product.rating} · {product.reviewsCount} відгуків
            </div>

            <div className="product-details__price">
              {product.price.toLocaleString("uk-UA")} грн
            </div>

            <p className="product-details__description">
              {product.description}
            </p>

            <div className="product-details__option">
              <span className="product-details__option-title">
                Розмір:
              </span>

              <div className="product-details__options">
                {(product.sizes || []).map((size) => (
                  <button
                    type="button"
                    key={size}
                    className={`product-details__option-button ${
                      selectedSize === size ? "is-selected" : ""
                    }`}
                    aria-pressed={selectedSize === size}
                    onClick={() => {
                      setSelectedSize(size);
                      setNotification("");
                    }}
                  >
                    {selectedSize === size && (
                      <span className="option-check">✓ </span>
                    )}
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="product-details__option">
              <span className="product-details__option-title">
                Колір:
              </span>

              <div className="product-details__options">
                {(product.colors || []).map((color) => (
                  <button
                    type="button"
                    key={color}
                    className={`product-details__option-button ${
                      selectedColor === color ? "is-selected" : ""
                    }`}
                    aria-pressed={selectedColor === color}
                    onClick={() => {
                      setSelectedColor(color);
                      setNotification("");
                    }}
                  >
                    {selectedColor === color && (
                      <span className="option-check">✓ </span>
                    )}
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="product-details__cart"
              onClick={handleAddToCart}
            >
              Додати в кошик
            </button>

            {notification && (
              <div
                className={`product-details__notification ${
                  selectedSize && selectedColor
                    ? "product-details__notification--success"
                    : "product-details__notification--error"
                }`}
                role="status"
              >
                {notification}
              </div>
            )}
          </div>
        </div>
      </div>
      </main>
       </>
  );
};

export default ProductDetails;
