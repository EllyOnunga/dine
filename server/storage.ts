// server/storage.ts
import { db, pool, connectToDatabase } from "./db";
import { eq, desc } from "drizzle-orm";
import * as schema from "@shared/schema";

// Utility to attach _id to Postgres rows for frontend compat
function mapId<T>(record: T): T & { _id: string } {
  return { ...record, _id: String((record as any).id) };
}

function mapIds<T>(records: T[]): (T & { _id: string })[] {
  return records.map(mapId);
}

export class Storage {
  private _dbReady: Promise<void> | null = null;

  constructor() {
    this._dbReady = connectToDatabase();
  }

  async ensureReady(): Promise<void> {
    await this._dbReady;
  }

  async getUser(id: string): Promise<schema.User | null> {
    const res = await db.select().from(schema.users).where(eq(schema.users.id, id));
    return res.length ? mapId(res[0]) as schema.User : null;
  }

  async getUserByUsername(username: string): Promise<schema.User | null> {
    const res = await db.select().from(schema.users).where(eq(schema.users.username, username));
    return res.length ? mapId(res[0]) as schema.User : null;
  }

  async createUser(user: schema.InsertUser): Promise<schema.User> {
    const res = await db.insert(schema.users).values(user).returning();
    return mapId(res[0]) as schema.User;
  }
  
  async countAdmins(): Promise<number> {
    const res = await db.select().from(schema.users).where(eq(schema.users.isAdmin, true));
    return res.length;
  }

  async getMenuItems(): Promise<schema.MenuItem[]> {
    const res = await db.select().from(schema.menuItems);
    return mapIds(res) as schema.MenuItem[];
  }

  async getMenuItem(id: string): Promise<schema.MenuItem | null> {
    const res = await db.select().from(schema.menuItems).where(eq(schema.menuItems.id, id));
    return res.length ? mapId(res[0]) as schema.MenuItem : null;
  }

  async createMenuItem(item: schema.InsertMenuItem): Promise<schema.MenuItem> {
    const res = await db.insert(schema.menuItems).values(item).returning();
    return mapId(res[0]) as schema.MenuItem;
  }

  async updateMenuItem(id: string, item: Partial<schema.InsertMenuItem>): Promise<schema.MenuItem | null> {
    const res = await db.update(schema.menuItems)
      .set(item)
      .where(eq(schema.menuItems.id, id))
      .returning();
    return res.length ? mapId(res[0]) as schema.MenuItem : null;
  }

  async deleteMenuItem(id: string): Promise<boolean> {
    const res = await db.delete(schema.menuItems).where(eq(schema.menuItems.id, id)).returning();
    return res.length > 0;
  }

  async seedMenuItems(items: schema.InsertMenuItem[]): Promise<void> {
    if (items.length === 0) return;
    await db.insert(schema.menuItems).values(items);
  }

  async createReservation(reservation: schema.InsertReservation): Promise<schema.Reservation> {
    const res = await db.insert(schema.reservations).values(reservation).returning();
    return mapId(res[0]) as schema.Reservation;
  }

  async getReservations(): Promise<schema.Reservation[]> {
    const res = await db.select().from(schema.reservations);
    return mapIds(res) as schema.Reservation[];
  }

  async getReservationsByEmail(email: string): Promise<schema.Reservation[]> {
    const res = await db.select().from(schema.reservations)
      .where(eq(schema.reservations.email, email))
      .orderBy(desc(schema.reservations.createdAt));
    return mapIds(res) as schema.Reservation[];
  }

  async deleteReservation(id: string): Promise<boolean> {
    const res = await db.delete(schema.reservations).where(eq(schema.reservations.id, id)).returning();
    return res.length > 0;
  }

  async addNewsletterLead(email: string): Promise<schema.NewsletterLead> {
    const res = await db.insert(schema.newsletterLeads).values({ email }).returning();
    return mapId(res[0]) as schema.NewsletterLead;
  }

  async getNewsletterLeads(): Promise<schema.NewsletterLead[]> {
    const res = await db.select().from(schema.newsletterLeads);
    return mapIds(res) as schema.NewsletterLead[];
  }

  async getBlogs(): Promise<schema.Blog[]> {
    const res = await db.select().from(schema.blogs).orderBy(desc(schema.blogs.createdAt));
    return mapIds(res) as schema.Blog[];
  }

  async getBlog(id: string): Promise<schema.Blog | null> {
    try {
      const res = await db.select().from(schema.blogs).where(eq(schema.blogs.id, id));
      return res.length ? mapId(res[0]) as schema.Blog : null;
    } catch {
      return null;
    }
  }

  async createBlog(blog: schema.InsertBlog): Promise<schema.Blog> {
    const res = await db.insert(schema.blogs).values(blog).returning();
    return mapId(res[0]) as schema.Blog;
  }

  async updateBlog(id: string, blog: Partial<schema.InsertBlog>): Promise<schema.Blog | null> {
    const res = await db.update(schema.blogs).set(blog).where(eq(schema.blogs.id, id)).returning();
    return res.length ? mapId(res[0]) as schema.Blog : null;
  }

  async deleteBlog(id: string): Promise<boolean> {
    const res = await db.delete(schema.blogs).where(eq(schema.blogs.id, id)).returning();
    return res.length > 0;
  }

  async createEnquiry(enquiry: schema.InsertEnquiry): Promise<schema.Enquiry> {
    const res = await db.insert(schema.enquiries).values(enquiry).returning();
    return mapId(res[0]) as schema.Enquiry;
  }

  async getEnquiries(): Promise<schema.Enquiry[]> {
    const res = await db.select().from(schema.enquiries);
    return mapIds(res) as schema.Enquiry[];
  }

  async deleteEnquiry(id: string): Promise<boolean> {
    const res = await db.delete(schema.enquiries).where(eq(schema.enquiries.id, id)).returning();
    return res.length > 0;
  }

  async createOrder(order: schema.InsertOrder): Promise<schema.Order> {
    const { items, ...orderData } = order;
    
    return await db.transaction(async (tx) => {
      const orderRes = await tx.insert(schema.orders).values(orderData).returning();
      const newOrder = orderRes[0];
      
      let insertedItems: schema.OrderItem[] = [];
      if (items && items.length > 0) {
        const itemsToInsert = items.map(i => ({
          ...i,
          orderId: newOrder.id,
        }));
        
        const itemsRes = await tx.insert(schema.orderItems).values(itemsToInsert).returning();
        insertedItems = mapIds(itemsRes) as schema.OrderItem[];
      }
      
      const mappedOrder = mapId(newOrder) as any;
      mappedOrder.items = insertedItems;
      return mappedOrder as unknown as schema.Order;
    });
  }

  async getOrders(): Promise<schema.Order[]> {
    const allOrders = await db.select().from(schema.orders).orderBy(desc(schema.orders.createdAt));
    const allItems = await db.select().from(schema.orderItems);
    
    return allOrders.map(o => {
      const mapped = mapId(o) as any;
      mapped.items = mapIds(allItems.filter(i => i.orderId === o.id));
      return mapped;
    }) as schema.Order[];
  }

  async getOrdersByEmail(email: string): Promise<schema.Order[]> {
    const userOrders = await db.select().from(schema.orders)
      .where(eq(schema.orders.customerEmail, email))
      .orderBy(desc(schema.orders.createdAt));
    
    if (userOrders.length === 0) return [];
    
    const allItems = await db.select().from(schema.orderItems);
    
    return userOrders.map(o => {
      const mapped = mapId(o) as any;
      mapped.items = mapIds(allItems.filter(i => i.orderId === o.id));
      return mapped;
    }) as schema.Order[];
  }

  async getOrder(id: string): Promise<schema.Order | null> {
    try {
      const res = await db.select().from(schema.orders).where(eq(schema.orders.id, id));
      if (!res.length) return null;
      
      const order = mapId(res[0]) as any;
      const items = await db.select().from(schema.orderItems).where(eq(schema.orderItems.orderId, id));
      order.items = mapIds(items);
      return order as unknown as schema.Order;
    } catch {
      return null;
    }
  }

  async updateOrder(id: string, updates: Partial<schema.Order>): Promise<schema.Order | null> {
    try {
      const { items, _id, id: orderId, ...data } = updates as any;
      const res = await db.update(schema.orders).set(data).where(eq(schema.orders.id, id)).returning();
      return res.length ? mapId(res[0]) as unknown as schema.Order : null;
    } catch {
      return null;
    }
  }

  async getSiteSettings(): Promise<schema.SiteSetting> {
    const res = await db.select().from(schema.siteSettings).where(eq(schema.siteSettings.id, "default"));
    if (res.length === 0) {
      const defaultSettings = await db.insert(schema.siteSettings).values({
        id: "default",
        restaurantName: "Savannah & Spice",
        restaurantTagline: "The Pinnacle of Kenyan Culinary Art",
        address: "Karen Triangle Mall, Nairobi",
        phone: "+254 712 345 678",
        email: "hello@savannahspice.co.ke",
        openingHours: "11am - 11pm (Mon-Sun)",
        isOrderingEnabled: true,
        minOrderAmount: 1000,
      }).returning();
      return mapId(defaultSettings[0]) as schema.SiteSetting;
    }
    return mapId(res[0]) as schema.SiteSetting;
  }

  async updateSiteSettings(settings: Partial<schema.SiteSetting>): Promise<schema.SiteSetting> {
    try {
      const current = await this.getSiteSettings();
      const res = await db.insert(schema.siteSettings)
        .values({ 
          id: "default", 
          restaurantName: settings.restaurantName || current.restaurantName,
          restaurantTagline: settings.restaurantTagline || current.restaurantTagline,
          address: settings.address || current.address,
          phone: settings.phone || current.phone,
          email: settings.email || current.email,
          openingHours: settings.openingHours || current.openingHours,
          isOrderingEnabled: settings.isOrderingEnabled ?? current.isOrderingEnabled,
          minOrderAmount: settings.minOrderAmount ?? current.minOrderAmount,
          mpesaPaybill: settings.mpesaPaybill ?? current.mpesaPaybill,
          mpesaTill: settings.mpesaTill ?? current.mpesaTill,
          cloudinaryCloudName: settings.cloudinaryCloudName ?? current.cloudinaryCloudName,
          cloudinaryApiKey: settings.cloudinaryApiKey ?? current.cloudinaryApiKey,
          instagramAccessToken: settings.instagramAccessToken ?? current.instagramAccessToken,
          instagramTokenExpiry: settings.instagramTokenExpiry ?? current.instagramTokenExpiry,
        })
        .onConflictDoUpdate({
          target: schema.siteSettings.id,
          set: settings,
        }).returning();
      return mapId(res[0]) as schema.SiteSetting;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  // Site Content CRUD
  async getSiteContent(section?: string): Promise<schema.SiteContent[]> {
    let query = db.select().from(schema.siteContent);
    if (section) {
      query = query.where(eq(schema.siteContent.section, section)) as any;
    }
    const res = await query.orderBy(schema.siteContent.order);
    return mapIds(res) as schema.SiteContent[];
  }

  async createSiteContent(content: Omit<schema.SiteContent, "id" | "createdAt">): Promise<schema.SiteContent> {
    const res = await db.insert(schema.siteContent).values(content).returning();
    return mapId(res[0]) as schema.SiteContent;
  }

  async updateSiteContent(id: string, content: Partial<schema.SiteContent>): Promise<schema.SiteContent | null> {
    const res = await db.update(schema.siteContent).set(content).where(eq(schema.siteContent.id, id)).returning();
    return res.length ? mapId(res[0]) as schema.SiteContent : null;
  }

  async deleteSiteContent(id: string): Promise<boolean> {
    const res = await db.delete(schema.siteContent).where(eq(schema.siteContent.id, id)).returning();
    return res.length > 0;
  }

  // Testimonials CRUD
  async getTestimonials(): Promise<schema.Testimonial[]> {
    const res = await db.select().from(schema.testimonials).orderBy(desc(schema.testimonials.createdAt));
    return mapIds(res) as schema.Testimonial[];
  }

  async createTestimonial(testimonial: Omit<schema.Testimonial, "id" | "createdAt">): Promise<schema.Testimonial> {
    const res = await db.insert(schema.testimonials).values(testimonial).returning();
    return mapId(res[0]) as schema.Testimonial;
  }

  async deleteTestimonial(id: string): Promise<boolean> {
    const res = await db.delete(schema.testimonials).where(eq(schema.testimonials.id, id)).returning();
    return res.length > 0;
  }

  // FAQs CRUD
  async getFAQs(): Promise<schema.FAQ[]> {
    const res = await db.select().from(schema.faqs).orderBy(schema.faqs.order);
    return mapIds(res) as schema.FAQ[];
  }

  async createFAQ(faq: Omit<schema.FAQ, "id" | "createdAt">): Promise<schema.FAQ> {
    const res = await db.insert(schema.faqs).values(faq).returning();
    return mapId(res[0]) as schema.FAQ;
  }

  async deleteFAQ(id: string): Promise<boolean> {
    const res = await db.delete(schema.faqs).where(eq(schema.faqs.id, id)).returning();
    return res.length > 0;
  }

  async updateUserPoints(userId: string, points: number): Promise<schema.User | null> {
    const res = await db.update(schema.users).set({ loyaltyPoints: points }).where(eq(schema.users.id, userId)).returning();
    return res.length ? mapId(res[0]) as schema.User : null;
  }

  async setAdminStatus(userId: string, isAdmin: boolean): Promise<schema.User | null> {
    const res = await db.update(schema.users).set({ isAdmin }).where(eq(schema.users.id, userId)).returning();
    return res.length ? mapId(res[0]) as schema.User : null;
  }

  async getSuites(): Promise<schema.Suite[]> {
    const res = await db.select().from(schema.suites);
    return mapIds(res) as schema.Suite[];
  }

  async getSuite(id: string): Promise<schema.Suite | null> {
    try {
      const res = await db.select().from(schema.suites).where(eq(schema.suites.id, id));
      return res.length ? mapId(res[0]) as schema.Suite : null;
    } catch {
      return null;
    }
  }

  async seedSuites(suites: schema.InsertSuite[]): Promise<void> {
    if (suites.length === 0) return;
    await db.insert(schema.suites).values(suites);
  }

  async healthCheck(): Promise<boolean> {
    try {
      await pool.query('SELECT 1');
      return true;
    } catch {
      return false;
    }
  }
  async seedAll(): Promise<void> {
    const content = await this.getSiteContent();
    if (content.length > 0) return;

    console.log("Seeding site content...");
    
    // 1. Home Section
    await this.createSiteContent({ section: 'home', key: 'hero_image', value: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2000', type: 'image', order: 0 });
    await this.createSiteContent({ section: 'home', key: 'about_image', value: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1200', type: 'image', order: 0 });
    await this.createSiteContent({ section: 'home', key: 'hero_description', value: "Experience Nairobi's finest bistro where the rich heritage of the Savannah meets contemporary culinary innovation.", type: 'text', order: 0 });
    await this.createSiteContent({ section: 'home', key: 'about_description', value: "At Savannah & Spice, we believe in celebrating the rich culinary diversity of Kenya. From the coastal spices of Swahili dishes to the hearty cuts of Nyama Choma from the Rift Valley, our kitchen is a tribute to tradition.", type: 'text', order: 0 });

    // 2. Story Section (Bullet Points)
    const storyItems = [
      { key: 'card', value: JSON.stringify({ title: 'Sustainable Sourcing', desc: 'We partner directly with Kenyan farmers for authentic, farm-to-table excellence.', icon: 'ChefHat' }), type: 'list_item' },
      { key: 'card', value: JSON.stringify({ title: 'Kenyan Hospitality', desc: "Celebrating our culture through food, warmth, and the spirit of 'Utamaduni'.", icon: 'Users' }), type: 'list_item' },
      { key: 'card', value: JSON.stringify({ title: 'Culinary Edge', desc: 'Redefining Kenyan cuisine for the global stage while staying true to our roots.', icon: 'Star' }), type: 'list_item' }
    ];
    for (let i = 0; i < storyItems.length; i++) {
        await this.createSiteContent({ ...storyItems[i], section: 'story', order: i });
    }

    // 3. Payment Methods (Bullet Points)
    const paymentSteps = [
      { section: 'payments_mpesa', key: 'step', value: 'Select M-Pesa at checkout or mention it to our staff.', type: 'list_item' },
      { section: 'payments_mpesa', key: 'step', value: 'An STK push will be sent to your mobile phone.', type: 'list_item' },
      { section: 'payments_mpesa', key: 'step', value: 'Enter your M-Pesa PIN to authorize the transaction.', type: 'list_item' },
      { section: 'payments_cards', key: 'step', value: 'Present your card at the point of sale.', type: 'list_item' },
      { section: 'payments_cards', key: 'step', value: 'Our secure terminals process the transaction in seconds.', type: 'list_item' }
    ];
    for (let i = 0; i < paymentSteps.length; i++) {
        await this.createSiteContent({ ...paymentSteps[i], order: i });
    }

    // 4. Testimonials
    const testimonials = [
      { name: "Sarah Jenkins", platform: "Google Reviews", rating: 5, text: "The best fine dining experience in Nairobi right now. The lamb rack was perfectly cooked and the service was impeccable. Highly recommended for a date night!" },
      { name: "Michael Mutinda", platform: "Yelp", rating: 5, text: "I booked the private dining room for my wife's 40th birthday. The ambiance, the staff, and the food were out of this world. Thank you Savannah & Spice!" }
    ];
    for (const t of testimonials) await this.createTestimonial(t);

    // 5. FAQs
    const faqs = [
      { question: "Where are you located?", answer: "We are located in the Karen Triangle Mall, 2nd Floor, in the heart of Karen, Nairobi. We offer a beautiful balcony view of the local scenery.", icon: "MapPin", order: 0 },
      { question: "What are your opening hours?", answer: "We are open daily from 11:00 AM to 11:00 PM. Dinner service starts strictly at 6:00 PM.", icon: "Clock", order: 1 }
    ];
    for (const f of faqs) await this.createFAQ(f);
  }
}

let _storage: Storage | null = null;

export function getStorage(): Storage {
  if (!_storage) {
    _storage = new Storage();
  }
  return _storage;
}

export const storage = new Proxy({} as Storage, {
  get(_target, prop) {
    return getStorage()[prop as keyof Storage];
  }
});