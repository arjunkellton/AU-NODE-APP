"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardData = void 0;
const fileReader_1 = require("../utils/fileReader");
const MONTH_FORMATTER = new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
});
const toTime = (value) => new Date(value).getTime();
const roundToTwo = (value) => Number(value.toFixed(2));
const isWithinDateRange = (orderDate, startDate, endDate) => {
    const orderTime = toTime(orderDate);
    if (Number.isNaN(orderTime)) {
        return false;
    }
    const matchesStart = startDate ? orderTime >= toTime(startDate) : true;
    const matchesEnd = endDate ? orderTime <= toTime(endDate) : true;
    return matchesStart && matchesEnd;
};
const matchesCustomer = (record, customerId) => customerId
    ? record["Customer ID"].trim().toLowerCase() === customerId.trim().toLowerCase()
    : true;
const matchesState = (record, state) => state ? record.State.trim().toLowerCase() === state.trim().toLowerCase() : true;
const filterRecords = (records, query) => records.filter((record) => matchesCustomer(record, query.customerId) &&
    matchesState(record, query.state) &&
    isWithinDateRange(record["Order Date"], query.startDate, query.endDate));
const buildChartData = (records) => {
    const monthlyMap = records.reduce((accumulator, record) => {
        const monthKey = record["Order Date"].slice(0, 7);
        const date = new Date(`${monthKey}-01T00:00:00.000Z`);
        const existingMonth = accumulator.get(monthKey);
        const nextValue = existingMonth ?? {
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
    }, new Map());
    return Array.from(monthlyMap.entries())
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([, value]) => ({
        month: value.month,
        sales: roundToTwo(value.sales),
        orders: value.orders,
        revenue: roundToTwo(value.revenue),
    }));
};
const buildValueBreakdown = (records, getKey, limit) => {
    const totals = records.reduce((accumulator, record) => {
        const key = getKey(record).trim();
        if (!key) {
            return accumulator;
        }
        accumulator.set(key, (accumulator.get(key) ?? 0) + record.Sales);
        return accumulator;
    }, new Map());
    const items = Array.from(totals.entries())
        .map(([label, value]) => ({
        label,
        value: roundToTwo(value),
    }))
        .sort((left, right) => right.value - left.value);
    return typeof limit === "number" ? items.slice(0, limit) : items;
};
const buildProductBreakdown = (records, limit) => buildValueBreakdown(records, (record) => record["Product Name"], limit).map((item) => ({
    name: item.label,
    sales: item.value,
}));
const getDashboardData = async (query) => {
    const records = await (0, fileReader_1.readSalesData)();
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
exports.getDashboardData = getDashboardData;
