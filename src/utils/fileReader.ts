import { readFile } from "fs/promises";
import path from "path";

import { SalesRecord } from "../types";

const resolveDataFilePath = (): string => {
  const configuredPath = process.env.DATA_FILE_PATH ?? "src/data/data.json";

  return path.isAbsolute(configuredPath)
    ? configuredPath
    : path.resolve(process.cwd(), configuredPath);
};

export const readSalesData = async (): Promise<SalesRecord[]> => {
  const filePath = resolveDataFilePath();
  const fileContent = await readFile(filePath, "utf-8");
  const parsedData: unknown = JSON.parse(fileContent);

  if (!Array.isArray(parsedData)) {
    const error = new Error("Data source must be a JSON array.");
    (error as Error & { statusCode?: number }).statusCode = 500;
    throw error;
  }

  return parsedData as SalesRecord[];
};
