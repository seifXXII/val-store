"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, User, Search, Menu } from "lucide-react";
import { MobileMenu } from "./MobileMenu";

const navLinks = [
  { label: "Shop", href: "/collections/all" },
  { label: "New", href: "/collections/new" },
  { label: "Collections", href: "/collections" },
  { label: "Sale", href: "/collections/sale" },
];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-black border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14 md:h-16">
            {/* Left: Nav Links (Desktop) */}
            <div className="hidden md:flex items-center gap-6 flex-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-xs sm:text-sm text-gray-300 hover:text-val-accent transition-colors uppercase tracking-wide"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Center: Logo */}
            <Link href="/" className="flex-shrink-0">
              <span className="text-xl sm:text-2xl md:text-3xl font-bold tracking-widest text-white hover:text-val-accent transition-colors">
                VAL
              </span>
            </Link>

            {/* Right: Icons (Desktop) */}
            <div className="hidden md:flex items-center gap-5 flex-1 justify-end">
              <button
                className="text-gray-300 hover:text-val-accent transition-colors"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
              <Link
                href="/account"
                className="text-gray-300 hover:text-val-accent transition-colors"
              >
                <User className="h-5 w-5" />
              </Link>
              <Link
                href="/cart"
                className="text-gray-300 hover:text-val-accent transition-colors relative"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-2 -right-2 bg-val-accent text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  0
                </span>
              </Link>
            </div>

            {/* Mobile: Cart + Menu */}
            <div className="flex md:hidden items-center gap-4">
              <Link
                href="/cart"
                className="text-gray-300 hover:text-val-accent transition-colors relative"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-2 -right-2 bg-val-accent text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  0
                </span>
              </Link>
              <button
                className="text-gray-300 hover:text-val-accent transition-colors"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}
