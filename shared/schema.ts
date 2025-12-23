import { pgTable, text, serial, integer, boolean, timestamp, date } from "drizzle-orm/pg-core";
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
  appearance: integer("appearance").notNull(),
  punctuality: integer("punctuality").notNull(),
  communication: integer("communication").notNull(),
  professionalism: integer("professionalism").notNull(),
  chemistry: integer("chemistry").notNull(),
  discretion: integer("discretion").notNull(),
  wouldBookAgain: boolean("would_book_again").notNull(),
  bookingProcessSmooth: boolean("booking_process_smooth").notNull(),
  matchedDescription: boolean("matched_description").notNull(),
  serviceTypes: text("service_types").array().notNull(),
  additionalComments: text("additional_comments"),
  publicRating: integer("public_rating").notNull(),
  publicComment: text("public_comment").notNull(),
  isApproved: boolean("is_approved").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  appointmentDate: text("appointment_date").notNull(),
  appointmentTime: text("appointment_time").notNull(),
  duration: text("duration"),
  serviceType: text("service_type").notNull(),
  location: text("location"),
  specialRequests: text("special_requests"),
  notes: text("notes"),
  travelRequest: boolean("travel_request").default(false),
  arrivalAirport: text("arrival_airport"),
  hotelBooked: text("hotel_booked"),
  interestsBoundaries: text("interests_boundaries"),
  status: text("status").default("pending").notNull(), // pending, confirmed, cancelled, completed
  makeWebhookSent: boolean("make_webhook_sent").default(false).notNull(),
  makeWebhookResponse: text("make_webhook_response"),
  source: text("source").default("website").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
  makeWebhookSent: true,
  makeWebhookResponse: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type Appointment = typeof appointments.$inferSelect;
