import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "./button";
import { useSiteContent } from "@/hooks/use-site-data";
import { Skeleton } from "@/components/ui/skeleton";

export function AboutIntro() {
  const { data: content, isLoading } = useSiteContent('home');

  if (isLoading) {
    return (
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-[500px] w-full rounded-2xl" />
          </div>
        </div>
      </section>
    );
  }

  const aboutDescription = content?.find(c => c.key === 'about_description')?.value || "At Savannah & Spice, we believe in celebrating the rich culinary diversity of Kenya.";
  const aboutImage = content?.find(c => c.key === 'about_image')?.value || "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1200";

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <span className="text-primary font-medium tracking-widest uppercase text-sm block">
              Our Story
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
              A Taste of Kenyan Heritage.
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {aboutDescription}
            </p>
            <Link href="/story">
              <Button variant="outline" className="font-serif italic border-primary text-primary hover:bg-primary hover:text-white px-8 h-12 text-lg">
                Read Our Full Story
              </Button>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative h-[300px] md:h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl mt-8 lg:mt-0"
          >
            <img 
              src={aboutImage} 
              alt="Restaurant Interior"
              className="absolute inset-0 w-full h-full object-cover rounded-2xl"
            />
            <div className="absolute inset-0 border border-white/20 rounded-2xl pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
