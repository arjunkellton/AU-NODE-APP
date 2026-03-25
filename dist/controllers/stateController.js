"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchStateDates = exports.fetchStates = void 0;
const stateService_1 = require("../services/stateService");
const fetchStates = async (_request, response, next) => {
    try {
        const states = await (0, stateService_1.getAllStates)();
        response.status(200).json({ data: states });
    }
    catch (error) {
        next(error);
    }
};
exports.fetchStates = fetchStates;
const fetchStateDates = async (request, response, next) => {
    try {
        const { state } = request.params;
        const result = await (0, stateService_1.getStateDateRange)(state);
        if (!result.minDate || !result.maxDate) {
            response.status(404).json({
                message: `No records found for state "${state}".`,
            });
            return;
        }
        response.status(200).json({ data: result });
    }
    catch (error) {
        next(error);
    }
};
exports.fetchStateDates = fetchStateDates;
