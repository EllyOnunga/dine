import { useQuery } from "@tanstack/react-query";
import { MenuItem } from "@shared/schema";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/cart-context";
import { Link } from "wouter";
import { ChevronRight, Utensils } from "lucide-react";

export default function MenuPage() {
    const { addToCart } = useCart();
    const { data: menuItems, isLoading } = useQuery<MenuItem[]>({
        queryKey: ["/api/menu"],
    });

    if (isLoading) {
        return (
            <div className="min-h-screen pt-24 bg-background">
                <div className="container mx-auto px-4">
                    <Skeleton className="h-12 w-64 mb-8" />
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Skeleton key={i} className="h-80 rounded-xl" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const categories = Array.from(new Set(menuItems?.map((item) => item.category)));

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <section className="relative py-24 bg-primary text-white overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2000')] bg-cover bg-center opacity-20" />
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-serif font-bold mb-4">Our Menu</h1>
                        <p className="text-xl text-white/80 max-w-2xl mx-auto font-light">
                            A curated collection of Kenya's finest flavors, prepared with modern techniques and traditional soul.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Menu Content */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="space-y-20 max-w-6xl mx-auto">
                        {categories.map((category) => (
                            <div key={category} className="space-y-10">
                                <div className="flex items-center gap-6">
                                    <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                                        <Utensils className="w-6 h-6" />
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-serif font-bold">{category}</h2>
                                    <div className="h-[1px] flex-1 bg-border/50" />
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    {menuItems
                                        ?.filter((item) => item.category === category)
                                        .map((item, index) => (
                                            <motion.div
                                                key={item.id}
                                                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                            >
                                                <Card className="group border-none bg-muted/30 hover:bg-muted/50 transition-all duration-300">
                                                    <CardContent className="p-6 flex gap-6">
                                                        <div className="relative w-32 h-32 flex-shrink-0 overflow-hidden rounded-xl">
                                                            <img
                                                                src={item.image}
                                                                alt={item.name}
                                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                            />
                                                        </div>
                                                        <div className="flex-1 space-y-2">
                                                            <div className="flex justify-between items-start">
                                                                <h3 className="text-xl font-serif font-bold text-foreground group-hover:text-primary transition-colors">
                                                                    {item.name}
                                                                </h3>
                                                                <div className="text-right">
                                                                    {item.originalPrice && (
                                                                        <span className="text-sm text-muted-foreground line-through block">
                                                                            {item.originalPrice}
                                                                        </span>
                                                                    )}
                                                                    <span className="text-lg font-serif font-bold text-primary">
                                                                        {item.price}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <p className="text-muted-foreground text-sm italic leading-relaxed">
                                                                {item.description}
                                                            </p>
                                                            {item.tag && (
                                                                <Badge variant="secondary" className="bg-primary/5 text-primary border-none">
                                                                    {item.tag}
                                                                </Badge>
                                                            )}
                                                            <div className="pt-2">
                                                                <Button
                                                                    size="sm"
                                                                    className="w-full sm:w-auto gap-2"
                                                                    onClick={() => addToCart(item)}
                                                                >
                                                                    <Utensils className="h-4 w-4" /> Add to Cart
                                                                </Button>
                                                            </div>
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

            {/* Footer CTA */}
            <section className="pb-24 pt-12">
                <div className="container mx-auto px-4 text-center">
                    <div className="bg-primary/5 p-12 rounded-[3rem] border border-primary/10 max-w-4xl mx-auto">
                        <h3 className="text-3xl font-serif font-bold mb-6">Ready to Experience Savannah Spice?</h3>
                        <p className="text-muted-foreground mb-10 max-w-xl mx-auto italic">
                            Join us for an unforgettable dining experience in the heart of Karen.
                        </p>
                        <Link href="/reservations">
                            <button className="bg-primary text-white px-10 py-4 rounded-full font-serif text-lg hover:bg-primary/90 transition-all shadow-xl hover:shadow-primary/20 flex items-center gap-2 mx-auto">
                                Make a Reservation <ChevronRight className="w-5 h-5" />
                            </button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
