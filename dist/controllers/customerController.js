"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchCustomers = void 0;
const customerService_1 = require("../services/customerService");
const fetchCustomers = async (_request, response, next) => {
    try {
        const customerIds = await (0, customerService_1.getAllCustomerIds)();
        response.status(200).json({ data: customerIds });
    }
    catch (error) {
        next(error);
    }
};
exports.fetchCustomers = fetchCustomers;
