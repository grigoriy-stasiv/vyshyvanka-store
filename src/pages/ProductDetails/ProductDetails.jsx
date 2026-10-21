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
          `http://localhost:5000/api/products/${id}`,
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

  const selectedStock = Array.isArray(product?.stock)
    ? product.stock.find(
        (item) => item.size === selectedSize && item.color === selectedColor,
      )
    : undefined;

  const hasStockData =
    Array.isArray(product?.stock) && product.stock.length > 0;

  const availableQuantity = selectedStock ? Number(selectedStock.quantity) : 0;

  const isVariantAvailable =
    hasStockData && selectedStock !== undefined && availableQuantity > 0;

  const getVariantQuantity = (size, color) => {
    if (!Array.isArray(product?.stock)) return null;

    const item = product.stock.find(
      (entry) => entry.size === size && entry.color === color,
    );

    return item ? Number(item.quantity) : 0;
  };

  const getSizeQuantity = (size) => {
    if (!Array.isArray(product?.stock)) return null;

    return product.stock
      .filter((item) => item.size === size)
      .reduce((total, item) => total + Number(item.quantity || 0), 0);
  };

  const getColorQuantity = (color) => {
    if (!Array.isArray(product?.stock)) return null;

    return product.stock
      .filter((item) => item.color === color)
      .reduce((total, item) => total + Number(item.quantity || 0), 0);
  };

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      setNotification("Будь ласка, виберіть розмір і колір.");
      return;
    }

    if (!hasStockData) {
      setNotification(
        "Наявність цього товару ще не налаштована. Будь ласка, зв'яжіться з нами.",
      );
      return;
    }

    if (!isVariantAvailable) {
      setNotification("На жаль, цього варіанта немає в наявності.");
      return;
    }

    addToCart({
      ...product,
      selectedSize,
      selectedColor,
    });

    setNotification(
      `✓ ${product.name} додано до кошика! Розмір: ${selectedSize}, колір: ${selectedColor}.`,
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

              <h1 className="product-details__title">{product.name}</h1>

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
                <span className="product-details__option-title">Розмір:</span>

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
                        setSelectedSize((current) =>
                          current === size ? "" : size,
                        );
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
                <span className="product-details__option-title">Колір:</span>

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
                        setSelectedColor((current) =>
                          current === color ? "" : color,
                        );
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

              <div
                className={`product-details__stock ${
                  selectedSize && selectedColor && !isVariantAvailable
                    ? "product-details__stock--out"
                    : ""
                }`}
                role="status"
              >
                {!hasStockData
                  ? "Наявність уточнюється"
                  : !selectedSize || !selectedColor
                    ? "Оберіть розмір і колір, щоб перевірити наявність"
                    : isVariantAvailable
                      ? `У наявності: ${availableQuantity} шт.`
                      : "Немає в наявності"}
              </div>

              <button
                type="button"
                className="product-details__cart"
                onClick={handleAddToCart}
                disabled={
                  !selectedSize ||
                  !selectedColor ||
                  !hasStockData ||
                  !isVariantAvailable
                }
              >
                {!selectedSize || !selectedColor
                  ? "Оберіть розмір і колір"
                  : isVariantAvailable
                    ? "Додати в кошик"
                    : "Немає в наявності"}
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
