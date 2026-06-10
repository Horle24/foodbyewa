"use client";

import { useEffect, useState, useCallback } from "react";
import Hero from "@/components/Hero";
import WhyUs from "@/components/WhyUs";
import Menu from "@/components/Menu";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import CartFab from "@/components/CartFab";
import { CartItem, MenuItem } from "@/lib/menuData";

export default function Home() {
  const [cart, setCart]               = useState<CartItem[]>([]);
  const [drawerOpen, setDrawerOpen]   = useState(false);
  const [toast, setToast]             = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    const handler = () => setDrawerOpen(true);
    document.addEventListener("openCart", handler);
    return () => document.removeEventListener("openCart", handler);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  }, []);

  const handleAddToCart = useCallback((item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) return prev.map((c) => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, qty: 1 }];
    });
    showToast(`🍲 ${item.name} added!`);
  }, [showToast]);

  const handleUpdateQty = useCallback((id: number, delta: number) => {
    setCart((prev) =>
      prev.map((c) => c.id === id ? { ...c, qty: c.qty + delta } : c).filter((c) => c.qty > 0)
    );
  }, []);

  const handleRemove = useCallback((id: number) => {
    setCart((prev) => prev.filter((c) => c.id !== id));
  }, []);

  // clears the entire cart (called after order is sent)
  const handleClearCart = useCallback(() => {
    setCart([]);
  }, []);

  const totalItems = cart.reduce((s, c) => s + c.qty, 0);

  return (
    <>
      {/* ━━━ SECTIONS ━━━ */}
      <Hero />
      <WhyUs />
      <Menu cart={cart} onAddToCart={handleAddToCart} />
      <About />
      <Testimonials />
      <Footer />

      {/* ━━━ FLOATING CART ━━━ */}
      <CartFab
        totalItems={totalItems}
        onClick={() => setDrawerOpen(true)}
        isOpen={drawerOpen}
      />

      {/* ── CART DRAWER ── */}
      <CartDrawer
        cart={cart}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onUpdateQty={handleUpdateQty}
        onRemove={handleRemove}
        onClearCart={handleClearCart}
      />

      {/* ━━━ TOAST ━━━ */}
      <div className={`toast ${toastVisible ? "show" : ""}`}>{toast}</div>
    </>
  );
}