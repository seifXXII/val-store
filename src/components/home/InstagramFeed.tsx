import Image from "next/image";
import { Instagram } from "lucide-react";

interface InstagramFeedProps {
  handle?: string;
  instagramUrl?: string;
}

// Picsum images seeded for consistent display
const instagramImages = [
  { id: 1, alt: "Valkyrie Style 1", seed: "insta-1" },
  { id: 2, alt: "Valkyrie Style 2", seed: "insta-2" },
  { id: 3, alt: "Valkyrie Style 3", seed: "insta-3" },
  { id: 4, alt: "Valkyrie Style 4", seed: "insta-4" },
  { id: 5, alt: "Valkyrie Style 5", seed: "insta-5" },
  { id: 6, alt: "Valkyrie Style 6", seed: "insta-6" },
];

export function InstagramFeed({
  handle = "@valkyrie",
  instagramUrl = "https://instagram.com/valkyrie",
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
            <a
              key={image.id}
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square group overflow-hidden"
            >
              <Image
                src={`https://picsum.photos/seed/${image.seed}/400/400`}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 33vw, 16vw"
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                unoptimized
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Instagram className="h-8 w-8 text-white" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
