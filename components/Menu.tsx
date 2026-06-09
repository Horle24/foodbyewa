
"use client";

import { useEffect, useRef, useState } from "react";
import { MenuItem } from "../lib/menuData";

const SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL!;

interface MenuProps {
  cart: { id: number; qty: number }[];
  onAddToCart: (item: MenuItem) => void;
}

export default function Menu({ cart, onAddToCart }: MenuProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ── Fetch live menu from Google Sheets ──
  useEffect(() => {
    async function fetchMenu() {
      try {
        const res = await fetch(`${SCRIPT_URL}?action=getMenu`);
        const data = await res.json();
        if (data.success && data.menu.length > 0) {
          setMenu(data.menu);
        } else {
          setError("Menu unavailable. Please try again later.");
        }
      } catch {
        setError("Could not load menu. Please refresh.");
      } finally {
        setLoading(false);
      }
    }
    fetchMenu();
  }, []);

  // ── Scroll reveal ──
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.08 }
    );
    const reveals = sectionRef.current?.querySelectorAll(".reveal");
    reveals?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [menu]);

  const isInCart = (id: number) => cart.some((c) => c.id === id);

  return (
    <section
      id="menu"
      ref={sectionRef}
      style={{ background: "var(--cream)", padding: "5rem 2rem" }}
    >
      <div className="container">

        {/* Header */}
        <div className="reveal" style={{ marginBottom: "3rem" }}>
          <span className="section-label">Today&apos;s Menu</span>
          <h2 className="section-title">
            Fresh Every <em>Day</em>
          </h2>
          <p className="section-sub">
            Made fresh, sold out fast — order early to avoid disappointment!
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "4rem",
            gap: "1rem",
          }}>
            <div style={{
              width: "48px",
              height: "48px",
              border: "4px solid var(--cream-dark)",
              borderTop: "4px solid var(--gold)",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }} />
            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
              Loading today&apos;s menu...
            </p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div style={{
            textAlign: "center",
            padding: "3rem",
            background: "var(--white)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid rgba(193,68,14,0.2)",
          }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>😔</div>
            <p style={{ color: "var(--terracotta)", fontWeight: 600 }}>{error}</p>
          </div>
        )}

        {/* Menu Grid */}
        {!loading && !error && (
          <div
            className="reveal"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1.8rem",
            }}
          >
            {menu.map((item) => (
              <FoodCard
                key={item.id}
                item={item}
                inCart={isInCart(item.id)}
                onAdd={() => onAddToCart(item)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//   Food Card Sub-Component
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function FoodCard({
  item,
  inCart,
  onAdd,
}: {
  item: MenuItem;
  inCart: boolean;
  onAdd: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "var(--white)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        boxShadow: hovered
          ? "0 16px 50px rgba(27,67,50,0.18)"
          : "var(--shadow-card)",
        transform: hovered ? "translateY(-8px)" : "translateY(0)",
        transition: "all 0.35s ease",
        cursor: "pointer",
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", height: "220px", overflow: "hidden" }}>
        <img
          src={item.img}
          alt={item.name}
          loading="lazy"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: hovered ? "scale(1.08)" : "scale(1)",
            transition: "transform 0.5s ease",
          }}
        />
        {/* Badge */}
        <div style={{
          position: "absolute",
          top: "0.8rem",
          left: "0.8rem",
          background: "var(--green)",
          color: "white",
          fontSize: "0.7rem",
          fontWeight: 700,
          padding: "0.25rem 0.75rem",
          borderRadius: "2rem",
          letterSpacing: "0.05em",
        }}>
          {item.badge}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "1.4rem" }}>
        <h3 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "1.2rem",
          fontWeight: 700,
          color: "var(--green-dark)",
          marginBottom: "0.4rem",
        }}>
          {item.name}
        </h3>
        <p style={{
          color: "var(--text-muted)",
          fontSize: "0.88rem",
          lineHeight: 1.55,
          marginBottom: "1.2rem",
        }}>
          {item.desc}
        </p>

        {/* Price + Add Button */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <span style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "var(--terracotta)",
          }}>
            €{item.price.toFixed(2)}
          </span>

          <button
            onClick={onAdd}
            style={{
              background: inCart ? "var(--gold)" : "var(--green)",
              color: inCart ? "var(--green-dark)" : "white",
              padding: "0.55rem 1.3rem",
              borderRadius: "2rem",
              fontSize: "0.85rem",
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.06)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            {inCart ? "✓ Added" : "+ Add"}
          </button>
        </div>
      </div>
    </div>
  );
}