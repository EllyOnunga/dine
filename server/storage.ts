import { MenuItem, Reservation, NewsletterLead, InsertUser, User, InsertReservation, Blog, Enquiry, InsertBlog, InsertEnquiry, Order, OrderItem, InsertOrder, SiteSetting, Suite, InsertSuite } from "@shared/schema";
import { users, menuItems, reservations, newsletterLeads, blogs, enquiries, orders, orderItems, siteSettings, suites } from "@shared/schema";
import { db, pool } from "./db";
import { eq, sql, desc } from "drizzle-orm";
import { randomUUID } from "crypto";
import session from "express-session";
import connectPg from "connect-pg-simple";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  sessionStore: session.Store;
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Menu Items
  getMenuItems(): Promise<MenuItem[]>;
  getMenuItem(id: string): Promise<MenuItem | undefined>;
  createMenuItem(item: any): Promise<MenuItem>;
  updateMenuItem(id: string, item: any): Promise<MenuItem>;
  deleteMenuItem(id: string): Promise<void>;
  seedMenuItems(items: MenuItem[]): Promise<void>;

  // Reservations
  createReservation(reservation: InsertReservation): Promise<Reservation>;
  getReservations(): Promise<Reservation[]>;
  deleteReservation(id: string): Promise<void>;

  // Newsletter
  addNewsletterLead(email: string): Promise<NewsletterLead>;
  getNewsletterLeads(): Promise<NewsletterLead[]>;

  // Blogs
  getBlogs(): Promise<Blog[]>;
  getBlog(id: string): Promise<Blog | undefined>;
  createBlog(blog: InsertBlog): Promise<Blog>;
  updateBlog(id: string, blog: Partial<Blog>): Promise<Blog>;
  deleteBlog(id: string): Promise<void>;

  // Enquiries
  createEnquiry(enquiry: InsertEnquiry): Promise<Enquiry>;
  getEnquiries(): Promise<Enquiry[]>;
  deleteEnquiry(id: string): Promise<void>;

  // Orders
  createOrder(order: InsertOrder): Promise<Order>;
  getOrders(): Promise<(Order & { items: OrderItem[] })[]>;
  getOrder(id: string): Promise<(Order & { items: OrderItem[] }) | undefined>;
  updateOrder(id: string, status: string): Promise<Order>;

  // Site Settings
  getSiteSettings(): Promise<SiteSetting>;
  updateSiteSettings(settings: Partial<SiteSetting>): Promise<SiteSetting>;

  // User Loyalty
  updateUserPoints(userId: string, points: number): Promise<User>;

  // Suites
  getSuites(): Promise<Suite[]>;
  getSuite(id: string): Promise<Suite | undefined>;
  seedSuites(suites: Suite[]): Promise<void>;

  healthCheck(): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: false,
    });
  }
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getMenuItems(): Promise<MenuItem[]> {
    return await db.select().from(menuItems);
  }

  async getMenuItem(id: string): Promise<MenuItem | undefined> {
    const [item] = await db.select().from(menuItems).where(eq(menuItems.id, id));
    return item;
  }

  async createMenuItem(item: any): Promise<MenuItem> {
    const [newItem] = await db.insert(menuItems).values(item).returning();
    return newItem;
  }

  async updateMenuItem(id: string, item: any): Promise<MenuItem> {
    const [updatedItem] = await db.update(menuItems).set(item).where(eq(menuItems.id, id)).returning();
    return updatedItem;
  }

  async deleteMenuItem(id: string): Promise<void> {
    await db.delete(menuItems).where(eq(menuItems.id, id));
  }

  async seedMenuItems(items: MenuItem[]): Promise<void> {
    if (items.length === 0) return;
    await db.insert(menuItems).values(items);
  }

  async createReservation(reservation: InsertReservation): Promise<Reservation> {
    const [newReservation] = await db
      .insert(reservations)
      .values(reservation)
      .returning();
    return newReservation;
  }

  async getReservations(): Promise<Reservation[]> {
    return await db.select().from(reservations);
  }

  async deleteReservation(id: string): Promise<void> {
    await db.delete(reservations).where(eq(reservations.id, id));
  }

  async addNewsletterLead(email: string): Promise<NewsletterLead> {
    const [lead] = await db
      .insert(newsletterLeads)
      .values({ email })
      .returning();
    return lead;
  }

  async getNewsletterLeads(): Promise<NewsletterLead[]> {
    return await db.select().from(newsletterLeads);
  }

  async getBlogs(): Promise<Blog[]> {
    return await db.select().from(blogs);
  }

  async getBlog(id: string): Promise<Blog | undefined> {
    const [blog] = await db.select().from(blogs).where(eq(blogs.id, id));
    return blog;
  }

  async createBlog(blog: InsertBlog): Promise<Blog> {
    const [newBlog] = await db.insert(blogs).values(blog).returning();
    return newBlog;
  }

  async updateBlog(id: string, blog: Partial<Blog>): Promise<Blog> {
    const [updatedBlog] = await db.update(blogs).set(blog).where(eq(blogs.id, id)).returning();
    return updatedBlog;
  }

  async deleteBlog(id: string): Promise<void> {
    await db.delete(blogs).where(eq(blogs.id, id));
  }

  async createEnquiry(enquiry: InsertEnquiry): Promise<Enquiry> {
    const [newEnquiry] = await db.insert(enquiries).values(enquiry).returning();
    return newEnquiry;
  }

  async getEnquiries(): Promise<Enquiry[]> {
    return await db.select().from(enquiries);
  }

  async deleteEnquiry(id: string): Promise<void> {
    await db.delete(enquiries).where(eq(enquiries.id, id));
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const { items, ...orderData } = insertOrder;
    const [newOrder] = await db.insert(orders).values(orderData).returning();

    if (items && items.length > 0) {
      await db.insert(orderItems).values(
        items.map(item => ({ ...item, orderId: newOrder.id }))
      );
    }

    return newOrder;
  }

  async getOrders(): Promise<(Order & { items: OrderItem[] })[]> {
    const allOrders = await db.select().from(orders).orderBy(sql`${orders.createdAt} DESC`);
    const allItems = await db.select().from(orderItems);

    return allOrders.map(order => ({
      ...order,
      items: allItems.filter(item => item.orderId === order.id)
    }));
  }

  async getOrder(id: string): Promise<(Order & { items: OrderItem[] }) | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    if (!order) return undefined;

    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id));
    return { ...order, items };
  }

  async updateOrder(id: string, status: string): Promise<Order> {
    const [updatedOrder] = await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder;
  }

  async getSiteSettings(): Promise<SiteSetting> {
    const [settings] = await db.select().from(siteSettings).limit(1);
    if (!settings) {
      const [newSettings] = await db.insert(siteSettings).values({ id: "default" }).returning();
      return newSettings;
    }
    return settings;
  }

  async updateSiteSettings(settings: Partial<SiteSetting>): Promise<SiteSetting> {
    const [updated] = await db.update(siteSettings).set(settings).where(eq(siteSettings.id, "default")).returning();
    return updated;
  }

  async updateUserPoints(userId: string, points: number): Promise<User> {
    const [user] = await db.update(users).set({ loyaltyPoints: points }).where(eq(users.id, userId)).returning();
    return user;
  }

  async getSuites(): Promise<Suite[]> {
    return await db.select().from(suites);
  }

  async getSuite(id: string): Promise<Suite | undefined> {
    const [suite] = await db.select().from(suites).where(eq(suites.id, id));
    return suite;
  }

  async seedSuites(items: Suite[]): Promise<void> {
    if (items.length === 0) return;
    await db.insert(suites).values(items);
  }

  async healthCheck(): Promise<boolean> {
    try {
      await db.execute(sql`SELECT 1`);
      return true;
    } catch (e) {
      return false;
    }
  }
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private menuItems: MenuItem[];
  private reservations: Reservation[];
  private newsletterLeads: Map<string, NewsletterLead>;
  private orders: Map<string, Order>;
  private orderItems: OrderItem[];
  private suites: Suite[];
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.menuItems = [];
    this.reservations = [];
    this.newsletterLeads = new Map();
    this.orders = new Map();
    this.orderItems = [];
    this.suites = [];
    this.sessionStore = new session.MemoryStore();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id, loyaltyPoints: 0 };
    this.users.set(id, user);
    return user;
  }

  async getMenuItems(): Promise<MenuItem[]> {
    return this.menuItems;
  }

  async seedMenuItems(items: MenuItem[]): Promise<void> {
    this.menuItems = items;
  }

  async createReservation(reservation: InsertReservation): Promise<Reservation> {
    const id = randomUUID();
    const newReservation: Reservation = {
      ...reservation,
      id,
      createdAt: new Date()
    };
    this.reservations.push(newReservation);
    return newReservation;
  }

  async getReservations(): Promise<Reservation[]> {
    return this.reservations;
  }

  async addNewsletterLead(email: string): Promise<NewsletterLead> {
    const id = randomUUID();
    const lead: NewsletterLead = {
      id,
      email,
      createdAt: new Date()
    };
    this.newsletterLeads.set(email, lead);
    return lead;
  }

  async getNewsletterLeads(): Promise<NewsletterLead[]> {
    return Array.from(this.newsletterLeads.values());
  }

  async getMenuItem(id: string): Promise<MenuItem | undefined> {
    return this.menuItems.find(item => item.id === id);
  }

  async createMenuItem(item: any): Promise<MenuItem> {
    const newItem = { ...item, id: randomUUID() };
    this.menuItems.push(newItem);
    return newItem;
  }

  async updateMenuItem(id: string, item: any): Promise<MenuItem> {
    const index = this.menuItems.findIndex(i => i.id === id);
    if (index === -1) throw new Error("Item not found");
    this.menuItems[index] = { ...this.menuItems[index], ...item };
    return this.menuItems[index];
  }

  async deleteMenuItem(id: string): Promise<void> {
    this.menuItems = this.menuItems.filter(i => i.id !== id);
  }

  async getBlogs(): Promise<Blog[]> {
    return [];
  }

  async getBlog(id: string): Promise<Blog | undefined> {
    return undefined;
  }

  async createBlog(blog: InsertBlog): Promise<Blog> {
    throw new Error("Not implemented");
  }

  async updateBlog(id: string, blog: Partial<Blog>): Promise<Blog> {
    throw new Error("Not implemented");
  }

  async deleteBlog(id: string): Promise<void> { }

  async createEnquiry(enquiry: InsertEnquiry): Promise<Enquiry> {
    const id = randomUUID();
    return { ...enquiry, id, createdAt: new Date() };
  }

  async getEnquiries(): Promise<Enquiry[]> {
    return [];
  }

  async deleteEnquiry(id: string): Promise<void> { }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const { items, ...orderData } = insertOrder;
    const id = randomUUID();
    const newOrder: Order = {
      ...orderData,
      id,
      createdAt: new Date(),
      status: "pending",
      paymentMethod: orderData.paymentMethod ?? "cash",
      paymentStatus: "pending"
    };
    this.orders.set(id, newOrder);

    if (items) {
      items.forEach(item => {
        this.orderItems.push({ ...item, id: randomUUID(), orderId: id });
      });
    }
    return newOrder;
  }

  async getOrders(): Promise<(Order & { items: OrderItem[] })[]> {
    return Array.from(this.orders.values()).map(order => ({
      ...order,
      items: this.orderItems.filter(item => item.orderId === order.id)
    }));
  }

  async getOrder(id: string): Promise<(Order & { items: OrderItem[] }) | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    return {
      ...order,
      items: this.orderItems.filter(item => item.orderId === order.id)
    };
  }

  async updateOrder(id: string, status: string): Promise<Order> {
    const order = this.orders.get(id);
    if (!order) throw new Error("Order not found");
    const updatedOrder = { ...order, status };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  async getSiteSettings(): Promise<SiteSetting> {
    return { id: "default", openingHours: "08:00-22:00", isOrderingEnabled: true, minOrderAmount: 0 };
  }

  async updateSiteSettings(settings: Partial<SiteSetting>): Promise<SiteSetting> {
    return { ...await this.getSiteSettings(), ...settings };
  }

  async updateUserPoints(userId: string, points: number): Promise<User> {
    const user = Array.from(this.users.values()).find(u => u.id === userId);
    if (!user) throw new Error("User not found");
    const updated = { ...user, loyaltyPoints: points };
    this.users.set(user.id, updated);
    return updated;
  }

  async getSuites(): Promise<Suite[]> {
    return this.suites;
  }

  async getSuite(id: string): Promise<Suite | undefined> {
    return this.suites.find(s => s.id === id);
  }

  async seedSuites(items: Suite[]): Promise<void> {
    this.suites = items;
  }

  async deleteReservation(id: string): Promise<void> {
    this.reservations = this.reservations.filter(r => r.id !== id);
  }

  async healthCheck(): Promise<boolean> {
    return true;
  }
}

export const storage = process.env.DATABASE_URL ? new DatabaseStorage() : new MemStorage();
