// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//   FOODBYEWA — Hero Section (Premium)
//   components/Hero.tsx
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

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

  // Auto-rotate background images
  useEffect(() => {
    const interval = setInterval(() => {
      setSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const openCart = () => document.dispatchEvent(new CustomEvent("openCart"));

  return (
    <section
      id="hero"
      style={{
        position: "relative",
        height: "100vh",
        minHeight: "680px",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* ── Sliding Backgrounds ── */}
      {SLIDES.map((src, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url('${src}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: slide === i ? 1 : 0,
            transform: slide === i ? "scale(1.06)" : "scale(1.12)",
            transition: "opacity 1.5s ease, transform 8s ease",
          }}
        />
      ))}

      {/* ── Multi-layer Overlay ── */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: `
          linear-gradient(to right, rgba(13,43,31,0.96) 0%, rgba(13,43,31,0.7) 55%, rgba(13,43,31,0.2) 100%),
          linear-gradient(to top, rgba(13,43,31,0.8) 0%, transparent 40%)
        `,
      }} />

      {/* ── Gold side accent line ── */}
      <div style={{
        position: "absolute",
        left: 0,
        top: "15%",
        bottom: "15%",
        width: "4px",
        background: "linear-gradient(to bottom, transparent, var(--gold), transparent)",
        opacity: loaded ? 1 : 0,
        transition: "opacity 1s 0.8s ease",
      }} />

      {/* ── Slide dots ── */}
      <div style={{
        position: "absolute",
        right: "2.5rem",
        top: "50%",
        transform: "translateY(-50%)",
        display: "flex",
        flexDirection: "column",
        gap: "0.6rem",
        zIndex: 10,
      }}>
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setSlide(i)}
            style={{
              width: slide === i ? "28px" : "8px",
              height: "8px",
              borderRadius: "4px",
              background: slide === i ? "var(--gold)" : "rgba(255,255,255,0.3)",
              border: "none",
              cursor: "pointer",
              transition: "all 0.4s ease",
              padding: 0,
            }}
          />
        ))}
      </div>

      {/* ── Hero Content ── */}
      <div style={{
        position: "relative",
        zIndex: 2,
        maxWidth: "680px",
        marginLeft: "clamp(2rem, 8%, 120px)",
        padding: "2rem 2rem 2rem 3rem",
        borderLeft: "1px solid rgba(212,160,23,0.2)",
      }}>

        {/* Location badge */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.6rem",
          background: "rgba(212,160,23,0.12)",
          border: "1px solid rgba(212,160,23,0.4)",
          color: "var(--gold-light)",
          padding: "0.45rem 1.1rem",
          borderRadius: "2rem",
          fontSize: "0.75rem",
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginBottom: "2rem",
          opacity: loaded ? 1 : 0,
          transform: loaded ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.8s ease",
        }}>
          <span style={{
            width: "6px", height: "6px",
            borderRadius: "50%",
            background: "var(--gold)",
            animation: "pulse 2s infinite",
          }} />
          🇳🇬 Nigerian Cuisine · Letterkenny, Donegal
        </div>

        {/* Main headline */}
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(2.6rem, 5.5vw, 4.8rem)",
          fontWeight: 900,
          color: "var(--white)",
          lineHeight: 1.08,
          marginBottom: "1.5rem",
          opacity: loaded ? 1 : 0,
          transform: loaded ? "translateY(0)" : "translateY(25px)",
          transition: "all 0.8s 0.15s ease",
        }}>
          Taste of{" "}
          <em style={{
            color: "var(--gold)",
            fontStyle: "italic",
            display: "block",
            fontSize: "110%",
          }}>
            Home,
          </em>
          Made with Love
        </h1>

        {/* Divider */}
        <div style={{
          width: loaded ? "80px" : "0px",
          height: "2px",
          background: "linear-gradient(to right, var(--gold), transparent)",
          marginBottom: "1.5rem",
          transition: "width 0.8s 0.4s ease",
        }} />

        {/* Subtext */}
        <p style={{
          fontSize: "1.05rem",
          color: "rgba(255,255,255,0.75)",
          lineHeight: 1.85,
          maxWidth: "480px",
          marginBottom: "2.8rem",
          opacity: loaded ? 1 : 0,
          transform: loaded ? "translateY(0)" : "translateY(25px)",
          transition: "all 0.8s 0.3s ease",
        }}>
          Soul-nourishing Nigerian home cooking — from Ewa&apos;s kitchen
          straight to your door, right here in the heart of Donegal, Ireland.
        </p>

        {/* Feature pills */}
        <div style={{
          display: "flex",
          gap: "0.6rem",
          flexWrap: "wrap",
          marginBottom: "2.5rem",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.8s 0.5s ease",
        }}>
          {["🏠 Home Cooked", "🌶️ Authentic", "🚗 Delivered"].map((tag) => (
            <span key={tag} style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "rgba(255,255,255,0.75)",
              padding: "0.3rem 0.9rem",
              borderRadius: "2rem",
              fontSize: "0.78rem",
              fontWeight: 500,
            }}>
              {tag}
            </span>
          ))}
        </div>

        {/* CTA Buttons */}
        <div style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          opacity: loaded ? 1 : 0,
          transform: loaded ? "translateY(0)" : "translateY(25px)",
          transition: "all 0.8s 0.5s ease",
        }}>
          <a
            href="#menu"
            style={{
              background: "var(--gold)",
              color: "var(--green-dark)",
              padding: "1rem 2.2rem",
              borderRadius: "var(--radius-full)",
              fontWeight: 800,
              fontSize: "0.95rem",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              transition: "all 0.25s",
              boxShadow: "0 8px 30px rgba(212,160,23,0.4)",
              letterSpacing: "0.02em",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--gold-light)";
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 12px 40px rgba(212,160,23,0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--gold)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 30px rgba(212,160,23,0.4)";
            }}
          >
            🍽️ View Today&apos;s Menu
          </a>

          <button
            onClick={openCart}
            style={{
              background: "transparent",
              color: "white",
              padding: "1rem 2.2rem",
              borderRadius: "var(--radius-full)",
              border: "1.5px solid rgba(255,255,255,0.35)",
              fontWeight: 600,
              fontSize: "0.95rem",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              transition: "all 0.25s",
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--gold)";
              e.currentTarget.style.color = "var(--gold)";
              e.currentTarget.style.transform = "translateY(-3px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)";
              e.currentTarget.style.color = "white";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            🛒 Order on WhatsApp
          </button>
        </div>
      </div>

      {/* ── Scroll Indicator ── */}
      <div style={{
        position: "absolute",
        bottom: "2.5rem",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.5rem",
        color: "rgba(255,255,255,0.35)",
        fontSize: "0.65rem",
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        animation: "scrollBounce 2s ease-in-out infinite",
        zIndex: 5,
      }}>
        <div style={{
          width: "1px",
          height: "50px",
          background: "linear-gradient(to bottom, var(--gold), transparent)",
        }} />
        Scroll
      </div>

      <style>{`
        @keyframes heroZoom {
          from { transform: scale(1.05); }
          to   { transform: scale(1.12); }
        }
        @keyframes scrollBounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50%       { transform: translateX(-50%) translateY(10px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.8); }
        }
        @media (max-width: 640px) {
          #hero > div:nth-child(4) {
            margin-left: 1.5rem !important;
            padding: 1.5rem !important;
            border-left: none !important;
          }
        }
      `}</style>
    </section>
  );
}