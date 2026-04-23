import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "./button";
import { ShoppingBag } from "lucide-react";

export function OrderOnlinePromo() {
  return (
    <section className="py-0 relative overflow-hidden bg-primary/5">
      <div className="flex flex-col md:flex-row min-h-[400px]">
        {/* Left Side text */}
        <div className="md:w-1/2 p-8 sm:p-12 lg:p-24 flex flex-col justify-center bg-white z-10 shadow-xl md:shadow-2xl">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-foreground mb-4 sm:mb-6">
              Craving Savannah Spice?
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg mb-6 sm:mb-8 max-w-md leading-relaxed">
              Experience our signature flavors from the comfort of your home. Enjoy fast delivery or swing by for quick pickup.
            </p>
            <Link href="/menu" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg flex items-center justify-center gap-2 font-serif group">
                <ShoppingBag className="w-5 h-5 group-hover:-translate-y-1 transition-transform" /> Start Order
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Right Side Image */}
        <div className="md:w-1/2 relative min-h-[300px] md:min-h-full">
             <img 
               src="https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1000" 
               alt="Gourmet Burger Delivery"
               className="absolute inset-0 w-full h-full object-cover"
             />
             <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent md:w-32 hidden md:block" />
        </div>
      </div>
    </section>
  );
}
