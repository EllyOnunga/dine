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
    <section id="menu" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-primary font-medium tracking-widest uppercase text-sm mb-2 block">
            Discover Our Flavors
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
            The Menu
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mt-6" />
        </div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-24 max-w-6xl mx-auto">
          {menuItems.map((category, idx) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
            >
              <h3 className="text-2xl font-serif font-semibold mb-8 border-b border-border pb-4 flex justify-between items-baseline text-primary">
                {category.category}
              </h3>
              <div className="space-y-12">
                {category.items.map((item) => (
                  <div key={item.name} className="group flex flex-col sm:flex-row gap-6 items-start">
                    <div className="relative h-32 w-full sm:w-32 shrink-0 overflow-hidden rounded-lg shadow-md border border-border/50 transition-transform duration-500 group-hover:scale-105">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-baseline mb-2">
                        <h4 className="text-xl font-serif font-bold group-hover:text-primary transition-colors flex items-center flex-wrap gap-2">
                          {item.name}
                          {item.tag && (
                            <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-normal border-primary/50 text-primary bg-primary/5">
                              {item.tag}
                            </Badge>
                          )}
                        </h4>
                        <span className="text-lg font-serif italic text-primary ml-4">{item.price}</span>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed italic">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
