import { useEffect, useState } from 'react';
import './Reviews.css';

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [eligibleProducts, setEligibleProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedRating, setSelectedRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();

    setFormMessage('');

    if (!selectedProduct) {
      setFormMessage('Оберіть товар.');
      return;
    }

    if (reviewText.trim().length < 5) {
      setFormMessage('Відгук повинен містити щонайменше 5 символів.');
      return;
    }

    const token = localStorage.getItem('vyshyvanka-token');

    if (!token) {
      setFormMessage('Увійдіть в акаунт, щоб залишити відгук.');
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: selectedProduct,
          rating: selectedRating,
          text: reviewText.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Не вдалося залишити відгук.');
      }

      setFormMessage('Відгук успішно додано!');

      setSelectedProduct('');
      setSelectedRating(5);
      setReviewText('');

      const reviewsResponse = await fetch('http://localhost:5000/api/reviews');

      if (reviewsResponse.ok) {
        const reviewsData = await reviewsResponse.json();

        setReviews(reviewsData.reviews);
        setRating(reviewsData.rating);
        setReviewsCount(reviewsData.reviewsCount);
      }

      const productsResponse = await fetch(
        'http://localhost:5000/api/reviews/eligible',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        setEligibleProducts(productsData);
      }
    } catch (error) {
      setFormMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/reviews');

        if (!response.ok) {
          throw new Error('Не вдалося завантажити відгуки');
        }

        const data = await response.json();

        setReviews(data.reviews);
        setRating(data.rating);
        setReviewsCount(data.reviewsCount);
      } catch (error) {
        console.error('Помилка завантаження відгуків:', error);
      } finally {
        setLoading(false);
      }

      const token = localStorage.getItem('vyshyvanka-token');

      if (token) {
        const productsResponse = await fetch(
          'http://localhost:5000/api/reviews/eligible',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          setEligibleProducts(productsData);
        }
      }
    };

    fetchReviews();
  }, []);

  const formatDate = date => {
    return new Date(date).toLocaleDateString('uk-UA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <section className="reviews">
      <div className="reviews__container">
        <div className="reviews__heading">
          <div className="reviews__subtitle">
            <span></span>
            Відгуки клієнтів
          </div>

          <div className="reviews__top">
            <div>
              <h2 className="reviews__title">
                Нас обирають
                <br />і рекомендують
              </h2>

              <p className="reviews__description">
                Дякуємо нашим клієнтам за довіру та теплі слова.
              </p>
            </div>

            <div className="reviews__rating">
              <div className="reviews__rating-number">{rating.toFixed(1)}</div>

              <div>
                <div className="reviews__stars">
                  <span>{'★'.repeat(Math.floor(rating))}</span>
                  <span style={{ color: '#d8d2ca' }}>
                    {'★'.repeat(5 - Math.floor(rating))}
                  </span>
                </div>

                <span>На основі {reviewsCount} відгуків</span>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <p>Завантаження відгуків...</p>
        ) : reviews.length === 0 ? (
          <p>Поки що відгуків немає.</p>
        ) : (
          <div className="reviews__grid">
            {reviews.map(review => (
              <article className="review-card" key={review._id}>
                <div className="review-card__top">
                  <div>
                    <h3 className="review-card__name">
                      {review.user?.name || 'Клієнт'}
                    </h3>
                  </div>

                  <div className="review-card__stars">
                    <span>{'★'.repeat(Number(review.rating))}</span>
                    <span style={{ color: '#d8d2ca' }}>
                      {'★'.repeat(5 - Number(review.rating))}
                    </span>
                  </div>
                </div>

                <p className="review-card__text">“{review.text}”</p>

                <div className="review-card__bottom">
                  <span>{review.product?.name || 'Товар'}</span>

                  <time>{formatDate(review.createdAt)}</time>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="reviews__button-wrapper">
          <button
            className="reviews__button"
            onClick={() => setIsFormOpen(!isFormOpen)}
          >
            {isFormOpen ? 'Закрити форму' : 'Залишити відгук'}
            <span>{isFormOpen ? '×' : '→'}</span>
          </button>
        </div>
        {isFormOpen && (
          <form className="reviews__form" onSubmit={handleSubmit}>
            <h3 className="reviews__form-title">
              Поділіться своїми враженнями
            </h3>

            <div className="reviews__form-group">
              <label htmlFor="review-product">Оберіть товар</label>

              <select
                id="review-product"
                value={selectedProduct}
                onChange={e => setSelectedProduct(e.target.value)}
              >
                <option value="" disabled>
                  Оберіть товар
                </option>

                {eligibleProducts.map(product => (
                  <option key={product._id} value={product._id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="reviews__form-group">
              <label>Ваша оцінка</label>

              <div className="reviews__form-stars">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    className={star <= selectedRating ? 'active' : ''}
                    onClick={() => setSelectedRating(star)}
                    aria-label={`Оцінка ${star} з 5`}
                  >
                    ★
                  </button>
                ))}
              </div>

              <div className="reviews__form-group">
                <label htmlFor="review-text">Ваш відгук</label>

                <textarea
                  id="review-text"
                  placeholder="Розкажіть про якість товару та свої враження..."
                  value={reviewText}
                  onChange={e => setReviewText(e.target.value)}
                  minLength={5}
                  maxLength={1000}
                  required
                />

                <small>{reviewText.length}/1000 символів</small>
              </div>
            </div>
            <button
              type="submit"
              className="reviews__button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Надсилання...' : 'Надіслати відгук'}
              <span>→</span>
            </button>

            {formMessage && (
              <p className="reviews__form-message">{formMessage}</p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}

export default Reviews;
