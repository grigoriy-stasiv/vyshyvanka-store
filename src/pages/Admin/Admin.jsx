import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

import { useAuth } from "../../context/AuthContext";

import "./Admin.css";

function Admin() {
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [showProducts, setShowProducts] = useState(false);
const [showProductForm, setShowProductForm] = useState(false);
const [editingProductId, setEditingProductId] = useState(null);

  const [productForm, setProductForm] = useState({
  name: "",
  category: "Жіноча",
  description: "",
  price: "",
  image: "",
  sizes: "",
  colors: "",
  inStock: true,
  rating: 0,
  reviewsCount: 0,
});

  const [productSaving, setProductSaving] = useState(false);
  const [productImageFile, setProductImageFile] =
  useState(null);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "admin") {
      navigate("/");
      return;
    }

    const checkAdminAccess = async () => {
      const token = localStorage.getItem(
        "vyshyvanka-token"
      );

      const loadProducts = async () => {
  try {
    const response = await fetch(
      "http://localhost:5000/api/products"
    );

    if (!response.ok) {
      throw new Error("Не вдалося завантажити товари");
    }

    const data = await response.json();

    setProducts(data);
  } catch (error) {
    setError(error.message);
  } finally {
    setProductsLoading(false);
  }
};

loadProducts();

      try {
        const response = await fetch(
          "http://localhost:5000/api/admin",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Доступ заборонено"
          );
        }

        setMessage(data.message);
      } catch (error) {
        setError(error.message);

        if (error.message.includes("токен")) {
          logout();
          navigate("/login");
        }
      }
    };

    checkAdminAccess();
  }, [user, loading, navigate, logout]);

  if (loading) {
    return (
      <div className="admin-loading">
        Завантаження...
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  const handleDeleteProduct = async (productId) => {
  const confirmed = window.confirm(
    "Ви впевнені, що хочете видалити цей товар?"
  );

  if (!confirmed) {
    return;
  }

  const token = localStorage.getItem("vyshyvanka-token");

  try {
    const response = await fetch(
      `http://localhost:5000/api/products/${productId}`,
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
        data.message || "Не вдалося видалити товар"
      );
    }

    setProducts((currentProducts) =>
      currentProducts.filter(
        (product) => product._id !== productId
      )
    );

    setMessage("Товар успішно видалено");
    setError("");
  } catch (error) {
    setError(error.message);
  }
  };
  
  const handleProductFormChange = (event) => {
  const { name, value, type, checked } = event.target;

  setProductForm((current) => ({
    ...current,
    [name]: type === "checkbox" ? checked : value,
  }));
  };
  
  const handleAddProduct = async (event) => {
  event.preventDefault();

  setProductSaving(true);
  setError("");
    setMessage("");
    let imageUrl = productForm.image;

  const token = localStorage.getItem(
    "vyshyvanka-token"
    );
    
    if (productImageFile) {
  const formData = new FormData();

  formData.append(
    "image",
    productImageFile
  );

  const uploadResponse = await fetch(
    "http://localhost:5000/api/upload/image",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  const uploadData =
    await uploadResponse.json();

  if (!uploadResponse.ok) {
    throw new Error(
      uploadData.message ||
        "Не вдалося завантажити фотографію"
    );
  }

  imageUrl = uploadData.url;
}

  const productData = {
    ...productForm,
    image: imageUrl,
    price: Number(productForm.price),
    sizes: productForm.sizes
      .split(",")
      .map((size) => size.trim())
      .filter(Boolean),
    colors: productForm.colors
      .split(",")
      .map((color) => color.trim())
      .filter(Boolean),
    rating: Number(productForm.rating),
    reviewsCount: Number(productForm.reviewsCount),
  };

  try {
    const url = editingProductId
      ? `http://localhost:5000/api/products/${editingProductId}`
      : "http://localhost:5000/api/products";

    const method = editingProductId
      ? "PUT"
      : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Не вдалося зберегти товар"
      );
    }

    if (editingProductId) {
      setProducts((currentProducts) =>
        currentProducts.map((product) =>
          product._id === editingProductId
            ? data
            : product
        )
      );

      setMessage("Товар успішно оновлено");
    } else {
      setProducts((currentProducts) => [
        data,
        ...currentProducts,
      ]);

      setMessage("Товар успішно додано");
    }

    setProductForm({
      name: "",
      category: "Жіноча",
      description: "",
      price: "",
      image: "",
      sizes: "",
      colors: "",
      inStock: true,
      rating: 0,
      reviewsCount: 0,
    });

    setEditingProductId(null);
    setShowProductForm(false);
    setProductImageFile(null);
  } catch (error) {
    setError(error.message);
  } finally {
    setProductSaving(false);
  }
};
  
  const handleEditProduct = (product) => {
  setEditingProductId(product._id);

  setProductForm({
    name: product.name || "",
    category: product.category || "Жіноча",
    description: product.description || "",
    price: product.price || "",
    image: product.image || "",
    sizes: Array.isArray(product.sizes)
      ? product.sizes.join(", ")
      : "",
    colors: Array.isArray(product.colors)
      ? product.colors.join(", ")
      : "",
    inStock: product.inStock ?? true,
    rating: product.rating || 0,
    reviewsCount: product.reviewsCount || 0,
  });

  setShowProductForm(true);
};

  return (
    <>
      <Header />

      <main className="admin-page">
        <div className="admin-page__container">

          <div className="admin-page__header">
            <div>
              <span className="admin-page__label">
                АДМІНІСТРАТИВНА ПАНЕЛЬ
              </span>

              <h1>Вітаємо, {user.name}</h1>

              <p>
                Тут ви зможете керувати магазином
                вишиванок.
              </p>
            </div>

            <button
              className="admin-page__logout"
              onClick={logout}
            >
              Вийти
            </button>
          </div>

          {error && (
            <div className="admin-page__error">
              {error}
            </div>
          )}

          {message && (
            <div className="admin-page__success">
              ✓ {message}
            </div>
          )}

          <div className="admin-dashboard">

            <div className="admin-dashboard__card">
              <span className="admin-dashboard__icon">
                🛍️
              </span>

              <h2>Товари</h2>

              <p>
                Додавання, редагування та видалення
                товарів.
              </p>

              <button
  type="button"
  onClick={() => setShowProducts((current) => !current)}
>
  {showProducts ? "Сховати товари" : "Керувати товарами"}
</button>
            </div>

            <div className="admin-dashboard__card">
              <span className="admin-dashboard__icon">
                📦
              </span>

              <h2>Замовлення</h2>

              <p>
                Перегляд та обробка замовлень
                клієнтів.
              </p>

              <button>
                Переглянути замовлення
              </button>
            </div>

            <div className="admin-dashboard__card">
              <span className="admin-dashboard__icon">
                👥
              </span>

              <h2>Користувачі</h2>

              <p>
                Перегляд зареєстрованих користувачів.
              </p>

              <button>
                Переглянути користувачів
              </button>
            </div>

          </div>
          {showProducts && (
<div className="admin-products">
  <div className="admin-products__header">
    <div>
      <span className="admin-products__label">
        КАТАЛОГ
      </span>

      <h2>Товари магазину</h2>
    </div>

    <button
  type="button"
  className="admin-products__add"
  onClick={() => {
  setEditingProductId(null);

  setProductForm({
    name: "",
    category: "Жіноча",
    description: "",
    price: "",
    image: "",
    sizes: "",
    colors: "",
    inStock: true,
    rating: 0,
    reviewsCount: 0,
  });

  setShowProductForm(true);
}}
>
  + Додати товар
</button>
            </div>
            
            {showProductForm && (
  <form
    className="admin-product-form"
    onSubmit={handleAddProduct}
  >
    <div className="admin-product-form__grid">

      <div className="admin-product-form__group">
        <label htmlFor="name">
          Назва товару
        </label>

        <input
          id="name"
          name="name"
          type="text"
          value={productForm.name}
          onChange={handleProductFormChange}
          placeholder="Наприклад, Вишиванка Берегиня"
          required
        />
      </div>

      <div className="admin-product-form__group">
        <label htmlFor="category">
          Категорія
        </label>

        <select
          id="category"
          name="category"
          value={productForm.category}
          onChange={handleProductFormChange}
        >
          <option value="Жіноча">Жіноча</option>
          <option value="Чоловіча">Чоловіча</option>
          <option value="Дитяча">Дитяча</option>
        </select>
      </div>

      <div className="admin-product-form__group">
        <label htmlFor="price">
          Ціна, грн
        </label>

        <input
          id="price"
          name="price"
          type="number"
          min="0"
          value={productForm.price}
          onChange={handleProductFormChange}
          placeholder="1890"
          required
        />
      </div>

      <div className="admin-product-form__group">
  <label htmlFor="image">
    Фотографія товару
  </label>

  <input
    type="file"
    id="image"
    name="image"
    accept="image/*"
    className="admin-product-form__file"
    onChange={(event) => {
      setProductImageFile(
        event.target.files[0] || null
      );
    }}
  />

  {productForm.image && (
    <small className="admin-product-form__current-image">
      Поточне зображення вже завантажене
    </small>
  )}
</div>

      <div className="admin-product-form__group admin-product-form__group--full">
        <label htmlFor="description">
          Опис
        </label>

        <textarea
          id="description"
          name="description"
          value={productForm.description}
          onChange={handleProductFormChange}
          placeholder="Опишіть товар..."
          rows="4"
        />
      </div>

      <div className="admin-product-form__group">
        <label htmlFor="sizes">
          Розміри
        </label>

        <input
          id="sizes"
          name="sizes"
          type="text"
          value={productForm.sizes}
          onChange={handleProductFormChange}
          placeholder="S, M, L, XL"
        />
      </div>

      <div className="admin-product-form__group">
        <label htmlFor="colors">
          Кольори
        </label>

        <input
          id="colors"
          name="colors"
          type="text"
          value={productForm.colors}
          onChange={handleProductFormChange}
          placeholder="Білий, чорний"
        />
      </div>

    </div>

    <label className="admin-product-form__stock">
      <input
        name="inStock"
        type="checkbox"
        checked={productForm.inStock}
        onChange={handleProductFormChange}
      />

      <span>Товар є в наявності</span>
    </label>

    <div className="admin-product-form__actions">
      <button
        type="button"
        className="admin-product-form__cancel"
        onClick={() => setShowProductForm(false)}
      >
        Скасувати
      </button>

      <button
        type="submit"
        className="admin-product-form__submit"
        disabled={productSaving}
      >
        {productSaving
  ? editingProductId
    ? "Збереження..."
    : "Додавання..."
  : editingProductId
    ? "Зберегти зміни"
    : "Додати товар"}
      </button>
    </div>
  </form>
)}

  {productsLoading ? (
    <p className="admin-products__loading">
      Завантаження товарів...
    </p>
  ) : products.length === 0 ? (
    <p className="admin-products__empty">
      Товарів поки немає.
    </p>
  ) : (
    <div className="admin-products__list">
      {products.map((product) => (
        <div
          className="admin-product"
          key={product._id}
        >
          <img
            src={product.image}
            alt={product.name}
            className="admin-product__image"
          />

          <div className="admin-product__info">
            <h3>{product.name}</h3>

            <p>{product.category}</p>

            <strong>
              {product.price} грн
            </strong>
          </div>

          <div className="admin-product__actions">
            <button
  className="admin-product__edit"
  onClick={() => handleEditProduct(product)}
>
  Редагувати
</button>

            <button
            className="admin-product__delete"
            onClick={() =>
            handleDeleteProduct(product._id)
           }
>
  Видалити
</button>
          </div>
        </div>
      ))}
    </div>
  )}
            </div>
            )}
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Admin;