import { NextFunction, Request, Response } from "express";

import { ApiError } from "../types";

export const notFoundHandler = (
  request: Request,
  _response: Response,
  next: NextFunction,
): void => {
  const error: ApiError = new Error(`Route not found: ${request.method} ${request.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

export const errorHandler = (
  error: ApiError,
  _request: Request,
  response: Response,
  _next: NextFunction,
): void => {
  const statusCode = error.statusCode ?? 500;

  response.status(statusCode).json({
    message: error.message || "Internal server error.",
  });
};
