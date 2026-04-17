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

  async updateOrder(id: string, status: string): Promise<schema.Order | null> {
    try {
      const res = await db.update(schema.orders).set({ status }).where(eq(schema.orders.id, id)).returning();
      return res.length ? mapId(res[0]) as unknown as schema.Order : null;
    } catch {
      return null;
    }
  }

  async getSiteSettings(): Promise<schema.SiteSetting> {
    let res = await db.select().from(schema.siteSettings).where(eq(schema.siteSettings.id, "default"));
    if (!res.length) {
      res = await db.insert(schema.siteSettings).values({
        id: "default",
        openingHours: "08:00-22:00",
        isOrderingEnabled: true,
        minOrderAmount: 0,
      }).returning();
    }
    return mapId(res[0]) as schema.SiteSetting;
  }

  async updateSiteSettings(settings: Partial<schema.SiteSetting>): Promise<schema.SiteSetting> {
    try {
      const res = await db.insert(schema.siteSettings)
        .values({ 
          id: "default", 
          openingHours: settings.openingHours || "08:00-22:00",
          isOrderingEnabled: settings.isOrderingEnabled ?? true,
          minOrderAmount: settings.minOrderAmount ?? 0,
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