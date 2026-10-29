import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { useAuth } from '../../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user, loading, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
 const [formData, setFormData] = useState({
   name: '',
   email: '',
   phone: '',
   address: '',
 });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      setProfileLoading(false);
      setError('Увійдіть в акаунт, щоб переглянути свій профіль.');
      return;
    }

    const loadProfile = async () => {
      try {
        const token = localStorage.getItem('vyshyvanka-token');

        const response = await fetch('http://localhost:5000/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Не вдалося завантажити профіль.');
        }

        setProfile(data.user);
        setFormData({
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone || '',
          address: data.user.address || '',
        });
      } catch (err) {
        setError(err.message || 'Сталася помилка.');
      } finally {
        setProfileLoading(false);
      }
    };

    loadProfile();
  }, [user, loading]);

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async e => {
    e.preventDefault();

    setError('');
    setSuccess('');

    try {
      setSaving(true);

      const token = localStorage.getItem('vyshyvanka-token');

      const response = await fetch('http://localhost:5000/api/auth/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Не вдалося оновити профіль.');
      }

      setProfile(data.user);
      updateUser(data.user);

     setFormData({
       name: data.user.name,
       email: data.user.email,
       phone: data.user.phone || '',
       address: data.user.address || '',
     });

      setIsEditing(false);
      setSuccess('Профіль успішно оновлено.');
    } catch (err) {
      setError(err.message || 'Сталася помилка.');
    } finally {
      setSaving(false);
    }
  };

 const handleCancel = () => {
   setFormData({
     name: profile.name,
     email: profile.email,
     phone: profile.phone || '',
     address: profile.address || '',
   });

   setError('');
   setIsEditing(false);
 };

  return (
    <>
      <Header />

      <main className="profile">
        <div className="profile__container">
          <h1>Мій профіль</h1>

          {loading || profileLoading ? (
            <p>Завантаження профілю...</p>
          ) : error && !profile ? (
            <div className="profile__message">
              <p>{error}</p>
              {!user && <Link to="/login">Увійти</Link>}
            </div>
          ) : profile ? (
            <div className="profile__info">
              {success && <p className="profile__success">{success}</p>}
              {error && <p className="profile__error">{error}</p>}

              {isEditing ? (
                <form onSubmit={handleSave}>
                  <div className="profile__field">
                    <label htmlFor="profile-name">Ім'я</label>
                    <input
                      id="profile-name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="profile__field">
                    <label htmlFor="profile-email">Email</label>
                    <input
                      id="profile-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="profile__field">
                    <label htmlFor="profile-phone">Номер телефону</label>
                    <input
                      id="profile-phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+380..."
                    />
                  </div>

                  <div className="profile__field">
                    <label htmlFor="profile-address">Адреса доставки</label>
                    <input
                      id="profile-address"
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Місто, вулиця, будинок, квартира"
                    />
                  </div>

                  <div className="profile__actions">
                    <button type="submit" disabled={saving}>
                      {saving ? 'Збереження...' : 'Зберегти зміни'}
                    </button>

                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={saving}
                    >
                      Скасувати
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div>
                    <span>Ім'я</span>
                    <p>{profile.name}</p>
                  </div>

                  <div>
                    <span>Email</span>
                    <p>{profile.email}</p>
                  </div>

                  <div>
                    <span>Номер телефону</span>
                    <p>{profile.phone || 'Не вказано'}</p>
                  </div>

                  <div>
                    <span>Адреса доставки</span>
                    <p>{profile.address || 'Не вказано'}</p>
                  </div>

                  <div>
                    <span>Тип акаунта</span>
                    <p>
                      {profile.role === 'admin' ? 'Адміністратор' : 'Покупець'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setError('');
                      setSuccess('');
                      setIsEditing(true);
                    }}
                  >
                    Редагувати профіль
                  </button>
                </>
              )}

              <Link to="/my-orders">Мої замовлення</Link>
            </div>
          ) : null}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Profile;
