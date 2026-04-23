import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/clerk-react";
import { useUserOrders, useUserReservations } from "@/hooks/use-user-history";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
    ShoppingBag, 
    Calendar, 
    Award, 
    ChevronRight, 
    Clock, 
    MapPin,
    ArrowRight,
    Settings,
    History
} from "lucide-react";
import { format } from "date-fns";
import { Link, useLocation } from "wouter";
import { Loader2, ShieldCheck } from "lucide-react";

export default function UserDashboard() {
    const { user, isLoaded } = useUser();
    const [, setLocation] = useLocation();
    const { data: dbUser } = useQuery<any>({ queryKey: ["/api/user/me"] });
    const { data: orders, isLoading: loadingOrders } = useUserOrders();
    const { data: reservations, isLoading: loadingReservations } = useUserReservations();

    const isAdmin = dbUser?.isAdmin || false;
    const loyaltyPoints = (user?.publicMetadata?.loyaltyPoints as number) || 0;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'cancelled': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
            case 'preparing': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'out_for_delivery': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            default: return 'bg-primary/10 text-primary border-primary/20';
        }
    };

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="container mx-auto px-4">
                {/* Header Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h1 className="text-4xl font-serif font-bold mb-2">
                                Welcome back, <span className="text-primary">{user?.firstName || "Guest"}</span>
                            </h1>
                            <p className="text-muted-foreground italic">Enjoy your exclusive Dine Elite benefits.</p>
                        </div>
                        <div className="flex gap-4">
                            {isAdmin && (
                                <Link href="/admin">
                                    <Button variant="outline" className="rounded-full border-primary/50 text-primary gap-2 bg-primary/5">
                                        <ShieldCheck className="w-4 h-4" />
                                        Admin Panel
                                    </Button>
                                </Link>
                            )}
                            <Link href="/menu">
                                <Button className="rounded-full px-6">Order Now</Button>
                            </Link>
                            <Link href="/settings">
                                <Button variant="outline" size="icon" className="rounded-full">
                                    <Settings className="w-4 h-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sidebar / Quick Stats */}
                    <div className="space-y-6">
                        {/* Loyalty Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-background to-primary/10 backdrop-blur-sm shadow-2xl shadow-primary/5">
                                <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
                                    <Award className="w-24 h-24 text-primary" />
                                </div>
                                <CardHeader>
                                    <CardTitle className="text-sm uppercase tracking-widest text-primary font-bold">Loyalty Balance</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-baseline gap-2 mb-4">
                                        <span className="text-5xl font-bold tracking-tighter">{loyaltyPoints}</span>
                                        <span className="text-muted-foreground font-serif italic uppercase text-xs">S&S Points</span>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="h-2 w-full bg-primary/10 rounded-full overflow-hidden">
                                            <motion.div 
                                                className="h-full bg-primary" 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${Math.min((loyaltyPoints / 1000) * 100, 100)}%` }}
                                            />
                                        </div>
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                                            {1000 - (loyaltyPoints % 1000)} points until your next free meal
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Quick Links */}
                        <Card className="border-border/50 bg-card/30 backdrop-blur-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-bold">Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 gap-2">
                                <Link href="/reservations">
                                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer group">
                                        <div className="flex items-center gap-3">
                                            <Calendar className="w-4 h-4 text-primary" />
                                            <span className="text-sm">Book a Table</span>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </Link>
                                <Link href="/track-order">
                                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer group">
                                        <div className="flex items-center gap-3">
                                            <Clock className="w-4 h-4 text-primary" />
                                            <span className="text-sm">Track Active Order</span>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </Link>
                                <Link href="/contact">
                                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer group">
                                        <div className="flex items-center gap-3">
                                            <MapPin className="w-4 h-4 text-primary" />
                                            <span className="text-sm">Find Us</span>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content Areas */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Recent Orders */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Card className="border-border/50 shadow-sm overflow-hidden">
                                <CardHeader className="flex flex-row items-center justify-between bg-muted/30 pb-4">
                                    <div>
                                        <CardTitle className="font-serif">Order History</CardTitle>
                                        <CardDescription>Monitor your culinary journey with us.</CardDescription>
                                    </div>
                                    <History className="w-5 h-5 text-muted-foreground" />
                                </CardHeader>
                                <CardContent className="p-0">
                                    {loadingOrders ? (
                                        <div className="flex items-center justify-center p-12">
                                            <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                        </div>
                                    ) : orders && orders.length > 0 ? (
                                        <div className="divide-y divide-border">
                                            {orders.slice(0, 5).map((order) => (
                                                <div key={order.id} className="p-6 hover:bg-muted/10 transition-colors flex flex-col md:flex-row justify-between gap-4">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-3">
                                                            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">#{order.id.slice(-6).toUpperCase()}</span>
                                                            <Badge variant="outline" className={`text-[10px] capitalize ${getStatusColor(order.status)} underline-none`}>
                                                                {order.status.replace('_', ' ')}
                                                            </Badge>
                                                        </div>
                                                        <div className="font-bold">
                                                            {order.items.map(i => i.itemName).join(', ')}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                                                            <Clock className="w-3 h-3" />
                                                            {order.createdAt ? format(new Date(order.createdAt), "MMMM d, yyyy 'at' HH:mm") : ""}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between md:flex-col md:items-end gap-2">
                                                        <div className="text-lg font-bold text-primary">KSh {order.totalAmount.toLocaleString()}</div>
                                                        <Link href={`/track-order?orderId=${order.id}`}>
                                                            <Button variant="ghost" size="sm" className="text-xs h-8 group p-0 hover:bg-transparent hover:text-primary">
                                                                View Details <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-12 text-center">
                                            <ShoppingBag className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                                            <p className="text-muted-foreground italic">No orders placed yet. Visit our menu to start!</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Upcoming Reservations */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Card className="border-border/50 shadow-sm overflow-hidden">
                                <CardHeader className="flex flex-row items-center justify-between bg-muted/30 pb-4">
                                    <div>
                                        <CardTitle className="font-serif">My Reservations</CardTitle>
                                        <CardDescription>Your upcoming table bookings.</CardDescription>
                                    </div>
                                    <Calendar className="w-5 h-5 text-muted-foreground" />
                                </CardHeader>
                                <CardContent className="p-0">
                                    {loadingReservations ? (
                                        <div className="flex items-center justify-center p-12">
                                            <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                        </div>
                                    ) : reservations && reservations.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
                                            {reservations.map((res) => (
                                                <div key={res.id} className="bg-background p-6 space-y-3">
                                                    <div className="flex justify-between items-start">
                                                        <div className="p-2 bg-primary/10 rounded-xl text-primary">
                                                            <Calendar className="w-5 h-5" />
                                                        </div>
                                                        <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest bg-emerald-500/5 text-emerald-500 border-emerald-500/10 px-2 py-0.5">Confirmed</Badge>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold">{res.date} at {res.time}</div>
                                                        <div className="text-xs text-muted-foreground italic">{res.guests} Guests • {res.name}</div>
                                                    </div>
                                                    {res.requests && (
                                                        <p className="text-[10px] text-muted-foreground bg-muted/50 p-2 rounded italic">
                                                            "{res.requests}"
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-12 text-center">
                                            <Calendar className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                                            <p className="text-muted-foreground italic">No reservations found.</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}

