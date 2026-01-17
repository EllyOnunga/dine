import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./hooks/theme-provider";
import NotFound from "./pages/not-found";
import Home from "./pages/home";
import Story from "./pages/story";
import Reservations from "./pages/reservations";
import Contact from "./pages/contact";
import Settings from "./pages/settings";
import PrivacyPolicy from "./pages/privacy";
import TermsOfService from "./pages/terms";
import FAQs from "./pages/faqs";
import Menu from "./pages/menu";
import Blog from "./pages/blog";
import BlogDetail from "./pages/blog-detail";
import PaymentMethods from "./pages/payments";
import AdminDashboard from "./pages/admin/dashboard";
import { Navbar } from "./components/ui/navbar";
import { Footer } from "./components/ui/footer";
import { ScrollToTop } from "./components/ui/scroll-to-top";
import { WhatsAppButton } from "./components/ui/whatsapp-button";

function Router() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/menu" component={Menu} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/:id" component={BlogDetail} />
        <Route path="/payments" component={PaymentMethods} />
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/story" component={Story} />
        <Route path="/reservations" component={Reservations} />
        <Route path="/contact" component={Contact} />
        <Route path="/settings" component={Settings} />
        <Route path="/privacy" component={PrivacyPolicy} />
        <Route path="/terms" component={TermsOfService} />
        <Route path="/faqs" component={FAQs} />
        <Route component={NotFound} />
      </Switch>
      <Footer />
      <WhatsAppButton />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="savor-theme">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
