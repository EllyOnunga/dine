import { ObjectId, Collection, UpdateResult, Document } from "mongodb";
import { getDb } from "./db";
import {
  User,
  MenuItem,
  Reservation,
  NewsletterLead,
  Blog,
  Enquiry,
  Suite,
  Order,
  OrderItem,
  SiteSetting,
  InsertUser,
  InsertMenuItem,
  InsertReservation,
  InsertNewsletter,
  InsertBlog,
  InsertEnquiry,
  InsertSuite,
  InsertOrder,
} from "@shared/schema";
import session from "express-session";
import MongoStore from "connect-mongo";

const COLLECTIONS = {
  USERS: "users",
  MENU_ITEMS: "menu_items",
  RESERVATIONS: "reservations",
  NEWSLETTER_LEADS: "newsletter_leads",
  BLOGS: "blogs",
  ENQUIRIES: "enquiries",
  SUITES: "suites",
  ORDERS: "orders",
  ORDER_ITEMS: "order_items",
  SITE_SETTINGS: "site_settings",
  SESSIONS: "sessions",
} as const;

export class Storage {
  private _sessionStore: session.Store | null = null;
  private _dbReady: Promise<void> | null = null;

  constructor() {
    this._dbReady = connectToDatabase();
  }

  async ensureReady(): Promise<void> {
    await this._dbReady;
  }

  get sessionStore(): session.Store {
    if (!this._sessionStore) {
      this._sessionStore = MongoStore.create({
        clientPromise: Promise.resolve(getDb().client),
        collectionName: COLLECTIONS.SESSIONS,
        ttl: 7 * 24 * 60 * 60,
      });
    }
    return this._sessionStore;
  }

  private collection<T extends Document>(name: string): Collection<T> {
    return getDb().collection<T>(name);
  }

  private users(): Collection<User> {
    return this.collection<User>(COLLECTIONS.USERS);
  }

  private menuItems(): Collection<MenuItem> {
    return this.collection<MenuItem>(COLLECTIONS.MENU_ITEMS);
  }

  private reservations(): Collection<Reservation> {
    return this.collection<Reservation>(COLLECTIONS.RESERVATIONS);
  }

  private newsletterLeads(): Collection<NewsletterLead> {
    return this.collection<NewsletterLead>(COLLECTIONS.NEWSLETTER_LEADS);
  }

  private blogs(): Collection<Blog> {
    return this.collection<Blog>(COLLECTIONS.BLOGS);
  }

  private enquiries(): Collection<Enquiry> {
    return this.collection<Enquiry>(COLLECTIONS.ENQUIRIES);
  }

  private suites(): Collection<Suite> {
    return this.collection<Suite>(COLLECTIONS.SUITES);
  }

  private orders(): Collection<Order> {
    return this.collection<Order>(COLLECTIONS.ORDERS);
  }

  private orderItems(): Collection<OrderItem> {
    return this.collection<OrderItem>(COLLECTIONS.ORDER_ITEMS);
  }

  private siteSettings(): Collection<SiteSetting> {
    return this.collection<SiteSetting>(COLLECTIONS.SITE_SETTINGS);
  }

  async getUser(id: string): Promise<User | null> {
    try {
      const user = await this.users().findOne({ _id: new ObjectId(id) });
      return user as User | null;
    } catch {
      return null;
    }
  }

  async getUserByUsername(username: string): Promise<User | null> {
    return this.users().findOne({ username }) as Promise<User | null>;
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await this.users().insertOne({
      ...user,
      createdAt: new Date(),
    });
    return { ...user, _id: result.insertedId, createdAt: new Date() } as User;
  }

  async getMenuItems(): Promise<MenuItem[]> {
    return this.menuItems().find({}).toArray() as Promise<MenuItem[]>;
  }

  async getMenuItem(id: string): Promise<MenuItem | null> {
    try {
      return await this.menuItems().findOne({ _id: new ObjectId(id) }) as MenuItem | null;
    } catch {
      return null;
    }
  }

  async createMenuItem(item: InsertMenuItem): Promise<MenuItem> {
    const result = await this.menuItems().insertOne({
      ...item,
      createdAt: new Date(),
    });
    return { ...item, _id: result.insertedId, createdAt: new Date() } as MenuItem;
  }

  async updateMenuItem(id: string, item: Partial<InsertMenuItem>): Promise<MenuItem | null> {
    try {
      const result = await this.menuItems().findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: item },
        { returnDocument: "after" }
      );
      return result as MenuItem | null;
    } catch {
      return null;
    }
  }

  async deleteMenuItem(id: string): Promise<boolean> {
    try {
      const result = await this.menuItems().deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount === 1;
    } catch {
      return false;
    }
  }

  async seedMenuItems(items: InsertMenuItem[]): Promise<void> {
    if (items.length === 0) return;
    await this.menuItems().insertMany(items);
  }

  async createReservation(reservation: InsertReservation): Promise<Reservation> {
    const result = await this.reservations().insertOne({
      ...reservation,
      createdAt: new Date(),
    });
    return { ...reservation, _id: result.insertedId, createdAt: new Date() } as Reservation;
  }

  async getReservations(): Promise<Reservation[]> {
    return this.reservations().find({}).toArray() as Promise<Reservation[]>;
  }

  async deleteReservation(id: string): Promise<boolean> {
    try {
      const result = await this.reservations().deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount === 1;
    } catch {
      return false;
    }
  }

  async addNewsletterLead(email: string): Promise<NewsletterLead> {
    const result = await this.newsletterLeads().insertOne({
      email,
      createdAt: new Date(),
    });
    return { email, _id: result.insertedId, createdAt: new Date() } as NewsletterLead;
  }

  async getNewsletterLeads(): Promise<NewsletterLead[]> {
    return this.newsletterLeads().find({}).toArray() as Promise<NewsletterLead[]>;
  }

  async getBlogs(): Promise<Blog[]> {
    return this.blogs().find({}).sort({ createdAt: -1 }).toArray() as Promise<Blog[]>;
  }

  async getBlog(id: string): Promise<Blog | null> {
    try {
      return await this.blogs().findOne({ _id: new ObjectId(id) }) as Blog | null;
    } catch {
      return null;
    }
  }

  async createBlog(blog: InsertBlog): Promise<Blog> {
    const result = await this.blogs().insertOne({
      ...blog,
      createdAt: new Date(),
    });
    return { ...blog, _id: result.insertedId, createdAt: new Date() } as Blog;
  }

  async updateBlog(id: string, blog: Partial<InsertBlog>): Promise<Blog | null> {
    try {
      const result = await this.blogs().findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: blog },
        { returnDocument: "after" }
      );
      return result as Blog | null;
    } catch {
      return null;
    }
  }

  async deleteBlog(id: string): Promise<boolean> {
    try {
      const result = await this.blogs().deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount === 1;
    } catch {
      return false;
    }
  }

  async createEnquiry(enquiry: InsertEnquiry): Promise<Enquiry> {
    const result = await this.enquiries().insertOne({
      ...enquiry,
      createdAt: new Date(),
    });
    return { ...enquiry, _id: result.insertedId, createdAt: new Date() } as Enquiry;
  }

  async getEnquiries(): Promise<Enquiry[]> {
    return this.enquiries().find({}).toArray() as Promise<Enquiry[]>;
  }

  async deleteEnquiry(id: string): Promise<boolean> {
    try {
      const result = await this.enquiries().deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount === 1;
    } catch {
      return false;
    }
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const { items, ...orderData } = order;
    const result = await this.orders().insertOne({
      ...orderData,
      items: [],
      createdAt: new Date(),
    });

    const orderId = result.insertedId.toString();

    if (items && items.length > 0) {
      const orderItemsWithId = items.map((item) => ({
        ...item,
        orderId,
      }));
      await this.orderItems().insertMany(orderItemsWithId);
    }

    return {
      ...orderData,
      _id: result.insertedId,
      items,
      createdAt: new Date(),
    } as Order;
  }

  async getOrders(): Promise<Order[]> {
    const orders = await this.orders().find({}).sort({ createdAt: -1 }).toArray();
    
    for (const order of orders) {
      const items = await this.orderItems().find({ orderId: order._id.toString() }).toArray();
      (order as any).items = items;
    }
    
    return orders as Order[];
  }

  async getOrder(id: string): Promise<Order | null> {
    try {
      const order = await this.orders().findOne({ _id: new ObjectId(id) }) as Order | null;
      if (order) {
        const items = await this.orderItems().find({ orderId: id }).toArray();
        (order as any).items = items;
      }
      return order;
    } catch {
      return null;
    }
  }

  async updateOrder(id: string, status: string): Promise<Order | null> {
    try {
      const result = await this.orders().findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { status } },
        { returnDocument: "after" }
      );
      return result as Order | null;
    } catch {
      return null;
    }
  }

  async getSiteSettings(): Promise<SiteSetting> {
    let settings = await this.siteSettings().findOne({ id: "default" });
    if (!settings) {
      const result = await this.siteSettings().insertOne({
        id: "default",
        openingHours: "08:00-22:00",
        isOrderingEnabled: true,
        minOrderAmount: 0,
      });
      settings = {
        _id: result.insertedId,
        id: "default",
        openingHours: "08:00-22:00",
        isOrderingEnabled: true,
        minOrderAmount: 0,
      };
    }
    return settings;
  }

  async updateSiteSettings(settings: Partial<SiteSetting>): Promise<SiteSetting> {
    const result = await this.siteSettings().findOneAndUpdate(
      { id: "default" },
      { $set: settings },
      { returnDocument: "after", upsert: true }
    );
    return result as SiteSetting;
  }

  async updateUserPoints(userId: string, points: number): Promise<User | null> {
    try {
      const result = await this.users().findOneAndUpdate(
        { _id: new ObjectId(userId) },
        { $set: { loyaltyPoints: points } },
        { returnDocument: "after" }
      );
      return result as User | null;
    } catch {
      return null;
    }
  }

  async getSuites(): Promise<Suite[]> {
    return this.suites().find({}).toArray() as Promise<Suite[]>;
  }

  async getSuite(id: string): Promise<Suite | null> {
    try {
      return await this.suites().findOne({ _id: new ObjectId(id) }) as Suite | null;
    } catch {
      return null;
    }
  }

  async seedSuites(suites: InsertSuite[]): Promise<void> {
    if (suites.length === 0) return;
    await this.suites().insertMany(suites);
  }

  async healthCheck(): Promise<boolean> {
    try {
      await getDb().admin().ping();
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