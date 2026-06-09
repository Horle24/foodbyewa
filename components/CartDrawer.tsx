// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//   FOODBYEWA — Cart Drawer Component
//   components/CartDrawer.tsx
//   Step 1: Cart review
//   Step 2: Delivery form
//   On submit: saves to Google Sheet + opens WhatsApp
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useEffect, useState } from "react";
import { CartItem, DeliveryOption, DELIVERY_OPTIONS, buildWhatsAppMessage } from "@/lib/menuData";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER!;

interface CartDrawerProps {
  cart: CartItem[];
  onUpdateQty: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
  onClose: () => void;
  isOpen: boolean;
}

const TIMES = [
  "ASAP (as soon as possible)",
  "Lunch — 12pm to 2pm",
  "Dinner — 5pm to 8pm",
];

export default function CartDrawer({
  cart,
  onUpdateQty,
  onRemove,
  onClose,
  isOpen,
}: CartDrawerProps) {
  const [step, setStep] = useState(1);
  const [delivery, setDelivery] = useState<DeliveryOption>(DELIVERY_OPTIONS[0]);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    whatsapp: "",
    address: "",
    time: TIMES[0],
    notes: "",
  });

  // Reset to step 1 when drawer closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setStep(1), 400);
    }
  }, [isOpen]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
  }, [isOpen]);

  const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const total = subtotal + delivery.fee;

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSendOrder = async () => {
    if (!form.name || !form.phone || !form.address) {
      alert("Please fill in your name, phone, and delivery address.");
      return;
    }

    setSubmitting(true);

    try {
      // 1. Save order to Google Sheet via API route
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: form.name,
          customer_phone: form.phone,
          customer_whatsapp: form.whatsapp || form.phone,
          delivery_address: form.address,
          items: cart.map((c) => ({
            id: c.id,
            name: c.name,
            qty: c.qty,
            price: c.price,
          })),
          subtotal,
          delivery_fee: delivery.fee,
          total,
          delivery_type: delivery.value,
          delivery_label: delivery.label,
          preferred_time: form.time,
          special_notes: form.notes,
        }),
      });
    } catch {
      // Don't block WhatsApp if sheet save fails
      console.error("Sheet save failed — continuing to WhatsApp.");
    }

    // 2. Build WhatsApp message and open
    const message = buildWhatsAppMessage(cart, delivery, form);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");

    setSubmitting(false);
    onClose();
  };

  return (
    <>
      {/* ── Overlay ── */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(3px)",
          zIndex: 1000,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "all" : "none",
          transition: "opacity 0.35s ease",
        }}
      />

      {/* ── Drawer ── */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          maxWidth: "480px",
          background: "var(--cream)",
          zIndex: 1001,
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div style={{
          background: "var(--green-dark)",
          color: "white",
          padding: "1.5rem 1.8rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.3rem",
            fontWeight: 700,
          }}>
            {step === 1 ? "🛒 Your Order" : "📋 Delivery Details"}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "none",
              color: "white",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              cursor: "pointer",
              fontSize: "1.1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.25)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
          >
            ✕
          </button>
        </div>

        {/* Step indicator */}
        <div style={{
          display: "flex",
          background: "var(--green)",
          padding: "0.6rem 1.8rem",
          gap: "0.5rem",
          alignItems: "center",
          flexShrink: 0,
        }}>
          {[1, 2].map((s) => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                background: step >= s ? "var(--gold)" : "rgba(255,255,255,0.2)",
                color: step >= s ? "var(--green-dark)" : "rgba(255,255,255,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.75rem",
                fontWeight: 800,
                transition: "all 0.3s",
              }}>
                {s}
              </div>
              <span style={{
                fontSize: "0.75rem",
                color: step >= s ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)",
                fontWeight: step === s ? 600 : 400,
              }}>
                {s === 1 ? "Cart" : "Delivery"}
              </span>
              {s < 2 && (
                <div style={{
                  width: "30px",
                  height: "1px",
                  background: "rgba(255,255,255,0.2)",
                  margin: "0 0.2rem",
                }} />
              )}
            </div>
          ))}
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>

          {/* ━━━ STEP 1 — CART ━━━ */}
          {step === 1 && (
            <>
              {cart.length === 0 ? (
                <div style={{
                  textAlign: "center",
                  padding: "3rem 1rem",
                  color: "var(--text-muted)",
                }}>
                  <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🍽️</div>
                  <p style={{ fontWeight: 600, marginBottom: "0.5rem" }}>Your cart is empty</p>
                  <p style={{ fontSize: "0.9rem" }}>Add some delicious meals from the menu!</p>
                  <a
                    href="#menu"
                    onClick={onClose}
                    style={{
                      display: "inline-block",
                      marginTop: "1.2rem",
                      color: "var(--green)",
                      fontWeight: 700,
                      textDecoration: "none",
                      fontSize: "0.95rem",
                    }}
                  >
                    Browse Menu →
                  </a>
                </div>
              ) : (
                <>
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        background: "white",
                        borderRadius: "var(--radius)",
                        padding: "1rem",
                        marginBottom: "0.8rem",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                      }}
                    >
                      <img
                        src={item.img}
                        alt={item.name}
                        style={{
                          width: "64px",
                          height: "64px",
                          borderRadius: "0.7rem",
                          objectFit: "cover",
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontWeight: 600,
                          fontSize: "0.95rem",
                          color: "var(--green-dark)",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}>
                          {item.name}
                        </div>
                        <div style={{
                          color: "var(--terracotta)",
                          fontWeight: 700,
                          fontSize: "0.95rem",
                          margin: "0.2rem 0",
                        }}>
                          €{(item.price * item.qty).toFixed(2)}
                        </div>
                        {/* Qty controls */}
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          {[
                            { delta: -1, label: "−" },
                            { delta: 1, label: "+" },
                          ].map(({ delta, label }, i) => (
                            <button
                              key={i}
                              onClick={() => onUpdateQty(item.id, delta)}
                              style={{
                                width: "26px",
                                height: "26px",
                                borderRadius: "50%",
                                background: "var(--cream)",
                                border: "1px solid rgba(27,67,50,0.2)",
                                cursor: "pointer",
                                fontSize: "1rem",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "var(--green-dark)",
                                fontWeight: 700,
                                transition: "all 0.2s",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = "var(--gold)";
                                e.currentTarget.style.borderColor = "var(--gold)";
                                e.currentTarget.style.color = "var(--green-dark)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = "var(--cream)";
                                e.currentTarget.style.borderColor = "rgba(27,67,50,0.2)";
                                e.currentTarget.style.color = "var(--green-dark)";
                              }}
                            >
                              {label}
                            </button>
                          ))}
                          <span style={{ fontWeight: 700, fontSize: "0.9rem", minWidth: "20px", textAlign: "center" }}>
                            {item.qty}
                          </span>
                        </div>
                      </div>
                      {/* Remove */}
                      <button
                        onClick={() => onRemove(item.id)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "1.1rem",
                          color: "#ccc",
                          padding: "0.2rem",
                          transition: "color 0.2s",
                          flexShrink: 0,
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--terracotta)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#ccc")}
                      >
                        🗑
                      </button>
                    </div>
                  ))}
                </>
              )}
            </>
          )}

          {/* ━━━ STEP 2 — ORDER FORM ━━━ */}
          {step === 2 && (
            <div>
              <button
                onClick={() => setStep(1)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  background: "none",
                  border: "1.5px solid rgba(27,67,50,0.2)",
                  color: "var(--text-muted)",
                  padding: "0.5rem 1rem",
                  borderRadius: "var(--radius-full)",
                  fontSize: "0.88rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  marginBottom: "1.2rem",
                  fontFamily: "inherit",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--green)";
                  e.currentTarget.style.color = "var(--green)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(27,67,50,0.2)";
                  e.currentTarget.style.color = "var(--text-muted)";
                }}
              >
                ← Back to Cart
              </button>

              <h3 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.3rem",
                color: "var(--green-dark)",
                fontWeight: 700,
                marginBottom: "0.3rem",
              }}>
                Complete Your Order
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.87rem", marginBottom: "1.5rem" }}>
                Fill in your details and we&apos;ll send your order straight to Ewa on WhatsApp.
              </p>

              {/* Form Fields */}
              {[
                { label: "Full Name *", name: "name", type: "text", placeholder: "Your full name" },
                { label: "Phone Number *", name: "phone", type: "tel", placeholder: "+353 8X XXX XXXX" },
                { label: "WhatsApp Number (if different)", name: "whatsapp", type: "tel", placeholder: "+353 8X XXX XXXX" },
              ].map((field) => (
                <div key={field.name} style={{ marginBottom: "1rem" }}>
                  <label style={{
                    display: "block",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    color: "var(--green-dark)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: "0.4rem",
                  }}>
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={form[field.name as keyof typeof form]}
                    onChange={handleFormChange}
                    placeholder={field.placeholder}
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      border: "1.5px solid rgba(27,67,50,0.2)",
                      borderRadius: "0.75rem",
                      fontFamily: "inherit",
                      fontSize: "0.95rem",
                      background: "white",
                      color: "var(--charcoal)",
                      outline: "none",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--green)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(27,67,50,0.2)")}
                  />
                </div>
              ))}

              {/* Address */}
              <div style={{ marginBottom: "1rem" }}>
                <label style={{
                  display: "block",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  color: "var(--green-dark)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: "0.4rem",
                }}>
                  Delivery Address *
                </label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleFormChange}
                  placeholder="Full delivery address in Letterkenny / Donegal..."
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    border: "1.5px solid rgba(27,67,50,0.2)",
                    borderRadius: "0.75rem",
                    fontFamily: "inherit",
                    fontSize: "0.95rem",
                    background: "white",
                    color: "var(--charcoal)",
                    outline: "none",
                    resize: "vertical",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--green)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(27,67,50,0.2)")}
                />
              </div>

              {/* Delivery Options */}
              <div style={{ marginBottom: "1rem" }}>
                <label style={{
                  display: "block",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  color: "var(--green-dark)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: "0.6rem",
                }}>
                  Delivery Option *
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {DELIVERY_OPTIONS.map((opt) => (
                    <label
                      key={opt.value}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.8rem",
                        background: "white",
                        border: `1.5px solid ${delivery.value === opt.value ? "var(--green)" : "rgba(27,67,50,0.15)"}`,
                        borderRadius: "0.75rem",
                        padding: "0.8rem 1rem",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        background: delivery.value === opt.value ? "rgba(27,67,50,0.04)" : "white",
                      }}
                    >
                      <input
                        type="radio"
                        name="delivery"
                        value={opt.value}
                        checked={delivery.value === opt.value}
                        onChange={() => setDelivery(opt)}
                        style={{ accentColor: "var(--green)", width: "16px", height: "16px" }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--green-dark)" }}>
                          {opt.label}
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "var(--terracotta)", fontWeight: 700 }}>
                          {opt.fee === 0 ? "FREE" : `+ €${opt.fee.toFixed(2)}`}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Preferred Time */}
              <div style={{ marginBottom: "1rem" }}>
                <label style={{
                  display: "block",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  color: "var(--green-dark)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: "0.4rem",
                }}>
                  Preferred Delivery Time
                </label>
                <select
                  name="time"
                  value={form.time}
                  onChange={handleFormChange}
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    border: "1.5px solid rgba(27,67,50,0.2)",
                    borderRadius: "0.75rem",
                    fontFamily: "inherit",
                    fontSize: "0.95rem",
                    background: "white",
                    color: "var(--charcoal)",
                    outline: "none",
                  }}
                >
                  {TIMES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>

              {/* Special Notes */}
              <div style={{ marginBottom: "1rem" }}>
                <label style={{
                  display: "block",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  color: "var(--green-dark)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: "0.4rem",
                }}>
                  Special Instructions / Allergies
                </label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleFormChange}
                  placeholder="Any special requests, allergies, or notes..."
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    border: "1.5px solid rgba(27,67,50,0.2)",
                    borderRadius: "0.75rem",
                    fontFamily: "inherit",
                    fontSize: "0.95rem",
                    background: "white",
                    color: "var(--charcoal)",
                    outline: "none",
                    resize: "vertical",
                  }}
                />
              </div>

              {/* Order Summary Box */}
              <div style={{
                background: "var(--green-dark)",
                borderRadius: "var(--radius)",
                padding: "1.2rem",
                marginBottom: "1rem",
              }}>
                <div style={{
                  fontSize: "0.75rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.55)",
                  marginBottom: "0.8rem",
                }}>
                  Order Summary
                </div>
                {cart.map((c) => (
                  <div key={c.id} style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.87rem",
                    color: "rgba(255,255,255,0.82)",
                    padding: "0.2rem 0",
                  }}>
                    <span>{c.name} x{c.qty}</span>
                    <span>€{(c.price * c.qty).toFixed(2)}</span>
                  </div>
                ))}
                <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.12)", margin: "0.7rem 0" }} />
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.87rem",
                  color: "rgba(255,255,255,0.7)",
                  marginBottom: "0.4rem",
                }}>
                  <span>Delivery</span>
                  <span>{delivery.fee === 0 ? "FREE" : `€${delivery.fee.toFixed(2)}`}</span>
                </div>
                <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.12)", margin: "0.7rem 0" }} />
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.15rem",
                  fontWeight: 700,
                  color: "var(--gold)",
                }}>
                  <span>Total</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Footer CTA ── */}
        <div style={{
          background: "white",
          borderTop: "1px solid rgba(27,67,50,0.1)",
          padding: "1.2rem 1.5rem",
          flexShrink: 0,
        }}>
          {step === 1 ? (
            <>
              {cart.length > 0 && (
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.95rem",
                  color: "var(--text-muted)",
                  marginBottom: "0.8rem",
                }}>
                  <span>Subtotal</span>
                  <strong style={{
                    color: "var(--green-dark)",
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.2rem",
                  }}>
                    €{subtotal.toFixed(2)}
                  </strong>
                </div>
              )}
              <button
                onClick={() => cart.length > 0 && setStep(2)}
                disabled={cart.length === 0}
                style={{
                  width: "100%",
                  background: cart.length === 0 ? "rgba(27,67,50,0.2)" : "var(--green)",
                  color: "white",
                  padding: "1rem",
                  borderRadius: "var(--radius-full)",
                  fontSize: "1rem",
                  fontWeight: 700,
                  border: "none",
                  cursor: cart.length === 0 ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  transition: "all 0.25s",
                  fontFamily: "inherit",
                }}
              >
                Continue to Delivery Details →
              </button>
            </>
          ) : (
            <button
              onClick={handleSendOrder}
              disabled={submitting}
              className="btn-whatsapp"
              style={{ fontFamily: "inherit" }}
            >
              {submitting ? (
                "Sending..."
              ) : (
                <>
                  <svg width="22" height="22" fill="white" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.859L0 24l6.335-1.521A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.819 9.819 0 01-5.006-1.367l-.359-.213-3.721.893.926-3.619-.234-.372A9.79 9.79 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182c5.43 0 9.818 4.388 9.818 9.818 0 5.43-4.388 9.818-9.818 9.818z"/>
                  </svg>
                  Send Order on WhatsApp
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </>
  );
}