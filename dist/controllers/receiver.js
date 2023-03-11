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
const postToMondayGrapQLAPI = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json();
        let response = yield fetch(req.body);
        let backoffCoefficient = 0;
        while (response.status >= 400 && backoffCoefficient < 10) {
            ++backoffCoefficient;
            yield (0, delay_1.delay)(backoffCoefficient);
            response = yield fetch(req.body);
        }
        yield saveLog(response, req.body);
    }
    catch (err) {
        console.log(err);
        yield saveLog(err.response, req.body);
    }
});
exports.postToMondayGrapQLAPI = postToMondayGrapQLAPI;
const fetch = (requestBody) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, queries_1.queryAPI)((0, queries_1.createBugQuery)(requestBody), { validateStatus: (status) => !(status >= 400 && status < 600) || [400, 408].includes(status) }); });
const saveLog = (responseObject, requestBody) => __awaiter(void 0, void 0, void 0, function* () {
    const newLog = yield webhookLogs_1.default.create({ status: responseObject.status ? responseObject.status : null, payload: requestBody ? requestBody : null });
    yield newLog.save();
});
