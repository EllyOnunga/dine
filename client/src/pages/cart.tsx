import { useCart } from "@/hooks/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Minus, Plus, Trash2, ArrowRight, CreditCard, Smartphone, Banknote, Loader2, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import { InsertOrder } from "@shared/schema";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function CartPage() {
    const { items, removeFromCart, updateQuantity, total, clearCart } = useCart();
    const [step, setStep] = useState<"cart" | "checkout">("cart");
    const [, setLocation] = useLocation();
    const { toast } = useToast();
    const [completedOrderId, setCompletedOrderId] = useState<string | null>(null);

    const [checkoutForm, setCheckoutForm] = useState({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        deliveryAddress: "",
        paymentMethod: "cash",
    });

    const orderMutation = useMutation({
        mutationFn: async (data: Omit<InsertOrder, "totalAmount" | "items">) => {
            const payload = {
                ...data,
                totalAmount: total,
                items: items.map(item => ({
                    menuItemId: item.id,
                    quantity: item.quantity,
                    price: parseInt(item.price.replace(/[^0-9]/g, "")) || 0,
                    itemName: item.name
                }))
            };

            const res = await apiRequest("POST", "/api/orders", payload);
            return res.json();
        },
        onSuccess: (data) => {
            setCompletedOrderId(data.id);
            toast({
                title: "Order Placed Successfully!",
                description: `Your order #${data.id.slice(-8).toUpperCase()} has been received and is being processed.`,
            });
            clearCart();
        },
        onError: (error: Error) => {
            toast({
                title: "Order Failed",
                description: error.message,
                variant: "destructive",
            });
        }
    });

    const handleCheckout = (e: React.FormEvent) => {
        e.preventDefault();
        orderMutation.mutate(checkoutForm);
    };

    if (completedOrderId) {
        return (
            <div className="pt-32 min-h-screen container mx-auto px-4 text-center max-w-2xl">
                <div className="mb-8">
                    <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
                    <h1 className="text-4xl font-serif font-bold mb-4">Order Placed Successfully!</h1>
                    <p className="text-muted-foreground mb-2">Thank you for your order.</p>
                    <p className="text-lg font-mono font-bold">Order ID: #{completedOrderId.slice(-8).toUpperCase()}</p>
                </div>
                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground mb-4">
                            We've sent a confirmation email to {checkoutForm.customerEmail}.
                            You can track your order status using the button below.
                        </p>
                        <Link href="/track-order">
                            <Button size="lg" className="w-full">
                                Track Your Order
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
                <Link href="/menu">
                    <Button variant="outline" size="lg">Continue Shopping</Button>
                </Link>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="pt-32 min-h-screen container mx-auto px-4 text-center">
                <h1 className="text-4xl font-serif font-bold mb-4">Your Cart is Empty</h1>
                <p className="text-muted-foreground mb-8">Looks like you haven't added any delicious items yet.</p>
                <Link href="/menu">
                    <Button size="lg" className="font-serif italic">Browse Menu</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="pt-24 min-h-screen bg-background pb-12">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-serif font-bold mb-8 text-center">
                    {step === "cart" ? "Your Cart" : "Checkout"}
                </h1>

                <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
                        {step === "cart" ? (
                            <div className="space-y-4">
                                {items.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex gap-4 p-4 rounded-xl border border-border bg-card"
                                    >
                                        <div className="h-24 w-24 rounded-lg overflow-hidden shrink-0">
                                            <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-serif font-bold text-lg">{item.name}</h3>
                                                    <p className="text-primary font-medium">{item.price}</p>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive hover:text-destructive/80"
                                                    onClick={() => removeFromCart(item.id)}
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </Button>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-full"
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </Button>
                                                <span className="w-8 text-center font-medium">{item.quantity}</span>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-full"
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <form id="checkout-form" onSubmit={handleCheckout} className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input
                                            id="name"
                                            required
                                            value={checkoutForm.customerName}
                                            onChange={e => setCheckoutForm({ ...checkoutForm, customerName: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            required
                                            value={checkoutForm.customerEmail}
                                            onChange={e => setCheckoutForm({ ...checkoutForm, customerEmail: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        required
                                        value={checkoutForm.customerPhone}
                                        onChange={e => setCheckoutForm({ ...checkoutForm, customerPhone: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="address">Delivery Address</Label>
                                    <Textarea
                                        id="address"
                                        required
                                        className="min-h-[100px]"
                                        value={checkoutForm.deliveryAddress}
                                        onChange={e => setCheckoutForm({ ...checkoutForm, deliveryAddress: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-4 pt-4">
                                    <Label className="text-lg font-serif font-bold">Payment Method</Label>
                                    <RadioGroup
                                        defaultValue="cash"
                                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                                        onValueChange={(val) => setCheckoutForm({ ...checkoutForm, paymentMethod: val })}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="mpesa" id="mpesa" className="peer sr-only" />
                                            <Label
                                                htmlFor="mpesa"
                                                className="flex flex-1 flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                            >
                                                <Smartphone className="mb-3 h-6 w-6 text-[#25D366]" />
                                                <span className="font-medium">M-Pesa</span>
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="card" id="card" className="peer sr-only" />
                                            <Label
                                                htmlFor="card"
                                                className="flex flex-1 flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                            >
                                                <CreditCard className="mb-3 h-6 w-6 text-primary" />
                                                <span className="font-medium">Card</span>
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="cash" id="cash" className="peer sr-only" />
                                            <Label
                                                htmlFor="cash"
                                                className="flex flex-1 flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                            >
                                                <Banknote className="mb-3 h-6 w-6 text-muted-foreground" />
                                                <span className="font-medium">Cash</span>
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                            </form>
                        )}
                    </div>

                    <div className="md:col-span-1">
                        <div className="sticky top-24 p-6 rounded-xl border border-border bg-card space-y-6">
                            <h3 className="font-serif font-bold text-xl">Order Summary</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>KSh {total.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Delivery</span>
                                    <span>Calculated at checkout</span>
                                </div>
                                <div className="pt-4 border-t border-border flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>KSh {total.toLocaleString()}</span>
                                </div>
                            </div>

                            {step === "cart" ? (
                                <Button className="w-full" size="lg" onClick={() => setStep("checkout")}>
                                    Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            ) : (
                                <div className="space-y-3">
                                    <Button
                                        type="submit"
                                        form="checkout-form"
                                        className="w-full"
                                        size="lg"
                                        disabled={orderMutation.isPending}
                                    >
                                        {orderMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Place Order
                                    </Button>
                                    <Button variant="outline" className="w-full" onClick={() => setStep("cart")}>
                                        Back to Cart
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
