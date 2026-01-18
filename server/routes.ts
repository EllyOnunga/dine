import type { Express } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { insertReservationSchema, insertNewsletterSchema, insertBlogSchema, insertEnquirySchema, insertMenuItemSchema, insertOrderSchema } from "@shared/schema";
import { ZodError } from "zod";
import { sendReservationConfirmation, sendReservationNotificationToAdmin, sendEnquiryNotification, sendEnquiryConfirmation, sendNewsletterWelcome, sendOrderStatusUpdate, sendOrderCustomMessage, sendOrderDetailsEmail, sendOrderNotificationToAdmin } from "./email";
import { logger } from "./logger";

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
    ];
    await storage.seedMenuItems(defaultMenu as any);
  }

  // Seed suites if empty
  const existingSuites = await storage.getSuites();
  if (existingSuites.length === 0) {
    const defaultSuites = [
      {
        name: "Savannah Executive Suite",
        description: "A spacious suite featuring African-modern fusion decor, a king-size bed, and a private balcony overlooking the lush gardens of Karen.",
        pricePerNight: 15000,
        image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1200",
        amenities: ["WiFi", "Breakfast", "Secure Parking", "Smart TV", "Mini Bar"],
        isAvailable: true
      },
      {
        name: "Acacia Garden Room",
        description: "Quiet and cozy room with direct access to our peaceful garden walkway. Perfect for business travelers seeking tranquility.",
        pricePerNight: 10000,
        image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1200",
        amenities: ["WiFi", "Breakfast", "Secure Parking", "Desk Space"],
        isAvailable: true
      },
      {
        name: "Royal Swahili Penthouse",
        description: "Our most premium offering. A multi-room penthouse with traditional Swahili carvings, a private lounge, and a dedicated butler service.",
        pricePerNight: 25000,
        image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200",
        amenities: ["WiFi", "Full Board", "Dedicated Butler", "Airport Pick-up", "Private Balcony"],
        isAvailable: true
      }
    ];
    await storage.seedSuites(defaultSuites as any);
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

  app.get("/api/suites", async (_req, res) => {
    const suites = await storage.getSuites();
    res.json(suites);
  });

  app.post("/api/reservations", async (req, res) => {
    try {
      const data = insertReservationSchema.parse(req.body);
      const reservation = await storage.createReservation(data);

      // Send confirmation emails (don't await to avoid blocking the response)
      sendReservationConfirmation(data).catch(err =>
        logger.error({ err }, 'Failed to send reservation confirmation')
      );
      sendReservationNotificationToAdmin(data).catch(err =>
        logger.error({ err }, 'Failed to send admin notification')
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
        logger.error({ err, email }, 'Failed to send newsletter welcome')
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

      // Send notification to admin and user (don't await to avoid blocking)
      sendEnquiryNotification(data).catch(err =>
        logger.error({ err }, 'Failed to send enquiry notification')
      );
      sendEnquiryConfirmation(data).catch(err =>
        logger.error({ err }, 'Failed to send enquiry confirmation')
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

  // Admin API Protection
  app.use("/api/admin", (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Unauthorized");
    }
    if (!(req.user as any).isAdmin) {
      return res.status(403).send("Forbidden: Admins only");
    }
    next();
  });

  app.get("/api/admin/analytics", async (_req, res) => {
    try {
      const orders = await storage.getOrders();
      const reservations = await storage.getReservations();

      const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
      const ordersByStatus = orders.reduce((acc: any, o) => {
        acc[o.status] = (acc[o.status] || 0) + 1;
        return acc;
      }, {});

      // Calculate popular items
      const itemCounts = orders.flatMap(o => o.items).reduce((acc: any, item) => {
        acc[item.itemName] = (acc[item.itemName] || 0) + item.quantity;
        return acc;
      }, {});

      const topItems = Object.entries(itemCounts)
        .sort(([, a]: any, [, b]: any) => b - a)
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }));

      res.json({
        totalRevenue,
        totalOrders: orders.length,
        totalReservations: reservations.length,
        ordersByStatus,
        topItems
      });
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  app.get("/api/admin/settings", async (_req, res) => {
    try {
      const settings = await storage.getSiteSettings();
      res.json(settings);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  app.patch("/api/admin/settings", async (req, res) => {
    try {
      const settings = await storage.updateSiteSettings(req.body);
      res.json(settings);
    } catch (err) {
      res.status(500).json({ message: "Failed to update settings" });
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

  app.get("/api/admin/orders", async (_req, res) => {
    const orders = await storage.getOrders();
    res.json(orders);
  });

  app.patch("/api/admin/orders/:id", async (req, res) => {
    try {
      const { status } = req.body;
      if (!status) return res.status(400).json({ message: "Status is required" });

      const order = await storage.updateOrder(req.params.id, status);
      if (!order) return res.status(404).json({ message: "Order not found" });

      // Notify customer (don't await)
      const fullOrder = await storage.getOrder(order.id);
      if (fullOrder) {
        if (status === 'confirmed') {
          // Special confirmation email with full details
          sendOrderDetailsEmail({
            orderId: fullOrder.id,
            customerName: fullOrder.customerName,
            customerEmail: fullOrder.customerEmail,
            customerPhone: fullOrder.customerPhone,
            deliveryAddress: fullOrder.deliveryAddress,
            totalAmount: fullOrder.totalAmount,
            paymentMethod: fullOrder.paymentMethod,
            createdAt: fullOrder.createdAt!,
            status: "confirmed",
            items: fullOrder.items
          }).catch(err => logger.error({ err, orderId: fullOrder.id }, 'Failed to send order confirmation email'));
        } else {
          logger.info({ orderId: order.id, status: order.status, email: order.customerEmail }, 'Triggering order status update email');
          sendOrderStatusUpdate({
            customerName: order.customerName,
            customerEmail: order.customerEmail,
            orderId: order.id,
            status: order.status
          }).catch(err => logger.error({ err, orderId: order.id }, 'Failed to send status update email'));
        }
      }

      res.json(order);
    } catch (err) {
      res.status(400).json({ message: "Failed to update order status" });
    }
  });

  app.post("/api/admin/orders/:id/message", async (req, res) => {
    try {
      const { message } = req.body;
      if (!message) return res.status(400).json({ message: "Message is required" });

      const orders = await storage.getOrders();
      const order = orders.find(o => o.id === req.params.id);

      if (!order) return res.status(404).json({ message: "Order not found" });

      await sendOrderCustomMessage({
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        orderId: order.id,
        message: message
      });

      res.json({ message: "Email sent successfully" });
    } catch (err) {
      res.status(500).json({ message: "Failed to send email" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const data = insertOrderSchema.parse(req.body);

      // Validate that all menu items exist
      for (const item of data.items) {
        const menuItem = await storage.getMenuItem(item.menuItemId);
        if (!menuItem) {
          return res.status(400).json({ message: `Menu item with id ${item.menuItemId} not found` });
        }
      }

      // Set payment status based on method (simulating instant success for mpesa/card)
      const orderData = {
        ...data,
        paymentStatus: (data.paymentMethod === 'mpesa' || data.paymentMethod === 'card') ? 'completed' : 'pending'
      };

      const order = await storage.createOrder(orderData);

      // Automated Receipt & Admin Notification
      const fullOrder = await storage.getOrder(order.id);
      if (fullOrder) {
        // Prepare common data
        const emailData = {
          orderId: fullOrder.id,
          customerName: fullOrder.customerName,
          customerEmail: fullOrder.customerEmail,
          customerPhone: fullOrder.customerPhone,
          deliveryAddress: fullOrder.deliveryAddress,
          totalAmount: fullOrder.totalAmount,
          paymentMethod: fullOrder.paymentMethod,
          createdAt: fullOrder.createdAt!,
          status: "received",
          items: fullOrder.items
        };

        // Send customer receipt
        sendOrderDetailsEmail(emailData).catch(err =>
          logger.error({ err, orderId: fullOrder.id }, 'Failed to send customer order email')
        );

        // Send admin notification
        sendOrderNotificationToAdmin(emailData).catch(err =>
          logger.error({ err, orderId: fullOrder.id }, 'Failed to send admin order notification')
        );
      }

      res.status(201).json(order);
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({ message: err.issues });
      } else {
        logger.error({ err }, 'Order creation failed');
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.get("/api/orders/:id/tracking", async (req, res) => {
    try {
      const orders = await storage.getOrders();
      const orderId = req.params.id.replace('#', '').toLowerCase();
      const order = orders.find(o =>
        o.id.toLowerCase() === orderId ||
        o.id.toLowerCase().endsWith(orderId)
      );

      if (!order) return res.status(404).json({ message: "Order not found" });

      res.json({
        id: order.id,
        status: order.status,
        customerName: order.customerName,
        createdAt: order.createdAt,
        paymentStatus: order.paymentStatus,
        items: order.items
      });
    } catch (err) {
      res.status(500).json({ message: "Failed to track order" });
    }
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

