"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const receiver_1 = require("../controllers/receiver");
const authorization_1 = require("../middleware/authorization");
const router = (0, express_1.Router)();
router.post('/', authorization_1.authorization, receiver_1.postToMondayGrapQLAPI);
exports.default = router;
