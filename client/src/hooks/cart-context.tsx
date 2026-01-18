import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { MenuItem } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export type CartItem = MenuItem & { quantity: number };

type CartContextType = {
    items: CartItem[];
    addToCart: (item: MenuItem) => void;
    removeFromCart: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;
    total: number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const { toast } = useToast();

    // Load cart from local storage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem("savor-cart");
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
    }, []);

    // Save cart to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem("savor-cart", JSON.stringify(items));
    }, [items]);

    const addToCart = (item: MenuItem) => {
        setItems((currentItems) => {
            const existingItem = currentItems.find((i) => i.id === item.id);
            if (existingItem) {
                toast({
                    title: "Added to cart",
                    description: `Increased quantity of ${item.name}`,
                });
                return currentItems.map((i) =>
                    i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            toast({
                title: "Added to cart",
                description: `${item.name} added to your cart`,
            });
            return [...currentItems, { ...item, quantity: 1 }];
        });
    };

    const removeFromCart = (itemId: string) => {
        setItems((currentItems) => currentItems.filter((i) => i.id !== itemId));
        toast({
            title: "Removed from cart",
            description: "Item removed from your cart",
        });
    };

    const updateQuantity = (itemId: string, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(itemId);
            return;
        }
        setItems((currentItems) =>
            currentItems.map((i) => (i.id === itemId ? { ...i, quantity } : i))
        );
    };

    const clearCart = () => {
        setItems([]);
        localStorage.removeItem("savor-cart");
    };

    const total = items.reduce((sum, item) => {
        // Parse price string "KSh 450" -> 450
        const price = parseInt(item.price.replace(/[^0-9]/g, "")) || 0;
        return sum + price * item.quantity;
    }, 0);

    return (
        <CartContext.Provider
            value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
