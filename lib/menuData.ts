

export const WHATSAPP_NUMBER = "353899620513";

// ── Types ──────────────────────────────────
export interface MenuItem {
  id: number;
  name: string;
  desc: string;
  price: number;
  img: string;
  badge: string;
}

export interface DeliveryOption {
  value: string;
  label: string;
  fee: number;
}

export interface CartItem extends MenuItem {
  qty: number;
}

// ── Menu Items ─────────────────────────────
export const MENU: MenuItem[] = [
  {
    id: 1,
    name: "Jollof Rice & Chicken",
    desc: "Party-style smoky jollof rice with well-seasoned grilled chicken",
    price: 12,
    img: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=600&auto=format&fit=crop",
    badge: "🔥 Popular",
  },
  {
    id: 2,
    name: "Egusi Soup & Pounded Yam",
    desc: "Rich melon seed soup with stockfish, slow-cooked to perfection",
    price: 14,
    img: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&auto=format&fit=crop",
    badge: "Chef's Pick",
  },
  {
    id: 3,
    name: "Pepper Soup (Assorted)",
    desc: "Hot, aromatic Nigerian pepper soup — perfect for cold Donegal nights",
    price: 11,
    img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop",
    badge: "🌶️ Spicy",
  },
  {
    id: 4,
    name: "Fried Plantain & Beans",
    desc: "Sweet ripe plantain with spiced honey beans — a true comfort meal",
    price: 9,
    img: "https://images.unsplash.com/photo-1601315152885-7eeaba1a8427?w=600&auto=format&fit=crop",
    badge: "Vegetarian",
  },
  {
    id: 5,
    name: "Afang Soup & Eba",
    desc: "Authentic Cross River soup with waterleaf and wild okazi leaves",
    price: 15,
    img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop",
    badge: "Traditional",
  },
  {
    id: 6,
    name: "Moi Moi (Portion)",
    desc: "Steamed bean pudding with eggs and fish, Nigerian street-food classic",
    price: 7,
    img: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&auto=format&fit=crop",
    badge: "Street Food",
  },
];

// ── Delivery Options ───────────────────────
export const DELIVERY_OPTIONS: DeliveryOption[] = [
  {
    value: "letterkenny",
    label: "🏠 Home Delivery — Letterkenny",
    fee: 2,
  },
  {
    value: "donegal",
    label: "📍 Donegal Town & Surrounds",
    fee: 4,
  },
  {
    value: "ireland",
    label: "📦 Nationwide Delivery — Ireland",
    fee: 6,
  },
  {
    value: "pickup",
    label: "🤝 Pickup — Letterkenny (Free)",
    fee: 0,
  },
];

// ── WhatsApp Message Builder ───────────────
export function buildWhatsAppMessage(
  cart: CartItem[],
  delivery: DeliveryOption,
  form: {
    name: string;
    phone: string;
    whatsapp: string;
    address: string;
    time: string;
    notes: string;
  }
): string {
  const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const total = subtotal + delivery.fee;

  const items = cart
    .map((c) => `• ${c.name} x${c.qty} — €${(c.price * c.qty).toFixed(2)}`)
    .join("\n");

  return `🍲 *NEW ORDER — FoodbyEwa*

👤 *Customer:* ${form.name}
📞 *Phone:* ${form.phone}
📱 *WhatsApp:* ${form.whatsapp || form.phone}
📍 *Delivery Address:* ${form.address}
🚗 *Delivery:* ${delivery.label}
⏰ *Preferred Time:* ${form.time}

🛒 *ORDER DETAILS:*
${items}

💰 *Subtotal:* €${subtotal.toFixed(2)}
🚗 *Delivery Fee:* ${delivery.fee === 0 ? "FREE" : "€" + delivery.fee.toFixed(2)}
💳 *TOTAL: €${total.toFixed(2)}*

📝 *Special Instructions:* ${form.notes || "None"}

_Sent via FoodbyEwa website_ 🇳🇬❤️`;
}