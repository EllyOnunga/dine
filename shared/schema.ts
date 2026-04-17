import { z } from "zod";
import { pgTable, text, timestamp, boolean, integer, json, real, uuid } from "drizzle-orm/pg-core";

// Define Drizzle Tables
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  username: text("username").notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
  loyaltyPoints: integer("loyalty_points").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const menuItems = pgTable("menu_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  price: text("price").notNull(),
  originalPrice: text("original_price"),
  description: text("description").notNull(),
  category: text("category").notNull(),
  tag: text("tag"),
  image: text("image").notNull(),
  isAvailable: boolean("is_available").default(true).notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  rating: integer("rating").default(5).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reservations = pgTable("reservations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  guests: integer("guests").notNull(),
  requests: text("requests"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const newsletterLeads = pgTable("newsletter_leads", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const blogs = pgTable("blogs", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  author: text("author").notNull(),
  image: text("image").notNull(),
  category: text("category").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const enquiries = pgTable("enquiries", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const suites = pgTable("suites", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  pricePerNight: integer("price_per_night").notNull(),
  image: text("image").notNull(),
  amenities: json("amenities").$type<string[]>().default([]).notNull(),
  isAvailable: boolean("is_available").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  deliveryAddress: text("delivery_address").notNull(),
  totalAmount: integer("total_amount").notNull(),
  paymentMethod: text("payment_method").default("cash").notNull(),
  paymentStatus: text("payment_status").default("pending").notNull(),
  status: text("status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: 'cascade' }),
  menuItemId: text("menu_item_id").notNull(),
  quantity: integer("quantity").notNull(),
  price: real("price").notNull(),
  itemName: text("item_name").notNull(),
});

export const siteSettings = pgTable("site_settings", {
  id: text("id").primaryKey(), 
  openingHours: text("opening_hours").notNull(),
  isOrderingEnabled: boolean("is_ordering_enabled").notNull(),
  minOrderAmount: integer("min_order_amount").notNull(),
});

export const insertUserSchema = z.object({
  id: z.string(),
  username: z.string().min(1).max(100),
  isAdmin: z.boolean().default(false),
  loyaltyPoints: z.number().int().min(0).default(0),
});

export const insertMenuItemSchema = z.object({
  name: z.string().min(1),
  price: z.string(),
  originalPrice: z.string().optional(),
  description: z.string().min(1),
  category: z.string().min(1),
  tag: z.string().optional(),
  image: z.string().min(1),
  isAvailable: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  rating: z.number().int().min(1).max(5).default(5),
});

export const insertReservationSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  date: z.string().min(1),
  time: z.string().min(1),
  guests: z.coerce.number().min(1).max(20),
  requests: z.string().nullable().optional(),
});

export const insertNewsletterSchema = z.object({
  email: z.string().email(),
});

export const insertBlogSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  author: z.string().min(1),
  image: z.string().min(1),
  category: z.string().min(1),
});

export const insertEnquirySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(1),
});

export const insertSuiteSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  pricePerNight: z.number().int().min(0),
  image: z.string().min(1),
  amenities: z.array(z.string()).default([]),
  isAvailable: z.boolean().default(true),
});

export const insertOrderSchema = z.object({
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(1),
  deliveryAddress: z.string().min(1),
  totalAmount: z.number().int().min(0),
  paymentMethod: z.string().default("cash"),
  paymentStatus: z.string().default("pending"),
  status: z.string().default("pending"),
  items: z.array(z.object({
    menuItemId: z.string(),
    quantity: z.number().int().min(1),
    price: z.number(),
    itemName: z.string(),
  })),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
export type InsertReservation = z.infer<typeof insertReservationSchema>;
export type InsertNewsletter = z.infer<typeof insertNewsletterSchema>;
export type InsertBlog = z.infer<typeof insertBlogSchema>;
export type InsertEnquiry = z.infer<typeof insertEnquirySchema>;
export type InsertSuite = z.infer<typeof insertSuiteSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export interface User extends InsertUser {
  id: string;
  _id: string;
  createdAt?: Date | null;
}

export interface MenuItem extends InsertMenuItem {
  id: string;
  _id: string;
  createdAt?: Date | null;
}

export interface Reservation extends Omit<InsertReservation, "guests"> {
  id: string;
  _id: string;
  guests: number;
  createdAt: Date | null;
}

export interface NewsletterLead extends InsertNewsletter {
  id: string;
  _id: string;
  createdAt: Date | null;
}

export interface Blog extends InsertBlog {
  id: string;
  _id: string;
  createdAt: Date | null;
}

export interface Enquiry extends InsertEnquiry {
  id: string;
  _id: string;
  createdAt: Date | null;
}

export interface Suite extends InsertSuite {
  id: string;
  _id: string;
  createdAt?: Date | null;
}

export interface OrderItem {
  id: string;
  _id?: string;
  orderId: string;
  menuItemId: string;
  quantity: number;
  price: number;
  itemName: string;
}

export interface Order extends Omit<InsertOrder, "items"> {
  id: string;
  _id: string;
  items: OrderItem[];
  createdAt: Date | null;
}

export interface SiteSetting {
  _id?: string;
  id: string;
  openingHours: string;
  isOrderingEnabled: boolean;
  minOrderAmount: number;
}