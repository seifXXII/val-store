"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, User, Search, Menu, X } from "lucide-react";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-black text-white text-center py-2 text-sm">
        <p>Free shipping over $200 • Duties & Taxes included in all orders</p>
      </div>

      {/* Main Navbar */}
      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Navigation Links (like Shihiko) */}
            <div className="hidden md:flex items-center gap-8">
              <div className="relative group">
                <button className="text-sm font-medium hover:text-gray-600 transition-colors uppercase">
                  Shop All
                </button>
              </div>

              <div className="relative group">
                <button className="text-sm font-medium hover:text-gray-600 transition-colors uppercase">
                  Categories
                </button>
              </div>

              <div className="relative group">
                <button className="text-sm font-medium hover:text-gray-600 transition-colors uppercase">
                  Drop
                </button>
              </div>

              <Link
                href="/collections/vault"
                className="text-sm font-medium hover:text-gray-600 transition-colors uppercase"
              >
                Vault
              </Link>
            </div>

            {/* Center: Logo */}
            <Link
              href="/"
              className="text-2xl font-bold tracking-wider absolute left-1/2 transform -translate-x-1/2"
            >
              VAL
            </Link>

            {/* Right: Utility Icons (like Shihiko) */}
            <div className="flex items-center gap-4">
              <button className="hover:text-gray-600 transition-colors">
                <Search className="h-5 w-5" />
              </button>
              <Link
                href="/account"
                className="hover:text-gray-600 transition-colors"
              >
                <User className="h-5 w-5" />
              </Link>
              <Link
                href="/cart"
                className="hover:text-gray-600 transition-colors relative"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  0
                </span>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden absolute left-4"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t">
            <div className="px-4 py-4 space-y-3">
              <Link
                href="/collections/all"
                className="block text-sm font-medium py-2 uppercase"
              >
                Shop All
              </Link>
              <Link
                href="/collections/categories"
                className="block text-sm font-medium py-2 uppercase"
              >
                Categories
              </Link>
              <Link
                href="/collections/drop"
                className="block text-sm font-medium py-2 uppercase"
              >
                Drop
              </Link>
              <Link
                href="/collections/vault"
                className="block text-sm font-medium py-2 uppercase"
              >
                Vault
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
