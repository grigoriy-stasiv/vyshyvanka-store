import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('vyshyvanka-token');

    if (!token) {
      setLoading(false);
      return;
    }

    fetch('http://localhost:5000/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async response => {
        if (!response.ok) {
          throw new Error('Токен недійсний');
        }

        return response.json();
      })
      .then(data => {
        setUser(data.user);
      })
      .catch(() => {
        localStorage.removeItem('vyshyvanka-token');
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Вхід
  const login = async (email, password) => {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Помилка входу');
    }

    localStorage.setItem('vyshyvanka-token', data.token);

    setUser(data.user);

    return data.user;
  };

  // Реєстрація
  const register = async (name, email, password) => {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Помилка реєстрації');
    }

    return data;
  };

  const logout = () => {
    localStorage.removeItem('vyshyvanka-token');
    setUser(null);
  };

  const updateUser = updatedUser => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};;

export const useAuth = () => {
  return useContext(AuthContext);
};