import { Request, Response, NextFunction } from "express";

import { getAllStates, getStateDateRange } from "../services/stateService";

export const fetchStates = async (
  _request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const states = await getAllStates();
    response.status(200).json({ data: states });
  } catch (error) {
    next(error);
  }
};

export const fetchStateDates = async (
  request: Request<{ state: string }>,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { state } = request.params;
    const result = await getStateDateRange(state);

    if (!result.minDate || !result.maxDate) {
      response.status(404).json({
        message: `No records found for state "${state}".`,
      });
      return;
    }

    response.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};
