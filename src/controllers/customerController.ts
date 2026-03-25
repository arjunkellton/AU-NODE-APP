import { NextFunction, Request, Response } from "express";

import { getAllCustomerIds } from "../services/customerService";

export const fetchCustomers = async (
  _request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const customerIds = await getAllCustomerIds();
    response.status(200).json({ data: customerIds });
  } catch (error) {
    next(error);
  }
};
