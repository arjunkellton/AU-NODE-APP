"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readSalesData = void 0;
const promises_1 = require("fs/promises");
const path_1 = __importDefault(require("path"));
const resolveDataFilePath = () => {
    const configuredPath = process.env.DATA_FILE_PATH ?? "src/data/data.json";
    return path_1.default.isAbsolute(configuredPath)
        ? configuredPath
        : path_1.default.resolve(process.cwd(), configuredPath);
};
const readSalesData = async () => {
    const filePath = resolveDataFilePath();
    const fileContent = await (0, promises_1.readFile)(filePath, "utf-8");
    const parsedData = JSON.parse(fileContent);
    if (!Array.isArray(parsedData)) {
        const error = new Error("Data source must be a JSON array.");
        error.statusCode = 500;
        throw error;
    }
    return parsedData;
};
exports.readSalesData = readSalesData;
