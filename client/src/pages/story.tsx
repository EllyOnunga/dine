import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChefHat, Star, Users, Loader2 } from "lucide-react";
import { useSiteContent } from "@/hooks/use-site-data";
import { Skeleton } from "@/components/ui/skeleton";

const iconMap: Record<string, any> = {
    ChefHat,
    Users,
    Star
};

export default function Story() {
  const { data: content, isLoading } = useSiteContent('story');

  if (isLoading) {
    return (
      <div className="pt-24 min-h-screen bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <Skeleton className="h-20 w-3/4 mx-auto mb-16" />
          <Skeleton className="h-64 w-full rounded-2xl mb-12" />
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-40 rounded-2xl" />)}
          </div>
        </div>
      </div>
    );
  }

  const mainStory = content?.find(c => c.key === 'main_story')?.value || "Born in the heart of Nairobi in 2024, Savannah & Spice is a celebration of Kenyan culinary heritage.";
  const closingStory = content?.find(c => c.key === 'closing_story')?.value || "Whether you're joining us for a sunset Nyama Choma platter or a coastal-inspired Samaki wa Kupaka, every bite tells a story.";
  const cards = content?.filter(c => c.key === 'card').map(c => JSON.parse(c.value)) || [];

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
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 text-primary">Kenyan Heart, Global Soul</h1>
            <p className="text-xl text-muted-foreground leading-relaxed italic">"Inspired by the rich heritage of the Rift Valley and the vibrant spirit of Nairobi."</p>
          </motion.div>

          <div className="grid gap-12 text-lg leading-relaxed text-muted-foreground">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              {mainStory}
            </motion.p>
            <div className="grid md:grid-cols-3 gap-8">
              {cards.map((card: any, idx: number) => {
                const Icon = iconMap[card.icon] || ChefHat;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                  >
                    <Card className="border-none shadow-none bg-muted/30 h-full">
                      <CardContent className="pt-6 text-center">
                        <Icon className="w-8 h-8 mx-auto text-primary mb-4" />
                        <h3 className="font-serif font-bold mb-2">{card.title}</h3>
                        <p className="text-sm">{card.desc}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              {closingStory}
            </motion.p>
          </div>
        </div>
      </section>
    </div>
  );
}
