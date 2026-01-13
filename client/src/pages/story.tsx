import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChefHat, Star, Users } from "lucide-react";

export default function Story() {
  return (
    <div className="pt-24 min-h-screen bg-background text-foreground">
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <span className="text-primary font-medium tracking-widest uppercase text-sm mb-2 block">Our Journey</span>
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">A Legacy of Taste</h1>
            <p className="text-xl text-muted-foreground leading-relaxed italic">"Cooking is not just about ingredients; it's about the soul of the artisan."</p>
          </motion.div>

          <div className="grid gap-12 text-lg leading-relaxed text-muted-foreground">
            <p>
              Founded in 2024, Savor & Vine began as a small dream to bring authentic, seasonal bistro flavors to the heart of the city. Our founder, Chef Elena Rossi, envisioned a space where the warmth of a rustic kitchen meets the elegance of modern fine dining.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-none shadow-none bg-muted/30">
                <CardContent className="pt-6 text-center">
                  <ChefHat className="w-8 h-8 mx-auto text-primary mb-4" />
                  <h3 className="font-serif font-bold mb-2">Artisanal Craft</h3>
                  <p className="text-sm">Every dish is handcrafted with precision and passion.</p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-none bg-muted/30">
                <CardContent className="pt-6 text-center">
                  <Users className="w-8 h-8 mx-auto text-primary mb-4" />
                  <h3 className="font-serif font-bold mb-2">Community</h3>
                  <p className="text-sm">A place where memories are shared and laughter flows.</p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-none bg-muted/30">
                <CardContent className="pt-6 text-center">
                  <Star className="w-8 h-8 mx-auto text-primary mb-4" />
                  <h3 className="font-serif font-bold mb-2">Quality</h3>
                  <p className="text-sm">We source only the finest local, organic ingredients.</p>
                </CardContent>
              </Card>
            </div>
            <p>
              Today, we continue to push culinary boundaries while staying true to our roots. Our commitment to sustainability and flavor remains the heartbeat of everything we serve.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
