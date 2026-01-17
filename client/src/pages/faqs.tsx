import { motion } from "framer-motion";
import {
    HelpCircle,
    MapPin,
    Clock,
    UtensilsCrossed,
    Users,
    Wine
} from "lucide-react";

const faqs = [
    {
        icon: <MapPin className="w-6 h-6 text-primary" />,
        question: "Where are you located?",
        answer: "We are located in the Karen Triangle Mall, 2nd Floor, in the heart of Karen, Nairobi. We offer a beautiful balcony view of the local scenery."
    },
    {
        icon: <Clock className="w-6 h-6 text-primary" />,
        question: "What are your opening hours?",
        answer: "We are open daily from 11:00 AM to 11:00 PM. Dinner service starts strictly at 6:00 PM."
    },
    {
        icon: <UtensilsCrossed className="w-6 h-6 text-primary" />,
        question: "Do you have vegetarian or vegan options?",
        answer: "Absolutely! Our signature Swahili coconut base can be adapted for many dishes, and our Tropical Fruit Medley is a local favorite."
    },
    {
        icon: <Users className="w-6 h-6 text-primary" />,
        question: "Can I host a large event or party?",
        answer: "Yes, our Savannah Lounge is perfect for private dining, corporate koroga, and celebrations. Please contact us for group bookings exceeding 15 guests."
    },
    {
        icon: <Wine className="w-6 h-6 text-primary" />,
        question: "Is there a corkage fee?",
        answer: "We have an extensive collection of fine wines and local refreshments. Our corkage fee for outside bottles is KSh 1,500 per bottle."
    },
    {
        icon: <HelpCircle className="w-6 h-6 text-primary" />,
        question: "Do you offer delivery?",
        answer: "While we believe the full experience is best enjoyed in-house, we offer local delivery within the Karen area via our artisanal partners."
    }
];

export default function FAQs() {
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
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-card p-8 rounded-2xl border border-border/50 hover:shadow-xl hover:border-primary/20 transition-all group"
                        >
                            <div className="mb-4 bg-primary/5 w-fit p-3 rounded-xl group-hover:bg-primary/10 transition-colors">
                                {faq.icon}
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
