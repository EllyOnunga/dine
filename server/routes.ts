import type { Express } from "express";
import { type Server } from "http";
import { requireAuth, getAuth } from "@clerk/express";
import { storage } from "./storage";
import { insertReservationSchema, insertNewsletterSchema, insertBlogSchema, insertEnquirySchema, insertMenuItemSchema, insertOrderSchema } from "@shared/schema";
import { upload } from "./lib/cloudinary";
import { ZodError } from "zod";
import { sendReservationConfirmation, sendReservationNotificationToAdmin, sendEnquiryNotification, sendEnquiryConfirmation, sendNewsletterWelcome, sendOrderStatusUpdate, sendOrderCustomMessage, sendOrderDetailsEmail, sendOrderNotificationToAdmin } from "./email";
import { logger } from "./logger";
// @ts-ignore
import Stripe from "stripe";

// Initialize Stripe with a fallback for local testing
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummy", {
  apiVersion: "2023-10-16" as any,
});

async function syncAndGetLocalUser(req: any) {
  const { userId: clerkId, sessionClaims } = getAuth(req);
  if (!clerkId || typeof clerkId !== 'string' || !clerkId.trim()) {
    return null;
  }

  let user = await storage.getUser(clerkId);
  const userEmail = sessionClaims?.email as string;
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminCount = await storage.countAdmins();
  const shouldBeAdmin = !!(adminCount === 0 || (userEmail && adminEmail && userEmail === adminEmail));

  if (!user) {
    user = await storage.createUser({
      id: clerkId,
      username: (sessionClaims?.username as string) || (sessionClaims?.name as string) || clerkId,
      isAdmin: shouldBeAdmin,
      loyaltyPoints: 0
    });
    logger.info({ userId: clerkId, isAdmin: user.isAdmin }, "New user synced from Clerk");
  } else if (shouldBeAdmin && !user.isAdmin) {
    user = await storage.setAdminStatus(clerkId, true) || user;
    user.isAdmin = true;
    logger.info({ userId: clerkId }, "User auto-promoted to admin");
  }

  return user;
}

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
    await storage.seedAll();
  }

  // Content Management API (Public)
  app.get("/api/settings", async (_req, res) => {
    const settings = await storage.getSiteSettings();
    res.json(settings);
  });

  app.get("/api/content/:section", async (req, res) => {
    const content = await storage.getSiteContent(req.params.section);
    res.json(content);
  });

  app.get("/api/testimonials", async (_req, res) => {
    const testimonials = await storage.getTestimonials();
    res.json(testimonials);
  });

  app.get("/api/faqs", async (_req, res) => {
    const faqs = await storage.getFAQs();
    res.json(faqs);
  });

  // Content Management API (Admin)
  app.patch("/api/admin/settings", async (req, res) => {
    if (!(req as any).user?.isAdmin) return res.sendStatus(403);
    const settings = await storage.updateSiteSettings(req.body);
    res.json(settings);
  });

  app.post("/api/admin/content", async (req, res) => {
    if (!(req as any).user?.isAdmin) return res.sendStatus(403);
    const content = await storage.createSiteContent(req.body);
    res.json(content);
  });

  app.patch("/api/admin/content/:id", async (req, res) => {
    if (!(req as any).user?.isAdmin) return res.sendStatus(403);
    const content = await storage.updateSiteContent(req.params.id, req.body);
    res.json(content);
  });

  app.delete("/api/admin/content/:id", async (req, res) => {
    if (!(req as any).user?.isAdmin) return res.sendStatus(403);
    await storage.deleteSiteContent(req.params.id);
    res.sendStatus(200);
  });

  app.post("/api/admin/testimonials", async (req, res) => {
    if (!(req as any).user?.isAdmin) return res.sendStatus(403);
    const testimonial = await storage.createTestimonial(req.body);
    res.json(testimonial);
  });

  app.delete("/api/admin/testimonials/:id", async (req, res) => {
    if (!(req as any).user?.isAdmin) return res.sendStatus(403);
    await storage.deleteTestimonial(req.params.id);
    res.sendStatus(200);
  });

  app.post("/api/admin/faqs", async (req, res) => {
    if (!(req as any).user?.isAdmin) return res.sendStatus(403);
    const faq = await storage.createFAQ(req.body);
    res.json(faq);
  });

  app.delete("/api/admin/faqs/:id", async (req, res) => {
    if (!(req as any).user?.isAdmin) return res.sendStatus(403);
    await storage.deleteFAQ(req.params.id);
    res.sendStatus(200);
  });

  // Image Upload (Cloudinary)
  app.post("/api/admin/upload", upload.single('image'), async (req, res) => {
    if (!(req as any).user?.isAdmin) return res.sendStatus(403);
    if (!req.file) return res.status(400).send("No file uploaded");
    
    // req.file.path contains the Cloudinary URL when using CloudinaryStorage
    res.json({ url: (req.file as any).path });
  });

  // Instagram Cache
  let instagramCache: { data: any, timestamp: number } | null = null;
  const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

  app.get("/api/social/instagram", async (_req, res) => {
    try {
      // Check cache
      if (instagramCache && (Date.now() - instagramCache.timestamp < CACHE_DURATION)) {
        return res.json(instagramCache.data);
      }

      const settings = await storage.getSiteSettings();
      const token = settings.instagramAccessToken;

      if (!token) {
        // Fallback to empty feed if no token
        return res.json([]);
      }

      const response = await fetch(
        `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${token}&limit=12`
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        logger.error({ errData, status: response.status }, "Instagram API error");
        // If API fails but we have old cache, return it
        if (instagramCache) return res.json(instagramCache.data);
        return res.json([]);
      }

      const rawData: any = await response.json();
      const media = rawData.data?.filter((m: any) => m.media_type === "IMAGE" || m.media_type === "CAROUSEL_ALBUM") || [];
      
      // Update cache
      instagramCache = { data: media, timestamp: Date.now() };
      res.json(media);
    } catch (err) {
      logger.error({ err }, "Failed to fetch Instagram feed");
      if (instagramCache) return res.json(instagramCache.data);
      res.json([]);
    }
  });

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
      const data = insertNewsletterSchema.parse(req.body);
      const lead = await storage.addNewsletterLead(data.email);

      // Send welcome email (don't await to avoid blocking)
      sendNewsletterWelcome(data.email).catch(err =>
        logger.error({ err, email: data.email }, 'Failed to send newsletter welcome')
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

  // User Sync and Admin Protection middleware
  app.use("/api/admin", requireAuth(), async (req: any, res, next) => {
    try {
      const user = await syncAndGetLocalUser(req);
      
      if (!user) {
        return res.status(401).json({ message: "Unauthorized: Invalid or missing Clerk ID" });
      }

      if (!user.isAdmin) {
        return res.status(403).send("Forbidden: Admins only");
      }
      
      // Attach local user object to request
      req.user = user;
      next();
    } catch (e) {
      logger.error({ err: e }, "Error in admin middleware");
      return res.status(500).send("Internal Server Error checking privileges");
    }
  });

  // Get current user profile
  app.get("/api/user/me", requireAuth(), async (req: any, res) => {
    try {
      const user = await syncAndGetLocalUser(req);
      
      if (!user) {
        return res.status(401).json({ message: "Unauthorized: Invalid or missing Clerk ID" });
      }
      
      res.json(user);
    } catch (err) {
      logger.error({ err, userId: req.auth?.userId }, "Failed to fetch user profile");
      res.status(500).json({ 
        message: "Failed to fetch user profile",
        error: err instanceof Error ? err.message : String(err)
      });
    }
  });

  app.get("/api/user/orders", requireAuth(), async (req: any, res) => {
    try {
      const { sessionClaims } = getAuth(req);
      const email = sessionClaims?.email as string;
      
      if (!email) {
        return res.status(400).json({ message: "User email not found in session" });
      }
      
      const orders = await storage.getOrdersByEmail(email);
      res.json(orders);
    } catch (err) {
      logger.error({ err }, "Failed to fetch user orders");
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/user/reservations", requireAuth(), async (req: any, res) => {
    try {
      const { sessionClaims } = getAuth(req);
      const email = sessionClaims?.email as string;
      
      if (!email) {
        return res.status(400).json({ message: "User email not found in session" });
      }
      
      const reservations = await storage.getReservationsByEmail(email);
      res.json(reservations);
    } catch (err) {
      logger.error({ err }, "Failed to fetch user reservations");
      res.status(500).json({ message: "Internal server error" });
    }
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
      
      const validStatuses = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }

      const order = await storage.updateOrder(req.params.id, status);
      if (!order) return res.status(404).json({ message: "Order not found" });

      // Notify customer (don't await)
      const fullOrder = await storage.getOrder(order._id.toString());
      if (fullOrder) {
        if (status === 'confirmed') {
          sendOrderDetailsEmail({
            orderId: fullOrder._id.toString(),
            customerName: fullOrder.customerName,
            customerEmail: fullOrder.customerEmail,
            customerPhone: fullOrder.customerPhone,
            deliveryAddress: fullOrder.deliveryAddress,
            totalAmount: fullOrder.totalAmount,
            paymentMethod: fullOrder.paymentMethod,
            createdAt: fullOrder.createdAt || new Date(),
            status: "confirmed",
            items: fullOrder.items
          }).catch(err => logger.error({ err, orderId: fullOrder._id.toString() }, 'Failed to send order confirmation email'));
        } else {
          sendOrderStatusUpdate({
            customerName: order.customerName,
            customerEmail: order.customerEmail,
            orderId: order._id.toString(),
            status: order.status
          }).catch(err => logger.error({ err, orderId: order._id.toString() }, 'Failed to send status update email'));
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
      const order = orders.find(o => o._id.toString() === req.params.id);

      if (!order) return res.status(404).json({ message: "Order not found" });

      await sendOrderCustomMessage({
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        orderId: order._id.toString(),
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
      const fullOrder = await storage.getOrder(order._id.toString());
      if (fullOrder) {
        // Prepare common data
        const emailData = {
          orderId: fullOrder._id.toString(),
          customerName: fullOrder.customerName,
          customerEmail: fullOrder.customerEmail,
          customerPhone: fullOrder.customerPhone,
          deliveryAddress: fullOrder.deliveryAddress,
          totalAmount: fullOrder.totalAmount,
          paymentMethod: fullOrder.paymentMethod,
          createdAt: fullOrder.createdAt || new Date(),
          status: "received",
          items: fullOrder.items
        };

        // Send customer receipt
        sendOrderDetailsEmail(emailData).catch(err =>
          logger.error({ err, orderId: fullOrder._id.toString() }, 'Failed to send customer order email')
        );

        // Send admin notification
        sendOrderNotificationToAdmin(emailData).catch(err =>
          logger.error({ err, orderId: fullOrder._id.toString() }, 'Failed to send admin order notification')
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
        o._id.toString().toLowerCase() === orderId ||
        o._id.toString().toLowerCase().endsWith(orderId)
      );

      if (!order) return res.status(404).json({ message: "Order not found" });

      res.json({
        id: order._id.toString(),
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

  app.post("/api/create-checkout-session", async (req, res) => {
    try {
      const { orderId } = req.body;
      const order = await storage.getOrder(orderId);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      // If no valid Stripe secret key is present, provide a mock checkout URL for local testing
      if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === "sk_test_dummy") {
        logger.info({ orderId }, "Simulating Stripe Checkout (No STRIPE_SECRET_KEY found)");
        return res.json({ url: `/track-order?session_id=mock_local_session` });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: order.items.map((item: any) => ({
          price_data: {
            currency: "kes",
            product_data: {
              name: item.itemName,
            },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: item.quantity,
        })),
        mode: "payment",
        success_url: `${req.protocol}://${req.get("host")}/track-order?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.protocol}://${req.get("host")}/cart?canceled=true`,
        client_reference_id: orderId.toString(),
      });

      res.json({ url: session.url });
    } catch (err: any) {
      logger.error({ err }, 'Stripe session creation failed');
      res.status(500).json({ message: "Error creating checkout session: " + err.message });
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

