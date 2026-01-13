import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { UtensilsCrossed, Menu as MenuIcon, X, Settings as SettingsIcon } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    { name: "Menu", href: isHome ? "#menu" : "/#menu" },
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
              Savor & Vine
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
            <Link href="/settings">
              <Button variant="ghost" size="icon" className={cn("rounded-full", navBackground ? "text-foreground/80" : "text-white/80 hover:text-white")}>
                <SettingsIcon className="h-5 w-5" />
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
           <Link href="/settings">
              <Button variant="ghost" size="icon" className={cn("rounded-full", navBackground ? "text-foreground/80" : "text-white/80")}>
                <SettingsIcon className="h-5 w-5" />
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

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background border-b border-border p-4 flex flex-col gap-4 shadow-xl animate-in slide-in-from-top duration-300">
          {navLinks.map((item) => (
            <Link key={item.name} href={item.href}>
              <span 
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-serif font-semibold border-b border-border/50 pb-2 cursor-pointer"
              >
                {item.name}
              </span>
            </Link>
          ))}
          <Link href="/reservations">
            <Button className="w-full font-serif italic" onClick={() => setMobileMenuOpen(false)}>
              Book a Table
            </Button>
          </Link>
        </div>
      )}
    </nav>
  );
}
