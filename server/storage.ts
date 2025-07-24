import { users, reviews, appointments, type User, type InsertUser, type Review, type InsertReview, type Appointment, type InsertAppointment } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Review methods
  getApprovedReviews(): Promise<Review[]>;
  getAllReviews(): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  approveReview(id: number): Promise<Review>;
  deleteReview(id: number): Promise<void>;
  
  // Appointment methods
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  getAppointments(): Promise<Appointment[]>;
  getAllAppointments(): Promise<Appointment[]>;
  getAppointmentById(id: number): Promise<Appointment | undefined>;
  updateAppointmentStatus(id: number, status: string): Promise<Appointment>;
  updateAppointmentWebhookStatus(id: number, sent: boolean, response?: string): Promise<Appointment>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
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

  // Review methods
  async getApprovedReviews(): Promise<Review[]> {
    return db.select().from(reviews).where(eq(reviews.isApproved, true));
  }

  async getAllReviews(): Promise<Review[]> {
    return db.select().from(reviews);
  }

  async createReview(reviewData: InsertReview): Promise<Review> {
    const [review] = await db.insert(reviews).values({
      ...reviewData,
      isApproved: false // Default to unapproved
    }).returning();
    return review;
  }

  async approveReview(id: number): Promise<Review> {
    const [review] = await db.update(reviews)
      .set({ isApproved: true })
      .where(eq(reviews.id, id))
      .returning();
    return review;
  }

  async deleteReview(id: number): Promise<void> {
    await db.delete(reviews).where(eq(reviews.id, id));
  }

  // Appointment methods
  async createAppointment(appointmentData: InsertAppointment): Promise<Appointment> {
    const [appointment] = await db.insert(appointments).values(appointmentData).returning();
    return appointment;
  }

  async getAppointments(): Promise<Appointment[]> {
    return db.select().from(appointments);
  }

  async getAllAppointments(): Promise<Appointment[]> {
    return db.select().from(appointments);
  }

  async getAppointmentById(id: number): Promise<Appointment | undefined> {
    const [appointment] = await db.select().from(appointments).where(eq(appointments.id, id));
    return appointment;
  }

  async updateAppointmentStatus(id: number, status: string): Promise<Appointment> {
    const [appointment] = await db.update(appointments)
      .set({ 
        status,
        updatedAt: new Date()
      })
      .where(eq(appointments.id, id))
      .returning();
    return appointment;
  }

  async updateAppointmentWebhookStatus(id: number, sent: boolean, response?: string): Promise<Appointment> {
    const [appointment] = await db.update(appointments)
      .set({ 
        makeWebhookSent: sent,
        makeWebhookResponse: response,
        updatedAt: new Date()
      })
      .where(eq(appointments.id, id))
      .returning();
    return appointment;
  }
}

export const storage = new DatabaseStorage();
