"use client";

import { useEffect, useRef, useState } from "react";

const SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL!;

// ── Static seed reviews shown before sheet loads ──
const SEED_REVIEWS = [
  {
    initials: "CO", name: "Chidi O.", location: "Nigerian Community, Dublin",
    text: "The Jollof rice took me straight back to Lagos! Best I've had in all of Ireland. Ewa, you are an absolute genius!",
    rating: 5, color: "#D4A017",
  },
  {
    initials: "SM", name: "Siobhán M.", location: "Letterkenny, Donegal",
    text: "Ewa's pepper soup on a cold Donegal evening is pure magic. I order every single week — absolutely cannot stop!",
    rating: 5, color: "#2D6A4F",
  },
  {
    initials: "NA", name: "Ngozi A.", location: "Sligo Town",
    text: "Finally, real Nigerian food in Donegal. The Egusi soup is absolutely divine — so rich and authentic!",
    rating: 5, color: "#C1440E",
  },
];

interface Review {
  initials: string;
  name: string;
  location?: string;
  text: string;
  rating: number;
  color: string;
  date?: string;
}

const COLORS = ["#D4A017", "#2D6A4F", "#C1440E", "#1B4332", "#6B3A2A", "#4A7C59"];

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [reviews, setReviews] = useState<Review[]>(SEED_REVIEWS);
  const [loadingReviews, setLoadingReviews] = useState(true);

  // Fetch live reviews from Google Sheet
  useEffect(() => {
    async function fetchReviews() {
      try {
        const res  = await fetch(`${SCRIPT_URL}?action=getReviews`);
        const data = await res.json();
        if (data.success && data.reviews.length > 0) {
          // Merge sheet reviews with seed reviews
          const sheetReviews: Review[] = data.reviews.map((r: any, i: number) => ({
            initials: getInitials(r.name),
            name: r.name,
            location: r.date,
            text: r.text || "Great food!",
            rating: r.rating,
            color: COLORS[i % COLORS.length],
          })).filter((r: Review) => r.text && r.text.length > 3);

          // Put real reviews first, then seeds
          setReviews([...sheetReviews, ...SEED_REVIEWS]);
        }
      } catch {
        // Keep seed reviews on error
      } finally {
        setLoadingReviews(false);
      }
    }
    fetchReviews();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    sectionRef.current?.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Auto-rotate
  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [reviews.length]);

  const avgRating = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <section id="testimonials" ref={sectionRef} style={{
      background: "var(--green)", position: "relative",
      overflow: "hidden", padding: "7rem 2rem",
    }}>
      {/* Decorative */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `
          radial-gradient(circle at 5% 50%, rgba(212,160,23,0.07) 0%, transparent 40%),
          radial-gradient(circle at 95% 50%, rgba(13,43,31,0.5) 0%, transparent 40%)
        `,
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", top: "-4rem", left: "3%",
        fontFamily: "'Playfair Display', serif",
        fontSize: "24rem", lineHeight: 1,
        color: "rgba(255,255,255,0.03)",
        pointerEvents: "none", userSelect: "none",
      }}>❝</div>

      <div className="container" style={{ position: "relative", zIndex: 2 }}>

        {/* ── Header ── */}
        <div className="reveal" style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            background: "rgba(212,160,23,0.12)", border: "1px solid rgba(212,160,23,0.3)",
            borderRadius: "2rem", padding: "0.35rem 1rem", marginBottom: "1rem",
          }}>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold-light)" }}>
              What People Say
            </span>
          </div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 900, color: "var(--cream)", lineHeight: 1.2,
          }}>
            Straight From Our{" "}
            <em style={{ color: "var(--gold)", fontStyle: "italic" }}>Happy</em>{" "}
            Customers
          </h2>

          {/* Rating summary */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "0.8rem",
            marginTop: "1.2rem",
            background: "rgba(255,255,255,0.07)", border: "1px solid rgba(212,160,23,0.2)",
            borderRadius: "var(--radius-full)", padding: "0.5rem 1.4rem",
          }}>
            <span style={{ color: "var(--gold)", fontSize: "1rem" }}>★</span>
            <span style={{ color: "white", fontWeight: 700, fontSize: "0.95rem" }}>{avgRating}</span>
            <span style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.8rem" }}>
              from {reviews.length} review{reviews.length !== 1 ? "s" : ""}
            </span>
            {loadingReviews && (
              <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.72rem" }}>• loading...</span>
            )}
          </div>
        </div>

        {/* ── Featured review ── */}
        <div className="reveal" style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(212,160,23,0.2)",
          borderRadius: "2rem", padding: "2.5rem",
          marginBottom: "1.5rem", position: "relative", overflow: "hidden",
          minHeight: "200px",
        }}>
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: "3px",
            background: "linear-gradient(to right, var(--gold), transparent)",
          }} />

          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(1rem, 2.5vw, 1.4rem)",
            fontStyle: "italic", color: "rgba(255,255,255,0.92)",
            lineHeight: 1.8, marginBottom: "1.8rem", maxWidth: "680px",
            transition: "all 0.4s ease",
          }}>
            &ldquo;{reviews[active]?.text}&rdquo;
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{
                width: "52px", height: "52px", borderRadius: "50%",
                background: `linear-gradient(135deg, ${reviews[active]?.color}, rgba(0,0,0,0.3))`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 800, color: "white", fontSize: "0.95rem",
                boxShadow: `0 4px 20px ${reviews[active]?.color}55`,
                flexShrink: 0,
              }}>
                {reviews[active]?.initials}
              </div>
              <div>
                <div style={{ color: "white", fontWeight: 700, fontSize: "0.95rem" }}>
                  {reviews[active]?.name}
                </div>
                <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.78rem", marginTop: "0.15rem" }}>
                  {reviews[active]?.location}
                </div>
              </div>
            </div>
            <div style={{ color: "var(--gold)", fontSize: "1.1rem", letterSpacing: "0.1em" }}>
              {"★".repeat(reviews[active]?.rating || 5)}
            </div>
          </div>

          {/* Dots */}
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "1.8rem" }}>
            {reviews.map((_, i) => (
              <button key={i} onClick={() => setActive(i)} style={{
                width: active === i ? "24px" : "7px", height: "7px",
                borderRadius: "4px",
                background: active === i ? "var(--gold)" : "rgba(255,255,255,0.2)",
                border: "none", cursor: "pointer",
                transition: "all 0.3s ease", padding: 0,
              }} />
            ))}
          </div>
        </div>

        {/* ── Small cards grid ── */}
        <div className="reveal" style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1rem", marginBottom: "3rem",
        }}>
          {reviews.slice(0, 6).map((t, i) => (
            <div key={i} onClick={() => setActive(i)} style={{
              background: active === i ? "rgba(212,160,23,0.1)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${active === i ? "rgba(212,160,23,0.4)" : "rgba(255,255,255,0.08)"}`,
              borderRadius: "var(--radius-lg)", padding: "1.2rem",
              cursor: "pointer", transition: "all 0.3s ease",
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
              <div style={{ color: "var(--gold)", fontSize: "0.85rem", marginBottom: "0.6rem" }}>
                {"★".repeat(t.rating)}
              </div>
              <p style={{
                fontFamily: "'Playfair Display', serif", fontStyle: "italic",
                color: "rgba(255,255,255,0.75)", fontSize: "0.84rem",
                lineHeight: 1.6, marginBottom: "0.8rem",
                display: "-webkit-box", WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical", overflow: "hidden",
              }}>
                &ldquo;{t.text}&rdquo;
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <div style={{
                  width: "32px", height: "32px", borderRadius: "50%",
                  background: `linear-gradient(135deg, ${t.color}, rgba(0,0,0,0.2))`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.7rem", fontWeight: 800, color: "white", flexShrink: 0,
                }}>
                  {t.initials}
                </div>
                <div>
                  <div style={{ color: "white", fontWeight: 600, fontSize: "0.8rem" }}>{t.name}</div>
                  {t.location && (
                    <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.7rem" }}>{t.location}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── CTA ── */}
        <div className="reveal" style={{ textAlign: "center" }}>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.88rem", marginBottom: "1rem" }}>
            Ordered from FoodbyEwa? Leave a review after your next order! 🌟
          </p>
          <a href="#menu" style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            background: "var(--gold)", color: "var(--green-dark)",
            padding: "0.85rem 2.2rem", borderRadius: "var(--radius-full)",
            fontWeight: 800, fontSize: "0.92rem",
            textDecoration: "none", transition: "all 0.25s",
            boxShadow: "var(--shadow-gold)",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--gold-light)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "var(--gold)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            🍽️ Order Your Meal Today
          </a>
        </div>
      </div>
    </section>
  );
}