"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.API_KEY = exports.PROJECT_ID = exports.MONGO_MONDAY_ERROR_LOGS = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.MONGO_MONDAY_ERROR_LOGS = process.env.MONGO_MONDAY_ERROR_LOGS;
exports.PROJECT_ID = process.env.PROJECT_ID;
exports.API_KEY = process.env.API_KEY;
