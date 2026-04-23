import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "./button";

export function RoomBookingTeaser() {
  return (
    <section className="relative py-32 bg-stone-900 border-t-8 border-primary overflow-hidden">
        <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=2000" 
              alt="Private Dining Event"
              className="w-full h-full object-cover opacity-30"
            />
        </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-primary font-medium tracking-widest text-[11px] uppercase mb-4 block drop-shadow-lg">
              Events & Private Dining
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-serif font-bold text-white mb-6 drop-shadow-xl">
              Host Your Event With Us
            </h2>
            <p className="text-white/90 text-lg sm:text-xl font-light mb-10 leading-relaxed shadow-black drop-shadow-md">
              Whether it's an intimate corporate dinner, an exciting koroga night, or a grand celebration, our exclusive Savannah Lounge provides the perfect setting for unforgettable moments.
            </p>
            <Link href="/events" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-serif italic px-8 h-14 text-xl shadow-[0_0_40px_rgba(196,30,30,0.4)] transition-all hover:shadow-[0_0_60px_rgba(196,30,30,0.6)]">
                Check Availability
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
