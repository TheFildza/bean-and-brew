import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { CartProvider } from "@/components/CartProvider";
import { LogoutButton } from "@/components/LogoutButton";
import { getUserFromSession } from "@/lib/userAuth";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Bean & Brew - Artisanal Coffee Roastery",
  description: "Discover our curated selection of specialty coffees from around the world.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUserFromSession()

  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FAF8F6] text-[#1A120B]">
        <CartProvider>
          <Header
            userNav={user ? (
              <div className="flex items-center gap-3 text-sm">
                <a href="/account" className="text-[#3C2A21] hover:text-[#1A120B] transition-colors">
                  {user.name ?? user.email}
                </a>
                <LogoutButton />
              </div>
            ) : (
              <div className="flex items-center gap-3 text-sm">
                <a href="/login" className="text-[#3C2A21] hover:text-[#1A120B] transition-colors">Login</a>
                <a href="/register" className="bg-[#1A120B] text-[#FAF8F6] px-3 py-1 rounded hover:bg-[#3C2A21] transition-colors">
                  Register
                </a>
              </div>
            )}
          />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
