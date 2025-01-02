"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_controllers_1 = require("../../controllers/admin/admin-controllers");
const express_validator_1 = require("express-validator");
const env_data_1 = require("../../shared/env-data");
const approver_routes_1 = __importDefault(require("./approver-routes"));
const router = express_1.default.Router();
const statusAndRoleCheck = [
    (0, express_validator_1.check)("status")
        .trim()
        .isIn(env_data_1.ADMIN_DATA.STATUS)
        .withMessage(`Status must be one of the following: ${env_data_1.ADMIN_DATA.STATUS.join(", ")}`),
    (0, express_validator_1.check)("role_applied")
        .isIn(env_data_1.ADMIN_DATA.ROLE_APPLIED)
        .withMessage(`Role applied must be among ${env_data_1.ADMIN_DATA.ROLE_APPLIED.join(", ")}`),
];
router.use("/approver", approver_routes_1.default);
router.get("/get-role", admin_controllers_1.getRole);
router.post("/req-access", statusAndRoleCheck, admin_controllers_1.getReqAccess);
router.post("/access-update", [
    ...statusAndRoleCheck,
    (0, express_validator_1.check)("req_id")
        .trim()
        .isLength({ min: 24, max: 24 })
        .withMessage("Publisher ID must be exactly 24 characters long"),
], admin_controllers_1.accessUpdate);
exports.default = router;
