import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Import Kenyan generated images
import nyamaChomaImg from "@assets/generated_images/nyama_choma_platter_with_kachumbari_and_ugali_shot_professionally.png";
import fishCurryImg from "@assets/generated_images/swahili_fish_curry_with_coconut_rice_shot_professionally.png";
import samosaImg from "@assets/generated_images/samosas_and_mahamri_on_a_platter_shot_professionally.png";
import tilapiaImg from "@assets/generated_images/grilled_tilapia_with_plantains_shot_professionally.png";
import biryaniImg from "@assets/generated_images/chicken_biryani_kenyan_style_shot_professionally.png";
import beefStewImg from "@assets/generated_images/beef_stew_with_chapati_shot_professionally.png";

const menuItems = [
  {
    category: "Bitings & Starters",
    items: [
      { name: "Maasai Beef Samosas", price: "KSh 450", description: "Three crispy samosas filled with spiced minced beef and local herbs", tag: "Must Try", image: samosaImg },
      { name: "Swahili Mahamri", price: "KSh 350", description: "Golden-brown coconut donuts, perfect with your morning tea or stew", tag: "Coastal", image: samosaImg },
      { name: "Lake Victoria Tilapia Bites", price: "KSh 850", description: "Crispy fried tilapia nuggets served with a tangy lime dip", image: tilapiaImg },
    ]
  },
  {
    category: "Main Plates",
    items: [
      { name: "Grand Nyama Choma Platter", price: "KSh 1,800", description: "Prime goat meat flame-grilled to perfection, served with Ugali and Kachumbari", tag: "Signature", image: nyamaChomaImg },
      { name: "Coastal Samaki wa Kupaka", price: "KSh 1,450", description: "Grilled fish in a rich, creamy coconut and tamarind sauce", tag: "Swahili", image: fishCurryImg },
      { name: "Mombasa Chicken Biryani", price: "KSh 1,200", description: "Fragrant rice layered with tender spiced chicken, served with raita", image: biryaniImg },
      { name: "Heritage Beef Stew", price: "KSh 950", description: "Slow-cooked beef chunks with garden vegetables, served with layered Chapati", image: beefStewImg },
    ]
  }
];

export function MenuSection() {
  return (
    <section id="menu" className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary font-medium tracking-widest uppercase text-sm mb-2 block"
          >
            A Taste of Kenya
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-serif font-bold text-foreground"
          >
            Our Menu
          </motion.h2>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="h-1 bg-primary mx-auto mt-6" 
          />
        </div>

        <div className="space-y-24 max-w-6xl mx-auto">
          {menuItems.map((category, catIdx) => (
            <div key={category.category}>
              <motion.h3 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-3xl font-serif font-semibold mb-12 flex items-center gap-4 text-primary"
              >
                {category.category}
                <div className="h-[1px] flex-1 bg-border/50" />
              </motion.h3>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {category.items.map((item, itemIdx) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ 
                      duration: 0.6, 
                      delay: itemIdx * 0.1,
                      ease: "easeOut" 
                    }}
                  >
                    <Card className="group h-full border-border/50 bg-card hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 overflow-hidden">
                      <div className="relative h-56 overflow-hidden">
                        <motion.img 
                          src={item.image} 
                          alt={item.name} 
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute top-4 right-4">
                           {item.tag && (
                            <Badge className="bg-primary text-white border-none shadow-lg">
                              {item.tag}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="text-xl font-serif font-bold group-hover:text-primary transition-colors">
                            {item.name}
                          </h4>
                          <span className="text-lg font-serif font-semibold text-primary">{item.price}</span>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 italic">
                          {item.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
