import { useQuery } from "@tanstack/react-query";
import { MenuItem } from "@shared/schema";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/cart-context";
import { Link } from "wouter";
import { ChevronRight, Utensils, Minus, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";

export default function MenuPage() {
    const { addToCart } = useCart();
    const { data: menuItems, isLoading } = useQuery<MenuItem[]>({
        queryKey: ["/api/menu"],
    });

    const [activeCategory, setActiveCategory] = useState<string>("All");
    const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (isLoading) {
        return (
            <div className="min-h-screen pt-24 bg-background">
                <div className="container mx-auto px-4">
                    <Skeleton className="h-12 w-64 mb-8" />
                    <div className="flex gap-4 mb-8">
                        <Skeleton className="h-10 w-24 rounded-full" />
                        <Skeleton className="h-10 w-24 rounded-full" />
                        <Skeleton className="h-10 w-24 rounded-full" />
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Skeleton key={i} className="h-48 rounded-xl" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const categories = ["All", ...Array.from(new Set(menuItems?.map((item) => item.category)))];

    const filteredItems = menuItems?.filter(
        (item) => activeCategory === "All" || item.category === activeCategory
    ) || [];

    const handleOpenModal = (item: MenuItem) => {
        setSelectedItem(item);
        setSelectedQuantity(1);
        setIsModalOpen(true);
    };

    const handleAddToCart = () => {
        if (selectedItem) {
            for (let i = 0; i < selectedQuantity; i++) {
                addToCart(selectedItem);
            }
            setIsModalOpen(false);
        }
    };

    const calculateItemPrice = (priceStr: string) => {
        const num = parseFloat(priceStr.replace(/[^0-9.]/g, ''));
        return isNaN(num) ? 0 : num;
    };

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
                    <div className="max-w-6xl mx-auto">
                        
                        {/* Category Filters */}
                        <div className="flex overflow-x-auto pb-4 mb-8 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap gap-3 sm:justify-center no-scrollbar">
                            {categories.map((category) => (
                                <Button
                                    key={category}
                                    variant={activeCategory === category ? "default" : "outline"}
                                    className={`rounded-full px-6 font-serif whitespace-nowrap h-11 ${activeCategory === category ? 'shadow-md ring-2 ring-primary/20' : ''}`}
                                    onClick={() => setActiveCategory(category)}
                                >
                                    {category}
                                </Button>
                            ))}
                        </div>

                        {/* Items Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                            {filteredItems.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    onClick={() => handleOpenModal(item)}
                                >
                                    <Card className="group cursor-pointer border-none shadow-sm hover:shadow-xl bg-card hover:bg-muted/30 transition-all duration-300">
                                        <CardContent className="p-3 sm:p-4 flex gap-4 h-full">
                                            <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 overflow-hidden rounded-lg">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>
                                            <div className="flex-1 flex flex-col min-w-0">
                                                <div className="flex justify-between items-start mb-1 gap-2">
                                                    <h3 className="text-base sm:text-lg font-serif font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                                        {item.name}
                                                    </h3>
                                                    <span className="font-serif font-bold text-primary whitespace-nowrap">
                                                        {item.price}
                                                    </span>
                                                </div>
                                                <p className="text-muted-foreground text-xs sm:text-sm italic leading-snug line-clamp-2 mb-2 flex-grow">
                                                    {item.description}
                                                </p>
                                                <div className="flex justify-between items-end mt-auto">
                                                    <div>
                                                        {item.tag && (
                                                            <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-[9px] sm:text-[10px] px-1.5 py-0">
                                                                {item.tag}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <div className="bg-primary/5 p-1.5 sm:p-2 rounded-full group-hover:bg-primary group-hover:text-white transition-colors text-primary">
                                                        <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>

                        {filteredItems.length === 0 && (
                            <div className="text-center py-20 text-muted-foreground">
                                No items found in this category.
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Item Modal Popup */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-lg p-0 overflow-hidden rounded-2xl border-none">
                    {selectedItem && (
                        <div className="flex flex-col">
                            <div className="relative h-64 w-full">
                                <img
                                    src={selectedItem.image}
                                    alt={selectedItem.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                            </div>
                            <div className="p-4 sm:p-6 pt-0 -mt-8 relative z-10 space-y-4 sm:space-y-6">
                                <div>
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-2 gap-1">
                                        <DialogTitle className="text-2xl sm:text-3xl font-serif font-bold">
                                            {selectedItem.name}
                                        </DialogTitle>
                                        <span className="text-xl sm:text-2xl font-serif text-primary font-bold">
                                            {selectedItem.price}
                                        </span>
                                    </div>
                                    {selectedItem.tag && (
                                        <Badge className="bg-primary/20 text-primary hover:bg-primary/30 mb-3 sm:mb-4">{selectedItem.tag}</Badge>
                                    )}
                                    <DialogDescription className="text-sm sm:text-base text-foreground/80 leading-relaxed italic">
                                        {selectedItem.description}
                                    </DialogDescription>
                                </div>
                                
                                <div className="bg-muted/50 rounded-xl p-3 sm:p-4 space-y-2 sm:space-y-3">
                                    <h4 className="font-bold text-[10px] sm:text-sm uppercase tracking-wider text-muted-foreground">Special Instructions</h4>
                                    <textarea 
                                        placeholder="Any allergies or specific prep requests?"
                                        className="w-full bg-background border border-border rounded-md text-sm p-3 focus:outline-none focus:ring-1 focus:ring-primary min-h-[60px] sm:min-h-[80px]"
                                    ></textarea>
                                </div>

                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2">
                                    <div className="flex items-center justify-between border border-border rounded-lg bg-background overflow-hidden">
                                        <button 
                                            onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
                                            className="p-3 hover:bg-muted transition-colors text-foreground flex-1 flex justify-center"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="w-12 text-center font-bold text-lg">{selectedQuantity}</span>
                                        <button 
                                            onClick={() => setSelectedQuantity(selectedQuantity + 1)}
                                            className="p-3 hover:bg-muted transition-colors text-foreground flex-1 flex justify-center"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <Button 
                                        className="flex-1 h-12 text-lg font-serif group"
                                        onClick={handleAddToCart}
                                    >
                                        Add to Cart <span className="ml-2 font-sans opacity-80 text-sm sm:text-base">(KSh {(calculateItemPrice(selectedItem.price) * selectedQuantity).toLocaleString()})</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

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

