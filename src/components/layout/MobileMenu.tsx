"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X, Search, User } from "lucide-react";
import { Instagram, Facebook, Twitter } from "lucide-react";

interface NavLink {
  label: string;
  href: string;
  hasDropdown?: boolean;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: NavLink[];
}

const shopCategories = [
  { label: "Men's", href: "/collections/men" },
  { label: "Women's", href: "/collections/women" },
  { label: "Accessories", href: "/collections/accessories" },
  { label: "All Products", href: "/collections/all" },
];

const collectionsLinks = [
  { label: "Summer 2025", href: "/collections/summer-2025" },
  { label: "Essentials", href: "/collections/essentials" },
  { label: "Best Sellers", href: "/collections/best-sellers" },
];

const socialLinks = [
  {
    icon: Instagram,
    href: "https://instagram.com/valstore",
    label: "Instagram",
  },
  { icon: Facebook, href: "https://facebook.com/valstore", label: "Facebook" },
  { icon: Twitter, href: "https://twitter.com/valstore", label: "Twitter" },
];

export function MobileMenu({
  isOpen,
  onClose,
}: Omit<MobileMenuProps, "navLinks">) {
  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Menu panel */}
      <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-black border-l border-white/10 flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <span className="text-xl font-bold tracking-wider text-white">
            VAL
          </span>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="space-y-1 px-4">
            {/* Shop with subcategories */}
            <div className="py-3">
              <Link
                href="/collections/all"
                className="text-lg font-medium text-white hover:text-val-accent transition-colors uppercase tracking-wider"
                onClick={onClose}
              >
                Shop
              </Link>
              <div className="mt-2 ml-4 space-y-2">
                {shopCategories.map((category) => (
                  <Link
                    key={category.label}
                    href={category.href}
                    className="block text-sm text-gray-400 hover:text-val-accent transition-colors"
                    onClick={onClose}
                  >
                    {category.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* New */}
            <Link
              href="/collections/new"
              className="block py-3 text-lg font-medium text-white hover:text-val-accent transition-colors uppercase tracking-wider"
              onClick={onClose}
            >
              New
            </Link>

            {/* Collections with subcategories */}
            <div className="py-3">
              <span className="text-lg font-medium text-white uppercase tracking-wider">
                Collections
              </span>
              <div className="mt-2 ml-4 space-y-2">
                {collectionsLinks.map((collection) => (
                  <Link
                    key={collection.label}
                    href={collection.href}
                    className="block text-sm text-gray-400 hover:text-val-accent transition-colors"
                    onClick={onClose}
                  >
                    {collection.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Sale */}
            <Link
              href="/collections/sale"
              className="block py-3 text-lg font-medium text-red-400 hover:text-red-300 transition-colors uppercase tracking-wider"
              onClick={onClose}
            >
              Sale
            </Link>
          </div>
        </nav>

        {/* User actions */}
        <div className="border-t border-white/10 p-4 space-y-4">
          <Link
            href="/search"
            className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
            onClick={onClose}
          >
            <Search className="h-5 w-5" />
            <span>Search</span>
          </Link>
          <Link
            href="/account"
            className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
            onClick={onClose}
          >
            <User className="h-5 w-5" />
            <span>Account</span>
          </Link>
        </div>

        {/* Social links */}
        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-6">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-val-accent transition-colors"
                aria-label={social.label}
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
