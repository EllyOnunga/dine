import { motion } from "framer-motion";
import {
    HelpCircle,
    MapPin,
    Clock,
    UtensilsCrossed,
    Users,
    Wine,
    Loader2
} from "lucide-react";
import { useFAQs } from "@/hooks/use-site-data";
import { Skeleton } from "@/components/ui/skeleton";

const iconMap: Record<string, React.ReactNode> = {
    MapPin: <MapPin className="w-6 h-6 text-primary" />,
    Clock: <Clock className="w-6 h-6 text-primary" />,
    UtensilsCrossed: <UtensilsCrossed className="w-6 h-6 text-primary" />,
    Users: <Users className="w-6 h-6 text-primary" />,
    Wine: <Wine className="w-6 h-6 text-primary" />,
    HelpCircle: <HelpCircle className="w-6 h-6 text-primary" />
};

export default function FAQs() {
    const { data: faqs, isLoading } = useFAQs();

    if (isLoading) {
        return (
            <div className="pt-32 pb-24 min-h-screen bg-background">
                <div className="container mx-auto px-4 max-w-5xl">
                    <Skeleton className="h-12 w-64 mx-auto mb-16" />
                    <div className="grid md:grid-cols-2 gap-8">
                        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-48 rounded-2xl" />)}
                    </div>
                </div>
            </div>
        );
    }

    const items = faqs || [];
    return (
        <div className="pt-32 pb-24 min-h-screen bg-background">
            <div className="container mx-auto px-4 max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <span className="text-primary font-medium tracking-widest uppercase text-sm mb-2 block font-serif">Support</span>
                    <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">Frequently Asked Questions</h1>
                    <p className="text-xl text-muted-foreground italic max-w-2xl mx-auto">
                        Everything you need to know about dining at Savannah & Spice.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8">
                    {items.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-card p-8 rounded-2xl border border-border/50 hover:shadow-xl hover:border-primary/20 transition-all group"
                        >
                            <div className="mb-4 bg-primary/5 w-fit p-3 rounded-xl group-hover:bg-primary/10 transition-colors">
                                {faq.icon && iconMap[faq.icon] ? iconMap[faq.icon] : <HelpCircle className="w-6 h-6 text-primary" />}
                            </div>
                            <h3 className="text-xl font-serif font-bold mb-3">{faq.question}</h3>
                            <p className="text-muted-foreground leading-relaxed italic">
                                {faq.answer}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
