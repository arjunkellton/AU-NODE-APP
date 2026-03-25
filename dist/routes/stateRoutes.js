"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stateController_1 = require("../controllers/stateController");
const stateRouter = (0, express_1.Router)();
stateRouter.get("/", stateController_1.fetchStates);
stateRouter.get("/:state/dates", stateController_1.fetchStateDates);
exports.default = stateRouter;
