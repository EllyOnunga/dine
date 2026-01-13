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
            <span className="text-primary font-medium tracking-widest uppercase text-sm mb-2 block">Our Story</span>
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">Kenyan Heart, Global Soul</h1>
            <p className="text-xl text-muted-foreground leading-relaxed italic">"Inspired by the rich heritage of the Rift Valley and the vibrant spirit of Nairobi."</p>
          </motion.div>

          <div className="grid gap-12 text-lg leading-relaxed text-muted-foreground">
            <p>
              Born in the heart of Nairobi in 2024, Savor & Vine is a celebration of Kenyan culinary heritage. Our mission is to elevate local ingredients—from the freshest Tilapia of Lake Victoria to the finest prime cuts of the highlands—and present them with modern artisanal flair.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-none shadow-none bg-muted/30">
                <CardContent className="pt-6 text-center">
                  <ChefHat className="w-8 h-8 mx-auto text-primary mb-4" />
                  <h3 className="font-serif font-bold mb-2">Local Sourcing</h3>
                  <p className="text-sm">We partner directly with Kenyan farmers for sustainable, farm-to-table excellence.</p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-none bg-muted/30">
                <CardContent className="pt-6 text-center">
                  <Users className="w-8 h-8 mx-auto text-primary mb-4" />
                  <h3 className="font-serif font-bold mb-2">Utamaduni</h3>
                  <p className="text-sm">Celebrating our culture through food, music, and Kenyan hospitality.</p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-none bg-muted/30">
                <CardContent className="pt-6 text-center">
                  <Star className="w-8 h-8 mx-auto text-primary mb-4" />
                  <h3 className="font-serif font-bold mb-2">Innovation</h3>
                  <p className="text-sm">Redefining Kenyan cuisine for the modern world while respecting our roots.</p>
                </CardContent>
              </Card>
            </div>
            <p>
              Whether you're joining us for a sunset Nyama Choma platter or a coastal-inspired Swahili curry, every bite at Savor & Vine tells a story of the soil we call home.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
