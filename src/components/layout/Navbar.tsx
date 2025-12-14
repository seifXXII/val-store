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

      {/* Main Navbar - with split border design */}
      <nav className="bg-white sticky top-0 z-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 relative">
            {/* Left: Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/collections/all"
                className="text-sm font-medium hover:text-gray-600 transition-colors"
              >
                Shop
              </Link>
              <Link
                href="/collections/new"
                className="text-sm font-medium hover:text-gray-600 transition-colors"
              >
                New
              </Link>
              <Link
                href="/collections/sale"
                className="text-sm font-medium hover:text-gray-600 transition-colors"
              >
                Sale
              </Link>
            </div>

            {/* Center: Logo with border notch */}
            <div className="absolute left-1/2 top-0 transform -translate-x-1/2 bg-white px-8 z-10">
              <Link
                href="/"
                className="block text-2xl font-bold tracking-wider py-4"
              >
                VAL
              </Link>
            </div>

            {/* Right: Icons */}
            <div className="flex items-center gap-4 z-20">
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
              className="md:hidden z-20"
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

        {/* Split Border - Left and Right sides */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gray-200 pointer-events-none">
          {/* Left border */}
          <div
            className="absolute left-0 top-0 h-px bg-gray-200"
            style={{ width: "calc(50% - 80px)" }}
          />
          {/* Right border */}
          <div
            className="absolute right-0 top-0 h-px bg-gray-200"
            style={{ width: "calc(50% - 80px)" }}
          />
        </div>

        {/* Bottom border - full width */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-200" />

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t">
            <div className="px-4 py-4 space-y-3">
              <Link
                href="/collections/all"
                className="block text-sm font-medium py-2"
              >
                Shop
              </Link>
              <Link
                href="/collections/new"
                className="block text-sm font-medium py-2"
              >
                New
              </Link>
              <Link
                href="/collections/sale"
                className="block text-sm font-medium py-2"
              >
                Sale
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
