import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").notNull().default(false),
  loyaltyPoints: integer("loyalty_points").notNull().default(0),
});

export const menuItems = pgTable("menu_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  price: text("price").notNull(),
  originalPrice: text("original_price"),
  description: text("description").notNull(),
  category: text("category").notNull(),
  tag: text("tag"),
  image: text("image").notNull(),
  isAvailable: boolean("is_available").notNull().default(true),
  isFeatured: boolean("is_featured").notNull().default(false),
  rating: integer("rating").default(5),
}, (table) => [
  index("idx_menu_items_category").on(table.category),
]);

export const siteSettings = pgTable("site_settings", {
  id: varchar("id").primaryKey().default("default"),
  openingHours: text("opening_hours").notNull().default('08:00-22:00'),
  isOrderingEnabled: boolean("is_ordering_enabled").notNull().default(true),
  minOrderAmount: integer("min_order_amount").notNull().default(0),
});

export const reservations = pgTable("reservations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  guests: integer("guests").notNull(),
  requests: text("requests"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_reservations_date").on(table.date),
]);

export const newsletterLeads = pgTable("newsletter_leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const blogs = pgTable("blogs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  author: text("author").notNull(),
  image: text("image").notNull(),
  category: text("category").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_blogs_created_at").on(table.createdAt),
]);

export const enquiries = pgTable("enquiries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const suites = pgTable("suites", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  pricePerNight: integer("price_per_night").notNull(),
  image: text("image").notNull(),
  amenities: text("amenities").array(),
  isAvailable: boolean("is_available").notNull().default(true),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  isAdmin: true,
}).extend({
  isAdmin: z.boolean(),
});

export const insertMenuItemSchema = createInsertSchema(menuItems);
export const insertReservationSchema = createInsertSchema(reservations, {
  requests: z.string().nullable(),
}).omit({
  id: true,
  createdAt: true
}).extend({
  guests: z.coerce.number().min(1).max(20),
});
export const insertNewsletterSchema = createInsertSchema(newsletterLeads).extend({
  email: z.string().email(),
});
export const insertBlogSchema = createInsertSchema(blogs);
export const insertEnquirySchema = createInsertSchema(enquiries).extend({
  email: z.string().email(),
});
export const insertSuiteSchema = createInsertSchema(suites);

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  deliveryAddress: text("delivery_address").notNull(),
  totalAmount: integer("total_amount").notNull(),
  paymentMethod: text("payment_method").notNull().default("cash"),
  paymentStatus: text("payment_status").notNull().default("pending"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull(),
  menuItemId: varchar("menu_item_id").notNull(),
  quantity: integer("quantity").notNull(),
  price: integer("price").notNull(),
  itemName: text("item_name").notNull(),
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  status: true,
  paymentStatus: true,
}).extend({
  customerEmail: z.string().email(),
  items: z.array(z.object({
    menuItemId: z.string(),
    quantity: z.number().min(1),
    price: z.number(),
    itemName: z.string(),
  })),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertReservation = z.infer<typeof insertReservationSchema>;
export type InsertBlog = z.infer<typeof insertBlogSchema>;
export type InsertEnquiry = z.infer<typeof insertEnquirySchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type SiteSetting = typeof siteSettings.$inferSelect;
export type User = typeof users.$inferSelect;
export type MenuItem = typeof menuItems.$inferSelect;
export type Reservation = typeof reservations.$inferSelect;
export type NewsletterLead = typeof newsletterLeads.$inferSelect;
export type Blog = typeof blogs.$inferSelect;
export type Enquiry = typeof enquiries.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type Suite = typeof suites.$inferSelect;
export type InsertSuite = z.infer<typeof insertSuiteSchema>;
