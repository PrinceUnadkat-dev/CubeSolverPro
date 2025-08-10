// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import { randomUUID } from "crypto";
var MemStorage = class {
  configurations;
  solutions;
  constructor() {
    this.configurations = /* @__PURE__ */ new Map();
    this.solutions = /* @__PURE__ */ new Map();
  }
  async getCubeConfiguration(id) {
    return this.configurations.get(id);
  }
  async createCubeConfiguration(insertConfig) {
    const id = randomUUID();
    const config = {
      ...insertConfig,
      name: insertConfig.name || null,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.configurations.set(id, config);
    return config;
  }
  async getCubeSolution(id) {
    return this.solutions.get(id);
  }
  async createCubeSolution(insertSolution) {
    const id = randomUUID();
    const solution = {
      ...insertSolution,
      configurationId: insertSolution.configurationId || null,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.solutions.set(id, solution);
    return solution;
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var cubeConfigurations = pgTable("cube_configurations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name"),
  configuration: json("configuration").$type().notNull(),
  createdAt: timestamp("created_at").default(sql`now()`)
});
var cubeSolutions = pgTable("cube_solutions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  configurationId: varchar("configuration_id").references(() => cubeConfigurations.id),
  solution: json("solution").$type().notNull(),
  createdAt: timestamp("created_at").default(sql`now()`)
});
var insertCubeConfigurationSchema = createInsertSchema(cubeConfigurations).omit({
  id: true,
  createdAt: true
});
var insertCubeSolutionSchema = createInsertSchema(cubeSolutions).omit({
  id: true,
  createdAt: true
});

// client/src/lib/cube-solver.ts
function solveCube(configuration) {
  const mockMoves = [
    "R",
    "U",
    "R'",
    "U'",
    "F",
    "R",
    "F'",
    "R'",
    "U",
    "R",
    "U'",
    "R'",
    "F",
    "R",
    "F'",
    "R",
    "U",
    "R'",
    "U'",
    "R",
    "U",
    "R'",
    "F",
    "R",
    "U",
    "R'",
    "U'",
    "F'"
  ];
  const numMoves = Math.floor(Math.random() * 15) + 10;
  return mockMoves.slice(0, numMoves);
}

// server/routes.ts
async function registerRoutes(app2) {
  app2.post("/api/cube/configuration", async (req, res) => {
    try {
      const validatedData = insertCubeConfigurationSchema.parse(req.body);
      const configuration = await storage.createCubeConfiguration(validatedData);
      res.json(configuration);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.get("/api/cube/configuration/:id", async (req, res) => {
    try {
      const configuration = await storage.getCubeConfiguration(req.params.id);
      if (!configuration) {
        return res.status(404).json({ error: "Configuration not found" });
      }
      res.json(configuration);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/cube/solve", async (req, res) => {
    try {
      const { configuration } = req.body;
      const startTime = Date.now();
      const solution = solveCube(configuration);
      const solvingTime = Date.now() - startTime;
      const solutionData = {
        moves: solution,
        totalMoves: solution.length,
        solvingTime: solvingTime / 1e3
        // Convert to seconds
      };
      if (req.body.configurationId) {
        const savedSolution = await storage.createCubeSolution({
          configurationId: req.body.configurationId,
          solution: solutionData
        });
        res.json(savedSolution);
      } else {
        res.json({ solution: solutionData });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/cube/solution/:id", async (req, res) => {
    try {
      const solution = await storage.getCubeSolution(req.params.id);
      if (!solution) {
        return res.status(404).json({ error: "Solution not found" });
      }
      res.json(solution);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/cube/random", async (req, res) => {
    try {
      const colors = ["white", "yellow", "red", "orange", "blue", "green"];
      const faces = ["front", "right", "back", "left", "top", "bottom"];
      const configuration = {};
      faces.forEach((face) => {
        configuration[face] = Array(9).fill(0).map(
          () => colors[Math.floor(Math.random() * colors.length)]
        );
      });
      res.json({ configuration });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
var vite_config_default = defineConfig({
  base: "/CubeSolverPro/",
  // ✅ Repo name
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets")
    }
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
