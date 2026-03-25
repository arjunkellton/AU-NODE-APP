import { readSalesData } from "../utils/fileReader";

const sortStrings = (values: string[]): string[] =>
  [...values].sort((left, right) => left.localeCompare(right));

export const getAllCustomerIds = async (): Promise<string[]> => {
  const records = await readSalesData();
  const uniqueCustomerIds = new Set(
    records
      .map((record) => record["Customer ID"].trim())
      .filter((customerId) => customerId.length > 0),
  );

  return sortStrings(Array.from(uniqueCustomerIds));
};
