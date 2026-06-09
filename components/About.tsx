// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//   FOODBYEWA — About Section (Premium)
//   components/About.tsx
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

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
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.1 }
    );
    const reveals = sectionRef.current?.querySelectorAll(".reveal");
    reveals?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      style={{
        background: "var(--green-dark)",
        color: "white",
        overflow: "hidden",
        padding: "6rem 2rem",
        position: "relative",
      }}
    >
      {/* ── Decorative background elements ── */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: `
          radial-gradient(circle at 10% 50%, rgba(212,160,23,0.06) 0%, transparent 50%),
          radial-gradient(circle at 90% 20%, rgba(27,67,50,0.4) 0%, transparent 50%)
        `,
        pointerEvents: "none",
      }} />

      {/* Vertical text watermark */}
      <div style={{
        position: "absolute",
        right: "2rem",
        top: "50%",
        transform: "translateY(-50%) rotate(90deg)",
        fontFamily: "'Playfair Display', serif",
        fontSize: "7rem",
        fontWeight: 900,
        color: "rgba(255,255,255,0.03)",
        letterSpacing: "0.2em",
        userSelect: "none",
        pointerEvents: "none",
        whiteSpace: "nowrap",
      }}>
        FOODBYEWA
      </div>

      <div className="container" style={{ position: "relative", zIndex: 2 }}>
        <div className="about-grid" style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "6rem",
          alignItems: "center",
        }}>

          {/* ━━━ IMAGE COLUMN ━━━ */}
          <div className="reveal about-img-col" style={{ position: "relative" }}>

            {/* Main image with border frame effect */}
            <div style={{
              position: "relative",
              borderRadius: "2rem",
              overflow: "visible",
            }}>
              {/* Gold frame border */}
              <div style={{
                position: "absolute",
                top: "-12px",
                left: "-12px",
                right: "12px",
                bottom: "12px",
                borderRadius: "2rem",
                border: "2px solid rgba(212,160,23,0.3)",
                pointerEvents: "none",
                zIndex: 0,
              }} />

              {/* Image */}
              <img
                src="https://i.pinimg.com/736x/97/8f/b5/978fb55bcfd69ea0d08424f3bb96da04.jpg"
                alt="Ewa cooking in her kitchen"
                loading="lazy"
                style={{
                  borderRadius: "2rem",
                  width: "100%",
                  height: "560px",
                  objectFit: "cover",
                  objectPosition: "center top",
                  boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
                  display: "block",
                  position: "relative",
                  zIndex: 1,
                }}
              />

              {/* Gradient overlay on image bottom */}
              <div style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "40%",
                background: "linear-gradient(to top, rgba(13,43,31,0.7), transparent)",
                borderRadius: "0 0 2rem 2rem",
                zIndex: 2,
              }} />
            </div>

            {/* Floating origin badge */}
            <div style={{
              position: "absolute",
              top: "2rem",
              left: "-1.5rem",
              zIndex: 10,
              background: "linear-gradient(135deg, var(--gold), var(--gold-dark))",
              borderRadius: "var(--radius)",
              padding: "1rem 1.4rem",
              boxShadow: "0 12px 40px rgba(212,160,23,0.4)",
            }}>
              <div style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1rem",
                fontWeight: 700,
                color: "var(--green-dark)",
              }}>
                🇳🇬 From Nigeria
              </div>
              <div style={{
                fontSize: "0.75rem",
                color: "rgba(13,43,31,0.75)",
                marginTop: "0.2rem",
                fontWeight: 600,
              }}>
                to Letterkenny, Ireland 🇮🇪
              </div>
            </div>

            {/* Stats floating card */}
            <div style={{
              position: "absolute",
              bottom: "-2rem",
              right: "-1.5rem",
              zIndex: 10,
              background: "var(--green)",
              border: "1px solid rgba(212,160,23,0.25)",
              borderRadius: "var(--radius-lg)",
              padding: "1.4rem 1.8rem",
              boxShadow: "0 16px 50px rgba(0,0,0,0.35)",
              display: "flex",
              gap: "1.5rem",
            }}>
              {STATS.map((s, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "1.2rem", marginBottom: "0.2rem" }}>{s.icon}</div>
                  <div style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.6rem",
                    fontWeight: 900,
                    color: "var(--gold)",
                    lineHeight: 1,
                  }}>
                    {s.num}
                  </div>
                  <div style={{
                    fontSize: "0.65rem",
                    color: "rgba(255,255,255,0.55)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginTop: "0.3rem",
                    whiteSpace: "nowrap",
                  }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ━━━ TEXT COLUMN ━━━ */}
          <div className="reveal" style={{ paddingBottom: "2rem" }}>

            {/* Label */}
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "rgba(212,160,23,0.12)",
              border: "1px solid rgba(212,160,23,0.3)",
              borderRadius: "2rem",
              padding: "0.35rem 1rem",
              marginBottom: "1.5rem",
            }}>
              <span style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "var(--gold)",
                display: "inline-block",
              }} />
              <span style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--gold-light)",
              }}>
                Our Story
              </span>
            </div>

            {/* Headline */}
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 3.5vw, 3rem)",
              fontWeight: 900,
              color: "var(--cream)",
              lineHeight: 1.15,
              marginBottom: "1.5rem",
            }}>
              Meet Ewa —{" "}
              <em style={{
                color: "var(--gold)",
                fontStyle: "italic",
                display: "block",
              }}>
                The Heart Behind
              </em>
              Every Plate
            </h2>

            {/* Divider */}
            <div style={{
              width: "60px",
              height: "3px",
              background: "linear-gradient(to right, var(--gold), transparent)",
              borderRadius: "2px",
              marginBottom: "1.8rem",
            }} />

            {/* Story paragraphs */}
            <p style={{
              color: "rgba(255,255,255,0.72)",
              lineHeight: 1.9,
              fontSize: "1rem",
              marginBottom: "1.2rem",
            }}>
              Born and raised in the vibrant heart of Nigeria, Ewa carried
              her grandmother&apos;s treasured recipes across the ocean to the
              green hills of Donegal. What began as cooking for friends and
              family became something bigger — a mission to bring the real,
              unfiltered taste of Nigerian home cooking to Ireland.
            </p>

            <p style={{
              color: "rgba(255,255,255,0.72)",
              lineHeight: 1.9,
              fontSize: "1rem",
              marginBottom: "2.5rem",
            }}>
              Every pot she stirs is seasoned with memory, love, and
              authentic ingredients sourced specially — so that every single
              meal tastes like a warm hug from home.
            </p>

            {/* Feature pills */}
            <div style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.7rem",
              marginBottom: "2.5rem",
            }}>
              {["🌿 All Natural", "🏠 Home Cooked", "🌶️ Authentic Spices", "🚗 Local Delivery"].map((tag) => (
                <span key={tag} style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "2rem",
                  padding: "0.4rem 1rem",
                  fontSize: "0.82rem",
                  color: "rgba(255,255,255,0.75)",
                  fontWeight: 500,
                }}>
                  {tag}
                </span>
              ))}
            </div>

            {/* CTA Buttons */}
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  background: "var(--gold)",
                  color: "var(--green-dark)",
                  padding: "0.9rem 2rem",
                  borderRadius: "var(--radius-full)",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  transition: "all 0.25s",
                  textDecoration: "none",
                  boxShadow: "var(--shadow-gold)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--gold-light)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--gold)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                📱 Chat with Ewa
              </a>

              <a
                href="#menu"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  background: "transparent",
                  color: "rgba(255,255,255,0.8)",
                  padding: "0.9rem 2rem",
                  borderRadius: "var(--radius-full)",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  transition: "all 0.25s",
                  textDecoration: "none",
                  border: "1.5px solid rgba(255,255,255,0.2)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--gold)";
                  e.currentTarget.style.color = "var(--gold)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.8)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                🍽️ View Menu
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Responsive ── */}
      <style>{`
        @media (max-width: 900px) {
          .about-grid {
            grid-template-columns: 1fr !important;
            gap: 5rem !important;
          }
          .about-img-col {
            order: -1;
          }
          .about-img-col img {
            height: 400px !important;
          }
        }
        @media (max-width: 480px) {
          .about-img-col img {
            height: 300px !important;
          }
        }
      `}</style>
    </section>
  );
}