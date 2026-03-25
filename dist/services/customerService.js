"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCustomerIds = void 0;
const fileReader_1 = require("../utils/fileReader");
const sortStrings = (values) => [...values].sort((left, right) => left.localeCompare(right));
const getAllCustomerIds = async () => {
    const records = await (0, fileReader_1.readSalesData)();
    const uniqueCustomerIds = new Set(records
        .map((record) => record["Customer ID"].trim())
        .filter((customerId) => customerId.length > 0));
    return sortStrings(Array.from(uniqueCustomerIds));
};
exports.getAllCustomerIds = getAllCustomerIds;
