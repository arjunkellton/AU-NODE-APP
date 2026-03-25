import { readSalesData } from "../utils/fileReader";
import { StateDateRange } from "../types";

const sortStrings = (values: string[]): string[] =>
  [...values].sort((left, right) => left.localeCompare(right));

export const getAllStates = async (): Promise<string[]> => {
  const records = await readSalesData();
  const uniqueStates = new Set(
    records
      .map((record) => record.State.trim())
      .filter((state) => state.length > 0),
  );

  return sortStrings(Array.from(uniqueStates));
};

export const getStateDateRange = async (state: string): Promise<StateDateRange> => {
  const normalizedState = state.trim().toLowerCase();
  const records = await readSalesData();

  const dates = records
    .filter((record) => record.State.trim().toLowerCase() === normalizedState)
    .map((record) => record["Order Date"])
    .sort((left, right) => left.localeCompare(right));

  return {
    state,
    minDate: dates[0] ?? null,
    maxDate: dates[dates.length - 1] ?? null,
  };
};
