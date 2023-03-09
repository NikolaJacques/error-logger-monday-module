"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorization = void 0;
const env_1 = require("../env");
const authorization = (req, res, next) => {
    try {
        const appId = req.body.appId;
        const timestamp = new Date(req.body.timestamp);
        if (!(appId === env_1.PROJECT_ID)) {
            throw new Error('project id error');
        }
        if ((Math.floor(Math.abs(timestamp.getTime() - new Date().getTime()) / 360000)) > 24) {
            throw new Error('timestamp error');
        }
        next();
    }
    catch (err) {
        res.status(401).json();
    }
};
exports.authorization = authorization;
