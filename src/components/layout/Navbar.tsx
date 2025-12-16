"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, User, Search, Menu, X } from "lucide-react";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white text-center py-2 text-sm">
        <p>Free shipping over $200 • Duties & Taxes included in all orders</p>
      </div>

      {/* Main Navbar with SVG Neon Border */}
      <nav className="bg-black sticky top-0 z-50 relative">
        {/* Neon SVG Border with Center Gap */}
        <svg
          className="w-full absolute top-0 z-10 pointer-events-none"
          height="80"
          viewBox="0 0 1200 80"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Base glow */}
          <path
            d="M 0,20 L 450,20 L 480,60 L 720,60 L 750,20 L 1200,20"
            stroke="#a855f7"
            strokeWidth="4"
            opacity="0.2"
          />

          {/* Neon layer */}
          <path
            d="M 0,20 L 450,20 L 480,60 L 720,60 L 750,20 L 1200,20"
            stroke="#a855f7"
            strokeWidth="1.5"
            filter="url(#neon-glow)"
          />

          {/* White core */}
          <path
            d="M 0,20 L 450,20 L 480,60 L 720,60 L 750,20 L 1200,20"
            stroke="white"
            strokeWidth="0.5"
            opacity="0.8"
          />
        </svg>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-between h-20 relative">
            {/* Left Section: Navigation Links */}
            <div className="hidden md:flex items-center gap-8 z-20 flex-1">
              <Link
                href="/collections/all"
                className="text-sm font-medium text-gray-300 hover:text-[#a855f7] transition-colors duration-300 uppercase tracking-wider"
              >
                Shop
              </Link>
              <Link
                href="/collections/new"
                className="text-sm font-medium text-gray-300 hover:text-[#a855f7] transition-colors duration-300 uppercase tracking-wider"
              >
                New
              </Link>
              <Link
                href="/collections/sale"
                className="text-sm font-medium text-gray-300 hover:text-[#a855f7] transition-colors duration-300 uppercase tracking-wider"
              >
                Sale
              </Link>
            </div>

            {/* Center Section: Logo */}
            <Link
              href="/"
              className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30"
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-[#a855f7] blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                <span className="relative text-4xl font-black tracking-[0.2em] text-white drop-shadow-[0_0_10px_rgba(168,85,247,0.8)] group-hover:drop-shadow-[0_0_20px_rgba(168,85,247,1)] transition-all duration-300">
                  VAL
                </span>
              </div>
            </Link>

            {/* Right Section: Icons */}
            <div className="hidden md:flex items-center gap-6 z-20 flex-1 justify-end">
              <button className="text-gray-300 hover:text-[#a855f7] transition-colors duration-300 hover:scale-110 transform">
                <Search className="h-5 w-5" />
              </button>
              <Link
                href="/account"
                className="text-gray-300 hover:text-[#a855f7] transition-colors duration-300 hover:scale-110 transform"
              >
                <User className="h-5 w-5" />
              </Link>
              <Link
                href="/cart"
                className="text-gray-300 hover:text-[#a855f7] transition-colors duration-300 hover:scale-110 transform relative"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-2 -right-2 bg-[#a855f7] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-[0_0_10px_rgba(168,85,247,0.8)]">
                  0
                </span>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden z-20 text-gray-300 hover:text-[#a855f7] transition-colors"
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
          <div className="md:hidden border-t border-[#a855f7]/20 bg-black/95 backdrop-blur-lg">
            <div className="px-4 py-6 space-y-4">
              <Link
                href="/collections/all"
                className="block text-sm font-medium py-3 text-gray-300 hover:text-[#a855f7] transition-colors uppercase tracking-wider"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Shop
              </Link>
              <Link
                href="/collections/new"
                className="block text-sm font-medium py-3 text-gray-300 hover:text-[#a855f7] transition-colors uppercase tracking-wider"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                New
              </Link>
              <Link
                href="/collections/sale"
                className="block text-sm font-medium py-3 text-gray-300 hover:text-[#a855f7] transition-colors uppercase tracking-wider"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sale
              </Link>
              <div className="flex items-center gap-6 pt-4 border-t border-[#a855f7]/20">
                <button className="text-gray-300 hover:text-[#a855f7] transition-colors">
                  <Search className="h-5 w-5" />
                </button>
                <Link
                  href="/account"
                  className="text-gray-300 hover:text-[#a855f7] transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
