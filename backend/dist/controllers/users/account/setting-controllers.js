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
exports.deactivateAccount = exports.changePassword = void 0;
const validation_error_1 = __importDefault(require("@controllers/sharedControllers/validation-error"));
const user_model_1 = __importDefault(require("@models/user/user-model"));
const http_errors_1 = __importDefault(require("@utils/http-errors"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const check_auth_1 = require("@middleware/check-auth");
const express_validator_1 = require("express-validator");
const changePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return next(new http_errors_1.default((0, validation_error_1.default)(errors), 400));
    }
    try {
        const { old_password, new_password } = req.body;
        const userId = (0, check_auth_1.getUserIdFromRequest)(req);
        const user = yield user_model_1.default.findById(userId);
        if (!user) {
            return next(new http_errors_1.default("User not found!", 404));
        }
        // Verify the old password
        const isMatch = yield bcryptjs_1.default.compare(old_password, user.password);
        if (!isMatch) {
            return next(new http_errors_1.default("Old password is incorrect.", 400));
        }
        // Hash the new password
        const hashedPassword = yield bcryptjs_1.default.hash(new_password, 10);
        // Update the user's password
        user.password = hashedPassword;
        yield user.save();
        return res.status(200).json({ message: "Password changed successfully!" });
    }
    catch (error) {
        return next(new http_errors_1.default("Unable to change your password at this time. Please try again later.", 500));
    }
});
exports.changePassword = changePassword;
const deactivateAccount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return next(new http_errors_1.default((0, validation_error_1.default)(errors), 400));
    }
    try {
        const userId = (0, check_auth_1.getUserIdFromRequest)(req);
        const user = yield user_model_1.default.findById(userId);
        if (!user) {
            return next(new http_errors_1.default("User not found!", 404));
        }
        user.deactivated_at = new Date();
        yield user.save();
        return res
            .status(200)
            .json({ message: "Account deactivated successfully!" });
    }
    catch (error) { }
});
exports.deactivateAccount = deactivateAccount;
