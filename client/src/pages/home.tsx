import { Hero } from "@/components/ui/hero";
import { QuickInfoBar } from "@/components/ui/quick-info-bar";
import { AboutIntro } from "@/components/ui/about-intro";
import { MenuSection } from "@/components/ui/menu-section";
import { RoomBookingTeaser } from "@/components/ui/room-booking-teaser";
import { OrderOnlinePromo } from "@/components/ui/order-online-promo";
import { TestimonialsSlider } from "@/components/ui/testimonials-slider";
import { InstagramFeed } from "@/components/ui/instagram-feed";

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/20">
      <main>
        {/* 1. Hero Banner */}
        <Hero />
        
        {/* 2. Quick Info Bar */}
        <QuickInfoBar />

        {/* 3. About Intro */}
        <AboutIntro />

        {/* 4. Featured Dishes (uses existing MenuSection structure) */}
        <MenuSection />

        {/* 5. Room Booking Teaser */}
        <RoomBookingTeaser />

        {/* 6. Order Online Promo */}
        <OrderOnlinePromo />

        {/* 7. Testimonials */}
        <TestimonialsSlider />

        {/* 8. Instagram Feed */}
        <InstagramFeed />
      </main>
    </div>
  );
}
