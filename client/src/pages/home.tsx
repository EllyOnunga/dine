import { Hero } from "@/components/ui/hero";
import { MenuSection } from "@/components/ui/menu-section";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Clock, MapPin, Phone } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
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
                <div>
                   <span className="text-primary font-medium tracking-widest uppercase text-sm mb-2 block">
                    Reservations
                  </span>
                  <h2 className="text-4xl font-serif font-bold mb-6">Book Your Table</h2>
                  <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                    Experience authentic Kenyan hospitality in a modern setting. Join us at Karen Triangle for an unforgettable culinary journey.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="bg-background p-6 rounded-lg shadow-sm border border-border/50">
                    <Clock className="w-6 h-6 text-primary mb-4" />
                    <h3 className="font-serif font-bold mb-2">Opening Hours</h3>
                    <p className="text-sm text-muted-foreground">Mon-Sun: 11am - 11pm</p>
                    <p className="text-sm text-muted-foreground">Dinner: 6pm - 11pm</p>
                  </div>
                  <div className="bg-background p-6 rounded-lg shadow-sm border border-border/50">
                    <MapPin className="w-6 h-6 text-primary mb-4" />
                    <h3 className="font-serif font-bold mb-2">Location</h3>
                    <p className="text-sm text-muted-foreground">Karen Triangle Mall</p>
                    <p className="text-sm text-muted-foreground">Karen, Nairobi</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Link href="/reservations">
                    <Button size="lg" className="font-serif italic">Make a Reservation</Button>
                  </Link>
                </div>
              </div>

              {/* Decorative Image/Box */}
              <div className="relative h-[500px] w-full bg-stone-200 rounded-lg overflow-hidden hidden lg:block">
                 <div className="absolute inset-0 bg-black/20" />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-8 border border-white/20 bg-white/10 backdrop-blur-md rounded-xl max-w-xs">
                        <h4 className="text-3xl font-serif text-white mb-2">Events & Gatherings</h4>
                        <p className="text-white/80 mb-6">Host your koroga or corporate dinner in our exclusive Nairobi lounge.</p>
                        <Button variant="outline" className="text-white border-white hover:bg-white hover:text-black">Enquire Now</Button>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-neutral-900 text-neutral-400 py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div className="col-span-1 md:col-span-2">
                <h3 className="text-2xl font-serif text-white mb-4">Savor & Vine</h3>
                <p className="max-w-sm text-neutral-400">
                  Bringing the spirit of Kenya to your plate with modern flair. Authentic, sustainable, and unforgettable.
                </p>
              </div>
              <div>
                <h4 className="text-white font-bold mb-4">Links</h4>
                <ul className="space-y-2">
                  <li><Link href="/"><span className="hover:text-primary transition-colors cursor-pointer">Home</span></Link></li>
                  <li><Link href="/#menu"><span className="hover:text-primary transition-colors cursor-pointer">Menu</span></Link></li>
                  <li><Link href="/story"><span className="hover:text-primary transition-colors cursor-pointer">Story</span></Link></li>
                  <li><Link href="/reservations"><span className="hover:text-primary transition-colors cursor-pointer">Reservations</span></Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-4">Contact</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2"><Phone className="w-4 h-4"/> +254 712 345 678</li>
                  <li className="flex items-center gap-2"><MapPin className="w-4 h-4"/> Karen, Nairobi</li>
                  <li>info@savorandvine.co.ke</li>
                </ul>
              </div>
            </div>
            <Separator className="bg-neutral-800 my-8" />
            <div className="text-center text-sm">
              © 2024 Savor & Vine Kenya. All rights reserved.
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
