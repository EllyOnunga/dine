import { motion } from "framer-motion";
import { Hero } from "@/components/ui/hero";
import { MenuSection } from "@/components/ui/menu-section";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Clock, MapPin, Phone, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function Home() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");

  const newsletterMutation = useMutation({
    mutationFn: async (email: string) => {
      await apiRequest("POST", "/api/newsletter", { email });
    },
    onSuccess: () => {
      toast({
        title: "Welcome to the Savannah Circle!",
        description: "You've successfully subscribed to our newsletter.",
      });
      setEmail("");
    },
    onError: (error: Error) => {
      toast({
        title: "Subscription Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/20">
      <main>
        <Hero />

        <MenuSection />

        {/* Info / Reservation Preview Section */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Text Content */}
              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <span className="text-primary font-medium tracking-widest uppercase text-sm mb-2 block">
                    Experience
                  </span>
                  <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Book Your Table</h2>
                  <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                    Authentic Kenyan hospitality meet modern elegance. Join us in the heart of Karen for an unforgettable culinary journey through the Savannah.
                  </p>
                </motion.div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-background p-6 rounded-xl shadow-sm border border-border/50 transition-all hover:shadow-lg hover:border-primary/20"
                  >
                    <Clock className="w-6 h-6 text-primary mb-4" />
                    <h3 className="font-serif font-bold mb-2 text-xl">Opening Hours</h3>
                    <p className="text-sm text-muted-foreground italic">Mon-Sun: 11am - 11pm</p>
                    <p className="text-sm text-muted-foreground italic text-primary/80">Dinner: 6pm - 11pm</p>
                  </motion.div>
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-background p-6 rounded-xl shadow-sm border border-border/50 transition-all hover:shadow-lg hover:border-primary/20"
                  >
                    <MapPin className="w-6 h-6 text-primary mb-4" />
                    <h3 className="font-serif font-bold mb-2 text-xl">Location</h3>
                    <p className="text-sm text-muted-foreground italic">Karen Triangle Mall</p>
                    <p className="text-sm text-muted-foreground italic">Karen, Nairobi, Kenya</p>
                  </motion.div>
                </div>

                <div className="flex gap-4">
                  <Link href="/reservations">
                    <Button size="lg" className="font-serif italic px-8 h-14 text-lg">Make a Reservation</Button>
                  </Link>
                </div>
              </div>

              {/* Decorative Image/Box */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative h-[600px] w-full bg-stone-200 rounded-2xl overflow-hidden hidden lg:block shadow-2xl"
              >
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute inset-0 flex items-center justify-center p-12">
                  <div className="text-center p-10 border border-white/20 bg-white/10 backdrop-blur-xl rounded-2xl max-w-sm">
                    <h4 className="text-4xl font-serif text-white mb-4">Events & Private Dining</h4>
                    <p className="text-white/80 mb-8 text-lg">Host your koroga, corporate dinner, or private celebration in our exclusive Savannah Lounge.</p>
                    <Button variant="outline" className="text-white border-white hover:bg-white hover:text-black h-14 px-8 text-lg font-serif">Enquire Now</Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Loyalty Program Section */}
        <section className="py-24 bg-primary text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-accent opacity-20 rounded-full blur-3xl" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto text-center space-y-8"
            >
              <h2 className="text-4xl md:text-6xl font-serif font-bold">Join the Savannah Circle</h2>
              <p className="text-xl text-white/80 font-light max-w-2xl mx-auto">
                Discover exclusive rewards, early access to seasonal menus, and special surprises. Our way of saying 'Asante' for being part of our journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="bg-white/10 border border-white/30 rounded-full px-8 py-4 w-full max-w-sm focus:outline-none focus:ring-2 focus:ring-accent backdrop-blur-sm text-white placeholder:text-white/50"
                />
                <Button
                  onClick={() => newsletterMutation.mutate(email)}
                  disabled={newsletterMutation.isPending || !email}
                  className="bg-accent hover:bg-accent/90 text-primary-foreground font-serif h-14 px-12 rounded-full text-lg shadow-xl"
                >
                  {newsletterMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Become a Member
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

      </main>
    </div>
  );
}
