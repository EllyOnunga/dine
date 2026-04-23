import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { UtensilsCrossed, Menu as MenuIcon, X, Settings as SettingsIcon, ShoppingCart, Award, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/cart-context";
import { Badge } from "@/components/ui/badge";
import { UserButton, useUser, SignInButton } from "@clerk/clerk-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { items } = useCart();
  const { user } = useUser();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHome = location === "/";
  const navBackground = scrolled || !isHome;

  const navLinks = [
    { name: "Menu", href: "/menu" },
    { name: "Stay", href: "/stay" },
    { name: "Track Order", href: "/track-order" },
    { name: "Blog", href: "/blog" },
    { name: "Story", href: "/story" },
    { name: "Reservations", href: "/reservations" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 border-b",
        navBackground
          ? "bg-background/80 backdrop-blur-md border-border py-2 shadow-sm"
          : "bg-transparent py-4 border-transparent"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="bg-primary text-primary-foreground p-2 rounded-full transition-transform group-hover:rotate-12">
              <UtensilsCrossed className="h-5 w-5" />
            </div>
            <span className={cn("text-xl font-serif font-bold tracking-tight transition-colors",
              navBackground ? "text-foreground" : "text-white")}>
              Savannah & Spice
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((item) => (
            <Link key={item.name} href={item.href}>
              <span className={cn(
                "text-sm font-medium hover:text-primary transition-colors cursor-pointer",
                navBackground ? "text-foreground/80" : "text-white/90 hover:text-white"
              )}>
                {item.name}
              </span>
            </Link>
          ))}

          <div className="flex items-center gap-4 border-l border-border/50 pl-8">
            {user ? (
              <div className="flex shrink-0 items-center gap-4">
                <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 transition-all hover:bg-primary/20",
                  navBackground ? "text-primary" : "text-white bg-white/10")}>
                  <Award className="h-4 w-4" />
                  <span className="text-xs font-bold">{(user.publicMetadata?.loyaltyPoints as number) || 0} Points</span>
                </div>
                <UserButton />
              </div>
            ) : (
                <SignInButton forceRedirectUrl="/">
                  <Button variant="ghost" size="sm" className={cn("rounded-full font-serif", navBackground ? "text-foreground" : "text-white")}>Sign In</Button>
                </SignInButton>
            )}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className={cn("rounded-full relative", navBackground ? "text-foreground/80" : "text-white/80 hover:text-white")}>
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>
            <Link href="/settings">
              <Button variant="ghost" size="icon" className={cn("rounded-full", navBackground ? "text-foreground/80" : "text-white/80 hover:text-white")}>
                <SettingsIcon className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className={cn("rounded-full", navBackground ? "text-foreground/80" : "text-white/80 hover:text-white")}>
                <ShoppingBag className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/reservations">
              <Button
                variant={navBackground ? "default" : "secondary"}
                className="font-serif italic"
              >
                Book a Table
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-2">
          <Link href="/cart">
            <Button variant="ghost" size="icon" className={cn("rounded-full relative", navBackground ? "text-foreground/80" : "text-white/80")}>
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]">
                  {cartCount}
                </Badge>
              )}
            </Button>
          </Link>
          <Link href="/settings">
            <Button variant="ghost" size="icon" className={cn("rounded-full", navBackground ? "text-foreground/80" : "text-white/80")}>
              <SettingsIcon className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className={cn("rounded-full", navBackground ? "text-foreground/80" : "text-white/80")}>
              <ShoppingBag className="h-5 w-5" />
            </Button>
          </Link>
          <button
            className="p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className={cn("h-6 w-6", navBackground ? "text-foreground" : "text-white")} />
            ) : (
              <MenuIcon className={cn("h-6 w-6", navBackground ? "text-foreground" : "text-white")} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[72px] bg-background z-40 flex flex-col pt-8 pb-32 px-6 overflow-y-auto w-full h-[calc(100vh-72px)] animate-in slide-in-from-bottom-2 fade-in duration-300">
          <div className="flex flex-col gap-6 w-full">
          {navLinks.map((item) => (
            <Link key={item.name} href={item.href}>
              <span
                onClick={() => setMobileMenuOpen(false)}
                className="text-2xl font-serif font-bold text-foreground border-b border-border/20 pb-4 flex justify-between items-center cursor-pointer active:scale-95 transition-transform"
              >
                {item.name}
              </span>
            </Link>
          ))}
          </div>
          <div className="mt-auto pt-8 flex flex-col gap-6 w-full">
            {user && (
              <div className="flex items-center justify-between p-4 bg-primary/5 rounded-2xl border border-primary/10">
                <div className="flex items-center gap-3">
                  <UserButton afterSignOutUrl="/" />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-foreground">{user.firstName || "Customer"}</span>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground italic">Dine Elite Member</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-white shadow-lg shadow-primary/20">
                  <Award className="h-3.5 w-3.5" />
                  <span className="text-xs font-bold">{(user.publicMetadata?.loyaltyPoints as number) || 0} Points</span>
                </div>
              </div>
            )}
            {!user && (
              <SignInButton mode="modal">
                <Button variant="outline" size="lg" className="w-full h-14 text-lg font-serif">Sign In</Button>
              </SignInButton>
            )}
            <Link href="/reservations">
              <Button size="lg" className="w-full h-14 text-lg font-serif italic shadow-xl" onClick={() => setMobileMenuOpen(false)}>
                Book a Table
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
