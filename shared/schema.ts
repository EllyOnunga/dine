import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
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
});

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
});

export const enquiries = pgTable("enquiries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
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

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertReservation = z.infer<typeof insertReservationSchema>;
export type InsertBlog = z.infer<typeof insertBlogSchema>;
export type InsertEnquiry = z.infer<typeof insertEnquirySchema>;
export type User = typeof users.$inferSelect;
export type MenuItem = typeof menuItems.$inferSelect;
export type Reservation = typeof reservations.$inferSelect;
export type NewsletterLead = typeof newsletterLeads.$inferSelect;
export type Blog = typeof blogs.$inferSelect;
export type Enquiry = typeof enquiries.$inferSelect;
