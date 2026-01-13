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
import { Navbar } from "./components/ui/navbar";

function Router() {
  return (
    <>
      <Navbar />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/story" component={Story} />
        <Route path="/reservations" component={Reservations} />
        <Route path="/contact" component={Contact} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
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
