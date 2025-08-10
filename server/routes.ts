import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCubeConfigurationSchema, insertCubeSolutionSchema } from "@shared/schema";
import { solveCube } from "../client/src/lib/cube-solver";

export async function registerRoutes(app: Express): Promise<Server> {
  // Save cube configuration
  app.post("/api/cube/configuration", async (req, res) => {
    try {
      const validatedData = insertCubeConfigurationSchema.parse(req.body);
      const configuration = await storage.createCubeConfiguration(validatedData);
      res.json(configuration);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Get cube configuration
  app.get("/api/cube/configuration/:id", async (req, res) => {
    try {
      const configuration = await storage.getCubeConfiguration(req.params.id);
      if (!configuration) {
        return res.status(404).json({ error: "Configuration not found" });
      }
      res.json(configuration);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Solve cube
  app.post("/api/cube/solve", async (req, res) => {
    try {
      const { configuration } = req.body;
      const startTime = Date.now();
      
      // Solve the cube using the algorithm
      const solution = solveCube(configuration);
      const solvingTime = Date.now() - startTime;
      
      const solutionData = {
        moves: solution,
        totalMoves: solution.length,
        solvingTime: solvingTime / 1000, // Convert to seconds
      };

      // Save solution if configurationId is provided
      if (req.body.configurationId) {
        const savedSolution = await storage.createCubeSolution({
          configurationId: req.body.configurationId,
          solution: solutionData,
        });
        res.json(savedSolution);
      } else {
        res.json({ solution: solutionData });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get solution
  app.get("/api/cube/solution/:id", async (req, res) => {
    try {
      const solution = await storage.getCubeSolution(req.params.id);
      if (!solution) {
        return res.status(404).json({ error: "Solution not found" });
      }
      res.json(solution);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Generate random cube configuration
  app.get("/api/cube/random", async (req, res) => {
    try {
      const colors = ["white", "yellow", "red", "orange", "blue", "green"];
      const faces = ["front", "right", "back", "left", "top", "bottom"];
      
      const configuration: any = {};
      faces.forEach(face => {
        configuration[face] = Array(9).fill(0).map(() => 
          colors[Math.floor(Math.random() * colors.length)]
        );
      });

      res.json({ configuration });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
