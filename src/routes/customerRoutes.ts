import { Router } from "express";

import { fetchCustomers } from "../controllers/customerController";

const customerRouter = Router();

customerRouter.get("/", fetchCustomers);

export default customerRouter;
