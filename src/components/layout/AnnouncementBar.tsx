"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface AnnouncementBarProps {
  messages?: string[];
  rotateInterval?: number;
  dismissible?: boolean;
}

const defaultMessages = [
  "Free shipping on orders over $200 🚚",
  "New arrivals just dropped - Shop Now →",
  "Holiday Sale: Up to 40% off select items ✨",
];

export function AnnouncementBar({
  messages = defaultMessages,
  rotateInterval = 5000,
  dismissible = true,
}: AnnouncementBarProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(() => {
    // Check localStorage on initial render (client-side only)
    if (typeof window !== "undefined") {
      return localStorage.getItem("announcement-dismissed") === "true";
    }
    return false;
  });

  // Rotate messages
  useEffect(() => {
    if (messages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, rotateInterval);

    return () => clearInterval(interval);
  }, [messages.length, rotateInterval]);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem("announcement-dismissed", "true");
  };

  if (isDismissed) return null;

  return (
    <div className="bg-val-steel text-white text-center py-2.5 text-sm relative">
      <p className="px-8 transition-opacity duration-300">
        {messages[currentIndex]}
      </p>
      {dismissible && (
        <button
          onClick={handleDismiss}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
          aria-label="Dismiss announcement"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
