
"use client";

import { useEffect, useState, useCallback } from "react";
import Hero from "../components/Hero";
import WhyUs from "../components/WhyUs";
import Menu from "../components/Menu";
import About from "../components/About";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";
import CartDrawer from "../components/CartDrawer";
import CartFab from "../components/CartFab";
import { CartItem, MenuItem } from "../lib/menuData";

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  // ── Listen for openCart events (Navbar, Hero, Footer) ──
  useEffect(() => {
    const handler = () => setDrawerOpen(true);
    document.addEventListener("openCart", handler);
    return () => document.removeEventListener("openCart", handler);
  }, []);

  // ── Global scroll reveal ──
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // ── Toast ──
  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  }, []);

  // ── Add to cart ──
  const handleAddToCart = useCallback(
    (item: MenuItem) => {
      setCart((prev) => {
        const existing = prev.find((c) => c.id === item.id);
        if (existing) {
          return prev.map((c) =>
            c.id === item.id ? { ...c, qty: c.qty + 1 } : c
          );
        }
        return [...prev, { ...item, qty: 1 }];
      });
      showToast(`🍲 ${item.name} added to order!`);
    },
    [showToast]
  );

  // ── Update qty ──
  const handleUpdateQty = useCallback((id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) => (c.id === id ? { ...c, qty: c.qty + delta } : c))
        .filter((c) => c.qty > 0)
    );
  }, []);

  // ── Remove item ──
  const handleRemove = useCallback((id: number) => {
    setCart((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const totalItems = cart.reduce((s, c) => s + c.qty, 0);

  return (
    <>
      {/* ━━━ PAGE SECTIONS ━━━ */}
      <Hero />
      <WhyUs />
      <Menu cart={cart} onAddToCart={handleAddToCart} />
      <About />
      <Testimonials />
      <Footer />

      {/* ━━━ FLOATING CART BUTTON ━━━ */}
      <CartFab
        totalItems={totalItems}
        onClick={() => setDrawerOpen(true)}
      />

      {/* ━━━ CART DRAWER ━━━ */}
      <CartDrawer
        cart={cart}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onUpdateQty={handleUpdateQty}
        onRemove={handleRemove}
      />

      {/* ━━━ TOAST NOTIFICATION ━━━ */}
      <div className={`toast ${toastVisible ? "show" : ""}`}>
        {toast}
      </div>
    </>
  );
}