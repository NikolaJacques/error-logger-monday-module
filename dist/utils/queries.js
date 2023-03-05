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
exports.queryAPI = exports.createBugQuery = void 0;
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../env");
const createBugQuery = (values) => {
    const date = new Date(values.timestamp);
    const dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate().toString().padStart(2, '0')}`;
    return {
        query: `mutation ($itemName: String!, $columnValues: JSON!) {
                    create_item(
                        board_id: 1148727305, 
                        group_id: topics, 
                        item_name: $itemName,
                        column_values: $columnValues
                        ){
                            id
                            column_values {
                                value
                            }
                        }
        }`,
        variables: {
            itemName: values.stack.split('at').slice(0, 2).join(' at'),
            columnValues: JSON.stringify({
                date4: { date: dateStr },
                text: values.name,
                text3: values.message,
                text34: values.stack,
                text1: values.browserVersion,
                text13: JSON.stringify(values)
            })
        }
    };
};
exports.createBugQuery = createBugQuery;
const queryAPI = (body, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield (0, axios_1.default)(Object.assign({ url: "https://api.monday.com/v2", method: 'post', headers: {
                'Content-Type': 'application/json',
                'Authorization': `${env_1.API_KEY}`
            }, data: JSON.stringify(body) }, options));
        return response;
    }
    catch (err) {
        console.log(err.message);
        throw err;
    }
});
exports.queryAPI = queryAPI;
