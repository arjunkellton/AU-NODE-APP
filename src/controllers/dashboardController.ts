import { NextFunction, Request, Response } from "express";

import { getDashboardData } from "../services/dashboardService";
import { DashboardQuery } from "../types";

const isValidDateInput = (value?: string): boolean =>
  !value || !Number.isNaN(new Date(value).getTime());

export const fetchDashboard = async (
  request: Request<unknown, unknown, unknown, DashboardQuery>,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const query: DashboardQuery = {
      customerId: request.query.customerId?.trim(),
      state: request.query.state?.trim(),
      startDate: request.query.startDate?.trim(),
      endDate: request.query.endDate?.trim(),
    };

    if (!isValidDateInput(query.startDate) || !isValidDateInput(query.endDate)) {
      response.status(400).json({
        message: "startDate and endDate must be valid dates in YYYY-MM-DD format.",
      });
      return;
    }

    if (query.startDate && query.endDate && query.startDate > query.endDate) {
      response.status(400).json({
        message: "startDate cannot be greater than endDate.",
      });
      return;
    }

    const dashboardData = await getDashboardData(query);
    response.status(200).json(dashboardData);
  } catch (error) {
    next(error);
  }
};
