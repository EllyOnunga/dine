import { FaInstagram } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { useSiteSettings } from "@/hooks/use-site-data";

interface InstagramMedia {
  id: string;
  caption?: string;
  media_type: string;
  media_url: string;
  permalink: string;
  thumbnail_url?: string;
  timestamp: string;
}

const STATIC_FALLBACK = [
  "https://images.unsplash.com/photo-1544025162-817bf40d3a5a?q=80&w=600",
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600",
  "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=600",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=600",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600",
  "https://images.unsplash.com/photo-1585518419759-7ec2a1ba9fa9?q=80&w=600"
];

export function InstagramFeed() {
  const { data: settings } = useSiteSettings();
  const { data: media, isLoading } = useQuery<InstagramMedia[]>({
    queryKey: ["/api/social/instagram"],
  });

  const displayData = media && media.length > 0 ? media : null;
  const handle = settings?.instagramHandle || "savannah_spice_ke";

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 text-center mb-12">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="flex flex-col items-center justify-center gap-4"
        >
          <FaInstagram className="w-10 h-10 text-primary" />
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground">
            Follow Our Journey
          </h2>
          <a href={`https://instagram.com/${handle}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors text-lg italic">
            @{handle}
          </a>
        </motion.div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-1">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="aspect-square bg-muted animate-pulse" />
          ))
        ) : displayData ? (
          displayData.slice(0, 6).map((item, idx) => (
            <motion.a 
              key={item.id}
              href={item.permalink}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative aspect-square overflow-hidden group cursor-pointer"
            >
              <img 
                src={item.media_url} 
                alt={item.caption || "Instagram post"}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                 <div className="text-center">
                    <FaInstagram className="w-6 h-6 text-white mx-auto mb-2" />
                    {item.caption && (
                      <p className="text-white text-[10px] line-clamp-2 leading-tight">
                        {item.caption}
                      </p>
                    )}
                 </div>
              </div>
            </motion.a>
          ))
        ) : (
          /* Fallback static images if no API media found */
          STATIC_FALLBACK.map((img, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative aspect-square overflow-hidden group cursor-pointer"
            >
              <img 
                src={img} 
                alt={`Instagram fallback image ${idx + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <FaInstagram className="w-8 h-8 text-white" />
              </div>
            </motion.div>
          ))
        )}
      </div>
    </section>
  );
}
