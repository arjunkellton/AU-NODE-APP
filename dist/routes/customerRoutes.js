"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const customerController_1 = require("../controllers/customerController");
const customerRouter = (0, express_1.Router)();
customerRouter.get("/", customerController_1.fetchCustomers);
exports.default = customerRouter;
