import "./Categories.css";

function Categories() {
  const categories = [
    {
      id: 1,
      title: "Жіночі",
      description: "Вишиванки для жінок",
      image: "/images/category-women.jpg",
    },
    {
      id: 2,
      title: "Чоловічі",
      description: "Вишиванки для чоловіків",
      image: "/images/category-men.jpg",
    },
    {
      id: 3,
      title: "Дитячі",
      description: "Вишиванки для дітей",
      image: "/images/category-kids.jpg",
    },
  ];

  return (
    <section className="categories">
      <div className="categories__container">

        <div className="categories__heading">
          <div className="categories__subtitle">
            <span></span>
            Обери свою
          </div>

          <h2 className="categories__title">
            Категорії
          </h2>

          <p className="categories__description">
            Традиційні українські мотиви у сучасному дизайні.
            Обери вишиванку, яка підійде саме тобі.
          </p>
        </div>

        <div className="categories__grid">
          {categories.map((category) => (
            <a
              href="/catalog"
              className="category-card"
              key={category.id}
            >
              <img
                src={category.image}
                alt={category.title}
                className="category-card__image"
              />

              <div className="category-card__overlay"></div>

              <div className="category-card__content">
                <span className="category-card__description">
                  {category.description}
                </span>

                <h3 className="category-card__title">
                  {category.title}
                </h3>

                <span className="category-card__link">
                  Переглянути
                  <span>→</span>
                </span>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Categories;