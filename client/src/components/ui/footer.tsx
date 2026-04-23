import { Link } from "wouter";
import { Separator } from "@/components/ui/separator";
import {
    Phone,
    MapPin,
    Mail,
    MessageCircle,
    Music2,
    Clock,
    Loader2
} from "lucide-react";
import { FaInstagram, FaFacebook, FaYoutube, FaTwitter } from "react-icons/fa";
import { motion } from "framer-motion";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useSiteSettings, useSiteContent } from "@/hooks/use-site-data";
import { Skeleton } from "@/components/ui/skeleton";

export function Footer() {
    const { toast } = useToast();
    const [email, setEmail] = useState("");
    const { data: settings, isLoading: settingsLoading } = useSiteSettings();
    const { data: homeContent, isLoading: contentLoading } = useSiteContent('home');

    const newsletterMutation = useMutation({
        mutationFn: async (email: string) => {
            await apiRequest("POST", "/api/newsletter", { email });
        },
        onSuccess: () => {
            toast({
                title: "Welcome to the Savannah Circle!",
                description: "You've successfully subscribed to our newsletter.",
            });
            setEmail("");
        },
        onError: (error: Error) => {
            toast({
                title: "Subscription Failed",
                description: error.message,
                variant: "destructive"
            });
        }
    });

    if (settingsLoading || contentLoading) {
        return <Skeleton className="h-96 w-full" />;
    }

    const socialLinks = [
        { icon: <FaInstagram className="w-5 h-5" />, href: "#", label: "Instagram" },
        { icon: <FaFacebook className="w-5 h-5" />, href: "#", label: "Facebook" },
        { icon: <Music2 className="w-5 h-5" />, href: "#", label: "TikTok" },
        { icon: <FaYoutube className="w-5 h-5" />, href: "#", label: "YouTube" },
        { icon: <MessageCircle className="w-5 h-5" />, href: "#", label: "WhatsApp" },
        { icon: <FaTwitter className="w-5 h-5" />, href: "#", label: "X (Twitter)" },
    ];

    const footerAbout = homeContent?.find(c => c.key === 'about_description')?.value || "Bringing the diverse flavors of Kenya to life with modern flair and unparalleled hospitality.";

    return (
        <footer className="bg-neutral-950 text-neutral-400 py-20 border-t border-white/5">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="text-3xl font-serif text-white mb-6">{settings?.restaurantName}</h3>
                        <p className="max-w-md text-neutral-400 text-lg leading-relaxed italic mb-8">
                            {footerAbout}
                        </p>
                        <div className="flex flex-wrap gap-4 mb-8">
                            {socialLinks.map((social, index) => (
                                <motion.a
                                    key={index}
                                    href={social.href}
                                    whileHover={{ y: -3, color: "#eeb431" }}
                                    className="bg-white/5 p-3 rounded-full border border-white/10 hover:border-primary/50 transition-colors"
                                    aria-label={social.label}
                                >
                                    {social.icon}
                                </motion.a>
                            ))}
                        </div>
                        <div className="flex items-center gap-6 grayscale opacity-60">
                            <Link href="/payments">
                                <div className="bg-white/10 p-2 rounded text-xs font-bold text-white tracking-widest border border-white/20 hover:border-primary/50 transition-colors cursor-pointer">PAY VIA M-PESA</div>
                            </Link>
                            <Link href="/payments">
                                <div className="bg-white/10 p-2 rounded text-xs font-bold text-white tracking-widest border border-white/20 hover:border-primary/50 transition-colors cursor-pointer">VISA / MASTERCARD</div>
                            </Link>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-6 text-xl font-serif">Quick Links</h4>
                        <ul className="space-y-4">
                            <li><Link href="/"><span className="hover:text-primary transition-colors cursor-pointer text-lg">Home</span></Link></li>
                            <li><Link href="/menu"><span className="hover:text-primary transition-colors cursor-pointer text-lg">Our Menu</span></Link></li>
                            <li><Link href="/blog"><span className="hover:text-primary transition-colors cursor-pointer text-lg">Savannah Stories</span></Link></li>
                            <li><Link href="/payments"><span className="hover:text-primary transition-colors cursor-pointer text-lg">Payment Methods</span></Link></li>
                            <li><Link href="/reservations"><span className="hover:text-primary transition-colors cursor-pointer text-lg">Reservations</span></Link></li>
                            <li><Link href="/admin"><span className="hover:text-primary transition-colors cursor-pointer text-lg">Admin Access</span></Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-6 text-xl font-serif">Get in Touch</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-4 text-lg">
                                <Phone className="w-5 h-5 text-primary shrink-0 mt-1" />
                                <a href={`tel:${settings?.phone}`} className="hover:text-white transition-colors">{settings?.phone}</a>
                            </li>
                            <li className="flex items-start gap-4 text-sm mt-4">
                                <MapPin className="w-5 h-5 text-primary shrink-0" />
                                <div>
                                    <span className="block hover:text-white transition-colors cursor-pointer mb-2">{settings?.address}</span>
                                    <div className="w-full h-32 rounded-lg overflow-hidden border border-white/10 mt-2">
                                        <iframe 
                                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15954.912781559868!2d36.6974!3d-1.32!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zKcKwMTknMTIuMCJTIDM2wrA0MSc1MC42IkU!5e0!3m2!1sen!2ske!4v1620000000000!5m2!1sen!2ske" 
                                            width="100%" 
                                            height="100%" 
                                            style={{ border: 0 }} 
                                            allowFullScreen={false} 
                                            loading="lazy"
                                        ></iframe>
                                    </div>
                                </div>
                            </li>
                            <li className="flex items-start gap-4 text-sm mt-4">
                                <Clock className="w-5 h-5 text-primary shrink-0" />
                                <div className="text-neutral-400">
                                    <span className="block mb-1 text-white">Opening Hours</span>
                                    {settings?.openingHours}
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-6 text-xl font-serif">Newsletter</h4>
                        <p className="text-neutral-400 text-sm mb-4 leading-relaxed">
                            Join the Savannah Circle. Get exclusive rewards, early access to seasonal menus, and special surprises.
                        </p>
                        <div className="flex flex-col gap-3">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Your email address"
                                className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-1 focus:ring-primary text-white placeholder:text-white/30 text-sm"
                            />
                            <Button
                                onClick={() => newsletterMutation.mutate(email)}
                                disabled={newsletterMutation.isPending || !email}
                                className="bg-primary hover:bg-primary/90 text-white w-full rounded-lg py-6 shadow-xl"
                            >
                                {newsletterMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Subscribe
                            </Button>
                        </div>
                    </div>
                </div>
                <Separator className="bg-white/10 my-10" />
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm font-light">
                    <div>© 2024 Savannah & Spice Kenya. All rights reserved.</div>
                    <div className="flex gap-8 uppercase tracking-widest text-[10px] opacity-50">
                        <Link href="/privacy"><span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span></Link>
                        <Link href="/terms"><span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span></Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
