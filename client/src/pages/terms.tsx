import { motion } from "framer-motion";

export default function TermsOfService() {
    return (
        <div className="pt-32 pb-24 min-h-screen bg-background">
            <div className="container mx-auto px-4 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="prose prose-neutral dark:prose-invert max-w-none"
                >
                    <h1 className="text-5xl font-serif font-bold mb-12 border-b border-border pb-6">Terms of Service</h1>

                    <section className="mb-12">
                        <h2 className="text-2xl font-serif font-bold text-primary mb-4">1. Acceptance of Terms</h2>
                        <p className="text-muted-foreground">
                            By accessing our website and making a reservation at Savannah & Spice, you agree to comply with and be bound by the following terms and conditions.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-serif font-bold text-primary mb-4">2. Reservations & Cancellations</h2>
                        <p className="text-muted-foreground mb-4">
                            We hold tables for 15 minutes beyond your scheduled time. If you need to cancel, please notify us at least 2 hours in advance.
                        </p>
                        <p className="text-muted-foreground">
                            For groups of 10 or more, a deposit may be required to secure your booking in the Savannah Lounge.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-serif font-bold text-primary mb-4">3. Conduct & Culture</h2>
                        <p className="text-muted-foreground">
                            We celebrate 'Utamaduni'—the spirit of hospitality and mutual respect. We reserve the right to refuse service to anyone who disrupts the serene atmosphere of our bistro.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-serif font-bold text-primary mb-4">4. Intellectual Property</h2>
                        <p className="text-muted-foreground">
                            All culinary designs, branding, and images are the property of Savannah & Spice Coffee & Bistro Ltd.
                        </p>
                    </section>

                    <p className="text-sm text-muted-foreground opacity-60 italic mt-16">
                        © 2024 Savannah & Spice. Karen, Nairobi. Kenya.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
