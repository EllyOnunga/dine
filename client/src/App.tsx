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
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import { CartProvider } from "@/hooks/cart-context";
import AuthPage from "./pages/auth";
import CartPage from "./pages/cart";
import TrackOrderPage from "./pages/track-order";
import SuitesPage from "./pages/suites";

function Router() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Switch>
        <ProtectedRoute path="/admin" component={AdminDashboard} />
        <Route path="/auth" component={AuthPage} />
        <Route path="/cart" component={CartPage} />
        <Route path="/track-order" component={TrackOrderPage} />
        <Route path="/" component={Home} />
        <Route path="/menu" component={Menu} />
        <Route path="/stay" component={SuitesPage} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/:id" component={BlogDetail} />
        <Route path="/payments" component={PaymentMethods} />
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
        <AuthProvider>
          <CartProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
