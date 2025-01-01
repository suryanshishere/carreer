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
const http_errors_1 = __importDefault(require("@utils/http-errors"));
const check_auth_1 = require("./check-auth");
const lodash_1 = require("lodash");
const checkAccountStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { deactivated_at } = req.userData || {};
    try {
        //todo: check for 30 days
        if (deactivated_at) {
            const isOptional = check_auth_1.optionalPaths.some((path) => {
                if ((0, lodash_1.isRegExp)(path)) {
                    return path.test(req.path);
                }
                else if (typeof path === "string") {
                    return req.path === path;
                }
                return false;
            });
            const isExcluded = check_auth_1.excludedPaths.some((path) => {
                if ((0, lodash_1.isRegExp)(path)) {
                    return path.test(req.path);
                }
                else if (typeof path === "string") {
                    return req.path === path;
                }
                return false;
            });
            if (!isExcluded && !isOptional) {
                return next(new http_errors_1.default("Your account is deactivated, activate or login again.", 403));
            }
        }
        next();
    }
    catch (error) {
        return next(new http_errors_1.default("Checking account status failed, please try again.", 500));
    }
});
exports.default = checkAccountStatus;
