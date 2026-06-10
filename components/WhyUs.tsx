

"use client";

import { useEffect, useRef } from "react";

const CARDS = [
  {
    icon: "🍲",
    title: "100% Home-Cooked",
    desc: "Every meal is freshly prepared by Ewa herself — no shortcuts, no preservatives. Just honest, soulful cooking made to order.",
  },
  {
    icon: "🌶️",
    title: "Authentic Recipes",
    desc: "Traditional Nigerian recipes passed down through generations. The same flavours your Mama made, reimagined for Donegal.",
  },
  {
    icon: "🚗",
    title: "Local Delivery",
    desc: "Delivered fresh and warm to your door across Letterkenny and wider Donegal. Pickup also available — free of charge.",
  },
  {
    icon: "📱",
    title: "Order via WhatsApp",
    desc: "No complicated apps. Just fill in your details and your order goes straight to Ewa on WhatsApp. Quick and easy!",
  },
];

export default function WhyUs() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.12 }
    );

    const reveals = sectionRef.current?.querySelectorAll(".reveal");
    reveals?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="why"
      ref={sectionRef}
      style={{
        background: "var(--white)",
        position: "relative",
        overflow: "hidden",
        padding: "5rem 2rem",
      }}
    >
      {/* Decorative background circle */}
      <div style={{
        position: "absolute",
        top: "-80px",
        right: "-80px",
        width: "350px",
        height: "350px",
        borderRadius: "50%",
        background: "rgba(212,160,23,0.05)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute",
        bottom: "-60px",
        left: "-60px",
        width: "250px",
        height: "250px",
        borderRadius: "50%",
        background: "rgba(27,67,50,0.04)",
        pointerEvents: "none",
      }} />

      <div className="container">

        {/* Header */}
        <div className="reveal" style={{ marginBottom: "3rem" }}>
          <span className="section-label">Why Choose Us</span>
          <h2 className="section-title">
            Food That Feels Like <em>Home</em>
          </h2>
          <p className="section-sub">
            Every meal is made from scratch, with love, tradition, and only
            the finest authentic Nigerian ingredients sourced specially for you.
          </p>
        </div>

        {/* Cards Grid */}
        <div
          className="reveal"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1.8rem",
          }}
        >
          {CARDS.map((card, i) => (
            <div
              key={i}
              style={{
                background: "var(--cream)",
                borderRadius: "var(--radius-lg)",
                padding: "2rem",
                border: "1px solid rgba(27,67,50,0.08)",
                transition: "all 0.3s ease",
                position: "relative",
                overflow: "hidden",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.transform = "translateY(-6px)";
                el.style.boxShadow = "var(--shadow)";
                const bar = el.querySelector(".card-bar") as HTMLElement;
                if (bar) bar.style.transform = "scaleX(1)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.transform = "translateY(0)";
                el.style.boxShadow = "none";
                const bar = el.querySelector(".card-bar") as HTMLElement;
                if (bar) bar.style.transform = "scaleX(0)";
              }}
            >
              {/* Gold bottom bar on hover */}
              <div
                className="card-bar"
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "3px",
                  background: "var(--gold)",
                  transform: "scaleX(0)",
                  transition: "transform 0.3s ease",
                  transformOrigin: "left",
                }}
              />

              {/* Icon */}
              <div style={{
                fontSize: "2.8rem",
                marginBottom: "1rem",
                lineHeight: 1,
              }}>
                {card.icon}
              </div>

              {/* Title */}
              <h3 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.2rem",
                fontWeight: 600,
                color: "var(--green-dark)",
                marginBottom: "0.6rem",
              }}>
                {card.title}
              </h3>

              {/* Description */}
              <p style={{
                color: "var(--text-muted)",
                fontSize: "0.93rem",
                lineHeight: 1.65,
              }}>
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}