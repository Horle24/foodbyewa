"use client";

interface CartFabProps {
  totalItems: number;
  onClick: () => void;
  isOpen: boolean;
}

export default function CartFab({ totalItems, onClick, isOpen }: CartFabProps) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      aria-label="Open cart"
      style={{
        position: "fixed", bottom: "1.5rem", right: "1.5rem",
        zIndex: 799,
        background: "var(--green)", color: "white",
        width: "58px", height: "58px", borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 8px 30px rgba(27,67,50,0.45)",
        border: "none", cursor: "pointer",
        transition: "opacity 0.3s ease, transform 0.3s ease",
        opacity: isOpen ? 0 : 1,
        pointerEvents: isOpen ? "none" : "all",
        transform: isOpen ? "scale(0.7)" : "scale(1)",
      }}
    >
      <svg width="24" height="24" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
      </svg>
      {totalItems > 0 && (
        <span style={{
          position: "absolute", top: "-4px", right: "-4px",
          background: "var(--gold)", color: "var(--green-dark)",
          width: "21px", height: "21px", borderRadius: "50%",
          fontSize: "0.7rem", fontWeight: 800,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)", pointerEvents: "none",
        }}>
          {totalItems}
        </span>
      )}
    </button>
  );
}