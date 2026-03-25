export interface SalesRecord {
  "Row ID": number;
  "Order ID": string;
  "Order Date": string;
  "Ship Date": string;
  "Ship Mode": string;
  "Customer ID": string;
  "Customer Name": string;
  Segment: string;
  Country: string;
  City: string;
  State: string;
  "Postal Code": number;
  Region: string;
  "Product ID": string;
  Category: string;
  "Sub-Category": string;
  "Product Name": string;
  Sales: number;
  Quantity: number;
  Discount: number;
  Profit: number;
}

export interface StateDateRange {
  state: string;
  minDate: string | null;
  maxDate: string | null;
}

export interface DashboardQuery {
  customerId?: string;
  state?: string;
  startDate?: string;
  endDate?: string;
}

export interface DashboardCards {
  totalSales: number;
  totalOrders: number;
  totalDiscount: number;
  totalRevenue: number;
}

export interface DashboardChartItem {
  month: string;
  sales: number;
  orders: number;
  revenue: number;
}

export interface DashboardValueItem {
  label: string;
  value: number;
}

export interface DashboardProductItem {
  name: string;
  sales: number;
}

export interface DashboardResponse {
  filters: DashboardQuery;
  cards: DashboardCards;
  chart: DashboardChartItem[];
  citySales: DashboardValueItem[];
  productSales: DashboardProductItem[];
  categorySales: DashboardValueItem[];
  subCategorySales: DashboardValueItem[];
  segmentSales: DashboardValueItem[];
}

export interface ApiError extends Error {
  statusCode?: number;
}
