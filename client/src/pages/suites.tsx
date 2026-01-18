import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Suite } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coffee, Wifi, Tv, Wind, ShieldCheck, MapPin } from "lucide-react";
import { Link } from "wouter";

export default function SuitesPage() {
    const { data: suites, isLoading } = useQuery<Suite[]>({
        queryKey: ["/api/suites"],
    });

    return (
        <div className="min-h-screen bg-background pt-24">
            {/* Hero Section */}
            <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2000"
                        alt="Luxury Suite"
                        className="w-full h-full object-cover brightness-50"
                    />
                </div>
                <div className="container relative z-10 text-center text-white px-4">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-serif font-bold mb-6"
                    >
                        Luxury Stay in Karen
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl md:text-2xl font-light max-w-2xl mx-auto opacity-90"
                    >
                        Experience unparalleled comfort and elegance at the heart of Nairobi's most prestigious suburb.
                    </motion.p>
                </div>
            </section>

            {/* Suites Listing */}
            <section className="py-24 container mx-auto px-4">
                <div className="text-center mb-16">
                    <span className="text-primary font-medium tracking-widest uppercase text-sm mb-2 block">
                        Our Accommodations
                    </span>
                    <h2 className="text-4xl font-serif font-bold">The Suites Collection</h2>
                </div>

                {isLoading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-[500px] w-full rounded-2xl" />
                        ))}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {suites?.map((suite, index) => (
                            <motion.div
                                key={suite.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl group">
                                    <div className="relative h-64 overflow-hidden">
                                        <img
                                            src={suite.image}
                                            alt={suite.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute top-4 right-4">
                                            <Badge className="bg-white/90 text-primary hover:bg-white font-serif italic text-lg shadow-lg">
                                                KSh {suite.pricePerNight.toLocaleString()} / Night
                                            </Badge>
                                        </div>
                                    </div>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-2xl font-serif font-bold">{suite.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <p className="text-muted-foreground line-clamp-2">
                                            {suite.description}
                                        </p>
                                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground border-t pt-4">
                                            <div className="flex items-center gap-1">
                                                <Wifi className="w-4 h-4 text-primary" />
                                                <span>Free WiFi</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Coffee className="w-4 h-4 text-primary" />
                                                <span>Breakfast</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <ShieldCheck className="w-4 h-4 text-primary" />
                                                <span>Secure</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Tv className="w-4 h-4 text-primary" />
                                                <span>Smart TV</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Link href="/contact" className="w-full">
                                            <Button className="w-full font-serif italic text-lg h-12">
                                                Inquire Now
                                            </Button>
                                        </Link>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>

            {/* Why Stay With Us */}
            <section className="bg-muted/30 py-24">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <h2 className="text-4xl font-serif font-bold leading-tight">
                                Your Home Away From Home in Nairobi
                            </h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Located in the serene Karen area, our suites offer a perfect blend of modern luxury and African charm. Whether you're here for business or a tranquil getaway, every detail has been crafted for your comfort.
                            </p>
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="p-6 bg-background rounded-xl shadow-sm border border-border/50">
                                    <MapPin className="w-6 h-6 text-primary mb-4" />
                                    <h3 className="font-bold mb-2">Prime Location</h3>
                                    <p className="text-sm text-muted-foreground italic">Walking distance to Karen Triangle Mall and major attractions.</p>
                                </div>
                                <div className="p-6 bg-background rounded-xl shadow-sm border border-border/50">
                                    <ShieldCheck className="w-6 h-6 text-primary mb-4" />
                                    <h3 className="font-bold mb-2">24/7 Security</h3>
                                    <p className="text-sm text-muted-foreground italic">Rest easy with our round-the-clock professional security services.</p>
                                </div>
                            </div>
                        </div>
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[500px]">
                            <img
                                src="https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1200"
                                alt="Suite Interior"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
