import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  
  // Rating scales (1-5)
  appearance: integer("appearance").notNull(),
  punctuality: integer("punctuality").notNull(),
  communication: integer("communication").notNull(),
  professionalism: integer("professionalism").notNull(),
  chemistry: integer("chemistry").notNull(),
  discretion: integer("discretion").notNull(),
  
  // Yes/No questions
  wouldBookAgain: boolean("would_book_again").notNull(),
  bookingProcessSmooth: boolean("booking_process_smooth").notNull(),
  matchedDescription: boolean("matched_description").notNull(),
  
  // Service types (stored as array of strings)
  serviceTypes: text("service_types").array().notNull(),
  
  // Optional comment
  additionalComments: text("additional_comments"),
  
  isApproved: boolean("is_approved").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertReviewSchema = createInsertSchema(reviews).pick({
  name: true,
  email: true,
  appearance: true,
  punctuality: true,
  communication: true,
  professionalism: true,
  chemistry: true,
  discretion: true,
  wouldBookAgain: true,
  bookingProcessSmooth: true,
  matchedDescription: true,
  serviceTypes: true,
  additionalComments: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;
