import {
  DashboardChartItem,
  DashboardProductItem,
  DashboardQuery,
  DashboardResponse,
  DashboardValueItem,
  SalesRecord,
} from "../types";
import { readSalesData } from "../utils/fileReader";

const MONTH_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
});

const toTime = (value: string): number => new Date(value).getTime();

const roundToTwo = (value: number): number => Number(value.toFixed(2));

const isWithinDateRange = (
  orderDate: string,
  startDate?: string,
  endDate?: string,
): boolean => {
  const orderTime = toTime(orderDate);

  if (Number.isNaN(orderTime)) {
    return false;
  }

  const matchesStart = startDate ? orderTime >= toTime(startDate) : true;
  const matchesEnd = endDate ? orderTime <= toTime(endDate) : true;

  return matchesStart && matchesEnd;
};

const matchesCustomer = (record: SalesRecord, customerId?: string): boolean =>
  customerId
    ? record["Customer ID"].trim().toLowerCase() === customerId.trim().toLowerCase()
    : true;

const matchesState = (record: SalesRecord, state?: string): boolean =>
  state ? record.State.trim().toLowerCase() === state.trim().toLowerCase() : true;

const filterRecords = (records: SalesRecord[], query: DashboardQuery): SalesRecord[] =>
  records.filter(
    (record) =>
      matchesCustomer(record, query.customerId) &&
      matchesState(record, query.state) &&
      isWithinDateRange(record["Order Date"], query.startDate, query.endDate),
  );

const buildChartData = (records: SalesRecord[]): DashboardChartItem[] => {
  const monthlyMap = records.reduce<Map<string, DashboardChartItem>>((accumulator, record) => {
    const monthKey = record["Order Date"].slice(0, 7);
    const date = new Date(`${monthKey}-01T00:00:00.000Z`);
    const existingMonth = accumulator.get(monthKey);
    const nextValue: DashboardChartItem = existingMonth ?? {
      month: MONTH_FORMATTER.format(date),
      sales: 0,
      orders: 0,
      revenue: 0,
    };

    nextValue.sales += record.Sales;
    nextValue.orders += 1;
    nextValue.revenue += record.Profit;
    accumulator.set(monthKey, nextValue);

    return accumulator;
  }, new Map<string, DashboardChartItem>());

  return Array.from(monthlyMap.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([, value]) => ({
      month: value.month,
      sales: roundToTwo(value.sales),
      orders: value.orders,
      revenue: roundToTwo(value.revenue),
    }));
};

const buildValueBreakdown = (
  records: SalesRecord[],
  getKey: (record: SalesRecord) => string,
  limit?: number,
): DashboardValueItem[] => {
  const totals = records.reduce<Map<string, number>>((accumulator, record) => {
    const key = getKey(record).trim();

    if (!key) {
      return accumulator;
    }

    accumulator.set(key, (accumulator.get(key) ?? 0) + record.Sales);
    return accumulator;
  }, new Map<string, number>());

  const items = Array.from(totals.entries())
    .map(([label, value]) => ({
      label,
      value: roundToTwo(value),
    }))
    .sort((left, right) => right.value - left.value);

  return typeof limit === "number" ? items.slice(0, limit) : items;
};

const buildProductBreakdown = (
  records: SalesRecord[],
  limit: number,
): DashboardProductItem[] =>
  buildValueBreakdown(records, (record) => record["Product Name"], limit).map((item) => ({
    name: item.label,
    sales: item.value,
  }));

export const getDashboardData = async (
  query: DashboardQuery,
): Promise<DashboardResponse> => {
  const records = await readSalesData();
  const filteredRecords = filterRecords(records, query);
  const uniqueOrders = new Set(filteredRecords.map((record) => record["Order ID"]));

  const totalSales = filteredRecords.reduce((sum, record) => sum + record.Sales, 0);
  const totalRevenue = filteredRecords.reduce((sum, record) => sum + record.Profit, 0);

  return {
    filters: query,
    cards: {
      totalSales: roundToTwo(totalSales),
      totalOrders: uniqueOrders.size,
      totalRevenue: roundToTwo(totalRevenue),
    },
    chart: buildChartData(filteredRecords),
    citySales: buildValueBreakdown(filteredRecords, (record) => record.City, 8),
    productSales: buildProductBreakdown(filteredRecords, 9),
    categorySales: buildValueBreakdown(filteredRecords, (record) => record.Category),
    subCategorySales: buildValueBreakdown(filteredRecords, (record) => record["Sub-Category"], 9),
    segmentSales: buildValueBreakdown(filteredRecords, (record) => record.Segment),
  };
};
