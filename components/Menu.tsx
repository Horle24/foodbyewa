"use client";

import { useEffect, useRef, useState } from "react";
import { MenuItem } from "@/lib/menuData";

const SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL!;

// ── Fixed Nigerian food categories ──
const CATEGORIES = [
  { label: "All Items", icon: "🍽️" },
  { label: "Rice",      icon: "🍚" },
  { label: "Soup",      icon: "🥣" },
  { label: "Swallow",   icon: "🫙" },
  { label: "Protein",   icon: "🍗" },
  { label: "Snacks",    icon: "🥟" },
  { label: "Drinks",    icon: "🥤" },
  { label: "Other",     icon: "✨" },
];

interface MenuProps {
  cart: { id: number; qty: number }[];
  onAddToCart: (item: MenuItem) => void;
}

// Extend MenuItem to include category
interface MenuItemWithCat extends MenuItem {
  category?: string;
}

export default function Menu({ cart, onAddToCart }: MenuProps) {
  const sectionRef   = useRef<HTMLElement>(null);
  const [menu, setMenu]           = useState<MenuItemWithCat[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [activeCategory, setActiveCategory] = useState("All Items");
  const [search, setSearch]       = useState("");

  useEffect(() => {
    async function fetchMenu() {
      try {
        const res  = await fetch(`${SCRIPT_URL}?action=getMenu`);
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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.06 }
    );
    sectionRef.current?.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [menu]);

  const isInCart = (id: number) => cart.some((c) => c.id === id);

  // Only show categories that actually have items
  const availableCategories = CATEGORIES.filter((cat) =>
    cat.label === "All Items" || menu.some((m) => m.category === cat.label)
  );

  const filtered = menu.filter((item) => {
    const matchCat    = activeCategory === "All Items" || item.category === activeCategory;
    const matchSearch = search.trim() === "" ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <section id="menu" ref={sectionRef} style={{
      background: "var(--cream)", padding: "6rem 2rem",
      position: "relative", overflow: "hidden",
    }}>
      {/* Dot pattern bg */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `radial-gradient(circle, rgba(27,67,50,0.04) 1px, transparent 1px)`,
        backgroundSize: "30px 30px", pointerEvents: "none",
      }} />

      <div className="container" style={{ position: "relative" }}>

        {/* ── Header ── */}
        <div className="reveal" style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <span style={{
            fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.2em",
            textTransform: "uppercase", color: "var(--gold)",
            display: "block", marginBottom: "0.6rem",
          }}>
            Our Menu
          </span>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 900, color: "var(--green-dark)", lineHeight: 1.15,
          }}>
            Pick Your{" "}
            <em style={{ color: "var(--terracotta)", fontStyle: "italic" }}>Favourite</em>
          </h2>
          <p style={{
            color: "var(--text-muted)", fontSize: "0.95rem",
            lineHeight: 1.7, maxWidth: "460px", margin: "0.8rem auto 0",
          }}>
            Browse dishes, add to your cart, then send directly to Ewa&apos;s WhatsApp to confirm and pay.
          </p>
        </div>

        {/* ── Search Bar ── */}
        {!loading && !error && (
          <div className="reveal" style={{ maxWidth: "500px", margin: "0 auto 2rem" }}>
            <div style={{ position: "relative" }}>
              <span style={{
                position: "absolute", left: "1rem", top: "50%",
                transform: "translateY(-50%)", fontSize: "1rem",
                pointerEvents: "none", color: "var(--text-muted)",
              }}>🔍</span>
              <input
                type="text" value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for a dish..."
                style={{
                  width: "100%", padding: "0.85rem 2.8rem 0.85rem 2.8rem",
                  border: "1.5px solid rgba(27,67,50,0.15)",
                  borderRadius: "var(--radius-full)", fontFamily: "inherit",
                  fontSize: "0.95rem", background: "white",
                  color: "var(--charcoal)", outline: "none",
                  transition: "all 0.2s", boxShadow: "0 2px 12px rgba(27,67,50,0.06)",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "var(--green)";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(27,67,50,0.08)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(27,67,50,0.15)";
                  e.currentTarget.style.boxShadow = "0 2px 12px rgba(27,67,50,0.06)";
                }}
              />
              {search && (
                <button onClick={() => setSearch("")} style={{
                  position: "absolute", right: "1rem", top: "50%",
                  transform: "translateY(-50%)", background: "none",
                  border: "none", cursor: "pointer",
                  color: "var(--text-muted)", fontSize: "1rem",
                }}>✕</button>
              )}
            </div>
          </div>
        )}

        {/* ── Category Tabs ── */}
        {!loading && !error && (
          <div className="reveal" style={{
            display: "flex", gap: "0.6rem", flexWrap: "wrap",
            justifyContent: "center", marginBottom: "2.5rem",
            paddingBottom: "2rem",
            borderBottom: "1px solid rgba(27,67,50,0.08)",
          }}>
            {availableCategories.map((cat) => (
              <button
                key={cat.label}
                onClick={() => { setActiveCategory(cat.label); setSearch(""); }}
                style={{
                  background: activeCategory === cat.label ? "var(--green)" : "white",
                  color: activeCategory === cat.label ? "white" : "var(--charcoal)",
                  border: `1.5px solid ${activeCategory === cat.label ? "var(--green)" : "rgba(27,67,50,0.12)"}`,
                  padding: "0.5rem 1.2rem",
                  borderRadius: "var(--radius-full)",
                  fontSize: "0.85rem", fontWeight: 600,
                  cursor: "pointer", transition: "all 0.2s ease",
                  fontFamily: "inherit", display: "inline-flex",
                  alignItems: "center", gap: "0.4rem",
                  boxShadow: activeCategory === cat.label ? "0 4px 14px rgba(27,67,50,0.2)" : "none",
                }}
                onMouseEnter={(e) => {
                  if (activeCategory !== cat.label) {
                    e.currentTarget.style.borderColor = "var(--green)";
                    e.currentTarget.style.color = "var(--green)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeCategory !== cat.label) {
                    e.currentTarget.style.borderColor = "rgba(27,67,50,0.12)";
                    e.currentTarget.style.color = "var(--charcoal)";
                  }
                }}
              >
                <span>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* ── Loading ── */}
        {loading && (
          <div style={{
            display: "flex", flexDirection: "column",
            alignItems: "center", padding: "5rem", gap: "1.2rem",
          }}>
            <div style={{
              width: "48px", height: "48px",
              border: "3px solid var(--cream-dark)",
              borderTop: "3px solid var(--gold)",
              borderRadius: "50%", animation: "spin 0.8s linear infinite",
            }} />
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
              Loading today&apos;s menu...
            </p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* ── Error ── */}
        {error && !loading && (
          <div style={{
            textAlign: "center", padding: "4rem", background: "white",
            borderRadius: "var(--radius-lg)", border: "1px solid rgba(193,68,14,0.15)",
          }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>😔</div>
            <p style={{ color: "var(--terracotta)", fontWeight: 600 }}>{error}</p>
          </div>
        )}

        {/* ── No results ── */}
        {!loading && !error && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-muted)" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🍽️</div>
            <p style={{ fontWeight: 600, marginBottom: "0.4rem" }}>No dishes found</p>
            <p style={{ fontSize: "0.88rem", marginBottom: "1.2rem" }}>
              Try a different search or category
            </p>
            <button onClick={() => { setSearch(""); setActiveCategory("All Items"); }} style={{
              background: "var(--green)", color: "white", border: "none",
              padding: "0.6rem 1.4rem", borderRadius: "var(--radius-full)",
              cursor: "pointer", fontFamily: "inherit",
              fontWeight: 600, fontSize: "0.88rem",
            }}>
              Clear filters
            </button>
          </div>
        )}

        {/* ── Menu Grid ── */}
        {!loading && !error && filtered.length > 0 && (
          <>
            <div style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "center", marginBottom: "1.2rem",
            }}>
              <p style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>
                <strong style={{ color: "var(--green-dark)" }}>{filtered.length}</strong>{" "}
                {filtered.length === 1 ? "dish" : "dishes"} available
                {activeCategory !== "All Items" && (
                  <span style={{ color: "var(--gold)", fontWeight: 700 }}>
                    {" "}· {activeCategory}
                  </span>
                )}
              </p>
              {(search || activeCategory !== "All Items") && (
                <button onClick={() => { setSearch(""); setActiveCategory("All Items"); }} style={{
                  background: "none", border: "none", color: "var(--text-muted)",
                  fontSize: "0.8rem", cursor: "pointer", fontFamily: "inherit",
                  textDecoration: "underline",
                }}>
                  Clear all
                </button>
              )}
            </div>

            <div className="reveal" style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
              gap: "1.8rem",
            }}>
              {filtered.map((item) => (
                <FoodCard
                  key={item.id}
                  item={item}
                  inCart={isInCart(item.id)}
                  onAdd={() => onAddToCart(item)}
                />
              ))}
            </div>
          </>
        )}

        {/* ── Bottom CTA ── */}
        {!loading && !error && (
          <div className="reveal" style={{
            textAlign: "center", marginTop: "4rem",
            background: "var(--green-dark)",
            borderRadius: "var(--radius-lg)",
            padding: "2.5rem 2rem", position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: "-40px", right: "-40px",
              width: "180px", height: "180px", borderRadius: "50%",
              background: "rgba(212,160,23,0.08)", pointerEvents: "none",
            }} />
            <p style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)",
              color: "var(--cream)", fontWeight: 700,
              marginBottom: "0.4rem", position: "relative",
            }}>
              Can&apos;t decide? Ask Ewa directly! 🍲
            </p>
            <p style={{
              color: "rgba(255,255,255,0.5)", fontSize: "0.88rem",
              marginBottom: "1.4rem", position: "relative",
            }}>
              WhatsApp Ewa for today&apos;s specials and custom orders
            </p>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
              target="_blank" rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                background: "var(--gold)", color: "var(--green-dark)",
                padding: "0.85rem 2rem", borderRadius: "var(--radius-full)",
                fontWeight: 800, fontSize: "0.92rem",
                textDecoration: "none", transition: "all 0.25s",
                boxShadow: "var(--shadow-gold)", position: "relative",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--gold-light)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "var(--gold)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              📱 Chat with Ewa on WhatsApp
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

// ── Food Card ──
function FoodCard({ item, inCart, onAdd }: {
  item: MenuItemWithCat; inCart: boolean; onAdd: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "white", borderRadius: "var(--radius-lg)", overflow: "hidden",
        boxShadow: hovered ? "0 20px 60px rgba(27,67,50,0.18)" : "0 4px 24px rgba(27,67,50,0.07)",
        transform: hovered ? "translateY(-8px)" : "translateY(0)",
        transition: "all 0.38s cubic-bezier(0.25,0.46,0.45,0.94)",
      }}
    >
      <div style={{ position: "relative", height: "220px", overflow: "hidden" }}>
        <img src={item.img} alt={item.name} loading="lazy" style={{
          width: "100%", height: "100%", objectFit: "cover",
          transform: hovered ? "scale(1.08)" : "scale(1)",
          transition: "transform 0.55s ease",
        }} />
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "55%",
          background: "linear-gradient(to top, rgba(13,43,31,0.6), transparent)",
        }} />
        {/* Category pill */}
        <div style={{
          position: "absolute", top: "0.8rem", left: "0.8rem",
          background: "rgba(13,43,31,0.85)", backdropFilter: "blur(6px)",
          color: "var(--gold-light)", fontSize: "0.68rem", fontWeight: 700,
          padding: "0.28rem 0.75rem", borderRadius: "2rem",
          border: "1px solid rgba(212,160,23,0.3)",
        }}>
          {item.category || item.badge}
        </div>
        {/* Price */}
        <div style={{
          position: "absolute", bottom: "0.8rem", right: "0.8rem",
          fontFamily: "'Playfair Display', serif",
          fontSize: "1.4rem", fontWeight: 900, color: "var(--gold)",
          textShadow: "0 2px 8px rgba(0,0,0,0.4)",
        }}>
          €{item.price.toFixed(2)}
        </div>
      </div>
      <div style={{ padding: "1.2rem 1.4rem 1.4rem" }}>
        <h3 style={{
          fontFamily: "'Playfair Display', serif", fontSize: "1.1rem",
          fontWeight: 700, color: "var(--green-dark)", marginBottom: "0.4rem",
        }}>
          {item.name}
        </h3>
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: 1.55, marginBottom: "1.2rem" }}>
          {item.desc}
        </p>
        <button onClick={onAdd} style={{
          width: "100%",
          background: inCart
            ? "linear-gradient(135deg, var(--gold), var(--gold-dark))"
            : "linear-gradient(135deg, var(--green), var(--green-light))",
          color: inCart ? "var(--green-dark)" : "white",
          padding: "0.72rem", borderRadius: "var(--radius)",
          fontSize: "0.88rem", fontWeight: 700, border: "none",
          cursor: "pointer", fontFamily: "inherit",
          display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem",
          touchAction: "manipulation",
        }}>
          {inCart ? "✓ Added to Order" : "+ Add to Order"}
        </button>
      </div>
    </div>
  );
}