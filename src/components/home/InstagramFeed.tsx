import Link from "next/link";
import { Instagram } from "lucide-react";

interface InstagramFeedProps {
  handle?: string;
  instagramUrl?: string;
}

// Placeholder images (will be replaced with actual Instagram API data)
const instagramImages = [
  { id: 1, alt: "VAL Style 1" },
  { id: 2, alt: "VAL Style 2" },
  { id: 3, alt: "VAL Style 3" },
  { id: 4, alt: "VAL Style 4" },
  { id: 5, alt: "VAL Style 5" },
  { id: 6, alt: "VAL Style 6" },
];

export function InstagramFeed({
  handle = "@valstore",
  instagramUrl = "https://instagram.com/valstore",
}: InstagramFeedProps) {
  return (
    <section className="py-16 md:py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Follow Us
          </h2>
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-val-accent hover:underline inline-flex items-center gap-1"
          >
            <Instagram className="h-4 w-4" />
            {handle}
          </a>
        </div>

        {/* Instagram Grid */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-1">
          {instagramImages.map((image) => (
            <Link
              key={image.id}
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square group overflow-hidden"
            >
              {/* Placeholder gradient (replace with actual images) */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900" />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Instagram className="h-8 w-8 text-white" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
