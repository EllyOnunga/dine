import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useSiteSettings, useSiteContent } from "@/hooks/use-site-data";
import { Skeleton } from "@/components/ui/skeleton";

export function Hero() {
  const { data: settings, isLoading: settingsLoading } = useSiteSettings();
  const { data: content, isLoading: contentLoading } = useSiteContent('home');

  if (settingsLoading || contentLoading) {
    return <Skeleton className="h-screen w-full rounded-none" />;
  }

  const heroImage = content?.find(c => c.key === 'hero_image')?.value || "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2000";
  const heroDescription = content?.find(c => c.key === 'hero_description')?.value || "Experience Nairobi's finest bistro where the rich heritage of the Savannah meets contemporary culinary innovation.";

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] hover:scale-110 hero-bg-dynamic"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
      </div>

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 flex flex-col justify-center items-center text-center text-white z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <span className="text-accent font-medium tracking-[0.2em] md:tracking-[0.3em] uppercase text-xs mb-6 block drop-shadow-md px-4">
            {settings?.restaurantTagline}
          </span>
          <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-serif font-bold mb-8 leading-[0.9] tracking-tighter px-2">
            {settings?.restaurantName.split(' & ')[0]} <br />
            <span className="italic text-accent">& {settings?.restaurantName.split(' & ')[1]}</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-2xl text-white/90 mb-10 font-light leading-relaxed drop-shadow-lg">
            {heroDescription}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-sm sm:max-w-none mx-auto px-4 sm:px-0">
            <Link href="/menu" className="w-full sm:w-auto">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white w-full sm:min-w-[200px] h-14 text-lg font-serif cursor-pointer">
                Order Now
              </Button>
            </Link>
            <Link href="/reservations" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white w-full hover:bg-white hover:text-black sm:min-w-[200px] h-14 text-lg backdrop-blur-md transition-all duration-500 cursor-pointer">
                Book a Table
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent mx-auto" />
      </motion.div>
    </div>
  );
}
