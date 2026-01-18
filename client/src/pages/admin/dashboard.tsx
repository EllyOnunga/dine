import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { MenuItem, Reservation, Enquiry, Blog, NewsletterLead, Order, OrderItem, SiteSetting } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
    Loader2,
    Plus,
    Trash2,
    Edit2,
    Calendar,
    MessageSquare,
    Utensils,
    BookOpen,
    Mail,
    CheckCircle2,
    XCircle,
    Image as ImageIcon,
    ShoppingBag
} from "lucide-react";
import { format } from "date-fns";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Analytics type definition
interface Analytics {
    totalRevenue: number;
    totalOrders: number;
    totalReservations: number;
    ordersByStatus: Record<string, number>;
    topItems: Array<{ name: string; count: number }>;
}

export default function AdminDashboard() {
    const { logoutMutation } = useAuth();
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState("reservations");

    // Fetching data
    const { data: reservations, isLoading: loadingReservations } = useQuery<Reservation[]>({ queryKey: ["/api/admin/reservations"] });
    const { data: enquiries, isLoading: loadingEnquiries } = useQuery<Enquiry[]>({ queryKey: ["/api/admin/enquiries"] });
    const { data: menuItems, isLoading: loadingMenu } = useQuery<MenuItem[]>({ queryKey: ["/api/menu"] });
    const { data: blogs, isLoading: loadingBlogs } = useQuery<Blog[]>({ queryKey: ["/api/blogs"] });
    const { data: newsletter, isLoading: loadingNewsletter } = useQuery<NewsletterLead[]>({ queryKey: ["/api/admin/newsletter"] });
    const { data: orders, isLoading: loadingOrders } = useQuery<(Order & { items: OrderItem[] })[]>({ queryKey: ["/api/admin/orders"] });
    const { data: analytics } = useQuery<Analytics>({ queryKey: ["/api/admin/analytics"] });
    const { data: settings } = useQuery<SiteSetting>({ queryKey: ["/api/admin/settings"] });

    // State for Dialogs
    const [isMenuDialogOpen, setIsMenuDialogOpen] = useState(false);
    const [isBlogDialogOpen, setIsBlogDialogOpen] = useState(false);
    const [editingMenuItem, setEditingMenuItem] = useState<Partial<MenuItem> | null>(null);
    const [editingBlog, setEditingBlog] = useState<Partial<Blog> | null>(null);
    const [sendMessageOrderId, setSendMessageOrderId] = useState<string | null>(null);
    const [customMessage, setCustomMessage] = useState("");

    const [menuForm, setMenuForm] = useState({
        name: "", price: "", originalPrice: "", description: "", category: "", tag: "", image: ""
    });
    const [blogForm, setBlogForm] = useState({
        title: "", content: "", author: "", image: "", category: ""
    });

    // Mutations
    const deleteReservation = useMutation({
        mutationFn: async (id: string) => apiRequest("DELETE", `/api/admin/reservations/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/reservations"] });
            toast({ title: "Reservation deleted" });
        }
    });

    const deleteEnquiry = useMutation({
        mutationFn: async (id: string) => apiRequest("DELETE", `/api/admin/enquiries/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/enquiries"] });
            toast({ title: "Enquiry deleted" });
        }
    });

    const deleteMenuItem = useMutation({
        mutationFn: async (id: string) => apiRequest("DELETE", `/api/admin/menu/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/menu"] });
            toast({ title: "Menu item deleted" });
        }
    });

    const deleteBlog = useMutation({
        mutationFn: async (id: string) => apiRequest("DELETE", `/api/admin/blogs/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/blogs"] });
            toast({ title: "Blog post deleted" });
        }
    });

    const saveMenuMutation = useMutation({
        mutationFn: async (data: any) => {
            if (editingMenuItem?.id) {
                return apiRequest("PATCH", `/api/admin/menu/${editingMenuItem.id}`, data);
            }
            return apiRequest("POST", "/api/admin/menu", data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/menu"] });
            toast({ title: editingMenuItem ? "Item updated" : "Item created" });
            setIsMenuDialogOpen(false);
            setEditingMenuItem(null);
        }
    });

    const saveBlogMutation = useMutation({
        mutationFn: async (data: any) => {
            if (editingBlog?.id) {
                return apiRequest("PATCH", `/api/admin/blogs/${editingBlog.id}`, data);
            }
            return apiRequest("POST", "/api/admin/blogs", data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/blogs"] });
            toast({ title: editingBlog ? "Blog updated" : "Blog created" });
            setIsBlogDialogOpen(false);
            setEditingBlog(null);
        }
    });

    const updateOrderStatus = useMutation({
        mutationFn: async ({ id, status }: { id: string, status: string }) => {
            return apiRequest("PATCH", `/api/admin/orders/${id}`, { status });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] });
            toast({ title: "Order status updated and notification sent" });
        },
        onError: (err: Error) => {
            toast({ title: "Failed to update order status", description: err.message, variant: "destructive" });
        }
    });

    const sendOrderMessage = useMutation({
        mutationFn: async ({ id, message }: { id: string, message: string }) => {
            return apiRequest("POST", `/api/admin/orders/${id}/message`, { message });
        },
        onSuccess: () => {
            toast({ title: "Custom message sent successfully" });
            setSendMessageOrderId(null);
            setCustomMessage("");
        },
        onError: (err: Error) => {
            toast({ title: "Failed to send message", description: err.message, variant: "destructive" });
        }
    });

    const openMenuDialog = (item: MenuItem | null = null) => {
        if (item) {
            setEditingMenuItem(item);
            setMenuForm({
                name: item.name,
                price: item.price,
                originalPrice: item.originalPrice || "",
                description: item.description,
                category: item.category,
                tag: item.tag || "",
                image: item.image
            });
        } else {
            setEditingMenuItem(null);
            setMenuForm({ name: "", price: "", originalPrice: "", description: "", category: "", tag: "", image: "" });
        }
        setIsMenuDialogOpen(true);
    };

    const openBlogDialog = (blog: Blog | null = null) => {
        if (blog) {
            setEditingBlog(blog);
            setBlogForm({
                title: blog.title,
                content: blog.content,
                author: blog.author,
                image: blog.image,
                category: blog.category
            });
        } else {
            setEditingBlog(null);
            setBlogForm({ title: "", content: "", author: "", image: "", category: "" });
        }
        setIsBlogDialogOpen(true);
    };

    if (loadingReservations || loadingEnquiries || loadingMenu || loadingBlogs || loadingNewsletter || loadingOrders) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-24 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                <div>
                    <h1 className="text-4xl font-serif font-bold text-foreground">Admin Control Panel</h1>
                    <p className="text-muted-foreground">Manage your bistro's operations and content.</p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" onClick={() => window.location.href = "/"}>View Site</Button>
                    <Button
                        className="bg-primary hover:bg-primary/90"
                        onClick={() => logoutMutation.mutate()}
                        disabled={logoutMutation.isPending}
                    >
                        {logoutMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Sign Out
                    </Button>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                <TabsList className="bg-muted/50 p-1 rounded-xl w-full justify-start overflow-x-auto">
                    <TabsTrigger value="analytics" className="gap-2"><ShoppingBag className="w-4 h-4" /> Analytics</TabsTrigger>
                    <TabsTrigger value="reservations" className="gap-2"><Calendar className="w-4 h-4" /> Reservations</TabsTrigger>
                    <TabsTrigger value="orders" className="gap-2"><ShoppingBag className="w-4 h-4" /> Orders</TabsTrigger>
                    <TabsTrigger value="enquiries" className="gap-2"><MessageSquare className="w-4 h-4" /> Enquiries</TabsTrigger>
                    <TabsTrigger value="menu" className="gap-2"><Utensils className="w-4 h-4" /> Menu Management</TabsTrigger>
                    <TabsTrigger value="blogs" className="gap-2"><BookOpen className="w-4 h-4" /> Blogs</TabsTrigger>
                    <TabsTrigger value="newsletter" className="gap-2"><Mail className="w-4 h-4" /> Newsletter</TabsTrigger>
                    <TabsTrigger value="settings" className="gap-2"><ImageIcon className="w-4 h-4" /> Settings</TabsTrigger>
                </TabsList>

                {/* Reservations Tab */}
                <TabsContent value="reservations">
                    <div className="grid gap-6">
                        <Card className="border-border/50 shadow-sm">
                            <CardHeader>
                                <CardTitle className="font-serif">Active Reservations</CardTitle>
                                <CardDescription>View and manage table bookings.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-border text-sm font-medium text-muted-foreground">
                                                <th className="pb-4 px-4">Guest</th>
                                                <th className="pb-4 px-4">Date & Time</th>
                                                <th className="pb-4 px-4">Party Size</th>
                                                <th className="pb-4 px-4">Special Requests</th>
                                                <th className="pb-4 px-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {reservations?.map((res) => (
                                                <tr key={res.id} className="text-sm">
                                                    <td className="py-4 px-4 font-medium">
                                                        {res.name}<br />
                                                        <a href={`mailto:${res.email}`} className="text-xs text-muted-foreground hover:text-primary hover:underline">{res.email}</a>
                                                    </td>
                                                    <td className="py-4 px-4">{res.date} at {res.time}</td>
                                                    <td className="py-4 px-4">{res.guests} people</td>
                                                    <td className="py-4 px-4 italic text-muted-foreground max-w-xs truncate">{res.requests || "None"}</td>
                                                    <td className="py-4 px-4 text-right">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                            onClick={() => deleteReservation.mutate(res.id)}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Orders Tab */}
                <TabsContent value="orders">
                    <Card className="border-border/50 shadow-sm">
                        <CardHeader>
                            <CardTitle className="font-serif">Incoming Orders</CardTitle>
                            <CardDescription>View and manage delivery orders. Updating status sends an automated email to the customer.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-border text-sm font-medium text-muted-foreground">
                                            <th className="pb-4 px-4">Order Details</th>
                                            <th className="pb-4 px-4">Customer Info</th>
                                            <th className="pb-4 px-4">Items</th>
                                            <th className="pb-4 px-4">Total</th>
                                            <th className="pb-4 px-4">Manage Status</th>
                                            <th className="pb-4 px-4 text-right">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {orders?.map((order) => (
                                            <tr key={order.id} className="text-sm">
                                                <td className="py-4 px-4">
                                                    <div className="font-mono text-[10px] text-muted-foreground mb-1 uppercase tracking-tighter">ID: {order.id.slice(0, 8)}</div>
                                                    <div className="font-bold flex items-center gap-2">
                                                        <ShoppingBag className="w-3 h-3 text-primary" />
                                                        Order #{order.id.slice(-4).toUpperCase()}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="font-medium text-foreground">{order.customerName}</div>
                                                    <div className="text-xs text-muted-foreground">{order.customerPhone}</div>
                                                    <div className="text-[10px] text-muted-foreground max-w-[200px] leading-tight mt-1">{order.deliveryAddress}</div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="space-y-1">
                                                        {order.items.map((item) => (
                                                            <div key={item.id} className="text-xs flex justify-between gap-4">
                                                                <span className="text-muted-foreground">{item.quantity}x {item.itemName}</span>
                                                                <span className="font-medium">KSh {item.price.toLocaleString()}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="font-bold text-primary">KSh {order.totalAmount.toLocaleString()}</div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex flex-col gap-2">
                                                        <Select
                                                            defaultValue={order.status}
                                                            onValueChange={(status) => updateOrderStatus.mutate({ id: order.id, status })}
                                                        >
                                                            <SelectTrigger className="w-[160px] h-8 text-xs">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="pending">Pending</SelectItem>
                                                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                                                <SelectItem value="preparing">Preparing</SelectItem>
                                                                <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                                                                <SelectItem value="delivered">Delivered</SelectItem>
                                                                <SelectItem value="cancelled">Cancelled</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-7 text-[10px] gap-1"
                                                            onClick={() => setSendMessageOrderId(order.id)}
                                                        >
                                                            <Mail className="w-3 h-3" />
                                                            Send Message
                                                        </Button>
                                                    </div>
                                                    <div className="mt-1 text-[10px] text-muted-foreground text-center italic">
                                                        Current: {order.status.replace('_', ' ')}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 text-right">
                                                    <div className="text-xs font-medium">
                                                        {order.createdAt ? format(new Date(order.createdAt), "MMM d") : "Unknown"}
                                                    </div>
                                                    <div className="text-[10px] text-muted-foreground">
                                                        {order.createdAt ? format(new Date(order.createdAt), "HH:mm") : ""}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Enquiries Tab */}
                <TabsContent value="enquiries">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {enquiries?.map((enq) => (
                            <Card key={enq.id} className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-lg font-serif">{enq.subject}</CardTitle>
                                        <div className="flex gap-2">
                                            <a href={`mailto:${enq.email}?subject=Re: ${enq.subject}`} title="Reply via Email">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10">
                                                    <Mail className="w-4 h-4" />
                                                </Button>
                                            </a>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive h-8 w-8 hover:text-destructive hover:bg-destructive/10"
                                                onClick={() => deleteEnquiry.mutate(enq.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <CardDescription>
                                        {enq.name} (<a href={`mailto:${enq.email}`} className="hover:text-primary hover:underline">{enq.email}</a>)
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground italic leading-relaxed">"{enq.message}"</p>
                                    <div className="mt-4 pt-4 border-t border-border flex justify-between items-center text-[10px] text-muted-foreground uppercase tracking-widest">
                                        <span>Received</span>
                                        <span>{enq.createdAt ? format(new Date(enq.createdAt), "MMM d, yyyy") : "Unknown"}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* Menu Management Tab */}
                <TabsContent value="menu">
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-serif font-bold">Menu Items</h2>
                            <Button onClick={() => openMenuDialog()} className="bg-primary hover:bg-primary/90 gap-2"><Plus className="w-4 h-4" /> Add Item</Button>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {menuItems?.map((item) => (
                                <Card key={item.id} className="overflow-hidden border-border/50">
                                    <div className="h-40 overflow-hidden relative">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        <div className="absolute top-2 right-2 flex gap-2">
                                            <Button variant="secondary" size="icon" onClick={() => openMenuDialog(item)} className="h-8 w-8 bg-white/90 backdrop-blur-sm"><Edit2 className="w-4 h-4" /></Button>
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => deleteMenuItem.mutate(item.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <CardHeader className="p-4">
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-lg font-bold">{item.name}</CardTitle>
                                            <span className="text-primary font-bold">{item.price}</span>
                                        </div>
                                        <CardDescription className="text-xs uppercase tracking-tighter text-primary/70">{item.category}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-0">
                                        <p className="text-sm text-muted-foreground line-clamp-2 italic">{item.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </TabsContent>

                {/* Blogs Tab */}
                <TabsContent value="blogs">
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-serif font-bold">Blog Posts</h2>
                            <Button onClick={() => openBlogDialog()} className="bg-primary hover:bg-primary/90 gap-2"><Plus className="w-4 h-4" /> Create Post</Button>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                            {blogs?.map((blog) => (
                                <Card key={blog.id} className="flex flex-col md:flex-row overflow-hidden border-border/50">
                                    <div className="md:w-48 h-48 md:h-auto overflow-hidden flex-shrink-0">
                                        <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 p-6 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-[10px] uppercase tracking-widest text-primary font-bold">{blog.category}</span>
                                                <div className="flex gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => openBlogDialog(blog)} className="h-8 w-8"><Edit2 className="w-4 h-4" /></Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-destructive"
                                                        onClick={() => deleteBlog.mutate(blog.id)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <h3 className="text-xl font-serif font-bold leading-tight mb-2">{blog.title}</h3>
                                            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{blog.content}</p>
                                        </div>
                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                            <span>By {blog.author}</span>
                                            <span>{blog.createdAt ? format(new Date(blog.createdAt), "MMM d, yyyy") : ""}</span>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </TabsContent>

                {/* Newsletter Tab */}
                <TabsContent value="newsletter">
                    <Card className="border-border/50 shadow-sm">
                        <CardHeader>
                            <CardTitle className="font-serif">Subscribers</CardTitle>
                            <CardDescription>Mailing list for Savannah Circle.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="max-w-2xl">
                                <div className="space-y-4">
                                    {newsletter?.map((lead) => (
                                        <div key={lead.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 bg-primary/10 rounded-full text-primary">
                                                    <CheckCircle2 className="w-4 h-4" />
                                                </div>
                                                <span className="font-medium">{lead.email}</span>
                                            </div>
                                            <span className="text-xs text-muted-foreground">Joined {lead.createdAt ? format(new Date(lead.createdAt), "MMM d, yyyy") : "Unknown"}</span>
                                        </div>
                                    ))}
                                    {newsletter?.length === 0 && (
                                        <div className="text-center py-12 text-muted-foreground italic">
                                            No subscribers yet.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                {/* Analytics Tab */}
                <TabsContent value="analytics">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>Total Revenue</CardDescription>
                                <CardTitle className="text-3xl font-bold">
                                    KSh {analytics?.totalRevenue?.toLocaleString() || 0}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-xs text-muted-foreground">From all completed orders</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>Total Orders</CardDescription>
                                <CardTitle className="text-3xl font-bold">{analytics?.totalOrders || 0}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-xs text-muted-foreground">All time</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>Reservations</CardDescription>
                                <CardTitle className="text-3xl font-bold">{analytics?.totalReservations || 0}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-xs text-muted-foreground">Total bookings</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>Newsletter</CardDescription>
                                <CardTitle className="text-3xl font-bold">{newsletter?.length || 0}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-xs text-muted-foreground">Subscribers</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Orders by Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {analytics?.ordersByStatus && Object.entries(analytics.ordersByStatus).map(([status, count]: any) => (
                                        <div key={status} className="flex justify-between items-center">
                                            <span className="capitalize">{status.replace('_', ' ')}</span>
                                            <span className="font-bold">{count}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Top Selling Items</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {analytics?.topItems?.map((item: any, index: number) => (
                                        <div key={index} className="flex justify-between items-center">
                                            <span className="text-sm">{item.name}</span>
                                            <span className="font-bold">{item.count} sold</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Settings Tab */}
                <TabsContent value="settings">
                    <Card>
                        <CardHeader>
                            <CardTitle>Restaurant Settings</CardTitle>
                            <CardDescription>Configure operational settings for your restaurant</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="openingHours">Opening Hours</Label>
                                <Input
                                    id="openingHours"
                                    defaultValue={settings?.openingHours || "08:00-22:00"}
                                    placeholder="08:00-22:00"
                                />
                                <p className="text-xs text-muted-foreground">Format: HH:MM-HH:MM</p>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Online Ordering</Label>
                                    <p className="text-sm text-muted-foreground">Enable or disable online ordering</p>
                                </div>
                                <Button variant="outline">
                                    {settings?.isOrderingEnabled ? "Enabled" : "Disabled"}
                                </Button>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="minOrder">Minimum Order Amount (KSh)</Label>
                                <Input
                                    id="minOrder"
                                    type="number"
                                    defaultValue={settings?.minOrderAmount || 0}
                                    placeholder="0"
                                />
                            </div>
                            <Button className="w-full">Save Settings</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Menu Item Dialog */}
                <Dialog open={isMenuDialogOpen} onOpenChange={setIsMenuDialogOpen}>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>{editingMenuItem ? "Edit Menu Item" : "Add New Menu Item"}</DialogTitle>
                            <DialogDescription>Fill in the details for your culinary creation.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Item Name</Label>
                                    <Input id="name" value={menuForm.name} onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })} placeholder="e.g. Masala Chips" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Input id="category" value={menuForm.category} onChange={(e) => setMenuForm({ ...menuForm, category: e.target.value })} placeholder="e.g. Starters" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Current Price</Label>
                                    <Input id="price" value={menuForm.price} onChange={(e) => setMenuForm({ ...menuForm, price: e.target.value })} placeholder="KSh 500" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="originalPrice">Original Price (for slashed)</Label>
                                    <Input id="originalPrice" value={menuForm.originalPrice} onChange={(e) => setMenuForm({ ...menuForm, originalPrice: e.target.value })} placeholder="KSh 650" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" value={menuForm.description} onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })} placeholder="Describe the flavors..." />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="tag">Tag (Optional)</Label>
                                    <Input id="tag" value={menuForm.tag} onChange={(e) => setMenuForm({ ...menuForm, tag: e.target.value })} placeholder="e.g. Popular" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="image">Image URL</Label>
                                    <Input id="image" value={menuForm.image} onChange={(e) => setMenuForm({ ...menuForm, image: e.target.value })} placeholder="https://..." />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsMenuDialogOpen(false)}>Cancel</Button>
                            <Button
                                className="bg-primary text-white"
                                onClick={() => saveMenuMutation.mutate(menuForm)}
                                disabled={saveMenuMutation.isPending}
                            >
                                {saveMenuMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {editingMenuItem ? "Update Item" : "Create Item"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Blog Dialog */}
                <Dialog open={isBlogDialogOpen} onOpenChange={setIsBlogDialogOpen}>
                    <DialogContent className="sm:max-w-[700px]">
                        <DialogHeader>
                            <DialogTitle>{editingBlog ? "Edit Blog Post" : "Create New Post"}</DialogTitle>
                            <DialogDescription>Share your Savannah stories with the world.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" value={blogForm.title} onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })} placeholder="How to grill like a Maasai..." />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="blogAuthor">Author</Label>
                                    <Input id="blogAuthor" value={blogForm.author} onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })} placeholder="Name" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="blogCategory">Category</Label>
                                    <Input id="blogCategory" value={blogForm.category} onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })} placeholder="Cuisine" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="blogImage">Featured Image URL</Label>
                                <Input id="blogImage" value={blogForm.image} onChange={(e) => setBlogForm({ ...blogForm, image: e.target.value })} placeholder="https://..." />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="content">Content</Label>
                                <Textarea id="content" className="min-h-[200px]" value={blogForm.content} onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })} placeholder="Write your story here..." />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsBlogDialogOpen(false)}>Cancel</Button>
                            <Button
                                className="bg-primary text-white"
                                onClick={() => saveBlogMutation.mutate(blogForm)}
                                disabled={saveBlogMutation.isPending}
                            >
                                {saveBlogMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {editingBlog ? "Update Post" : "Publish Post"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Custom Message Dialog */}
                <Dialog open={sendMessageOrderId !== null} onOpenChange={(open) => !open && setSendMessageOrderId(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Send Message to Customer</DialogTitle>
                            <DialogDescription>
                                Send a personalized email update regarding order #{sendMessageOrderId?.slice(-4).toUpperCase()}.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            <Label htmlFor="custom-message">Your Message</Label>
                            <Textarea
                                id="custom-message"
                                value={customMessage}
                                onChange={(e) => setCustomMessage(e.target.value)}
                                placeholder="Type your message here..."
                                className="min-h-[150px] mt-2"
                            />
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setSendMessageOrderId(null)}>Cancel</Button>
                            <Button
                                className="bg-primary text-white"
                                onClick={() => sendOrderMessage.mutate({ id: sendMessageOrderId!, message: customMessage })}
                                disabled={sendOrderMessage.isPending || !customMessage.trim()}
                            >
                                {sendOrderMessage.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Send Email
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Analytics Tab */}
                <TabsContent value="analytics">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>Total Revenue</CardDescription>
                                <CardTitle className="text-3xl font-bold">
                                    KSh {analytics?.totalRevenue?.toLocaleString() || 0}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-xs text-muted-foreground">From all completed orders</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>Total Orders</CardDescription>
                                <CardTitle className="text-3xl font-bold">{analytics?.totalOrders || 0}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-xs text-muted-foreground">All time</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>Reservations</CardDescription>
                                <CardTitle className="text-3xl font-bold">{analytics?.totalReservations || 0}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-xs text-muted-foreground">Total bookings</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>Newsletter</CardDescription>
                                <CardTitle className="text-3xl font-bold">{newsletter?.length || 0}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-xs text-muted-foreground">Subscribers</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Orders by Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {analytics?.ordersByStatus && Object.entries(analytics.ordersByStatus).map(([status, count]: any) => (
                                        <div key={status} className="flex justify-between items-center">
                                            <span className="capitalize">{status.replace('_', ' ')}</span>
                                            <span className="font-bold">{count}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Top Selling Items</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {analytics?.topItems?.map((item: any, index: number) => (
                                        <div key={index} className="flex justify-between items-center">
                                            <span className="text-sm">{item.name}</span>
                                            <span className="font-bold">{item.count} sold</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Settings Tab */}
                <TabsContent value="settings">
                    <Card>
                        <CardHeader>
                            <CardTitle>Restaurant Settings</CardTitle>
                            <CardDescription>Configure operational settings for your restaurant</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="openingHours">Opening Hours</Label>
                                <Input
                                    id="openingHours"
                                    defaultValue={settings?.openingHours || "08:00-22:00"}
                                    placeholder="08:00-22:00"
                                />
                                <p className="text-xs text-muted-foreground">Format: HH:MM-HH:MM</p>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Online Ordering</Label>
                                    <p className="text-sm text-muted-foreground">Enable or disable online ordering</p>
                                </div>
                                <Button variant="outline">
                                    {settings?.isOrderingEnabled ? "Enabled" : "Disabled"}
                                </Button>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="minOrder">Minimum Order Amount (KSh)</Label>
                                <Input
                                    id="minOrder"
                                    type="number"
                                    defaultValue={settings?.minOrderAmount || 0}
                                    placeholder="0"
                                />
                            </div>
                            <Button className="w-full">Save Settings</Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
