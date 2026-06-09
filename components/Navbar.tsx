
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
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 900,
        padding: scrolled ? "0.8rem 3rem" : "1.3rem 3rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: scrolled ? "rgba(13,43,31,0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(212,160,23,0.1)" : "none",
        boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.2)" : "none",
        transition: "all 0.4s ease",
      }}>

        {/* ── Logo ── */}
        <a
          href="#hero"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            textDecoration: "none",
          }}
        >
          <div style={{
            width: "38px", height: "38px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--gold), var(--gold-dark))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.2rem",
            boxShadow: "0 4px 16px rgba(212,160,23,0.35)",
            flexShrink: 0,
          }}>
            🍲
          </div>
          <span style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "white",
            letterSpacing: "0.02em",
          }}>
            Food<em style={{ color: "var(--gold)", fontStyle: "italic" }}>byEwa</em>
          </span>
        </a>

        {/* ── Desktop Links ── */}
        <ul
          className="desktop-nav"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2.5rem",
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
        >
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setActiveLink(link.href)}
                style={{
                  color: activeLink === link.href
                    ? "var(--gold)"
                    : "rgba(255,255,255,0.8)",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  transition: "color 0.2s",
                  position: "relative",
                  paddingBottom: "4px",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold)")}
                onMouseLeave={(e) => {
                  if (activeLink !== link.href) {
                    e.currentTarget.style.color = "rgba(255,255,255,0.8)";
                  }
                }}
              >
                {link.label}
                {/* Active underline */}
                <span style={{
                  position: "absolute",
                  bottom: 0, left: 0,
                  width: activeLink === link.href ? "100%" : "0%",
                  height: "1.5px",
                  background: "var(--gold)",
                  transition: "width 0.3s ease",
                  borderRadius: "1px",
                }} />
              </a>
            </li>
          ))}

          {/* Order CTA */}
          <li>
            <button
              onClick={openCart}
              style={{
                background: "linear-gradient(135deg, var(--gold), var(--gold-dark))",
                color: "var(--green-dark)",
                padding: "0.6rem 1.6rem",
                borderRadius: "var(--radius-full)",
                fontWeight: 800,
                fontSize: "0.85rem",
                letterSpacing: "0.04em",
                border: "none",
                cursor: "pointer",
                transition: "all 0.22s",
                boxShadow: "0 4px 16px rgba(212,160,23,0.35)",
                fontFamily: "inherit",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(212,160,23,0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(212,160,23,0.35)";
              }}
            >
              🛒 Order Now
            </button>
          </li>
        </ul>

        {/* ── Burger ── */}
        <button
          onClick={() => setMobileOpen(true)}
          className="burger-btn"
          aria-label="Open menu"
          style={{
            display: "none",
            flexDirection: "column",
            gap: "5px",
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "0.5rem",
            cursor: "pointer",
            padding: "0.5rem 0.6rem",
          }}
        >
          <span style={{ display: "block", width: "22px", height: "2px", background: "white", borderRadius: "2px" }} />
          <span style={{ display: "block", width: "16px", height: "2px", background: "var(--gold)", borderRadius: "2px" }} />
          <span style={{ display: "block", width: "22px", height: "2px", background: "white", borderRadius: "2px" }} />
        </button>
      </nav>

      {/* ── Mobile Menu ── */}
      <div style={{
        position: "fixed",
        inset: 0,
        background: "var(--green-dark)",
        zIndex: 950,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        opacity: mobileOpen ? 1 : 0,
        pointerEvents: mobileOpen ? "all" : "none",
        transition: "opacity 0.3s ease",
      }}>
        {/* Gold accent top bar */}
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: "3px",
          background: "linear-gradient(to right, var(--gold), var(--green), transparent)",
        }} />

        <button
          onClick={() => setMobileOpen(false)}
          style={{
            position: "absolute",
            top: "1.5rem", right: "1.8rem",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "50%",
            color: "white",
            width: "40px", height: "40px",
            fontSize: "1.1rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >✕</button>

        {/* Logo in mobile menu */}
        <div style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "1.6rem",
          color: "white",
          fontWeight: 700,
          marginBottom: "1.5rem",
        }}>
          🍲 Food<em style={{ color: "var(--gold)", fontStyle: "italic" }}>byEwa</em>
        </div>

        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setMobileOpen(false)}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.8rem",
              color: "rgba(255,255,255,0.85)",
              textDecoration: "none",
              transition: "color 0.2s",
              padding: "0.4rem 0",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.85)")}
          >
            {link.label}
          </a>
        ))}

        <button
          onClick={openCart}
          style={{
            marginTop: "1.5rem",
            background: "linear-gradient(135deg, var(--gold), var(--gold-dark))",
            color: "var(--green-dark)",
            padding: "1rem 2.5rem",
            borderRadius: "var(--radius-full)",
            fontWeight: 800,
            fontSize: "1.1rem",
            border: "none",
            cursor: "pointer",
            fontFamily: "inherit",
            boxShadow: "var(--shadow-gold)",
          }}
        >
          🛒 Order Now
        </button>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .burger-btn  { display: flex !important; }
          nav { padding: 1rem 1.2rem !important; }
        }
      `}</style>
    </>
  );
}