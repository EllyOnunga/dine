import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const menuItems = [
  {
    category: "Starters",
    items: [
      { name: "Burrata & Figs", price: "$18", description: "Fresh burrata, caramelized figs, toasted hazelnuts, balsamic glaze", tag: "Vegetarian" },
      { name: "Wagyu Carpaccio", price: "$24", description: "Thinly sliced wagyu beef, truffle oil, parmesan shavings, arugula", tag: "Signature" },
      { name: "Seared Scallops", price: "$22", description: "Pan-seared scallops, cauliflower purée, crispy pancetta, lemon butter" },
    ]
  },
  {
    category: "Mains",
    items: [
      { name: "Truffle Mushroom Risotto", price: "$28", description: "Arborio rice, wild mushrooms, black truffle, parmesan crisp", tag: "Popular" },
      { name: "Pan-Roasted Duck Breast", price: "$34", description: "Duck breast, cherry reduction, fondant potatoes, roasted asparagus" },
      { name: "Herb-Crusted Lamb Rack", price: "$42", description: "New Zealand lamb, pistachio crust, red wine jus, root vegetables" },
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
              <h3 className="text-2xl font-serif font-semibold mb-8 border-b border-border pb-4 flex justify-between items-baseline">
                {category.category}
              </h3>
              <div className="space-y-8">
                {category.items.map((item) => (
                  <div key={item.name} className="group cursor-default">
                    <div className="flex justify-between items-baseline mb-2">
                      <h4 className="text-xl font-medium group-hover:text-primary transition-colors flex items-center gap-2">
                        {item.name}
                        {item.tag && (
                          <Badge variant="outline" className="text-xs font-normal border-primary/50 text-primary bg-primary/5 ml-2">
                            {item.tag}
                          </Badge>
                        )}
                      </h4>
                      <span className="text-lg font-serif italic text-muted-foreground ml-4">{item.price}</span>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {item.description}
                    </p>
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
