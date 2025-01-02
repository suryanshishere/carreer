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
const user_model_1 = __importDefault(require("../../models/user/user-model"));
const node_cron_1 = __importDefault(require("node-cron"));
const EMAIL_VERIFICATION_TOKEN_EXPIRY = Number(process.env.EMAIL_VERIFICATION_TOKEN_EXPIRY) || 3;
const PASSWORD_RESET_TOKEN_EXPIRY = Number(process.env.PASSWORD_RESET_TOKEN_EXPIRY) || 3;
// Run every day, to clean unverified user and tokens
const userCleanupTask = () => {
    node_cron_1.default.schedule("0 0 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
        const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        const now = new Date();
        try {
            // Remove unverified users older than one day
            yield user_model_1.default.deleteMany({
                isEmailVerified: false,
                createdAt: { $lt: new Date(now.getTime() - oneDay) },
            });
            // console.log("Unverified user data removed");
        }
        catch (error) {
            console.error("Error clearing expired tokens or unverified users:", error);
        }
    }));
};
exports.default = userCleanupTask;
