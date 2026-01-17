import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { MenuItem } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export function MenuSection() {
  const { data: menuItems, isLoading } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu"],
  });

  if (isLoading) {
    return (
      <section id="menu" className="py-24 bg-background overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Skeleton className="h-4 w-32 mx-auto mb-2" />
            <Skeleton className="h-10 w-64 mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-80 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const categories = Array.from(new Set(menuItems?.map(item => item.category)));

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
          {categories.map((category, catIdx) => (
            <div key={category}>
              <motion.h3
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-3xl font-serif font-semibold mb-12 flex items-center gap-4 text-primary"
              >
                {category}
                <div className="h-[1px] flex-1 bg-border/50" />
              </motion.h3>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {menuItems?.filter(item => item.category === category).map((item, itemIdx) => (
                  <Dialog key={item.name}>
                    <DialogTrigger asChild>
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{
                          duration: 0.6,
                          delay: itemIdx * 0.1,
                          ease: "easeOut"
                        }}
                        className="cursor-pointer"
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
                              <div className="text-right">
                                {item.originalPrice && (
                                  <span className="text-xs text-muted-foreground line-through block leading-none mb-1">
                                    {item.originalPrice}
                                  </span>
                                )}
                                <span className="text-lg font-serif font-semibold text-primary block leading-none">
                                  {item.price}
                                </span>
                              </div>
                            </div>
                            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 italic">
                              {item.description}
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] border-none bg-background rounded-3xl overflow-hidden p-0 shadow-2xl">
                      <div className="relative h-64 w-full">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                      </div>
                      <div className="p-8 space-y-4">
                        <div className="flex justify-between items-center">
                          <DialogTitle className="text-3xl font-serif font-bold text-foreground">
                            {item.name}
                          </DialogTitle>
                          <div className="text-right">
                            {item.originalPrice && (
                              <span className="text-sm text-muted-foreground line-through block">
                                {item.originalPrice}
                              </span>
                            )}
                            <span className="text-2xl font-serif font-semibold text-primary block">
                              {item.price}
                            </span>
                          </div>
                        </div>
                        {item.tag && (
                          <Badge className="bg-primary/10 text-primary border-primary/20">
                            {item.tag}
                          </Badge>
                        )}
                        <DialogDescription className="text-lg text-muted-foreground leading-relaxed italic">
                          {item.description}
                        </DialogDescription>
                        <div className="pt-4">
                          <p className="text-sm text-muted-foreground opacity-60">
                            * Chef's selection. All ingredients are locally sourced from Kenyan farms.
                          </p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
