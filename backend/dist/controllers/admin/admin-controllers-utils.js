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
exports.authorisedAdmin = void 0;
const admin_model_1 = __importDefault(require("src/models/admin/admin-model"));
const http_errors_1 = __importDefault(require("src/utils/http-errors"));
const authorisedAdmin = (userId, next) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield admin_model_1.default.findById(userId);
    if (!admin || admin.role != "admin") {
        return next(new http_errors_1.default("Access denied! Not authorized as admin.", 403));
    }
});
exports.authorisedAdmin = authorisedAdmin;
