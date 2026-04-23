import { useQuery } from "@tanstack/react-query";
import { SiteSetting, SiteContent, Testimonial, FAQ } from "@shared/schema";

export function useSiteSettings() {
  return useQuery<SiteSetting>({
    queryKey: ["/api/settings"],
  });
}

export function useSiteContent(section?: string) {
  return useQuery<SiteContent[]>({
    queryKey: [section ? `/api/content/${section}` : "/api/content"],
    enabled: true
  });
}

export function useTestimonials() {
  return useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
  });
}

export function useFAQs() {
  return useQuery<FAQ[]>({
    queryKey: ["/api/faqs"],
  });
}
