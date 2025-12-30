import { ServerHeroSection } from "@/components/home/ServerHeroSection";
import { ServerFeaturedCategories } from "@/components/home/ServerFeaturedCategories";
import { ServerFeaturedProducts } from "@/components/home/ServerFeaturedProducts";
import { NewArrivals } from "@/components/home/NewArrivals";
import { PromoBanner } from "@/components/home/PromoBanner";
import { BrandStory } from "@/components/home/BrandStory";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { InstagramFeed } from "@/components/home/InstagramFeed";
import { TrustIndicators } from "@/components/home/TrustIndicators";

export default function Home() {
  return (
    <main>
      {/* Hero Section - CMS Configurable */}
      <ServerHeroSection />

      {/* Featured Categories - CMS Configurable */}
      <ServerFeaturedCategories
        title="Shop by Category"
        subtitle="Find your perfect style"
      />

      {/* Brand Story */}
      <BrandStory />

      {/* Featured Products - CMS Configurable */}
      <ServerFeaturedProducts
        title="Best Sellers"
        subtitle="Our most popular pieces"
      />

      {/* New Arrivals - Horizontal Scroll */}
      <NewArrivals title="New Arrivals" subtitle="Fresh drops just for you" />

      {/* Promotional Banner */}
      <PromoBanner
        preHeadline="Limited Time"
        headline="Winter Sale"
        description="Up to 40% off on selected items. Don't miss out on our biggest sale of the season."
        ctaText="Shop Sale"
        ctaLink="/collections/sale"
      />

      {/* Newsletter */}
      <NewsletterSection />

      {/* Instagram Feed */}
      <InstagramFeed />

      {/* Trust Indicators */}
      <TrustIndicators />
    </main>
  );
}
