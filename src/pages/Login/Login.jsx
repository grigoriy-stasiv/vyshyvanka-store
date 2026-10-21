import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

import { useAuth } from "../../context/AuthContext";

import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const user = await login(email, password);

      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <main className="login-page">
        <div className="login-page__container">
          <div className="login-card">
            <span className="login-card__label">ОСОБИСТИЙ КАБІНЕТ</span>

            <h1>Вхід</h1>

            <p className="login-card__description">
              Увійдіть до свого облікового запису.
            </p>

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="login-form__group">
                <label htmlFor="email">Email</label>

                <input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>

              <div className="login-form__group">
                <label htmlFor="password">Пароль</label>

                <input
                  id="password"
                  type="password"
                  placeholder="Введіть пароль"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>

              {error && <div className="login-form__error">{error}</div>}

              <button
                type="submit"
                className="login-form__button"
                disabled={loading}
              >
                {loading ? "Вхід..." : "Увійти"}
              </button>
            </form>

            <p className="login-card__register">
              Ще не маєте акаунта? <Link to="/register">Зареєструватися</Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Login;
