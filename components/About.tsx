"use client";

import { useEffect, useRef } from "react";

const STATS = [
  { num: "5+", label: "Years Cooking", icon: "🍳" },
  { num: "15+", label: "Signature Dishes", icon: "🍲" },
  { num: "500+", label: "Happy Customers", icon: "❤️" },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    sectionRef.current?.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" ref={sectionRef} style={{
      background: "var(--green-dark)", color: "white",
      overflow: "hidden", padding: "5rem 2rem", position: "relative",
    }}>
      {/* Decorative bg */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `
          radial-gradient(circle at 10% 50%, rgba(212,160,23,0.06) 0%, transparent 50%),
          radial-gradient(circle at 90% 20%, rgba(27,67,50,0.4) 0%, transparent 50%)
        `,
        pointerEvents: "none",
      }} />

      <div className="container" style={{ position: "relative", zIndex: 2 }}>
        <div className="about-grid" style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "4rem",
          alignItems: "center",
        }}>

          {/* IMAGE COLUMN */}
          <div className="reveal about-img-col" style={{ position: "relative", paddingBottom: "3rem" }}>
            <div style={{ position: "relative", borderRadius: "1.5rem", overflow: "visible" }}>
              {/* Gold frame */}
              <div style={{
                position: "absolute",
                top: "-10px", left: "-10px", right: "10px", bottom: "10px",
                borderRadius: "1.5rem",
                border: "2px solid rgba(212,160,23,0.3)",
                pointerEvents: "none", zIndex: 0,
              }} />
              <img
                src="https://i.pinimg.com/736x/97/8f/b5/978fb55bcfd69ea0d08424f3bb96da04.jpg"
                alt="Ewa cooking"
                loading="lazy"
                style={{
                  borderRadius: "1.5rem", width: "100%", height: "480px",
                  objectFit: "cover", objectPosition: "center top",
                  boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
                  display: "block", position: "relative", zIndex: 1,
                }}
              />
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0, height: "40%",
                background: "linear-gradient(to top, rgba(13,43,31,0.7), transparent)",
                borderRadius: "0 0 1.5rem 1.5rem", zIndex: 2,
              }} />
            </div>

            {/* Origin badge */}
            <div style={{
              position: "absolute", top: "1.5rem", left: "-1rem", zIndex: 10,
              background: "linear-gradient(135deg, var(--gold), var(--gold-dark))",
              borderRadius: "var(--radius)", padding: "0.8rem 1.1rem",
              boxShadow: "0 8px 30px rgba(212,160,23,0.4)",
            }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.9rem", fontWeight: 700, color: "var(--green-dark)" }}>
                🇳🇬 From Nigeria
              </div>
              <div style={{ fontSize: "0.7rem", color: "rgba(13,43,31,0.75)", marginTop: "0.15rem", fontWeight: 600 }}>
                to Letterkenny 🇮🇪
              </div>
            </div>

            {/* Stats card */}
            <div style={{
              position: "absolute", bottom: "0rem", right: "-1rem", zIndex: 10,
              background: "var(--green)",
              border: "1px solid rgba(212,160,23,0.25)",
              borderRadius: "var(--radius-lg)",
              padding: "1rem 1.2rem",
              boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
              display: "flex", gap: "1rem",
            }}>
              {STATS.map((s, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "1rem", marginBottom: "0.2rem" }}>{s.icon}</div>
                  <div style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.3rem", fontWeight: 900, color: "var(--gold)", lineHeight: 1,
                  }}>{s.num}</div>
                  <div style={{
                    fontSize: "0.55rem", color: "rgba(255,255,255,0.55)",
                    textTransform: "uppercase", letterSpacing: "0.07em",
                    marginTop: "0.2rem", whiteSpace: "nowrap",
                  }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* TEXT COLUMN */}
          <div className="reveal">
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              background: "rgba(212,160,23,0.12)", border: "1px solid rgba(212,160,23,0.3)",
              borderRadius: "2rem", padding: "0.35rem 1rem", marginBottom: "1.2rem",
            }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--gold)", display: "inline-block" }} />
              <span style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold-light)" }}>
                Our Story
              </span>
            </div>

            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
              fontWeight: 900, color: "var(--cream)", lineHeight: 1.15, marginBottom: "1.2rem",
            }}>
              Meet Ewa —{" "}
              <em style={{ color: "var(--gold)", fontStyle: "italic", display: "block" }}>
                The Heart Behind
              </em>
              Every Plate
            </h2>

            <div style={{
              width: "50px", height: "3px",
              background: "linear-gradient(to right, var(--gold), transparent)",
              borderRadius: "2px", marginBottom: "1.4rem",
            }} />

            <p style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.85, fontSize: "0.95rem", marginBottom: "1rem" }}>
              Born and raised in the vibrant heart of Nigeria, Ewa carried her grandmother&apos;s
              treasured recipes across the ocean to the green hills of Donegal. What began as
              cooking for friends became a mission — to bring real Nigerian home cooking to Ireland.
            </p>
            <p style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.85, fontSize: "0.95rem", marginBottom: "2rem" }}>
              Every pot she stirs is seasoned with memory, love, and authentic ingredients — so
              every meal tastes like a warm hug from home.
            </p>

            {/* Pills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", marginBottom: "2rem" }}>
              {["🌿 All Natural", "🏠 Home Cooked", "🌶️ Authentic Spices", "🚗 Local Delivery"].map((tag) => (
                <span key={tag} style={{
                  background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "2rem", padding: "0.35rem 0.9rem",
                  fontSize: "0.78rem", color: "rgba(255,255,255,0.75)", fontWeight: 500,
                }}>
                  {tag}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
                target="_blank" rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "0.5rem",
                  background: "var(--gold)", color: "var(--green-dark)",
                  padding: "0.85rem 1.8rem", borderRadius: "var(--radius-full)",
                  fontWeight: 700, fontSize: "0.9rem", textDecoration: "none",
                  transition: "all 0.25s", boxShadow: "var(--shadow-gold)",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "var(--gold-light)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "var(--gold)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                📱 Chat with Ewa
              </a>
              <a
                href="#menu"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "0.5rem",
                  background: "transparent", color: "rgba(255,255,255,0.8)",
                  padding: "0.85rem 1.8rem", borderRadius: "var(--radius-full)",
                  fontWeight: 600, fontSize: "0.9rem", textDecoration: "none",
                  transition: "all 0.25s", border: "1.5px solid rgba(255,255,255,0.2)",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.color = "var(--gold)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "rgba(255,255,255,0.8)"; }}
              >
                🍽️ View Menu
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .about-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          .about-img-col {
            order: -1;
            padding-bottom: 4rem !important;
          }
          .about-img-col img {
            height: 320px !important;
          }
        }
        @media (max-width: 480px) {
          .about-img-col img {
            height: 260px !important;
          }
          .about-img-col > div:first-child > div:first-child {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}