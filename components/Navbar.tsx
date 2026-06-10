"use client";

import { useEffect, useState } from "react";

const NAV_LINKS = [
  { label: "About", href: "#why" },
  { label: "Menu", href: "#menu" },
  { label: "Our Story", href: "#about" },
  { label: "Reviews", href: "#testimonials" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  const openCart = () => {
    document.dispatchEvent(new CustomEvent("openCart"));
    setMobileOpen(false);
  };

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 900,
        padding: scrolled ? "0.8rem 2rem" : "1.1rem 2rem",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrolled ? "rgba(13,43,31,0.97)" : "rgba(13,43,31,0.4)",
        backdropFilter: "blur(12px)",
        borderBottom: scrolled ? "1px solid rgba(212,160,23,0.1)" : "none",
        boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.2)" : "none",
        transition: "all 0.4s ease",
      }}>
        {/* Logo */}
        <a href="#hero" style={{ display: "flex", alignItems: "center", gap: "0.55rem", textDecoration: "none" }}>
          <div style={{
            width: "34px", height: "34px", borderRadius: "50%",
            background: "linear-gradient(135deg, var(--gold), var(--gold-dark))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.1rem", flexShrink: 0,
          }}>🍲</div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.35rem", fontWeight: 700, color: "white" }}>
            Food<em style={{ color: "var(--gold)", fontStyle: "italic" }}>byEwa</em>
          </span>
        </a>

        {/* Desktop Links */}
        <ul className="desktop-nav" style={{
          display: "flex", alignItems: "center", gap: "2rem",
          listStyle: "none", margin: 0, padding: 0,
        }}>
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} onClick={() => setActiveLink(link.href)} style={{
                color: activeLink === link.href ? "var(--gold)" : "rgba(255,255,255,0.82)",
                fontSize: "0.8rem", fontWeight: 600,
                letterSpacing: "0.08em", textTransform: "uppercase",
                textDecoration: "none", transition: "color 0.2s",
                position: "relative", paddingBottom: "4px",
              }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold)")}
                onMouseLeave={(e) => { if (activeLink !== link.href) e.currentTarget.style.color = "rgba(255,255,255,0.82)"; }}
              >
                {link.label}
                <span style={{
                  position: "absolute", bottom: 0, left: 0,
                  width: activeLink === link.href ? "100%" : "0%",
                  height: "1.5px", background: "var(--gold)",
                  transition: "width 0.3s ease", borderRadius: "1px",
                }} />
              </a>
            </li>
          ))}
          <li>
            <button onClick={openCart} style={{
              background: "linear-gradient(135deg, var(--gold), var(--gold-dark))",
              color: "var(--green-dark)", padding: "0.55rem 1.4rem",
              borderRadius: "var(--radius-full)", fontWeight: 800,
              fontSize: "0.82rem", border: "none", cursor: "pointer",
              transition: "all 0.22s", fontFamily: "inherit",
              boxShadow: "0 4px 16px rgba(212,160,23,0.35)",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(212,160,23,0.5)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(212,160,23,0.35)"; }}
            >
              🛒 Order Now
            </button>
          </li>
        </ul>

        {/* Burger */}
        <button onClick={() => setMobileOpen(true)} className="burger-btn" aria-label="Open menu" style={{
          display: "none", flexDirection: "column", gap: "4px",
          background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: "0.5rem", cursor: "pointer", padding: "0.45rem 0.55rem",
        }}>
          <span style={{ display: "block", width: "20px", height: "2px", background: "white", borderRadius: "2px" }} />
          <span style={{ display: "block", width: "14px", height: "2px", background: "var(--gold)", borderRadius: "2px" }} />
          <span style={{ display: "block", width: "20px", height: "2px", background: "white", borderRadius: "2px" }} />
        </button>
      </nav>

      {/* Mobile Menu — slide down from top, NOT full screen */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0,
        zIndex: 940,
        background: "var(--green-dark)",
        transform: mobileOpen ? "translateY(0)" : "translateY(-100%)",
        transition: "transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94)",
        padding: "5rem 2rem 2rem",
        boxShadow: mobileOpen ? "0 8px 40px rgba(0,0,0,0.4)" : "none",
        borderBottom: "1px solid rgba(212,160,23,0.2)",
      }}>
        {/* Close */}
        <button onClick={() => setMobileOpen(false)} style={{
          position: "absolute", top: "1rem", right: "1.2rem",
          background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: "50%", color: "white",
          width: "36px", height: "36px", fontSize: "1rem",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        }}>✕</button>

        {/* Links */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setMobileOpen(false)} style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.5rem", color: "rgba(255,255,255,0.88)",
              textDecoration: "none", padding: "0.5rem 0",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              transition: "color 0.2s",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.88)")}
            >
              {link.label}
            </a>
          ))}
        </div>

        <button onClick={openCart} style={{
          marginTop: "1.2rem", width: "100%",
          background: "linear-gradient(135deg, var(--gold), var(--gold-dark))",
          color: "var(--green-dark)", padding: "0.9rem",
          borderRadius: "var(--radius-full)", fontWeight: 800,
          fontSize: "1rem", border: "none", cursor: "pointer",
          fontFamily: "inherit", boxShadow: "var(--shadow-gold)",
        }}>
          🛒 Order Now on WhatsApp
        </button>
      </div>

      {/* Overlay behind mobile menu */}
      {mobileOpen && (
        <div onClick={() => setMobileOpen(false)} style={{
          position: "fixed", inset: 0, zIndex: 930,
          background: "rgba(0,0,0,0.4)", backdropFilter: "blur(2px)",
        }} />
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .burger-btn  { display: flex !important; }
          nav { padding: 0.8rem 1.2rem !important; }
        }
      `}</style>
    </>
  );
}