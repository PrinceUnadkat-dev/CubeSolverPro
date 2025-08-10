import { sql } from "drizzle-orm";
import { pgTable, text, varchar, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const cubeConfigurations = pgTable("cube_configurations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name"),
  configuration: json("configuration").$type<{
    front: string[];
    right: string[];
    back: string[];
    left: string[];
    top: string[];
    bottom: string[];
  }>().notNull(),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const cubeSolutions = pgTable("cube_solutions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  configurationId: varchar("configuration_id").references(() => cubeConfigurations.id),
  solution: json("solution").$type<{
    moves: string[];
    totalMoves: number;
    solvingTime: number;
  }>().notNull(),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const insertCubeConfigurationSchema = createInsertSchema(cubeConfigurations).omit({
  id: true,
  createdAt: true,
});

export const insertCubeSolutionSchema = createInsertSchema(cubeSolutions).omit({
  id: true,
  createdAt: true,
});

export type InsertCubeConfiguration = z.infer<typeof insertCubeConfigurationSchema>;
export type InsertCubeSolution = z.infer<typeof insertCubeSolutionSchema>;
export type CubeConfiguration = typeof cubeConfigurations.$inferSelect;
export type CubeSolution = typeof cubeSolutions.$inferSelect;

export const cubeColors = ["white", "yellow", "red", "orange", "blue", "green"] as const;
export type CubeColor = typeof cubeColors[number];

export const cubeFaces = ["front", "right", "back", "left", "top", "bottom"] as const;
export type CubeFace = typeof cubeFaces[number];
