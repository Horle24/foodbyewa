"use client";

import { useEffect, useState } from "react";
import { CartItem, DeliveryOption, DELIVERY_OPTIONS, buildWhatsAppMessage } from "@/lib/menuData";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER!;
const SCRIPT_URL      = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL!;

interface CartDrawerProps {
  cart:          CartItem[];
  onUpdateQty:   (id: number, delta: number) => void;
  onRemove:      (id: number) => void;
  onClose:       () => void;
  onClearCart:   () => void;   // ← NEW: clears cart after order
  isOpen:        boolean;
}

const TIMES = [
  "ASAP (as soon as possible)",
  "Lunch — 12pm to 2pm",
  "Dinner — 5pm to 8pm",
];

export default function CartDrawer({
  cart, onUpdateQty, onRemove, onClose, onClearCart, isOpen,
}: CartDrawerProps) {
  const [step,       setStep]       = useState<1 | 2 | 3>(1); // 3 = success
  const [delivery,   setDelivery]   = useState<DeliveryOption>(DELIVERY_OPTIONS[0]);
  const [submitting, setSubmitting] = useState(false);
  const [sheetError, setSheetError] = useState(false); // show sheet warning if it fails
  const [form, setForm] = useState({
    name: "", phone: "", whatsapp: "", address: "", time: TIMES[0], notes: "",
  });

  // Reset when drawer closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep(1);
        setSheetError(false);
        setForm({ name: "", phone: "", whatsapp: "", address: "", time: TIMES[0], notes: "" });
        setDelivery(DELIVERY_OPTIONS[0]);
      }, 400);
    }
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const total    = subtotal + delivery.fee;

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSendOrder = async () => {
    if (!form.name || !form.phone || !form.address) {
      alert("Please fill in your name, phone number, and delivery address.");
      return;
    }
    setSubmitting(true);
    setSheetError(false);

    const orderData = {
      customer_name:      form.name,
      customer_phone:     form.phone,
      customer_whatsapp:  form.whatsapp || form.phone,
      delivery_address:   form.address,
      items:              cart.map((c) => ({ id: c.id, name: c.name, qty: c.qty, price: c.price })),
      subtotal,
      delivery_fee:       delivery.fee,
      total,
      delivery_type:      delivery.value,
      delivery_label:     delivery.label,
      preferred_time:     form.time,
      special_notes:      form.notes,
      timestamp:          new Date().toISOString(),
    };

    // ── 1. Save to Google Sheet ──────────────────────────────
    
    if (SCRIPT_URL) {
      try {
        await fetch(SCRIPT_URL, {
          method:  "POST",
          mode:    "no-cors",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify(orderData),
        });
      } catch (err) {
        console.error("Google Sheet save failed:", err);
        setSheetError(true); // warn user but don't block WhatsApp
      }
    } else {
      console.warn("NEXT_PUBLIC_GOOGLE_SCRIPT_URL not set — skipping sheet save.");
    }

    // ── 2. Open WhatsApp ─────────────────────────────────────
    const message = buildWhatsAppMessage(cart, delivery, form);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      window.location.href = url;
    } else {
      window.open(url, "_blank");
    }

    // ── 3. Clear cart + show success screen ──────────────────
    onClearCart();      // empties the cart
    setSubmitting(false);
    setStep(3);         // show success step instead of closing immediately
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "0.72rem 1rem",
    border: "1.5px solid rgba(27,67,50,0.2)",
    borderRadius: "0.75rem", fontFamily: "inherit",
    fontSize: "16px", background: "white",
    color: "var(--charcoal)", outline: "none",
    transition: "border-color 0.2s", WebkitAppearance: "none",
  };
  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: "0.75rem", fontWeight: 700,
    color: "var(--green-dark)", textTransform: "uppercase",
    letterSpacing: "0.06em", marginBottom: "0.4rem",
  };

  return (
    <>
      {/* Overlay */}
      <div onClick={step === 3 ? undefined : onClose} style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.55)", backdropFilter: "blur(3px)",
        zIndex: 1000,
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? "all" : "none",
        transition: "opacity 0.35s ease",
      }} />

      {/* Drawer */}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0,
        width: "100%", maxWidth: "460px",
        background: "var(--cream)", zIndex: 1001,
        transform: isOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94)",
        display: "flex", flexDirection: "column", overflow: "hidden",
      }}>

        {/* ── Header ── */}
        <div style={{
          background: "var(--green-dark)", color: "white",
          padding: "1.2rem 1.5rem",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexShrink: 0,
        }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700 }}>
            {step === 1 ? "🛒 Your Order" : step === 2 ? "📋 Delivery Details" : "✅ Order Confirmed!"}
          </h2>
          {step !== 3 && (
            <button onClick={onClose} style={{
              background: "rgba(255,255,255,0.15)", border: "none", color: "white",
              width: "34px", height: "34px", borderRadius: "50%", cursor: "pointer",
              fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center",
            }}>✕</button>
          )}
        </div>

        {/* ── Step bar (hidden on success) ── */}
        {step !== 3 && (
          <div style={{
            display: "flex", background: "var(--green)",
            padding: "0.5rem 1.5rem", gap: "0.5rem", alignItems: "center", flexShrink: 0,
          }}>
            {[1, 2].map((s) => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <div style={{
                  width: "22px", height: "22px", borderRadius: "50%",
                  background: step >= s ? "var(--gold)" : "rgba(255,255,255,0.2)",
                  color: step >= s ? "var(--green-dark)" : "rgba(255,255,255,0.5)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.72rem", fontWeight: 800, transition: "all 0.3s",
                }}>{s}</div>
                <span style={{ fontSize: "0.72rem", color: step >= s ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)", fontWeight: step === s ? 600 : 400 }}>
                  {s === 1 ? "Cart" : "Delivery"}
                </span>
                {s < 2 && <div style={{ width: "24px", height: "1px", background: "rgba(255,255,255,0.2)", margin: "0 0.2rem" }} />}
              </div>
            ))}
          </div>
        )}

        {/* ── Body ── */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1.2rem", WebkitOverflowScrolling: "touch" as any }}>

          {/* ━━━ STEP 1 — CART ━━━ */}
          {step === 1 && (
            <>
              {cart.length === 0 ? (
                <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--text-muted)" }}>
                  <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>🍽️</div>
                  <p style={{ fontWeight: 600, marginBottom: "0.4rem" }}>Your cart is empty</p>
                  <p style={{ fontSize: "0.88rem" }}>Add meals from the menu!</p>
                  <a href="#menu" onClick={onClose} style={{
                    display: "inline-block", marginTop: "1rem",
                    color: "var(--green)", fontWeight: 700, textDecoration: "none", fontSize: "0.92rem",
                  }}>Browse Menu →</a>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} style={{
                    display: "flex", alignItems: "center", gap: "0.8rem",
                    background: "white", borderRadius: "var(--radius)",
                    padding: "0.85rem", marginBottom: "0.7rem",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                  }}>
                    <img src={item.img} alt={item.name} style={{
                      width: "58px", height: "58px", borderRadius: "0.6rem",
                      objectFit: "cover", flexShrink: 0,
                    }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: "0.88rem", color: "var(--green-dark)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {item.name}
                      </div>
                      <div style={{ color: "var(--terracotta)", fontWeight: 700, fontSize: "0.9rem", margin: "0.15rem 0" }}>
                        €{(item.price * item.qty).toFixed(2)}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        {[{ delta: -1, label: "−" }, { delta: 1, label: "+" }].map(({ delta, label }, i) => (
                          <button key={i} onClick={() => onUpdateQty(item.id, delta)} style={{
                            width: "28px", height: "28px", borderRadius: "50%",
                            background: "var(--cream)", border: "1px solid rgba(27,67,50,0.2)",
                            cursor: "pointer", fontSize: "1rem",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "var(--green-dark)", fontWeight: 700,
                          }}>{label}</button>
                        ))}
                        <span style={{ fontWeight: 700, fontSize: "0.88rem", minWidth: "18px", textAlign: "center" }}>{item.qty}</span>
                      </div>
                    </div>
                    <button onClick={() => onRemove(item.id)} style={{
                      background: "none", border: "none", cursor: "pointer",
                      fontSize: "1rem", color: "#ccc", padding: "0.2rem", flexShrink: 0,
                    }}>🗑</button>
                  </div>
                ))
              )}
            </>
          )}

          {/* ━━━ STEP 2 — FORM ━━━ */}
          {step === 2 && (
            <div>
              <button onClick={() => setStep(1)} style={{
                display: "flex", alignItems: "center", gap: "0.4rem",
                background: "none", border: "1.5px solid rgba(27,67,50,0.2)",
                color: "var(--text-muted)", padding: "0.45rem 0.9rem",
                borderRadius: "var(--radius-full)", fontSize: "0.85rem",
                fontWeight: 600, cursor: "pointer", marginBottom: "1rem", fontFamily: "inherit",
              }}>← Back</button>

              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: "var(--green-dark)", fontWeight: 700, marginBottom: "0.3rem" }}>
                Complete Your Order
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.83rem", marginBottom: "1.2rem" }}>
                Fill in your details — your order goes straight to Ewa on WhatsApp.
              </p>

              {[
                { label: "Full Name *",               name: "name",     type: "text", placeholder: "Your full name"      },
                { label: "Phone Number *",             name: "phone",    type: "tel",  placeholder: "+353 8X XXX XXXX"    },
                { label: "WhatsApp (if different)",    name: "whatsapp", type: "tel",  placeholder: "+353 8X XXX XXXX"    },
              ].map((field) => (
                <div key={field.name} style={{ marginBottom: "0.9rem" }}>
                  <label style={labelStyle}>{field.label}</label>
                  <input type={field.type} name={field.name}
                    value={form[field.name as keyof typeof form]}
                    onChange={handleFormChange} placeholder={field.placeholder}
                    style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--green)")}
                    onBlur={(e)  => (e.currentTarget.style.borderColor = "rgba(27,67,50,0.2)")}
                  />
                </div>
              ))}

              <div style={{ marginBottom: "0.9rem" }}>
                <label style={labelStyle}>Delivery Address *</label>
                <textarea name="address" value={form.address} onChange={handleFormChange}
                  placeholder="Full address in Letterkenny / Donegal..." rows={3}
                  style={{ ...inputStyle, resize: "vertical" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--green)")}
                  onBlur={(e)  => (e.currentTarget.style.borderColor = "rgba(27,67,50,0.2)")}
                />
              </div>

              <div style={{ marginBottom: "0.9rem" }}>
                <label style={labelStyle}>Delivery Option *</label>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {DELIVERY_OPTIONS.map((opt) => (
                    <label key={opt.value} style={{
                      display: "flex", alignItems: "center", gap: "0.7rem",
                      background: delivery.value === opt.value ? "rgba(27,67,50,0.04)" : "white",
                      border: `1.5px solid ${delivery.value === opt.value ? "var(--green)" : "rgba(27,67,50,0.15)"}`,
                      borderRadius: "0.75rem", padding: "0.75rem 0.9rem", cursor: "pointer",
                    }}>
                      <input type="radio" name="delivery" value={opt.value}
                        checked={delivery.value === opt.value} onChange={() => setDelivery(opt)}
                        style={{ accentColor: "var(--green)", width: "16px", height: "16px" }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: "0.88rem", color: "var(--green-dark)" }}>{opt.label}</div>
                        <div style={{ fontSize: "0.78rem", color: "var(--terracotta)", fontWeight: 700 }}>
                          {opt.fee === 0 ? "FREE" : `+ €${opt.fee.toFixed(2)}`}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: "0.9rem" }}>
                <label style={labelStyle}>Preferred Time</label>
                <select name="time" value={form.time} onChange={handleFormChange} style={inputStyle}>
                  {TIMES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: "0.9rem" }}>
                <label style={labelStyle}>Special Instructions / Allergies</label>
                <textarea name="notes" value={form.notes} onChange={handleFormChange}
                  placeholder="Any special requests or allergies..." rows={2}
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </div>

              {/* Order Summary */}
              <div style={{ background: "var(--green-dark)", borderRadius: "var(--radius)", padding: "1rem", marginBottom: "0.5rem" }}>
                <div style={{ fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: "0.7rem" }}>
                  Order Summary
                </div>
                {cart.map((c) => (
                  <div key={c.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.83rem", color: "rgba(255,255,255,0.82)", padding: "0.18rem 0" }}>
                    <span>{c.name} x{c.qty}</span>
                    <span>€{(c.price * c.qty).toFixed(2)}</span>
                  </div>
                ))}
                <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.1)", margin: "0.6rem 0" }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.83rem", color: "rgba(255,255,255,0.65)", marginBottom: "0.3rem" }}>
                  <span>Delivery</span>
                  <span>{delivery.fee === 0 ? "FREE" : `€${delivery.fee.toFixed(2)}`}</span>
                </div>
                <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.1)", margin: "0.6rem 0" }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: "var(--gold)" }}>
                  <span>Total</span><span>€{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Sheet error warning */}
              {sheetError && (
                <div style={{
                  background: "rgba(255,160,0,0.1)", border: "1px solid rgba(255,160,0,0.35)",
                  borderRadius: "0.75rem", padding: "0.75rem 1rem",
                  fontSize: "0.8rem", color: "#b45000", marginTop: "0.5rem",
                }}>
                  ⚠️ Order log failed — but your WhatsApp order still went through fine.
                </div>
              )}
            </div>
          )}

          {/* ━━━ STEP 3 — SUCCESS ━━━ */}
          {step === 3 && (
            <div style={{ textAlign: "center", padding: "2.5rem 1rem" }}>
              {/* Animated checkmark */}
              <div style={{
                width: "80px", height: "80px", borderRadius: "50%",
                background: "linear-gradient(135deg, var(--green), var(--green-dark))",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 1.5rem",
                boxShadow: "0 8px 32px rgba(27,67,50,0.35)",
                animation: "popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)",
              }}>
                <span style={{ fontSize: "2.2rem" }}>✅</span>
              </div>

              <h3 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.6rem", fontWeight: 700,
                color: "var(--green-dark)", marginBottom: "0.5rem",
              }}>
                Order Sent!
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.75, marginBottom: "1.5rem" }}>
                Your order has been sent to Ewa on WhatsApp. She'll confirm your order and delivery shortly. 🍲
              </p>

              {sheetError && (
                <p style={{ fontSize: "0.78rem", color: "#b45000", marginBottom: "1rem" }}>
                  ⚠️ Note: Order log to Google Sheet failed, but your WhatsApp message went through fine.
                </p>
              )}

              {/* Order recap */}
              <div style={{
                background: "white", borderRadius: "var(--radius)",
                padding: "1rem 1.2rem", marginBottom: "1.5rem",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)", textAlign: "left",
              }}>
                <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--green)", marginBottom: "0.6rem" }}>
                  Your Order
                </p>
                {/* We store the last order in a ref so it shows after cart is cleared */}
                <p style={{ fontSize: "0.85rem", color: "var(--charcoal)", lineHeight: 1.7 }}>
                  <strong>{form.name}</strong><br />
                  📞 {form.phone}<br />
                  📍 {form.address}<br />
                  🚗 {delivery.label}<br />
                  ⏰ {form.time}
                </p>
              </div>

              <style>{`
                @keyframes popIn {
                  0%   { transform: scale(0.5); opacity: 0; }
                  100% { transform: scale(1);   opacity: 1; }
                }
              `}</style>
            </div>
          )}
        </div>

        {/* ── Footer CTA ── */}
        <div style={{
          background: "white", borderTop: "1px solid rgba(27,67,50,0.1)",
          padding: "1rem 1.2rem", flexShrink: 0,
        }}>
          {step === 1 && (
            <>
              {cart.length > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.92rem", color: "var(--text-muted)", marginBottom: "0.7rem" }}>
                  <span>Subtotal</span>
                  <strong style={{ color: "var(--green-dark)", fontFamily: "'Playfair Display', serif", fontSize: "1.15rem" }}>
                    €{subtotal.toFixed(2)}
                  </strong>
                </div>
              )}
              <button
                onClick={() => cart.length > 0 && setStep(2)}
                disabled={cart.length === 0}
                style={{
                  width: "100%",
                  background: cart.length === 0 ? "rgba(27,67,50,0.15)" : "var(--green)",
                  color: "white", padding: "0.95rem", borderRadius: "var(--radius-full)",
                  fontSize: "0.95rem", fontWeight: 700, border: "none",
                  cursor: cart.length === 0 ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem",
                  fontFamily: "inherit",
                }}>
                Continue to Delivery Details →
              </button>
            </>
          )}

          {step === 2 && (
            <button
              onClick={handleSendOrder}
              disabled={submitting}
              style={{
                width: "100%",
                background: submitting ? "rgba(37,211,102,0.6)" : "linear-gradient(135deg, #25D366, #128C7E)",
                color: "white", padding: "1rem", borderRadius: "var(--radius-full)",
                fontSize: "1rem", fontWeight: 800, border: "none",
                cursor: submitting ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem",
                fontFamily: "inherit",
                boxShadow: "0 6px 24px rgba(37,211,102,0.35)",
                WebkitTapHighlightColor: "transparent", touchAction: "manipulation",
              }}>
              {submitting ? "Sending your order…" : (
                <>
                  <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.859L0 24l6.335-1.521A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.819 9.819 0 01-5.006-1.367l-.359-.213-3.721.893.926-3.619-.234-.372A9.79 9.79 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182c5.43 0 9.818 4.388 9.818 9.818 0 5.43-4.388 9.818-9.818 9.818z"/>
                  </svg>
                  Send Order on WhatsApp
                </>
              )}
            </button>
          )}

          {step === 3 && (
            <button
              onClick={onClose}
              style={{
                width: "100%", background: "var(--green-dark)", color: "white",
                padding: "0.95rem", borderRadius: "var(--radius-full)",
                fontSize: "0.95rem", fontWeight: 700, border: "none", cursor: "pointer",
                fontFamily: "inherit",
              }}>
              Back to Menu 🍲
            </button>
          )}
        </div>
      </div>
    </>
  );
}