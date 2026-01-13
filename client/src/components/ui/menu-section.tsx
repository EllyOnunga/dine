import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Import generated images
import burrataImg from "@assets/generated_images/gourmet_burrata_and_figs_salad_shot_professionally.png";
import wagyuImg from "@assets/generated_images/wagyu_beef_carpaccio_with_truffle_oil_shot_professionally.png";
import scallopsImg from "@assets/generated_images/seared_scallops_with_cauliflower_puree_shot_professionally.png";
import risottoImg from "@assets/generated_images/truffle_mushroom_risotto_with_parmesan_crisp_shot_professionally.png";
import duckImg from "@assets/generated_images/pan-roasted_duck_breast_with_cherry_reduction_shot_professionally.png";
import lambImg from "@assets/generated_images/herb-crusted_lamb_rack_with_red_wine_jus_shot_professionally.png";

const menuItems = [
  {
    category: "Starters",
    items: [
      { name: "Burrata & Figs", price: "$18", description: "Fresh burrata, caramelized figs, toasted hazelnuts, balsamic glaze", tag: "Vegetarian", image: burrataImg },
      { name: "Wagyu Carpaccio", price: "$24", description: "Thinly sliced wagyu beef, truffle oil, parmesan shavings, arugula", tag: "Signature", image: wagyuImg },
      { name: "Seared Scallops", price: "$22", description: "Pan-seared scallops, cauliflower purée, crispy pancetta, lemon butter", image: scallopsImg },
    ]
  },
  {
    category: "Mains",
    items: [
      { name: "Truffle Mushroom Risotto", price: "$28", description: "Arborio rice, wild mushrooms, black truffle, parmesan crisp", tag: "Popular", image: risottoImg },
      { name: "Pan-Roasted Duck Breast", price: "$34", description: "Duck breast, cherry reduction, fondant potatoes, roasted asparagus", image: duckImg },
      { name: "Herb-Crusted Lamb Rack", price: "$42", description: "New Zealand lamb, pistachio crust, red wine jus, root vegetables", image: lambImg },
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
            Discover Our Flavors
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-serif font-bold text-foreground"
          >
            The Menu
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
                        <div className="mt-6 pt-4 border-t border-border/50 flex justify-between items-center">
                          <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Chef's Special</span>
                          <motion.div 
                            whileHover={{ x: 5 }}
                            className="text-primary cursor-pointer"
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                          </motion.div>
                        </div>
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
