import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

import { useAuth } from "../../context/AuthContext";

import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Паролі не збігаються");
      return;
    }

    if (password.length < 6) {
      setError("Пароль повинен містити щонайменше 6 символів");
      return;
    }

    setLoading(true);

    try {
      await register(name, email, password);

      navigate("/login");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <main className="register-page">
        <div className="register-page__container">

          <div className="register-card">

            <span className="register-card__label">
              ОСОБИСТИЙ КАБІНЕТ
            </span>

            <h1>Реєстрація</h1>

            <p className="register-card__description">
              Створіть обліковий запис для зручних покупок.
            </p>

            <form
              className="register-form"
              onSubmit={handleSubmit}
            >

              <div className="register-form__group">
                <label htmlFor="name">
                  Ім'я
                </label>

                <input
                  id="name"
                  type="text"
                  placeholder="Ваше ім'я"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  required
                />
              </div>

              <div className="register-form__group">
                <label htmlFor="email">
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  required
                />
              </div>

              <div className="register-form__group">
                <label htmlFor="password">
                  Пароль
                </label>

                <input
                  id="password"
                  type="password"
                  placeholder="Мінімум 6 символів"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  required
                />
              </div>

              <div className="register-form__group">
                <label htmlFor="confirmPassword">
                  Підтвердження пароля
                </label>

                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Повторіть пароль"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  required
                />
              </div>

              {error && (
                <div className="register-form__error">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="register-form__button"
                disabled={loading}
              >
                {loading
                  ? "Створення акаунта..."
                  : "Зареєструватися"}
              </button>

            </form>

            <p className="register-card__login">
              Вже маєте акаунт?{" "}
              <Link to="/login">
                Увійти
              </Link>
            </p>

          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}

export default Register;