
"use client";

import { useEffect, useRef, useState } from "react";

const TESTIMONIALS = [
  {
    initials: "CO",
    name: "Chidi O.",
    location: "Nigerian Community, Dublin",
    text: "The Jollof rice took me straight back to Lagos! Best I've had in all of Ireland. Ewa, you are an absolute genius in the kitchen!",
    stars: 5,
    color: "#D4A017",
  },
  {
    initials: "SM",
    name: "Siobhán M.",
    location: "Letterkenny, Donegal",
    text: "Ewa's pepper soup on a cold Donegal evening is pure magic. I order every single week now — absolutely cannot stop. Highly recommend!",
    stars: 5,
    color: "#2D6A4F",
  },
  {
    initials: "NA",
    name: "Ngozi A.",
    location: "Sligo Town",
    text: "Finally, real Nigerian food in Donegal. The Egusi soup is absolutely divine — so rich and authentic. A true hidden gem in Ireland!",
    stars: 5,
    color: "#C1440E",
  },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("visible");
      }),
      { threshold: 0.1 }
    );
    sectionRef.current?.querySelectorAll(".reveal")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Auto-rotate featured testimonial
  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      style={{
        background: "var(--green)",
        position: "relative",
        overflow: "hidden",
        padding: "7rem 2rem",
      }}
    >
      {/* ── Decorative background ── */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `
          radial-gradient(circle at 5% 50%, rgba(212,160,23,0.07) 0%, transparent 40%),
          radial-gradient(circle at 95% 50%, rgba(13,43,31,0.5) 0%, transparent 40%)
        `,
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute",
        top: "-4rem", left: "3%",
        fontFamily: "'Playfair Display', serif",
        fontSize: "24rem", lineHeight: 1,
        color: "rgba(255,255,255,0.03)",
        pointerEvents: "none", userSelect: "none",
      }}>❝</div>

      <div className="container" style={{ position: "relative", zIndex: 2 }}>

        {/* ── Header ── */}
        <div className="reveal" style={{ textAlign: "center", marginBottom: "4rem" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "rgba(212,160,23,0.12)",
            border: "1px solid rgba(212,160,23,0.3)",
            borderRadius: "2rem",
            padding: "0.35rem 1rem",
            marginBottom: "1.2rem",
          }}>
            <span style={{
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--gold-light)",
            }}>
              What People Say
            </span>
          </div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 900,
            color: "var(--cream)",
            lineHeight: 1.2,
          }}>
            Straight From Our{" "}
            <em style={{ color: "var(--gold)", fontStyle: "italic" }}>Happy</em>{" "}
            Customers
          </h2>
        </div>

        {/* ── Featured large testimonial ── */}
        <div className="reveal" style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(212,160,23,0.2)",
          borderRadius: "2rem",
          padding: "3rem",
          marginBottom: "2rem",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Gold top bar */}
          <div style={{
            position: "absolute",
            top: 0, left: 0, right: 0,
            height: "3px",
            background: "linear-gradient(to right, var(--gold), transparent)",
          }} />

          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
            fontStyle: "italic",
            color: "rgba(255,255,255,0.9)",
            lineHeight: 1.8,
            marginBottom: "2rem",
            maxWidth: "700px",
          }}>
            &ldquo;{TESTIMONIALS[active].text}&rdquo;
          </div>

          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{
                width: "56px", height: "56px",
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${TESTIMONIALS[active].color}, rgba(0,0,0,0.3))`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                color: "white",
                fontSize: "1rem",
                boxShadow: `0 4px 20px ${TESTIMONIALS[active].color}55`,
              }}>
                {TESTIMONIALS[active].initials}
              </div>
              <div>
                <div style={{ color: "white", fontWeight: 700, fontSize: "1rem" }}>
                  {TESTIMONIALS[active].name}
                </div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.82rem", marginTop: "0.2rem" }}>
                  {TESTIMONIALS[active].location}
                </div>
              </div>
            </div>
            <div style={{ color: "var(--gold)", fontSize: "1.2rem", letterSpacing: "0.1em" }}>
              {"★".repeat(TESTIMONIALS[active].stars)}
            </div>
          </div>

          {/* Slide dots */}
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "2rem" }}>
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                style={{
                  width: active === i ? "28px" : "8px",
                  height: "8px",
                  borderRadius: "4px",
                  background: active === i ? "var(--gold)" : "rgba(255,255,255,0.2)",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  padding: 0,
                }}
              />
            ))}
          </div>
        </div>

        {/* ── 3 Small cards ── */}
        <div className="reveal" style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "1.2rem",
        }}>
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              onClick={() => setActive(i)}
              style={{
                background: active === i ? "rgba(212,160,23,0.1)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${active === i ? "rgba(212,160,23,0.4)" : "rgba(255,255,255,0.08)"}`,
                borderRadius: "var(--radius-lg)",
                padding: "1.4rem",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                if (active !== i) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.transform = "translateY(-3px)";
                }
              }}
              onMouseLeave={(e) => {
                if (active !== i) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                  e.currentTarget.style.transform = "translateY(0)";
                }
              }}
            >
              <div style={{ color: "var(--gold)", fontSize: "0.9rem", marginBottom: "0.8rem" }}>
                {"★".repeat(t.stars)}
              </div>
              <p style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
                color: "rgba(255,255,255,0.75)",
                fontSize: "0.88rem",
                lineHeight: 1.65,
                marginBottom: "1rem",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}>
                &ldquo;{t.text}&rdquo;
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
                <div style={{
                  width: "36px", height: "36px",
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${t.color}, rgba(0,0,0,0.2))`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  color: "white",
                  flexShrink: 0,
                }}>
                  {t.initials}
                </div>
                <div>
                  <div style={{ color: "white", fontWeight: 600, fontSize: "0.85rem" }}>{t.name}</div>
                  <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.75rem" }}>{t.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}