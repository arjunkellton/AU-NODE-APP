import { Router } from "express";

import { fetchDashboard } from "../controllers/dashboardController";

const dashboardRouter = Router();

dashboardRouter.get("/", fetchDashboard);

export default dashboardRouter;
