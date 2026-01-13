import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Instagram, Facebook } from "lucide-react";

export default function Contact() {
  return (
    <div className="pt-24 min-h-screen bg-background text-foreground">
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
             <div className="text-center mb-16">
              <h1 className="text-5xl font-serif font-bold mb-4">Contact Us</h1>
              <p className="text-muted-foreground italic">Karibu Savor & Vine – Visit us in Nairobi.</p>
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
                      <p className="text-muted-foreground">Karen Triangle Mall, 2nd Floor<br />Karen, Nairobi, Kenya</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="bg-primary/10 p-4 rounded-full h-fit">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-serif font-bold mb-2">Phone</h3>
                      <p className="text-muted-foreground">+254 712 345 678</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="bg-primary/10 p-4 rounded-full h-fit">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-serif font-bold mb-2">Email</h3>
                      <p className="text-muted-foreground">info@savorandvine.co.ke</p>
                    </div>
                  </div>
                </div>

                <div className="h-[300px] w-full rounded-2xl overflow-hidden border border-border">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.7562452378!2d36.7034689758705!3d-1.321946898665365!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1b4020a6e4d7%3A0x86702e5b8e994848!2sKaren%20Triangle%20Mall!5e0!3m2!1sen!2ske!4v1700000000000!5m2!1sen!2ske" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen={true} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>

                <div className="pt-8 border-t border-border">
                  <h3 className="text-xl font-serif font-bold mb-4">Follow Our Story</h3>
                  <div className="flex gap-4">
                    <Button variant="outline" size="icon" className="rounded-full"><Instagram className="w-5 h-5" /></Button>
                    <Button variant="outline" size="icon" className="rounded-full"><Facebook className="w-5 h-5" /></Button>
                  </div>
                </div>
              </div>

              <div className="bg-muted/30 p-8 rounded-2xl h-fit">
                <form className="grid gap-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" placeholder="Juma Japhary" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="juma@example.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="Reservation Enquiry" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" className="min-h-[150px]" placeholder="Habari! We would like to book for a group of 10..." />
                  </div>
                  <Button className="w-full h-12 font-serif italic bg-primary hover:bg-primary/90">Send Message</Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
