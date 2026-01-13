import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { UtensilsCrossed } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 border-b border-transparent",
        scrolled
          ? "bg-background/80 backdrop-blur-md border-border py-2 shadow-sm"
          : "bg-transparent py-4"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/">
          <a className="flex items-center gap-2 group">
            <div className="bg-primary text-primary-foreground p-2 rounded-full transition-transform group-hover:rotate-12">
              <UtensilsCrossed className="h-5 w-5" />
            </div>
            <span className={cn("text-xl font-serif font-bold tracking-tight transition-colors", scrolled ? "text-foreground" : "text-white")}>
              Savor & Vine
            </span>
          </a>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {["Menu", "Story", "Reservations", "Contact"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className={cn(
                "text-sm font-medium hover:text-primary transition-colors",
                scrolled ? "text-foreground/80" : "text-white/90 hover:text-white"
              )}
            >
              {item}
            </a>
          ))}
          <Button 
            variant={scrolled ? "default" : "secondary"} 
            className="font-serif italic"
          >
            Book a Table
          </Button>
        </div>
      </div>
    </nav>
  );
}
