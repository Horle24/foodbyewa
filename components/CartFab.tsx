// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//   FOODBYEWA — Floating Cart Button (FAB)
//   components/CartFab.tsx
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

interface CartFabProps {
  totalItems: number;
  onClick: () => void;
}

export default function CartFab({ totalItems, onClick }: CartFabProps) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      aria-label="Open cart"
      style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        zIndex: 9999,
        background: "var(--green)",
        color: "white",
        width: "62px",
        height: "62px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 8px 30px rgba(27,67,50,0.45)",
        border: "none",
        cursor: "pointer",
        transition: "all 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--green-light)";
        e.currentTarget.style.transform = "scale(1.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "var(--green)";
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      {/* Cart Icon */}
      <svg
        width="26"
        height="26"
        fill="none"
        stroke="white"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
      </svg>

      {/* Item Count Badge */}
      {totalItems > 0 && (
        <span
          style={{
            position: "absolute",
            top: "-4px",
            right: "-4px",
            background: "var(--gold)",
            color: "var(--green-dark)",
            width: "22px",
            height: "22px",
            borderRadius: "50%",
            fontSize: "0.72rem",
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            animation: "badgePop 0.2s ease",
            pointerEvents: "none",
          }}
        >
          {totalItems}
        </span>
      )}

      <style>{`
        @keyframes badgePop {
          0%   { transform: scale(0.5); opacity: 0; }
          70%  { transform: scale(1.2); }
          100% { transform: scale(1);   opacity: 1; }
        }
      `}</style>
    </button>
  );
}