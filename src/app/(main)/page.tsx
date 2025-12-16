import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            From Dreams to Reality
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300">
            Premium streetwear crafted with passion
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/collections/all">
              <Button
                size="lg"
                className="bg-white text-black hover:bg-gray-100 px-8"
              >
                » EXPLORE «
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="animate-bounce">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">LATEST DROPS</h2>
            <p className="text-gray-600">Explore our newest collections</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Collection Card 1 */}
            <Link href="/collections/tees" className="group cursor-pointer">
              <div className="relative h-96 bg-gray-100 overflow-hidden mb-4">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-sm">01</p>
                  <h3 className="text-2xl font-bold">TEES</h3>
                </div>
              </div>
            </Link>

            {/* Collection Card 2 */}
            <Link href="/collections/hoodies" className="group cursor-pointer">
              <div className="relative h-96 bg-gray-200 overflow-hidden mb-4">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-sm">02</p>
                  <h3 className="text-2xl font-bold">HOODIES</h3>
                </div>
              </div>
            </Link>

            {/* Collection Card 3 */}
            <Link href="/collections/jackets" className="group cursor-pointer">
              <div className="relative h-96 bg-gray-300 overflow-hidden mb-4">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-sm">03</p>
                  <h3 className="text-2xl font-bold">JACKETS</h3>
                </div>
              </div>
            </Link>
          </div>

          <div className="text-center mt-12">
            <Link href="/collections/all">
              <Button variant="outline" size="lg" className="px-8">
                » VIEW ALL «
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Banner Section */}
      <section className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            JOIN THE VAL FAMILY
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Be the first to know about new drops and exclusive offers
          </p>
          <div className="flex gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:border-white"
            />
            <Button className="bg-white text-black hover:bg-gray-100">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-4xl font-bold mb-2">Free Shipping</h3>
              <p className="text-gray-600">On orders over $200</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold mb-2">Easy Returns</h3>
              <p className="text-gray-600">30-day return policy</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold mb-2">Premium Quality</h3>
              <p className="text-gray-600">Crafted with care</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
