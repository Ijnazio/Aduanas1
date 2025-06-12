import {
  users,
  minorApplications,
  vehicleApplications,
  declarations,
  reviews,
  statistics,
  type User,
  type InsertUser,
  type MinorApplication,
  type InsertMinorApplication,
  type VehicleApplication,
  type InsertVehicleApplication,
  type Declaration,
  type InsertDeclaration,
  type Review,
  type InsertReview,
  type Statistics,
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  authenticateUser(username: string, password: string): Promise<User | null>;

  // Minor Applications
  createMinorApplication(userId: number, application: InsertMinorApplication): Promise<MinorApplication>;
  getMinorApplicationsByUser(userId: number): Promise<MinorApplication[]>;
  getAllMinorApplications(): Promise<MinorApplication[]>;
  updateMinorApplicationStatus(id: number, status: string, observations?: string): Promise<MinorApplication | undefined>;

  // Vehicle Applications
  createVehicleApplication(userId: number, application: InsertVehicleApplication): Promise<VehicleApplication>;
  getVehicleApplicationsByUser(userId: number): Promise<VehicleApplication[]>;
  getAllVehicleApplications(): Promise<VehicleApplication[]>;
  updateVehicleApplicationStatus(id: number, status: string, observations?: string): Promise<VehicleApplication | undefined>;

  // Declarations
  createDeclaration(userId: number, declaration: InsertDeclaration): Promise<Declaration>;
  getDeclarationsByUser(userId: number): Promise<Declaration[]>;
  getAllDeclarations(): Promise<Declaration[]>;
  updateDeclarationStatus(id: number, status: string, observations?: string): Promise<Declaration | undefined>;

  // Reviews
  createReview(reviewerId: number, review: InsertReview): Promise<Review>;
  getPendingReviews(): Promise<Review[]>;
  getReviewsByReviewer(reviewerId: number): Promise<Review[]>;
  updateReview(id: number, status: string, observations?: string): Promise<Review | undefined>;

  // Statistics
  getTodayStatistics(): Promise<Statistics | undefined>;
  getStatisticsByDateRange(startDate: string, endDate: string): Promise<Statistics[]>;
  updateStatistics(date: string, updates: Partial<Statistics>): Promise<Statistics>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private minorApplications: Map<number, MinorApplication>;
  private vehicleApplications: Map<number, VehicleApplication>;
  private declarations: Map<number, Declaration>;
  private reviews: Map<number, Review>;
  private statistics: Map<string, Statistics>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.minorApplications = new Map();
    this.vehicleApplications = new Map();
    this.declarations = new Map();
    this.reviews = new Map();
    this.statistics = new Map();
    this.currentId = 1;

    // Initialize with sample users and today's statistics
    this.initializeData();
  }

  private initializeData() {
    // Create sample users for each role
    const sampleUsers = [
      { username: "funcionario1", password: "pass123", role: "funcionario", fullName: "Juan Pérez" },
      { username: "turista1", password: "pass123", role: "turista", fullName: "María González" },
      { username: "sag1", password: "pass123", role: "sag", fullName: "Carlos Silva" },
      { username: "pdi1", password: "pass123", role: "pdi", fullName: "Ana López" },
    ];

    sampleUsers.forEach(userData => {
      const user: User = {
        ...userData,
        id: this.currentId++,
        createdAt: new Date(),
      };
      this.users.set(user.id, user);
    });

    // Initialize today's statistics
    const today = new Date().toISOString().split('T')[0];
    const todayStats: Statistics = {
      id: this.currentId++,
      date: today,
      totalEntries: 247,
      totalExits: 189,
      totalVehicles: 89,
      pendingReviews: 12,
      alerts: 3,
      createdAt: new Date(),
    };
    this.statistics.set(today, todayStats);
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async authenticateUser(username: string, password: string): Promise<User | null> {
    const user = await this.getUserByUsername(username);
    if (user && user.password === password) {
      return user;
    }
    return null;
  }

  // Minor Applications
  async createMinorApplication(userId: number, application: InsertMinorApplication): Promise<MinorApplication> {
    const id = this.currentId++;
    const minorApp: MinorApplication = {
      ...application,
      id,
      userId,
      status: "pending",
      observations: null,
      createdAt: new Date(),
    };
    this.minorApplications.set(id, minorApp);
    return minorApp;
  }

  async getMinorApplicationsByUser(userId: number): Promise<MinorApplication[]> {
    return Array.from(this.minorApplications.values()).filter(app => app.userId === userId);
  }

  async getAllMinorApplications(): Promise<MinorApplication[]> {
    return Array.from(this.minorApplications.values());
  }

  async updateMinorApplicationStatus(id: number, status: string, observations?: string): Promise<MinorApplication | undefined> {
    const app = this.minorApplications.get(id);
    if (app) {
      app.status = status;
      if (observations) app.observations = observations;
      this.minorApplications.set(id, app);
    }
    return app;
  }

  // Vehicle Applications
  async createVehicleApplication(userId: number, application: InsertVehicleApplication): Promise<VehicleApplication> {
    const id = this.currentId++;
    const vehicleApp: VehicleApplication = {
      ...application,
      id,
      userId,
      status: "pending",
      observations: null,
      createdAt: new Date(),
    };
    this.vehicleApplications.set(id, vehicleApp);
    return vehicleApp;
  }

  async getVehicleApplicationsByUser(userId: number): Promise<VehicleApplication[]> {
    return Array.from(this.vehicleApplications.values()).filter(app => app.userId === userId);
  }

  async getAllVehicleApplications(): Promise<VehicleApplication[]> {
    return Array.from(this.vehicleApplications.values());
  }

  async updateVehicleApplicationStatus(id: number, status: string, observations?: string): Promise<VehicleApplication | undefined> {
    const app = this.vehicleApplications.get(id);
    if (app) {
      app.status = status;
      if (observations) app.observations = observations;
      this.vehicleApplications.set(id, app);
    }
    return app;
  }

  // Declarations
  async createDeclaration(userId: number, declaration: InsertDeclaration): Promise<Declaration> {
    const id = this.currentId++;
    const decl: Declaration = {
      ...declaration,
      id,
      userId,
      status: "pending",
      observations: null,
      createdAt: new Date(),
    };
    this.declarations.set(id, decl);
    return decl;
  }

  async getDeclarationsByUser(userId: number): Promise<Declaration[]> {
    return Array.from(this.declarations.values()).filter(decl => decl.userId === userId);
  }

  async getAllDeclarations(): Promise<Declaration[]> {
    return Array.from(this.declarations.values());
  }

  async updateDeclarationStatus(id: number, status: string, observations?: string): Promise<Declaration | undefined> {
    const decl = this.declarations.get(id);
    if (decl) {
      decl.status = status;
      if (observations) decl.observations = observations;
      this.declarations.set(id, decl);
    }
    return decl;
  }

  // Reviews
  async createReview(reviewerId: number, review: InsertReview): Promise<Review> {
    const id = this.currentId++;
    const rev: Review = {
      ...review,
      id,
      reviewerId,
      createdAt: new Date(),
    };
    this.reviews.set(id, rev);
    return rev;
  }

  async getPendingReviews(): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(review => review.status === "pending");
  }

  async getReviewsByReviewer(reviewerId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(review => review.reviewerId === reviewerId);
  }

  async updateReview(id: number, status: string, observations?: string): Promise<Review | undefined> {
    const review = this.reviews.get(id);
    if (review) {
      review.status = status;
      if (observations) review.observations = observations;
      this.reviews.set(id, review);
    }
    return review;
  }

  // Statistics
  async getTodayStatistics(): Promise<Statistics | undefined> {
    const today = new Date().toISOString().split('T')[0];
    return this.statistics.get(today);
  }

  async getStatisticsByDateRange(startDate: string, endDate: string): Promise<Statistics[]> {
    return Array.from(this.statistics.values()).filter(stat => 
      stat.date >= startDate && stat.date <= endDate
    );
  }

  async updateStatistics(date: string, updates: Partial<Statistics>): Promise<Statistics> {
    let stats = this.statistics.get(date);
    if (!stats) {
      stats = {
        id: this.currentId++,
        date,
        totalEntries: 0,
        totalExits: 0,
        totalVehicles: 0,
        pendingReviews: 0,
        alerts: 0,
        createdAt: new Date(),
      };
    }
    
    Object.assign(stats, updates);
    this.statistics.set(date, stats);
    return stats;
  }
}

export const storage = new MemStorage();
