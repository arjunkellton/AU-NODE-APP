import { Router } from "express";

import { fetchStateDates, fetchStates } from "../controllers/stateController";

const stateRouter = Router();

stateRouter.get("/", fetchStates);
stateRouter.get("/:state/dates", fetchStateDates);

export default stateRouter;
