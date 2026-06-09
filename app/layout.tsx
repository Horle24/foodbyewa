
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata: Metadata = {
  title: "FoodbyEwa — Authentic Nigerian Home Cooking in Donegal",
  description:
    "Soul-nourishing Nigerian home cooking delivered to your door in Letterkenny & Donegal, Ireland. Order via WhatsApp.",
  keywords:
    "Nigerian food Donegal, Nigerian food Letterkenny, African food Ireland, Jollof rice Donegal, FoodbyEwa",
  openGraph: {
    title: "FoodbyEwa — Taste of Home, Made with Love",
    description:
      "Authentic Nigerian home cooking in Letterkenny, Donegal. Fresh daily. Order via WhatsApp.",
    type: "website",
    locale: "en_IE",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}