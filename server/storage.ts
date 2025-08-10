import { type CubeConfiguration, type CubeSolution, type InsertCubeConfiguration, type InsertCubeSolution } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getCubeConfiguration(id: string): Promise<CubeConfiguration | undefined>;
  createCubeConfiguration(config: InsertCubeConfiguration): Promise<CubeConfiguration>;
  getCubeSolution(id: string): Promise<CubeSolution | undefined>;
  createCubeSolution(solution: InsertCubeSolution): Promise<CubeSolution>;
}

export class MemStorage implements IStorage {
  private configurations: Map<string, CubeConfiguration>;
  private solutions: Map<string, CubeSolution>;

  constructor() {
    this.configurations = new Map();
    this.solutions = new Map();
  }

  async getCubeConfiguration(id: string): Promise<CubeConfiguration | undefined> {
    return this.configurations.get(id);
  }

  async createCubeConfiguration(insertConfig: InsertCubeConfiguration): Promise<CubeConfiguration> {
    const id = randomUUID();
    const config: CubeConfiguration = { 
      ...insertConfig,
      name: insertConfig.name || null,
      id, 
      createdAt: new Date() 
    };
    this.configurations.set(id, config);
    return config;
  }

  async getCubeSolution(id: string): Promise<CubeSolution | undefined> {
    return this.solutions.get(id);
  }

  async createCubeSolution(insertSolution: InsertCubeSolution): Promise<CubeSolution> {
    const id = randomUUID();
    const solution: CubeSolution = { 
      ...insertSolution,
      configurationId: insertSolution.configurationId || null,
      id, 
      createdAt: new Date() 
    };
    this.solutions.set(id, solution);
    return solution;
  }
}

export const storage = new MemStorage();