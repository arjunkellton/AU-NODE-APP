"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchDashboard = void 0;
const dashboardService_1 = require("../services/dashboardService");
const isValidDateInput = (value) => !value || !Number.isNaN(new Date(value).getTime());
const fetchDashboard = async (request, response, next) => {
    try {
        const query = {
            customerId: request.query.customerId?.trim(),
            state: request.query.state?.trim(),
            startDate: request.query.startDate?.trim(),
            endDate: request.query.endDate?.trim(),
        };
        if (!isValidDateInput(query.startDate) || !isValidDateInput(query.endDate)) {
            response.status(400).json({
                message: "startDate and endDate must be valid dates in YYYY-MM-DD format.",
            });
            return;
        }
        if (query.startDate && query.endDate && query.startDate > query.endDate) {
            response.status(400).json({
                message: "startDate cannot be greater than endDate.",
            });
            return;
        }
        const dashboardData = await (0, dashboardService_1.getDashboardData)(query);
        response.status(200).json(dashboardData);
    }
    catch (error) {
        next(error);
    }
};
exports.fetchDashboard = fetchDashboard;
