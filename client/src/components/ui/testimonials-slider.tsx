import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { useEffect } from "react";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTestimonials } from "@/hooks/use-site-data";
import { Skeleton } from "@/components/ui/skeleton";

export function TestimonialsSlider() {
  const { data: testimonials, isLoading } = useTestimonials();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" });

  useEffect(() => {
    if (emblaApi) {
      const interval = setInterval(() => {
        emblaApi.scrollNext();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [emblaApi]);

  if (isLoading) {
    return (
      <section className="py-24 bg-muted/20">
        <div className="container mx-auto px-4">
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </section>
    );
  }

  const items = testimonials || [];

  return (
    <section className="py-24 bg-muted/20 overflow-hidden">
      <div className="container mx-auto px-4 text-center">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="mb-16"
        >
          <span className="text-primary font-medium tracking-widest uppercase text-sm mb-2 block">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
            What Our Guests Say
          </h2>
        </motion.div>

        <div className="max-w-4xl mx-auto overflow-hidden" ref={emblaRef}>
          <div className="flex touch-pan-y py-4">
            {items.map((testimonial, idx) => (
              <div key={idx} className="flex-[0_0_100%] min-w-0 md:flex-[0_0_80%] px-4">
                <Card className="border-none shadow-xl bg-card rounded-2xl">
                  <CardContent className="p-6 sm:p-10 flex flex-col items-center text-center">
                    <div className="flex gap-1 text-accent mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-5 h-5 sm:w-6 sm:h-6 ${i < testimonial.rating ? 'fill-accent' : 'fill-muted text-muted'}`} />
                      ))}
                    </div>
                    <p className="text-lg sm:text-xl md:text-2xl text-foreground/80 italic font-serif leading-relaxed mb-8">
                      "{testimonial.text}"
                    </p>
                    <div>
                      <h4 className="font-bold text-base sm:text-lg">{testimonial.name}</h4>
                      <span className="text-muted-foreground text-xs sm:text-sm">{testimonial.platform}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
