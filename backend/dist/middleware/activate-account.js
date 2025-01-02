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
const user_model_1 = __importDefault(require("../models/user/user-model"));
const http_errors_1 = __importDefault(require("../utils/http-errors"));
const activateAccount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userData.userId;
    try {
        const user = yield user_model_1.default.findById(userId);
        if (!user)
            return next(new http_errors_1.default("User not found!", 404));
        if (!user.deactivated_at)
            return next(new http_errors_1.default("User account seem to be active already.", 400));
        user.deactivated_at = undefined;
        user.save();
        return res.status(200).json({ message: "Account activated successfully!" });
    }
    catch (error) {
        return next(new http_errors_1.default("Activating your account failed, please try again.", 500));
    }
});
exports.default = activateAccount;
