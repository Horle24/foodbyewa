
"use client";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

const QUICK_LINKS = [
  { label: "Why FoodbyEwa", href: "#why" },
  { label: "Today's Menu", href: "#menu" },
  { label: "Our Story", href: "#about" },
  { label: "Reviews", href: "#testimonials" },
];

export default function Footer() {
  const openCart = () => document.dispatchEvent(new CustomEvent("openCart"));

  return (
    <footer style={{
      background: "var(--green-dark)",
      color: "white",
      position: "relative",
      overflow: "hidden",
    }}>

      {/* ── Top Banner CTA ── */}
      <div style={{
        background: "linear-gradient(135deg, var(--green), var(--green-light))",
        borderBottom: "1px solid rgba(212,160,23,0.2)",
        padding: "2.5rem 2rem",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(circle, rgba(212,160,23,0.06) 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
          pointerEvents: "none",
        }} />
        <p style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(1.2rem, 3vw, 1.8rem)",
          color: "var(--cream)",
          fontWeight: 700,
          marginBottom: "0.5rem",
          position: "relative",
        }}>
          Craving authentic Nigerian food tonight? 🍲
        </p>
        <p style={{
          color: "rgba(255,255,255,0.6)",
          fontSize: "0.9rem",
          marginBottom: "1.5rem",
          position: "relative",
        }}>
          Place your order now — delivered fresh to your door in Donegal
        </p>
        <button
          onClick={openCart}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.6rem",
            background: "var(--gold)",
            color: "var(--green-dark)",
            padding: "0.9rem 2.4rem",
            borderRadius: "var(--radius-full)",
            fontWeight: 800,
            fontSize: "1rem",
            border: "none",
            cursor: "pointer",
            transition: "all 0.25s",
            fontFamily: "inherit",
            boxShadow: "var(--shadow-gold)",
            position: "relative",
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
          🛒 Order Now on WhatsApp
        </button>
      </div>

      {/* ── Main Footer ── */}
      <div style={{ padding: "4rem 2rem 2rem" }}>
        <div className="container">
          <div
            className="footer-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr",
              gap: "3rem",
              paddingBottom: "3rem",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {/* ── Brand ── */}
            <div>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                marginBottom: "1.2rem",
              }}>
                <span style={{ fontSize: "1.8rem" }}>🍲</span>
                <span style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.6rem",
                  fontWeight: 700,
                  color: "white",
                }}>
                  Food<em style={{ color: "var(--gold)", fontStyle: "italic" }}>byEwa</em>
                </span>
              </div>

              <p style={{
                color: "rgba(255,255,255,0.55)",
                fontSize: "0.92rem",
                lineHeight: 1.8,
                maxWidth: "290px",
                marginBottom: "1.8rem",
              }}>
                Authentic Nigerian home cooking — made with love, tradition,
                and soul, delivered fresh to your door in Letterkenny &amp; Donegal.
              </p>

              {/* Hours card */}
              <div style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(212,160,23,0.2)",
                borderRadius: "var(--radius)",
                padding: "1rem 1.2rem",
                marginBottom: "1.5rem",
                display: "inline-block",
              }}>
                <div style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--gold)",
                  marginBottom: "0.5rem",
                }}>
                  Opening Hours
                </div>
                <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.88rem", lineHeight: 1.8 }}>
                  <div>⏰ Mon – Sat: 10am – 8pm</div>
                  <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.82rem" }}>
                    Sunday: By Request Only
                  </div>
                </div>
              </div>

              {/* Social Icons */}
              <div style={{ display: "flex", gap: "0.7rem" }}>
                {[
                  { href: `https://wa.me/${WHATSAPP_NUMBER}`, icon: "📱", hover: "#25D366", label: "WhatsApp" },
                  { href: "#", icon: "📸", hover: "#E1306C", label: "Instagram" },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target={s.href !== "#" ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    title={s.label}
                    style={{
                      width: "40px", height: "40px",
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.1rem",
                      transition: "all 0.2s",
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = s.hover;
                      e.currentTarget.style.borderColor = s.hover;
                      e.currentTarget.style.transform = "translateY(-3px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* ── Quick Links ── */}
            <div>
              <div style={{
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                fontSize: "0.75rem",
                color: "var(--gold)",
                marginBottom: "1.4rem",
                paddingBottom: "0.8rem",
                borderBottom: "1px solid rgba(212,160,23,0.2)",
              }}>
                Quick Links
              </div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                {QUICK_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      style={{
                        color: "rgba(255,255,255,0.6)",
                        fontSize: "0.9rem",
                        textDecoration: "none",
                        transition: "all 0.2s",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "var(--gold)";
                        e.currentTarget.style.paddingLeft = "0.3rem";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                        e.currentTarget.style.paddingLeft = "0";
                      }}
                    >
                      <span style={{ color: "var(--gold)", fontSize: "0.55rem" }}>▶</span>
                      {link.label}
                    </a>
                  </li>
                ))}
                <li>
                  <button
                    onClick={openCart}
                    style={{
                      background: "none", border: "none",
                      color: "rgba(255,255,255,0.6)",
                      fontSize: "0.9rem",
                      cursor: "pointer",
                      padding: 0,
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      transition: "all 0.2s",
                      fontFamily: "inherit",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "var(--gold)";
                      e.currentTarget.style.paddingLeft = "0.3rem";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                      e.currentTarget.style.paddingLeft = "0";
                    }}
                  >
                    <span style={{ color: "var(--gold)", fontSize: "0.55rem" }}>▶</span>
                    Order Now
                  </button>
                </li>
              </ul>
            </div>

            {/* ── Contact ── */}
            <div>
              <div style={{
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                fontSize: "0.75rem",
                color: "var(--gold)",
                marginBottom: "1.4rem",
                paddingBottom: "0.8rem",
                borderBottom: "1px solid rgba(212,160,23,0.2)",
              }}>
                Find Us
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
                {[
                  { icon: "📍", text: "Letterkenny, Donegal, Ireland" },
                  { icon: "📱", text: "WhatsApp Orders Only" },
                ].map((item, i) => (
                  <div key={i} style={{
                    display: "flex",
                    gap: "0.7rem",
                    color: "rgba(255,255,255,0.6)",
                    fontSize: "0.9rem",
                    lineHeight: 1.5,
                  }}>
                    <span style={{ flexShrink: 0 }}>{item.icon}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    background: "rgba(37,211,102,0.12)",
                    border: "1px solid rgba(37,211,102,0.3)",
                    color: "#25D366",
                    padding: "0.6rem 1.1rem",
                    borderRadius: "var(--radius)",
                    fontWeight: 600,
                    fontSize: "0.88rem",
                    textDecoration: "none",
                    transition: "all 0.2s",
                    marginTop: "0.3rem",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#25D366";
                    e.currentTarget.style.color = "white";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(37,211,102,0.12)";
                    e.currentTarget.style.color = "#25D366";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  +353 899 620 513
                </a>
              </div>
            </div>
          </div>

          {/* ── Bottom Bar ── */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
            marginTop: "1.8rem",
          }}>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.82rem" }}>
              © {new Date().getFullYear()} FoodbyEwa. All Rights Reserved. Made with ❤️ in Donegal.
            </p>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.82rem" }}>
              🇳🇬 Authentic Nigerian Home Cooking
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 600px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}