// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//   FOODBYEWA — Supabase Client
//   lib/supabase.ts
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Check your .env.local file."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ── Types matching the orders table ────────
export interface OrderInsert {
  customer_name: string;
  customer_phone: string;
  customer_whatsapp?: string;
  delivery_address: string;
  items: {
    id: number;
    name: string;
    qty: number;
    price: number;
  }[];
  subtotal: number;
  delivery_fee: number;
  total: number;
  delivery_type: string;
  delivery_label: string;
  preferred_time: string;
  special_notes?: string;
  status?: string;
}

// ── Save order to Supabase ─────────────────
export async function saveOrder(order: OrderInsert) {
  const { data, error } = await supabase
    .from("orders")
    .insert([order])
    .select()
    .single();

  if (error) throw error;
  return data;
}