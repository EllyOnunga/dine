import { MenuItem, Reservation, NewsletterLead, InsertUser, User, InsertReservation, Blog, Enquiry, InsertBlog, InsertEnquiry } from "@shared/schema";
import { users, menuItems, reservations, newsletterLeads, blogs, enquiries } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import { PartialMenuItem } from "@shared/schema"; // Actually Partial is fine

export interface IStorage {
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
}

export class DatabaseStorage implements IStorage {
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
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private menuItems: MenuItem[];
  private reservations: Reservation[];
  private newsletterLeads: Map<string, NewsletterLead>;

  constructor() {
    this.users = new Map();
    this.menuItems = [];
    this.reservations = [];
    this.newsletterLeads = new Map();
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
    const user: User = { ...insertUser, id };
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
}

export const storage = process.env.DATABASE_URL ? new DatabaseStorage() : new MemStorage();
