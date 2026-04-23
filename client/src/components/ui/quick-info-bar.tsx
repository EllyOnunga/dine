import { MapPin, Phone, Clock, Loader2 } from "lucide-react";
import { useSiteSettings } from "@/hooks/use-site-data";

export function QuickInfoBar() {
  const { data: settings, isLoading } = useSiteSettings();

  if (isLoading) {
    return (
      <div className="bg-neutral-900 border-b border-border/10 py-6 min-h-[68px] flex items-center justify-center">
        <Loader2 className="w-4 h-4 animate-spin text-primary" />
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div className="bg-neutral-900 border-b border-border/10 py-6 text-white text-sm">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-primary" />
          <span><span className="font-bold text-primary">Hours:</span> {settings.openingHours}</span>
        </div>
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-primary" />
          <a href="#map" className="hover:text-primary transition-colors hover:underline">
            {settings.address}
          </a>
        </div>
        <div className="flex items-center gap-3">
          <Phone className="w-5 h-5 text-primary" />
          <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className="hover:text-primary transition-colors font-bold tracking-wider">
            {settings.phone}
          </a>
        </div>
      </div>
    </div>
  );
}
