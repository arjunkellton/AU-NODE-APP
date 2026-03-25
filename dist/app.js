"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const customerRoutes_1 = __importDefault(require("./routes/customerRoutes"));
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
const stateRoutes_1 = __importDefault(require("./routes/stateRoutes"));
const errorHandler_1 = require("./middlewares/errorHandler");
dotenv_1.default.config();
const app = (0, express_1.default)();
const allowedOrigins = new Set([
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
]);
app.use(express_1.default.json());
app.use((request, response, next) => {
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
app.use((request, _response, next) => {
    // Lightweight request logging keeps troubleshooting simple without extra packages.
    console.log(`${request.method} ${request.originalUrl}`);
    next();
});
app.get("/health", (_request, response) => {
    response.status(200).json({
        message: "Server is running.",
    });
});
app.use("/states", stateRoutes_1.default);
app.use("/customers", customerRoutes_1.default);
app.use("/dashboard", dashboardRoutes_1.default);
app.use("/api/states", stateRoutes_1.default);
app.use("/api/customers", customerRoutes_1.default);
app.use("/api/dashboard", dashboardRoutes_1.default);
app.use(errorHandler_1.notFoundHandler);
app.use(errorHandler_1.errorHandler);
exports.default = app;
