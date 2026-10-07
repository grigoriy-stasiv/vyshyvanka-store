import "./Benefits.css";

const benefits = [
  {
    id: 1,
    icon: "✦",
    title: "Висока якість",
    text: "Ретельний вибір тканин та акуратне пошиття",
  },
  {
    id: 2,
    icon: "◇",
    title: "Українське виробництво",
    text: "Створюємо наші вишиванки в Україні",
  },
  {
    id: 3,
    icon: "♧",
    title: "Швидка доставка",
    text: "Відправляємо замовлення по всій Україні",
  },
  {
    id: 4,
    icon: "↻",
    title: "Легке повернення",
    text: "14 днів на повернення або обмін товару",
  },
];

function Benefits() {
  return (
    <section className="benefits">
      <div className="benefits__container">
        {benefits.map((benefit) => (
          <div className="benefit" key={benefit.id}>
            <div className="benefit__icon">
              {benefit.icon}
            </div>

            <div className="benefit__content">
              <h3 className="benefit__title">
                {benefit.title}
              </h3>

              <p className="benefit__text">
                {benefit.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Benefits;