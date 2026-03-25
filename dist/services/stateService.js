"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStateDateRange = exports.getAllStates = void 0;
const fileReader_1 = require("../utils/fileReader");
const sortStrings = (values) => [...values].sort((left, right) => left.localeCompare(right));
const getAllStates = async () => {
    const records = await (0, fileReader_1.readSalesData)();
    const uniqueStates = new Set(records
        .map((record) => record.State.trim())
        .filter((state) => state.length > 0));
    return sortStrings(Array.from(uniqueStates));
};
exports.getAllStates = getAllStates;
const getStateDateRange = async (state) => {
    const normalizedState = state.trim().toLowerCase();
    const records = await (0, fileReader_1.readSalesData)();
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
exports.getStateDateRange = getStateDateRange;
