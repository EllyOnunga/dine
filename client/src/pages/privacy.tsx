import { motion } from "framer-motion";

export default function PrivacyPolicy() {
    return (
        <div className="pt-32 pb-24 min-h-screen bg-background">
            <div className="container mx-auto px-4 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="prose prose-neutral dark:prose-invert max-w-none"
                >
                    <h1 className="text-5xl font-serif font-bold mb-12 border-b border-border pb-6">Privacy Policy</h1>

                    <section className="mb-12">
                        <h2 className="text-2xl font-serif font-bold text-primary mb-4">1. Introduction</h2>
                        <p className="text-lg text-muted-foreground leading-relaxed italic mb-6">
                            Welcome to Savannah & Spice. We are committed to protecting your personal data and your privacy is our highest priority.
                        </p>
                        <p className="text-muted-foreground">
                            This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website or dine at our bistro in Karen, Nairobi.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-serif font-bold text-primary mb-2">2. Data We Collect</h2>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                            <li>Personal identification (Name, email address, phone number).</li>
                            <li>Reservation details and dining preferences.</li>
                            <li>Optional newsletter subscriptions.</li>
                            <li>Technical data (IP address, browser type) via cookies.</li>
                        </ul>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-serif font-bold text-primary mb-2">3. How We Use Informantion</h2>
                        <p className="text-muted-foreground">
                            We use your data solely to manage your reservations, provide personalized service, and (with your consent) send you artisanal updates from the Savannah. We never sell your data to third parties.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-serif font-bold text-primary mb-2">4. Security</h2>
                        <p className="text-muted-foreground">
                            We implement industry-standard security measures to ensure your data remains protected within our Kenyan and global servers.
                        </p>
                    </section>

                    <p className="text-sm text-muted-foreground opacity-60 italic mt-16">
                        Last updated: January 2024. Savannah & Spice Bistro, Karen Triangle Mall, Nairobi.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
