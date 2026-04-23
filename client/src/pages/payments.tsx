import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, ShieldCheck, Smartphone, CreditCard, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useSiteSettings, useSiteContent } from "@/hooks/use-site-data";
import { Skeleton } from "@/components/ui/skeleton";

export default function PaymentMethods() {
    const { data: settings, isLoading: settingsLoading } = useSiteSettings();
    const { data: mpesaContent, isLoading: mpesaLoading } = useSiteContent('payments_mpesa');
    const { data: cardContent, isLoading: cardLoading } = useSiteContent('payments_cards');

    if (settingsLoading || mpesaLoading || cardLoading) {
        return (
            <div className="pt-32 min-h-screen bg-background">
                <div className="container mx-auto px-4">
                    <Skeleton className="h-48 w-full mb-12" />
                    <div className="grid md:grid-cols-2 gap-8">
                        <Skeleton className="h-[600px] w-full rounded-2xl" />
                        <Skeleton className="h-[600px] w-full rounded-2xl" />
                    </div>
                </div>
            </div>
        );
    }

    const steps = [
        {
            title: "M-Pesa Payments",
            icon: <Smartphone className="w-8 h-8 text-primary" />,
            image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800", // Dynamic eventually
            description: "Fast and secure mobile payments directly from your phone.",
            howItWorks: mpesaContent?.filter(c => c.key === 'step').map(c => c.value) || [],
            details: `You can also use our Paybill ${settings?.mpesaPaybill || '123456'} or Buy Goods TILL ${settings?.mpesaTill || '789012'}.`
        },
        {
            title: "Credit & Debit Cards",
            icon: <CreditCard className="w-8 h-8 text-primary" />,
            image: "https://images.unsplash.com/photo-1556740758-90eb79425181?q=80&w=800", // Dynamic eventually
            description: "We accept all major international and local cards.",
            howItWorks: cardContent?.filter(c => c.key === 'step').map(c => c.value) || [],
            details: "Accepted cards: Visa, Mastercard, American Express, and more."
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 bg-primary text-white overflow-hidden">
                <div className="absolute inset-0 bg-black/40 z-0" />
                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl"
                    >
                        <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">Seamless Payments</h1>
                        <p className="text-xl text-white/80 leading-relaxed font-light">
                            At Savannah & Spice, we believe your dining experience should be flawless from the first bite to the final bill. Explore our secure and convenient payment options.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Security Banner */}
            <div className="bg-muted py-4 border-b border-border">
                <div className="container mx-auto px-4 flex items-center justify-center gap-4 text-sm font-medium text-muted-foreground">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                    <span>PCI-DSS Compliant • Encrypted Transactions • Secured by Industry Leaders</span>
                </div>
            </div>

            {/* Payment Options Section */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12">
                        {steps.map((method, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                            >
                                <Card className="overflow-hidden border-border/50 bg-card shadow-2xl h-full flex flex-col">
                                    <div className="h-64 overflow-hidden">
                                        <img
                                            src={method.image}
                                            alt={method.title}
                                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                                        />
                                    </div>
                                    <CardHeader className="p-8 pb-4">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="p-3 bg-primary/10 rounded-2xl">
                                                {method.icon}
                                            </div>
                                            <div>
                                                <CardTitle className="text-3xl font-serif">{method.title}</CardTitle>
                                                <CardDescription className="text-lg mt-1">{method.description}</CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-8 pt-0 flex-1">
                                        <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                                            <ChevronRight className="w-5 h-5 text-primary" />
                                            How it works
                                        </h4>
                                        <ul className="space-y-4">
                                            {method.howItWorks.map((step, i) => (
                                                <li key={i} className="flex items-start gap-3 text-muted-foreground">
                                                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                                    <span>{step}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="mt-8 p-4 bg-muted/50 rounded-xl border border-border border-dashed text-sm font-medium">
                                            {method.details}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="pb-24">
                <div className="container mx-auto px-4 text-center">
                    <div className="bg-primary/5 border border-primary/10 rounded-[3rem] p-12 max-w-4xl mx-auto">
                        <h2 className="text-3xl font-serif font-bold mb-6 italic">Ready for an Unforgettable Dining Experience?</h2>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/reservations">
                                <Button size="lg" className="bg-primary hover:bg-primary/90 h-14 px-8 text-lg font-serif">
                                    Make a Reservation
                                </Button>
                            </Link>
                            <Link href="/menu">
                                <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-serif">
                                    Explore Our Menu
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
