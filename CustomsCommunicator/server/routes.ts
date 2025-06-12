import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertMinorApplicationSchema, insertVehicleApplicationSchema, insertDeclarationSchema, insertReviewSchema } from "@shared/schema";
import { z } from "zod";

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
  role: z.enum(["funcionario", "turista", "sag", "pdi"]),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password, role } = loginSchema.parse(req.body);
      
      const user = await storage.authenticateUser(username, password);
      if (!user || user.role !== role) {
        return res.status(401).json({ message: "Credenciales inválidas" });
      }

      res.json({ 
        user: { 
          id: user.id, 
          username: user.username, 
          role: user.role, 
          fullName: user.fullName 
        } 
      });
    } catch (error) {
      res.status(400).json({ message: "Datos inválidos" });
    }
  });

  // Statistics
  app.get("/api/statistics/today", async (req, res) => {
    try {
      const stats = await storage.getTodayStatistics();
      res.json(stats || {
        totalEntries: 0,
        totalExits: 0,
        totalVehicles: 0,
        pendingReviews: 0,
        alerts: 0,
      });
    } catch (error) {
      res.status(500).json({ message: "Error al obtener estadísticas" });
    }
  });

  app.get("/api/statistics/range", async (req, res) => {
    try {
      const { startDate, endDate } = req.query as { startDate: string; endDate: string };
      if (!startDate || !endDate) {
        return res.status(400).json({ message: "Fechas requeridas" });
      }
      
      const stats = await storage.getStatisticsByDateRange(startDate, endDate);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener estadísticas" });
    }
  });

  // Minor Applications
  app.post("/api/minors", async (req, res) => {
    try {
      const { userId, ...applicationData } = req.body;
      if (!userId) {
        return res.status(400).json({ message: "ID de usuario requerido" });
      }

      const application = insertMinorApplicationSchema.parse(applicationData);
      const result = await storage.createMinorApplication(userId, application);
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: "Datos inválidos" });
    }
  });

  app.get("/api/minors/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const applications = await storage.getMinorApplicationsByUser(userId);
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener aplicaciones" });
    }
  });

  app.get("/api/minors", async (req, res) => {
    try {
      const applications = await storage.getAllMinorApplications();
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener aplicaciones" });
    }
  });

  app.patch("/api/minors/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status, observations } = req.body;
      const result = await storage.updateMinorApplicationStatus(id, status, observations);
      
      if (!result) {
        return res.status(404).json({ message: "Aplicación no encontrada" });
      }
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar estado" });
    }
  });

  // Vehicle Applications
  app.post("/api/vehicles", async (req, res) => {
    try {
      const { userId, ...applicationData } = req.body;
      if (!userId) {
        return res.status(400).json({ message: "ID de usuario requerido" });
      }

      const application = insertVehicleApplicationSchema.parse(applicationData);
      const result = await storage.createVehicleApplication(userId, application);
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: "Datos inválidos" });
    }
  });

  app.get("/api/vehicles/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const applications = await storage.getVehicleApplicationsByUser(userId);
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener aplicaciones" });
    }
  });

  app.get("/api/vehicles", async (req, res) => {
    try {
      const applications = await storage.getAllVehicleApplications();
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener aplicaciones" });
    }
  });

  app.patch("/api/vehicles/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status, observations } = req.body;
      const result = await storage.updateVehicleApplicationStatus(id, status, observations);
      
      if (!result) {
        return res.status(404).json({ message: "Aplicación no encontrada" });
      }
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar estado" });
    }
  });

  // Declarations
  app.post("/api/declarations", async (req, res) => {
    try {
      const { userId, ...declarationData } = req.body;
      if (!userId) {
        return res.status(400).json({ message: "ID de usuario requerido" });
      }

      const declaration = insertDeclarationSchema.parse(declarationData);
      const result = await storage.createDeclaration(userId, declaration);
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: "Datos inválidos" });
    }
  });

  app.get("/api/declarations/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const declarations = await storage.getDeclarationsByUser(userId);
      res.json(declarations);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener declaraciones" });
    }
  });

  app.get("/api/declarations", async (req, res) => {
    try {
      const declarations = await storage.getAllDeclarations();
      res.json(declarations);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener declaraciones" });
    }
  });

  app.patch("/api/declarations/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status, observations } = req.body;
      const result = await storage.updateDeclarationStatus(id, status, observations);
      
      if (!result) {
        return res.status(404).json({ message: "Declaración no encontrada" });
      }
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar estado" });
    }
  });

  // Reviews
  app.post("/api/reviews", async (req, res) => {
    try {
      const { reviewerId, ...reviewData } = req.body;
      if (!reviewerId) {
        return res.status(400).json({ message: "ID de revisor requerido" });
      }

      const review = insertReviewSchema.parse(reviewData);
      const result = await storage.createReview(reviewerId, review);
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: "Datos inválidos" });
    }
  });

  app.get("/api/reviews/pending", async (req, res) => {
    try {
      const reviews = await storage.getPendingReviews();
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener revisiones" });
    }
  });

  app.get("/api/reviews/reviewer/:reviewerId", async (req, res) => {
    try {
      const reviewerId = parseInt(req.params.reviewerId);
      const reviews = await storage.getReviewsByReviewer(reviewerId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener revisiones" });
    }
  });

  app.patch("/api/reviews/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status, observations } = req.body;
      const result = await storage.updateReview(id, status, observations);
      
      if (!result) {
        return res.status(404).json({ message: "Revisión no encontrada" });
      }
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar revisión" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
