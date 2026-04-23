import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Calendar as CalendarIcon, Clock, Users, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertReservationSchema } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

const ROOMS = [
  {
    id: "savannah-lounge",
    name: "The Savannah Lounge",
    capacity: "Up to 50 guests",
    image: "https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=800",
    minSpend: "KSh 150,000",
    amenities: ["Private Bar", "AV Equipment", "Outdoor Terrace Access"]
  },
  {
    id: "acacia-room",
    name: "The Acacia Room",
    capacity: "Up to 20 guests",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800",
    minSpend: "KSh 80,000",
    amenities: ["Boardroom Setup", "Smart TV Screen", "Natural Light"]
  }
];

export default function EventsPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const form = useForm({
    resolver: zodResolver(insertReservationSchema),
    defaultValues: {
      name: "",
      email: "",
      date: "",
      time: "",
      guests: 10,
      requests: "" // We will encode phone/event type here
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/reservations", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Event Request Submitted",
        description: "Our events coordinator will contact you shortly to confirm your booking details.",
      });
      setLocation("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Request Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: any) => {
    // Append additional fields to the requests column
    const formData = new FormData(document.getElementById("event-form") as HTMLFormElement);
    const phone = formData.get("phone");
    const eventType = formData.get("eventType");
    const enhancedData = {
        ...data,
        requests: `Phone: ${phone} | Event Type: ${eventType} | Notes: ${data.requests}`
    };
    mutation.mutate(enhancedData);
  };

  return (
    <div className="pt-24 min-h-screen bg-background">
      <section className="py-12 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-serif font-bold mb-4 px-2">Private Dining & Events</h1>
              <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto italic mb-12 px-4">
                Elevate your special occasions with our exclusive spaces and tailored menus.
              </p>
            </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 max-w-5xl">
            {/* Room Gallery */}
            <div className="mb-20">
                <h2 className="text-3xl font-serif font-bold mb-8 text-center text-primary">Our Spaces</h2>
                <div className="grid md:grid-cols-2 gap-8">
                    {ROOMS.map(room => (
                        <Card key={room.id} className="overflow-hidden border-none shadow-xl group">
                            <div className="h-64 overflow-hidden relative">
                                <img src={room.image} alt={room.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute top-4 right-4 bg-background/90 text-foreground px-4 py-1 rounded-full text-sm font-bold shadow-lg backdrop-blur-md">
                                    {room.capacity}
                                </div>
                            </div>
                            <CardContent className="p-6">
                                <h3 className="text-xl font-serif font-bold mb-4 text-foreground">{room.name}</h3>
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="details" className="border-none">
                                        <AccordionTrigger className="bg-muted/30 px-4 rounded-lg hover:no-underline">Room Details</AccordionTrigger>
                                        <AccordionContent className="p-4 bg-muted/10 rounded-b-lg">
                                            <ul className="space-y-3">
                                                <li className="flex justify-between items-center border-b border-border/50 pb-2">
                                                    <span className="text-muted-foreground">Capacity</span>
                                                    <span className="font-semibold">{room.capacity}</span>
                                                </li>
                                                <li className="flex justify-between items-center border-b border-border/50 pb-2">
                                                    <span className="text-muted-foreground">Minimum Spend</span>
                                                    <span className="font-semibold text-primary">{room.minSpend}</span>
                                                </li>
                                                <li>
                                                    <span className="text-muted-foreground block mb-2">Amenities</span>
                                                    <div className="flex flex-wrap gap-2">
                                                        {room.amenities.map(amenity => (
                                                            <span key={amenity} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">{amenity}</span>
                                                        ))}
                                                    </div>
                                                </li>
                                            </ul>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Booking Form */}
            <div className="border-t border-border pt-20">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-8 sm:mb-10 px-4">
                        <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-3">Request a Booking</h2>
                        <p className="text-sm sm:text-base text-muted-foreground">Fill out the form below and our team will get in touch with availability.</p>
                    </div>

                    <Card className="border-border/50 shadow-2xl p-4 sm:p-8 bg-card mx-2 sm:mx-0">
                        <form id="event-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" {...form.register("name")} placeholder="John Doe" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input id="email" type="email" {...form.register("email")} placeholder="john@example.com" />
                                </div>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input id="phone" name="phone" placeholder="+254 700 000000" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="eventType">Event Type</Label>
                                    <Select name="eventType">
                                        <SelectTrigger id="eventType">
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Corporate/Business">Corporate / Business</SelectItem>
                                            <SelectItem value="Birthday/Celebration">Birthday / Celebration</SelectItem>
                                            <SelectItem value="Wedding/Engagement">Wedding / Engagement</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="space-y-2 relative">
                                    <Label htmlFor="date">Event Date</Label>
                                    <div className="relative">
                                        <Input type="date" {...form.register("date")} id="date" className="pl-10" />
                                        <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="time">Time</Label>
                                    <Select onValueChange={(val) => form.setValue("time", val)}>
                                        <SelectTrigger id="time" className="pl-10 relative">
                                            <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <SelectValue placeholder="Select time" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="09:00">09:00 AM</SelectItem>
                                            <SelectItem value="12:00">12:00 PM</SelectItem>
                                            <SelectItem value="15:00">03:00 PM</SelectItem>
                                            <SelectItem value="18:00">06:00 PM</SelectItem>
                                            <SelectItem value="20:00">08:00 PM</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="guests">Party Size</Label>
                                    <div className="relative">
                                      <Input type="number" {...form.register("guests")} min="5" placeholder="10" className="pl-10" />
                                      <Users className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="requests">Specific Requests or Notes</Label>
                                <Input id="requests" {...form.register("requests")} placeholder="Food allergies, setup requirements..." />
                            </div>

                            <Button type="submit" disabled={mutation.isPending} className="w-full h-14 text-lg font-serif">
                                {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Submit Request
                            </Button>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
}
