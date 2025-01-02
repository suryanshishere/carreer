"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const setting_controllers_1 = require("../../../controllers/users/account/setting-controllers");
const router = express_1.default.Router();
const PWD_LENGTH = Number(process.env.PWD_LENGTH) || 6;
// router.post(
//   "/:userId/account-info",
//   [check("password").trim().isLength({ min: 5 })],
//   getAccountInfo
// );
// router.patch("/:userId/account-info", editAccountInfo);
// router.post("/:userId/deactivate", deactivateAccount);
// router.get("/:userId/reactivate", reactivateAccount);
// router.get("/:userId/deactivate-at", deactivateAt);
router.post("/change-password", [
    (0, express_validator_1.check)("email").trim().not().isEmpty(),
    (0, express_validator_1.check)("old_password")
        .trim()
        .isLength({ min: PWD_LENGTH })
        .withMessage("Old password is required!"),
    (0, express_validator_1.check)("new_password")
        .trim()
        .isLength({ min: PWD_LENGTH })
        .withMessage("New password must be minimum of 6 characters long."),
], setting_controllers_1.changePassword);
router.post("/deactivate-account", [
    (0, express_validator_1.check)("password")
        .trim()
        .isLength({ min: PWD_LENGTH })
        .withMessage("Password is required!"),
], setting_controllers_1.deactivateAccount);
exports.default = router;
