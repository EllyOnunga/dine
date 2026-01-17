import type { Express } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { insertReservationSchema, insertNewsletterSchema, insertBlogSchema, insertEnquirySchema, insertMenuItemSchema } from "@shared/schema";
import { ZodError } from "zod";
import { sendReservationConfirmation, sendReservationNotificationToAdmin, sendEnquiryNotification, sendNewsletterWelcome } from "./email";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Health check endpoint
  app.get("/health", async (_req, res) => {
    const isStorageHealthy = await storage.healthCheck();
    const status = isStorageHealthy ? "ok" : "error";

    res.status(isStorageHealthy ? 200 : 503).json({
      status,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
      database: isStorageHealthy ? "connected" : "disconnected",
    });
  });

  // Seed menu items if empty
  const existingMenu = await storage.getMenuItems();
  if (existingMenu.length === 0) {
    const defaultMenu = [
      { name: "Maasai Beef Samosas", price: "KSh 450", originalPrice: "KSh 600", description: "Hand-folded pastry triangles filled with spiced Samburu beef and organic herbs. Served with a tangy coriander chutney.", category: "The Bitings (Starters)", tag: "Must Try", image: "/images/samosas_and_mahamri_on_a_platter_shot_professionally.png" },
      { name: "Swahili Mahamri & Mbaazi", price: "KSh 550", originalPrice: "KSh 700", description: "Golden coconut donuts served with pigeon peas in a rich, cardamom-scented coconut sauce.", category: "The Bitings (Starters)", tag: "Coastal Classic", image: "/images/samosas_and_mahamri_on_a_platter_shot_professionally.png" },
      { name: "Savannah Nyama Choma", price: "KSh 1,800", originalPrice: "KSh 2,200", description: "Tender goat ribs slow-grilled over savannah wood, served with traditional Ugali, Sukuma Wiki, and spicy Kachumbari.", category: "Signature Main Plates", tag: "Signature", image: "/images/nyama_choma_platter_with_kachumbari_and_ugali_shot_professionally.png" },
      { name: "Samaki wa Kupaka", price: "KSh 1,650", originalPrice: "KSh 2,000", description: "Charcoal-grilled whole tilapia smothered in a spicy Swahili coconut and tamarind sauce.", category: "Signature Main Plates", tag: "Coastal", image: "/images/grilled_tilapia_with_plantains_shot_professionally.png" },
      { name: "Mombasa Chicken Biryani", price: "KSh 1,350", originalPrice: "KSh 1,600", description: "Fragrant basmati rice layered with tender spring chicken marinated in secret 'Savannah' spices.", category: "Signature Main Plates", image: "/images/chicken_biryani_kenyan_style_shot_professionally.png" },
      { name: "Swahili Fish Curry", price: "KSh 1,750", originalPrice: "KSh 2,100", description: "Fresh catch of the day simmered in a rich coconut milk and tamarind curry, served with aromatic rice.", category: "Signature Main Plates", image: "/images/swahili_fish_curry_with_coconut_rice_shot_professionally.png" },
      { name: "Herb-Crusted Lamb Rack", price: "KSh 2,400", originalPrice: "KSh 3,000", description: "Succulent rack of lamb with a fresh herb crust, served with a red wine reduction.", category: "Signature Main Plates", tag: "Chef's Special", image: "/images/herb-crusted_lamb_rack_with_red_wine_jus_shot_professionally.png" },
      { name: "Truffle Mushroom Risotto", price: "KSh 1,950", originalPrice: "KSh 2,500", description: "Creamy arborio rice cooked with wild mushrooms and finished with truffle oil and a parmesan crisp.", category: "Vegetarian", image: "/images/truffle_mushroom_risotto_with_parmesan_crisp_shot_professionally.png" },
      { name: "Masala Chai Tiramisu", price: "KSh 750", originalPrice: "KSh 950", description: "A fusion twist on the classic Italian dessert, infused with house-blended Kenyan tea spices.", category: "Desserts & Refreshments", tag: "Fusion", image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=800" },
    ].map(item => ({ ...item, id: Math.random().toString() }));
    await storage.seedMenuItems(defaultMenu as any);
  }

  // Public API
  app.get("/api/menu", async (_req, res) => {
    const menu = await storage.getMenuItems();
    res.json(menu);
  });

  app.get("/api/blogs", async (_req, res) => {
    const blogs = await storage.getBlogs();
    res.json(blogs);
  });

  app.get("/api/blogs/:id", async (req, res) => {
    const blog = await storage.getBlog(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  });

  app.post("/api/reservations", async (req, res) => {
    try {
      const data = insertReservationSchema.parse(req.body);
      const reservation = await storage.createReservation(data);

      // Send confirmation emails (don't await to avoid blocking the response)
      sendReservationConfirmation(data).catch(err =>
        console.error('Failed to send reservation confirmation:', err)
      );
      sendReservationNotificationToAdmin(data).catch(err =>
        console.error('Failed to send admin notification:', err)
      );

      res.status(201).json(reservation);
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({ message: err.issues });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.post("/api/newsletter", async (req, res) => {
    try {
      const { email } = insertNewsletterSchema.parse(req.body);
      const lead = await storage.addNewsletterLead(email);

      // Send welcome email (don't await to avoid blocking)
      sendNewsletterWelcome(email).catch(err =>
        console.error('Failed to send newsletter welcome:', err)
      );

      res.status(201).json(lead);
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({ message: err.issues });
      } else {
        res.status(500).json({ message: "Email already subscribed or invalid" });
      }
    }
  });

  app.post("/api/enquiries", async (req, res) => {
    try {
      const data = insertEnquirySchema.parse(req.body);
      const enquiry = await storage.createEnquiry(data);

      // Send notification to admin (don't await to avoid blocking)
      sendEnquiryNotification(data).catch(err =>
        console.error('Failed to send enquiry notification:', err)
      );

      res.status(201).json(enquiry);
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({ message: err.issues });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // Admin API (In a real app, these would be protected by auth middleware)
  app.get("/api/admin/reservations", async (_req, res) => {
    const reservations = await storage.getReservations();
    res.json(reservations);
  });

  app.delete("/api/admin/reservations/:id", async (req, res) => {
    await storage.deleteReservation(req.params.id);
    res.sendStatus(204);
  });

  app.get("/api/admin/enquiries", async (_req, res) => {
    const enquiries = await storage.getEnquiries();
    res.json(enquiries);
  });

  app.delete("/api/admin/enquiries/:id", async (req, res) => {
    await storage.deleteEnquiry(req.params.id);
    res.sendStatus(204);
  });

  app.get("/api/admin/newsletter", async (_req, res) => {
    const leads = await storage.getNewsletterLeads();
    res.json(leads);
  });

  app.post("/api/admin/menu", async (req, res) => {
    try {
      const data = insertMenuItemSchema.parse(req.body);
      const item = await storage.createMenuItem(data);
      res.status(201).json(item);
    } catch (err) {
      res.status(400).json({ message: "Invalid menu item data" });
    }
  });

  app.patch("/api/admin/menu/:id", async (req, res) => {
    try {
      // For simplicity, we're not strict with the schema here but you could use a partial schema
      const item = await storage.updateMenuItem(req.params.id, req.body);
      res.json(item);
    } catch (err) {
      res.status(400).json({ message: "Failed to update menu item" });
    }
  });

  app.delete("/api/admin/menu/:id", async (req, res) => {
    await storage.deleteMenuItem(req.params.id);
    res.sendStatus(204);
  });

  app.post("/api/admin/blogs", async (req, res) => {
    try {
      const data = insertBlogSchema.parse(req.body);
      const blog = await storage.createBlog(data);
      res.status(201).json(blog);
    } catch (err) {
      res.status(400).json({ message: "Invalid blog data" });
    }
  });

  app.patch("/api/admin/blogs/:id", async (req, res) => {
    try {
      const blog = await storage.updateBlog(req.params.id, req.body);
      res.json(blog);
    } catch (err) {
      res.status(400).json({ message: "Failed to update blog" });
    }
  });

  app.delete("/api/admin/blogs/:id", async (req, res) => {
    await storage.deleteBlog(req.params.id);
    res.sendStatus(204);
  });

  return httpServer;
}

