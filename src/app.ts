import dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";

import customerRouter from "./routes/customerRoutes";
import dashboardRouter from "./routes/dashboardRoutes";
import stateRouter from "./routes/stateRoutes";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler";

dotenv.config();

const app = express();

const allowedOrigins = new Set([
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3001",
]);

app.use(express.json());

app.use((request: Request, response: Response, next: NextFunction) => {
  const origin = request.headers.origin;

  if (origin && allowedOrigins.has(origin)) {
    response.header("Access-Control-Allow-Origin", origin);
  }

  response.header("Vary", "Origin");
  response.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  response.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (request.method === "OPTIONS") {
    response.sendStatus(204);
    return;
  }

  next();
});

app.use((request: Request, _response: Response, next: NextFunction) => {
  // Lightweight request logging keeps troubleshooting simple without extra packages.
  console.log(`${request.method} ${request.originalUrl}`);
  next();
});

app.get("/health", (_request: Request, response: Response) => {
  response.status(200).json({
    message: "Server is running.",
  });
});

app.use("/states", stateRouter);
app.use("/customers", customerRouter);
app.use("/dashboard", dashboardRouter);
app.use("/api/states", stateRouter);
app.use("/api/customers", customerRouter);
app.use("/api/dashboard", dashboardRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
