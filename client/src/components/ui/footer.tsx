import { Link } from "wouter";
import { Separator } from "@/components/ui/separator";
import {
    Phone,
    MapPin,
    Mail,
    Instagram,
    Facebook,
    Youtube,
    MessageCircle,
    Twitter,
    Music2
} from "lucide-react";
import { motion } from "framer-motion";

export function Footer() {
    const socialLinks = [
        { icon: <Instagram className="w-5 h-5" />, href: "#", label: "Instagram" },
        { icon: <Facebook className="w-5 h-5" />, href: "#", label: "Facebook" },
        { icon: <Music2 className="w-5 h-5" />, href: "#", label: "TikTok" },
        { icon: <Youtube className="w-5 h-5" />, href: "#", label: "YouTube" },
        { icon: <MessageCircle className="w-5 h-5" />, href: "#", label: "WhatsApp" },
        { icon: <Twitter className="w-5 h-5" />, href: "#", label: "X (Twitter)" },
    ];

    return (
        <footer className="bg-neutral-950 text-neutral-400 py-20 border-t border-white/5">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="text-3xl font-serif text-white mb-6">Savannah & Spice</h3>
                        <p className="max-w-md text-neutral-400 text-lg leading-relaxed italic mb-8">
                            Bringing the diverse flavors of Kenya to life with modern flair and unparalleled hospitality. Authentic. Sustainable. Unforgettable.
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
                                <span className="hover:text-white transition-colors">+254 712 345 678</span>
                            </li>
                            <li className="flex items-start gap-4 text-lg">
                                <MapPin className="w-5 h-5 text-primary shrink-0 mt-1" />
                                <span className="hover:text-white transition-colors">Karen Triangle Mall, Nairobi</span>
                            </li>
                            <li className="flex items-start gap-4 text-lg">
                                <Mail className="w-5 h-5 text-primary shrink-0 mt-1" />
                                <span className="hover:text-white transition-colors">hello@savannahspice.co.ke</span>
                            </li>
                        </ul>
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
