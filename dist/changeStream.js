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
exports.changeStreamHandler = void 0;
const mongodb_1 = require("mongodb");
const env_1 = require("./env");
const queries_1 = require("./queries");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pipeline = [{
        $match: {
            "operationType": "insert",
            "fullDocument.appId": env_1.PROJECT_ID
        }
    }];
const changeStreamHandler = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = new mongodb_1.MongoClient(env_1.MONGO_URI);
        const logs = client.db('errors').collection('logs');
        const storedToken = yield client.db('errors').collection('token').findOne({ _id: 'resume_token' });
        const changeStream = storedToken ? logs.watch(pipeline, { resumeAfter: storedToken }) : logs.watch(pipeline);
        changeStream.on('change', (next) => __awaiter(void 0, void 0, void 0, function* () {
            const resumeToken = next._id._data;
            yield client.db('errors').collection('token').findOneAndUpdate({ _id: 'resume_token' }, { $set: { token: resumeToken } }, { upsert: true });
            const stack = next.fullDocument.stack;
            const name = stack.split('at').slice(0, 2).join(' at');
            const bugs = yield (0, queries_1.queryAPI)((0, queries_1.getBugsQuery)(name));
            if (bugs.items_by_column_values.length === 0) {
                (0, queries_1.queryAPI)((0, queries_1.createBugQuery)(Object.assign(Object.assign({}, next.fullDocument), { name }))).then(data => console.log(data));
            }
        }));
        changeStream.on('error', () => __awaiter(void 0, void 0, void 0, function* () { return yield changeStream.close().catch(err => { throw err; }); }));
    }
    catch (err) {
        console.log(err.message);
    }
});
exports.changeStreamHandler = changeStreamHandler;
