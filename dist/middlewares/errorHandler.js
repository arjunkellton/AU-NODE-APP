"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.notFoundHandler = void 0;
const notFoundHandler = (request, _response, next) => {
    const error = new Error(`Route not found: ${request.method} ${request.originalUrl}`);
    error.statusCode = 404;
    next(error);
};
exports.notFoundHandler = notFoundHandler;
const errorHandler = (error, _request, response, _next) => {
    const statusCode = error.statusCode ?? 500;
    response.status(statusCode).json({
        message: error.message || "Internal server error.",
    });
};
exports.errorHandler = errorHandler;
