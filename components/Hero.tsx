"use client";

import { useEffect, useState } from "react";

const SLIDES = [
  "https://i.pinimg.com/736x/5d/18/c8/5d18c8f3a6face69b8dd1ab49d5a5c9c.jpg",
  "https://i.pinimg.com/736x/f3/53/35/f35335c6e9469387f4a69c4591f2c9b1.jpg",
  "/ewa-meal.jpg",
];

export default function Hero() {
  const [loaded, setLoaded] = useState(false);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const openCart = () => document.dispatchEvent(new CustomEvent("openCart"));

  return (
    <section id="hero" style={{
      position: "relative",
      height: "100vh",
      minHeight: "600px",
      display: "flex",
      alignItems: "center",
      overflow: "hidden",
    }}>
      {/* Backgrounds */}
      {SLIDES.map((src, i) => (
        <div key={i} style={{
          position: "absolute", inset: 0,
          backgroundImage: `url('${src}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: slide === i ? 1 : 0,
          transform: slide === i ? "scale(1.06)" : "scale(1.12)",
          transition: "opacity 1.5s ease, transform 8s ease",
        }} />
      ))}

      {/* Overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: `
          linear-gradient(to right, rgba(13,43,31,0.97) 0%, rgba(13,43,31,0.75) 60%, rgba(13,43,31,0.3) 100%),
          linear-gradient(to top, rgba(13,43,31,0.9) 0%, transparent 50%)
        `,
      }} />

      {/* Gold accent line — hidden on mobile */}
      <div className="hero-accent-line" style={{
        position: "absolute", left: 0, top: "15%", bottom: "15%",
        width: "4px",
        background: "linear-gradient(to bottom, transparent, var(--gold), transparent)",
        opacity: loaded ? 1 : 0,
        transition: "opacity 1s 0.8s ease",
      }} />

      {/* Slide dots — hidden on mobile */}
      <div className="hero-dots" style={{
        position: "absolute", right: "2rem", top: "50%",
        transform: "translateY(-50%)",
        display: "flex", flexDirection: "column", gap: "0.6rem", zIndex: 10,
      }}>
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => setSlide(i)} style={{
            width: slide === i ? "24px" : "8px", height: "8px",
            borderRadius: "4px",
            background: slide === i ? "var(--gold)" : "rgba(255,255,255,0.3)",
            border: "none", cursor: "pointer",
            transition: "all 0.4s ease", padding: 0,
          }} />
        ))}
      </div>

      {/* Hero Content */}
      <div className="hero-content" style={{
        position: "relative", zIndex: 2,
        width: "100%",
        maxWidth: "680px",
        marginLeft: "clamp(1.2rem, 8%, 120px)",
        padding: "2rem 1.5rem 2rem clamp(1.2rem, 4%, 3rem)",
        borderLeft: "1px solid rgba(212,160,23,0.2)",
      }}>
        {/* Badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "0.5rem",
          background: "rgba(212,160,23,0.12)",
          border: "1px solid rgba(212,160,23,0.4)",
          color: "var(--gold-light)",
          padding: "0.4rem 0.9rem", borderRadius: "2rem",
          fontSize: "0.7rem", fontWeight: 700,
          letterSpacing: "0.08em", textTransform: "uppercase",
          marginBottom: "1.2rem",
          opacity: loaded ? 1 : 0,
          transform: loaded ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.8s ease",
        }}>
          <span style={{
            width: "5px", height: "5px", borderRadius: "50%",
            background: "var(--gold)", animation: "pulse 2s infinite",
            flexShrink: 0,
          }} />
          🇳🇬 Nigerian Cuisine · Letterkenny, Donegal
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(2rem, 7vw, 4.8rem)",
          fontWeight: 900,
          color: "white",
          lineHeight: 1.1,
          marginBottom: "1rem",
          opacity: loaded ? 1 : 0,
          transform: loaded ? "translateY(0)" : "translateY(25px)",
          transition: "all 0.8s 0.15s ease",
        }}>
          Taste of{" "}
          <em style={{ color: "var(--gold)", fontStyle: "italic", display: "block", fontSize: "110%" }}>
            Home,
          </em>
          Made with Love
        </h1>

        {/* Divider */}
        <div style={{
          width: loaded ? "60px" : "0px", height: "2px",
          background: "linear-gradient(to right, var(--gold), transparent)",
          marginBottom: "1rem",
          transition: "width 0.8s 0.4s ease",
        }} />

        {/* Subtext */}
        <p style={{
          fontSize: "clamp(0.9rem, 2.5vw, 1.05rem)",
          color: "rgba(255,255,255,0.78)",
          lineHeight: 1.75,
          maxWidth: "460px",
          marginBottom: "1.8rem",
          opacity: loaded ? 1 : 0,
          transform: loaded ? "translateY(0)" : "translateY(25px)",
          transition: "all 0.8s 0.3s ease",
        }}>
          Soul-nourishing Nigerian home cooking — from Ewa&apos;s kitchen
          straight to your door in Donegal, Ireland.
        </p>

        {/* Feature pills */}
        <div style={{
          display: "flex", gap: "0.5rem", flexWrap: "wrap",
          marginBottom: "1.8rem",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.8s 0.45s ease",
        }}>
          {["🏠 Home Cooked", "🌶️ Authentic", "🚗 Delivered"].map((tag) => (
            <span key={tag} style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "rgba(255,255,255,0.75)",
              padding: "0.28rem 0.8rem", borderRadius: "2rem",
              fontSize: "0.72rem", fontWeight: 500,
            }}>
              {tag}
            </span>
          ))}
        </div>

        {/* CTA Buttons */}
        <div style={{
          display: "flex", gap: "0.8rem", flexWrap: "wrap",
          opacity: loaded ? 1 : 0,
          transform: loaded ? "translateY(0)" : "translateY(25px)",
          transition: "all 0.8s 0.5s ease",
        }}>
          <a href="#menu" style={{
            background: "var(--gold)", color: "var(--green-dark)",
            padding: "0.85rem 1.8rem",
            borderRadius: "var(--radius-full)",
            fontWeight: 800, fontSize: "0.9rem",
            textDecoration: "none",
            display: "inline-flex", alignItems: "center", gap: "0.4rem",
            transition: "all 0.25s",
            boxShadow: "0 8px 30px rgba(212,160,23,0.4)",
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
            🍽️ View Menu
          </a>
          <button onClick={openCart} style={{
            background: "transparent", color: "white",
            padding: "0.85rem 1.8rem",
            borderRadius: "var(--radius-full)",
            border: "1.5px solid rgba(255,255,255,0.35)",
            fontWeight: 600, fontSize: "0.9rem",
            cursor: "pointer",
            display: "inline-flex", alignItems: "center", gap: "0.4rem",
            transition: "all 0.25s", fontFamily: "inherit",
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--gold)";
              e.currentTarget.style.color = "var(--gold)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)";
              e.currentTarget.style.color = "white";
            }}
          >
            🛒 Order Now
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: "absolute", bottom: "1.5rem", left: "50%",
        transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem",
        color: "rgba(255,255,255,0.35)", fontSize: "0.6rem",
        letterSpacing: "0.2em", textTransform: "uppercase",
        animation: "scrollBounce 2s ease-in-out infinite", zIndex: 5,
      }}>
        <div style={{
          width: "1px", height: "36px",
          background: "linear-gradient(to bottom, var(--gold), transparent)",
        }} />
        Scroll
      </div>

      <style>{`
        @keyframes scrollBounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50%       { transform: translateX(-50%) translateY(8px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.8); }
        }
        @media (max-width: 640px) {
          .hero-accent-line { display: none !important; }
          .hero-dots { display: none !important; }
          .hero-content {
            margin-left: 0 !important;
            padding: 1.5rem 1.2rem !important;
            border-left: none !important;
            max-width: 100% !important;
          }
        }
      `}</style>
    </section>
  );
}