"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const changeStream_1 = require("../controllers/changeStream");
const router = (0, express_1.Router)();
router.post('/', changeStream_1.postToMondayGrapQLAPI);
exports.default = router;
