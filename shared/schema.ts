import { ObjectId } from "mongodb";
import { z } from "zod";

export const insertUserSchema = z.object({
  username: z.string().min(1).max(100),
  password: z.string().min(6),
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
  _id: ObjectId;
  createdAt?: Date;
}

export interface MenuItem extends InsertMenuItem {
  _id: ObjectId;
  createdAt?: Date;
}

export interface Reservation extends Omit<InsertReservation, "guests"> {
  _id: ObjectId;
  guests: number;
  createdAt: Date;
}

export interface NewsletterLead extends InsertNewsletter {
  _id: ObjectId;
  createdAt: Date;
}

export interface Blog extends InsertBlog {
  _id: ObjectId;
  createdAt: Date;
}

export interface Enquiry extends InsertEnquiry {
  _id: ObjectId;
  createdAt: Date;
}

export interface Suite extends InsertSuite {
  _id: ObjectId;
  createdAt?: Date;
}

export interface OrderItem {
  _id?: ObjectId;
  orderId: string;
  menuItemId: string;
  quantity: number;
  price: number;
  itemName: string;
}

export interface Order extends Omit<InsertOrder, "items"> {
  _id: ObjectId;
  items: OrderItem[];
  createdAt: Date;
}

export interface SiteSetting {
  _id?: ObjectId;
  id: string;
  openingHours: string;
  isOrderingEnabled: boolean;
  minOrderAmount: number;
}