"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postToMondayGrapQLAPI = void 0;
const queries_1 = require("../utils/queries");
const delay_1 = require("../utils/delay");
const webhookLogs_1 = __importDefault(require("../models/webhookLogs"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const postToMondayGrapQLAPI = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fetch = () => __awaiter(void 0, void 0, void 0, function* () { return yield (0, queries_1.queryAPI)((0, queries_1.createBugQuery)(req.body), { validateStatus: (status) => !(status >= 400 && status < 600) || [400, 408].includes(status) }); });
        let response = yield fetch();
        let backoffCoefficient = 0;
        while (response.status >= 400 && backoffCoefficient < 10) {
            ++backoffCoefficient;
            yield (0, delay_1.delay)(backoffCoefficient);
            response = yield fetch();
        }
        const newLog = yield webhookLogs_1.default.create({ status: response.status, payload: req.body });
        yield newLog.save();
    }
    catch (err) {
        const newLog = yield webhookLogs_1.default.create({ status: err.response.status, payload: req.body });
        yield newLog.save();
        next(err);
    }
});
exports.postToMondayGrapQLAPI = postToMondayGrapQLAPI;
