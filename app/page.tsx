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
import ReviewModal from "@/components/ReviewModal";
import { CartItem, MenuItem } from "@/lib/menuData";

export default function Home() {
  const [cart, setCart]                         = useState<CartItem[]>([]);
  const [drawerOpen, setDrawerOpen]             = useState(false);
  const [toast, setToast]                       = useState("");
  const [toastVisible, setToastVisible]         = useState(false);
  const [reviewOpen, setReviewOpen]             = useState(false);
  const [lastCustomerName, setLastCustomerName] = useState("");

  // Listen for openCart events from Navbar, Hero, Footer
  useEffect(() => {
    const handler = () => setDrawerOpen(true);
    document.addEventListener("openCart", handler);
    return () => document.removeEventListener("openCart", handler);
  }, []);

  // Global scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("visible");
      }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Toast
  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  }, []);

  // Add to cart
  const handleAddToCart = useCallback((item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) {
        return prev.map((c) => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      }
      return [...prev, { ...item, qty: 1 }];
    });
    showToast(`🍲 ${item.name} added!`);
  }, [showToast]);

  // Update qty
  const handleUpdateQty = useCallback((id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) => c.id === id ? { ...c, qty: c.qty + delta } : c)
        .filter((c) => c.qty > 0)
    );
  }, []);

  // Remove item
  const handleRemove = useCallback((id: number) => {
    setCart((prev) => prev.filter((c) => c.id !== id));
  }, []);

  // Clear entire cart after order
  const handleClearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Called after order sent successfully — opens review modal
  const handleOrderSuccess = useCallback((customerName: string) => {
    setLastCustomerName(customerName);
    setDrawerOpen(false);
    setTimeout(() => setReviewOpen(true), 800);
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

      {/* ━━━ CART DRAWER ━━━ */}
      <CartDrawer
        cart={cart}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onUpdateQty={handleUpdateQty}
        onRemove={handleRemove}
        onClearCart={handleClearCart}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* ━━━ REVIEW MODAL ━━━ */}
      <ReviewModal
        isOpen={reviewOpen}
        onClose={() => setReviewOpen(false)}
        customerName={lastCustomerName}
      />

      {/* ━━━ TOAST ━━━ */}
      <div className={`toast ${toastVisible ? "show" : ""}`}>
        {toast}
      </div>
    </>
  );
}