import "./Reviews.css";

const reviews = [
  {
    id: 1,
    name: "Олена",
    city: "Львів",
    rating: 5,
    product: "Вишиванка «Червона калина»",
    text: "Дуже красива вишиванка! Якість тканини чудова, а вишивка виглядає ще красивіше, ніж на фото.",
    date: "12 вересня 2026",
  },
  {
    id: 2,
    name: "Андрій",
    city: "Київ",
    rating: 5,
    product: "Вишиванка «Козацька»",
    text: "Замовляв для себе. Розмір підійшов ідеально, сорочка якісна. Окремо дякую за швидку доставку.",
    date: "5 вересня 2026",
  },
  {
    id: 3,
    name: "Марія",
    city: "Тернопіль",
    rating: 5,
    product: "Вишиванка «Українська квітка»",
    text: "Закохалась у цю вишиванку з першого погляду. Дуже гарний орнамент і приємна тканина.",
    date: "28 серпня 2026",
  },
];

function Reviews() {
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
                <br />
                і рекомендують
              </h2>

              <p className="reviews__description">
                Дякуємо нашим клієнтам за довіру
                та теплі слова.
              </p>
            </div>

            <div className="reviews__rating">
              <div className="reviews__rating-number">
                4.9
              </div>

              <div>
                <div className="reviews__stars">
                  ★★★★★
                </div>

                <span>
                  На основі 128 відгуків
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="reviews__grid">
          {reviews.map((review) => (
            <article
              className="review-card"
              key={review.id}
            >
              <div className="review-card__top">

                <div>
                  <h3 className="review-card__name">
                    {review.name}
                  </h3>

                  <span className="review-card__city">
                    {review.city}
                  </span>
                </div>

                <div className="review-card__stars">
                  {"★".repeat(review.rating)}
                </div>

              </div>

              <p className="review-card__text">
                “{review.text}”
              </p>

              <div className="review-card__bottom">
                <span>
                  {review.product}
                </span>

                <time>
                  {review.date}
                </time>
              </div>
            </article>
          ))}
        </div>

        <div className="reviews__button-wrapper">
          <button className="reviews__button">
            Залишити відгук
            <span>→</span>
          </button>
        </div>

      </div>
    </section>
  );
}

export default Reviews;