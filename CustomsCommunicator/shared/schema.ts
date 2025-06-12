import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull(), // funcionario, turista, sag, pdi
  fullName: text("full_name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const minorApplications = pgTable("minor_applications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  minorName: text("minor_name").notNull(),
  minorDocument: text("minor_document").notNull(),
  birthDate: text("birth_date").notNull(),
  applicationType: text("application_type").notNull(), // salida, entrada
  authorizationFile: text("authorization_file"),
  status: text("status").notNull().default("pending"), // pending, approved, rejected
  observations: text("observations"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const vehicleApplications = pgTable("vehicle_applications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  licensePlate: text("license_plate").notNull(),
  brand: text("brand").notNull(),
  model: text("model").notNull(),
  year: integer("year").notNull(),
  color: text("color").notNull(),
  applicationType: text("application_type").notNull(), // salida, entrada
  ownerName: text("owner_name").notNull(),
  ownerDocument: text("owner_document").notNull(),
  status: text("status").notNull().default("pending"),
  observations: text("observations"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const declarations = pgTable("declarations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  foodItems: jsonb("food_items").notNull(), // array of declared food items
  hasPets: boolean("has_pets").notNull().default(false),
  petDetails: jsonb("pet_details"), // pet information if has pets
  status: text("status").notNull().default("pending"),
  observations: text("observations"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  applicationId: integer("application_id").notNull(),
  applicationType: text("application_type").notNull(), // minor, vehicle, declaration
  reviewerId: integer("reviewer_id").references(() => users.id).notNull(),
  status: text("status").notNull(), // pending, approved, rejected, requires_inspection
  observations: text("observations"),
  priority: text("priority").notNull().default("medium"), // low, medium, high, urgent
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const statistics = pgTable("statistics", {
  id: serial("id").primaryKey(),
  date: text("date").notNull(),
  totalEntries: integer("total_entries").notNull().default(0),
  totalExits: integer("total_exits").notNull().default(0),
  totalVehicles: integer("total_vehicles").notNull().default(0),
  pendingReviews: integer("pending_reviews").notNull().default(0),
  alerts: integer("alerts").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
  fullName: true,
});

export const insertMinorApplicationSchema = createInsertSchema(minorApplications).pick({
  minorName: true,
  minorDocument: true,
  birthDate: true,
  applicationType: true,
  authorizationFile: true,
});

export const insertVehicleApplicationSchema = createInsertSchema(vehicleApplications).pick({
  licensePlate: true,
  brand: true,
  model: true,
  year: true,
  color: true,
  applicationType: true,
  ownerName: true,
  ownerDocument: true,
});

export const insertDeclarationSchema = createInsertSchema(declarations).pick({
  foodItems: true,
  hasPets: true,
  petDetails: true,
});

export const insertReviewSchema = createInsertSchema(reviews).pick({
  applicationId: true,
  applicationType: true,
  status: true,
  observations: true,
  priority: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type MinorApplication = typeof minorApplications.$inferSelect;
export type InsertMinorApplication = z.infer<typeof insertMinorApplicationSchema>;
export type VehicleApplication = typeof vehicleApplications.$inferSelect;
export type InsertVehicleApplication = z.infer<typeof insertVehicleApplicationSchema>;
export type Declaration = typeof declarations.$inferSelect;
export type InsertDeclaration = z.infer<typeof insertDeclarationSchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Statistics = typeof statistics.$inferSelect;
