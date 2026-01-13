import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Instagram, Facebook } from "lucide-react";

export default function Contact() {
  return (
    <div className="pt-24 min-h-screen bg-background">
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
             <div className="text-center mb-16">
              <h1 className="text-5xl font-serif font-bold mb-4">Contact Us</h1>
              <p className="text-muted-foreground italic">We'd love to hear from you.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-16">
              <div className="space-y-12">
                <div className="grid gap-8">
                  <div className="flex gap-4">
                    <div className="bg-primary/10 p-4 rounded-full h-fit">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-serif font-bold mb-2">Location</h3>
                      <p className="text-muted-foreground">123 Culinary Avenue<br />New York, NY 10012</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="bg-primary/10 p-4 rounded-full h-fit">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-serif font-bold mb-2">Phone</h3>
                      <p className="text-muted-foreground">(555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="bg-primary/10 p-4 rounded-full h-fit">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-serif font-bold mb-2">Email</h3>
                      <p className="text-muted-foreground">hello@savorandvine.com</p>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-border">
                  <h3 className="text-xl font-serif font-bold mb-4">Follow Us</h3>
                  <div className="flex gap-4">
                    <Button variant="outline" size="icon" className="rounded-full"><Instagram className="w-5 h-5" /></Button>
                    <Button variant="outline" size="icon" className="rounded-full"><Facebook className="w-5 h-5" /></Button>
                  </div>
                </div>
              </div>

              <div className="bg-muted/30 p-8 rounded-2xl">
                <form className="grid gap-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" className="min-h-[150px]" />
                  </div>
                  <Button className="w-full h-12 font-serif italic">Send Message</Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
