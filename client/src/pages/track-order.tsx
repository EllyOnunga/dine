import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Clock, Package, Truck, XCircle } from "lucide-react";
import { format } from "date-fns";

export default function TrackOrderPage() {
    const [orderId, setOrderId] = useState("");
    const [searchId, setSearchId] = useState("");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const idFromUrl = params.get("id");
        if (idFromUrl) {
            setOrderId(idFromUrl);
            setSearchId(idFromUrl);
        }
    }, []);

    const { data: order, isLoading, error } = useQuery({
        queryKey: ["/api/orders", searchId, "tracking"],
        queryFn: async () => {
            if (!searchId) return null;
            const res = await apiRequest("GET", `/api/orders/${searchId}/tracking`);
            return res.json();
        },
        enabled: !!searchId,
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearchId(orderId);
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "pending":
                return <Clock className="h-8 w-8 text-orange-500" />;
            case "confirmed":
                return <CheckCircle2 className="h-8 w-8 text-blue-500" />;
            case "preparing":
                return <Package className="h-8 w-8 text-purple-500" />;
            case "out_for_delivery":
                return <Truck className="h-8 w-8 text-teal-500" />;
            case "delivered":
                return <CheckCircle2 className="h-8 w-8 text-green-500" />;
            case "cancelled":
                return <XCircle className="h-8 w-8 text-red-500" />;
            default:
                return <Clock className="h-8 w-8 text-gray-500" />;
        }
    };

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            pending: "Order Received",
            confirmed: "Confirmed",
            preparing: "Preparing Your Food",
            out_for_delivery: "Out for Delivery",
            delivered: "Delivered",
            cancelled: "Cancelled"
        };
        return labels[status] || status;
    };

    const statuses = ["pending", "confirmed", "preparing", "out_for_delivery", "delivered"];

    return (
        <div className="pt-24 min-h-screen bg-background pb-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-4xl font-serif font-bold mb-8 text-center">Track Your Order</h1>

                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Enter Order ID</CardTitle>
                        <CardDescription>
                            You can find your order ID in the confirmation email we sent you.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="flex gap-4">
                            <div className="flex-1">
                                <Label htmlFor="orderId" className="sr-only">Order ID</Label>
                                <Input
                                    id="orderId"
                                    placeholder="Enter your order ID"
                                    value={orderId}
                                    onChange={(e) => setOrderId(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Searching..." : "Track Order"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {error && (
                    <Card className="border-destructive">
                        <CardContent className="pt-6">
                            <p className="text-destructive text-center">
                                Order not found. Please check your order ID and try again.
                            </p>
                        </CardContent>
                    </Card>
                )}

                {order && (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3">
                                    {getStatusIcon(order.status)}
                                    <span>{getStatusLabel(order.status)}</span>
                                </CardTitle>
                                <CardDescription>
                                    Order placed on {order.createdAt ? format(new Date(order.createdAt), "MMMM d, yyyy 'at' h:mm a") : "Unknown"}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Order ID:</span>
                                        <span className="font-mono font-medium">#{order.id.slice(-8).toUpperCase()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Customer:</span>
                                        <span className="font-medium">{order.customerName}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Payment Status:</span>
                                        <span className={`font-medium ${order.paymentStatus === 'completed' ? 'text-green-600' : 'text-orange-600'}`}>
                                            {order.paymentStatus === 'completed' ? 'Paid' : 'Pending'}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Order Progress</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="relative">
                                    {statuses.map((status, index) => {
                                        const isActive = statuses.indexOf(order.status) >= index;
                                        const isCurrent = order.status === status;

                                        return (
                                            <div key={status} className="flex items-start mb-8 last:mb-0">
                                                <div className="flex flex-col items-center mr-4">
                                                    <div className={`rounded-full p-2 ${isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'} ${isCurrent ? 'ring-4 ring-primary/20' : ''}`}>
                                                        {getStatusIcon(status)}
                                                    </div>
                                                    {index < statuses.length - 1 && (
                                                        <div className={`w-0.5 h-16 mt-2 ${isActive ? 'bg-primary' : 'bg-muted'}`} />
                                                    )}
                                                </div>
                                                <div className="flex-1 pt-2">
                                                    <h3 className={`font-semibold ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                                                        {getStatusLabel(status)}
                                                    </h3>
                                                    {isCurrent && (
                                                        <p className="text-sm text-primary font-medium mt-1">Current Status</p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Order Items</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {order.items?.map((item: any, index: number) => (
                                        <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                                            <div>
                                                <p className="font-medium">{item.itemName}</p>
                                                <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                                            </div>
                                            <p className="font-medium">KSh {item.price.toLocaleString()}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
