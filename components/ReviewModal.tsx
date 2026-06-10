

"use client";

import { useState } from "react";

const SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL!;

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerName: string;
}

export default function ReviewModal({ isOpen, onClose, customerName }: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;
    setSubmitting(true);

    try {
      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "saveReview",
          customer_name: customerName || "Anonymous",
          rating,
          review,
          date: new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.error("Review save error:", err);
    }

    setSubmitted(true);
    setSubmitting(false);

    // Auto-close after 3s
    setTimeout(() => {
      onClose();
      setSubmitted(false);
      setRating(0);
      setReview("");
    }, 3000);
  };

  const handleSkip = () => {
    onClose();
    setRating(0);
    setReview("");
    setSubmitted(false);
  };

  if (!isOpen) return null;

  const STAR_LABELS = ["", "Poor", "Fair", "Good", "Great", "Excellent!"];
  const activeRating = hoverRating || rating;

  return (
    <>
      {/* Overlay */}
      <div onClick={handleSkip} style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)",
        zIndex: 2000,
        animation: "fadeIn 0.3s ease",
      }} />

      {/* Modal */}
      <div style={{
        position: "fixed",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 2001,
        width: "100%", maxWidth: "440px",
        margin: "0 1rem",
        background: "var(--cream)",
        borderRadius: "1.5rem",
        overflow: "hidden",
        boxShadow: "0 24px 80px rgba(0,0,0,0.4)",
        animation: "slideUp 0.35s cubic-bezier(0.25,0.46,0.45,0.94)",
      }}>

        {submitted ? (
          // ── Success State ──
          <div style={{ padding: "3rem 2rem", textAlign: "center" }}>
            <div style={{
              width: "72px", height: "72px", borderRadius: "50%",
              background: "linear-gradient(135deg, var(--green), var(--green-light))",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "2rem", margin: "0 auto 1.2rem",
              boxShadow: "0 8px 30px rgba(27,67,50,0.3)",
            }}>
              ✅
            </div>
            <h3 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.4rem", fontWeight: 700,
              color: "var(--green-dark)", marginBottom: "0.5rem",
            }}>
              Thank You{customerName ? `, ${customerName.split(" ")[0]}` : ""}!
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", lineHeight: 1.6 }}>
              Your feedback means the world to Ewa. See you next time! 🍲
            </p>
            <div style={{ marginTop: "1.5rem", color: "var(--gold)", fontSize: "1.8rem", letterSpacing: "0.1em" }}>
              {"★".repeat(rating)}
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{
              background: "var(--green-dark)", padding: "1.5rem 1.8rem",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div>
                <h2 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.2rem", fontWeight: 700, color: "white",
                }}>
                  How was your order? 🍲
                </h2>
                <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.78rem", marginTop: "0.2rem" }}>
                  Your feedback helps Ewa improve
                </p>
              </div>
              <button onClick={handleSkip} style={{
                background: "rgba(255,255,255,0.1)", border: "none", color: "white",
                width: "32px", height: "32px", borderRadius: "50%",
                cursor: "pointer", fontSize: "1rem",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>✕</button>
            </div>

            {/* Body */}
            <div style={{ padding: "1.8rem" }}>

              {/* Star Rating */}
              <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                <p style={{
                  fontSize: "0.8rem", fontWeight: 700,
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  color: "var(--text-muted)", marginBottom: "0.8rem",
                }}>
                  Rate your experience
                </p>
                <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", marginBottom: "0.5rem" }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      style={{
                        background: "none", border: "none", cursor: "pointer",
                        fontSize: "2.2rem", padding: "0.1rem",
                        transition: "transform 0.15s ease",
                        transform: activeRating >= star ? "scale(1.15)" : "scale(1)",
                        filter: activeRating >= star
                          ? "drop-shadow(0 2px 6px rgba(212,160,23,0.5))"
                          : "none",
                      }}
                    >
                      <span style={{ color: activeRating >= star ? "var(--gold)" : "#ddd" }}>★</span>
                    </button>
                  ))}
                </div>
                {activeRating > 0 && (
                  <p style={{
                    fontSize: "0.85rem", fontWeight: 700,
                    color: activeRating >= 4 ? "var(--green)" : activeRating >= 3 ? "var(--gold-dark)" : "var(--terracotta)",
                    transition: "color 0.2s",
                  }}>
                    {STAR_LABELS[activeRating]}
                  </p>
                )}
              </div>

              {/* Review text */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{
                  display: "block", fontSize: "0.78rem", fontWeight: 700,
                  color: "var(--green-dark)", textTransform: "uppercase",
                  letterSpacing: "0.06em", marginBottom: "0.5rem",
                }}>
                  Tell us more (optional)
                </label>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="What did you love? Any suggestions for Ewa?"
                  rows={3}
                  maxLength={300}
                  style={{
                    width: "100%", padding: "0.75rem 1rem",
                    border: "1.5px solid rgba(27,67,50,0.2)",
                    borderRadius: "0.75rem", fontFamily: "inherit",
                    fontSize: "0.92rem", background: "white",
                    color: "var(--charcoal)", outline: "none",
                    resize: "none", transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--green)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(27,67,50,0.2)")}
                />
                <div style={{ textAlign: "right", fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.3rem" }}>
                  {review.length}/300
                </div>
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", gap: "0.8rem" }}>
                <button onClick={handleSkip} style={{
                  flex: 1, background: "none",
                  border: "1.5px solid rgba(27,67,50,0.15)",
                  color: "var(--text-muted)", padding: "0.75rem",
                  borderRadius: "var(--radius-full)", fontSize: "0.88rem",
                  fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                  transition: "all 0.2s",
                }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--green)"}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = "rgba(27,67,50,0.15)"}
                >
                  Skip
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={rating === 0 || submitting}
                  style={{
                    flex: 2,
                    background: rating === 0
                      ? "rgba(27,67,50,0.15)"
                      : "linear-gradient(135deg, var(--green), var(--green-light))",
                    color: rating === 0 ? "var(--text-muted)" : "white",
                    border: "none", padding: "0.75rem",
                    borderRadius: "var(--radius-full)",
                    fontSize: "0.92rem", fontWeight: 700,
                    cursor: rating === 0 ? "not-allowed" : "pointer",
                    fontFamily: "inherit", transition: "all 0.2s",
                    boxShadow: rating > 0 ? "0 4px 16px rgba(27,67,50,0.25)" : "none",
                  }}
                >
                  {submitting ? "Sending..." : "Submit Review ✓"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translate(-50%, calc(-50% + 30px)); }
          to   { opacity: 1; transform: translate(-50%, -50%); }
        }
      `}</style>
    </>
  );
}