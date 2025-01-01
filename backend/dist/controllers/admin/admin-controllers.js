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
exports.accessUpdate = exports.getReqAccess = exports.getRole = void 0;
const http_errors_1 = __importDefault(require("@utils/http-errors"));
const validation_error_1 = require("@controllers/sharedControllers/validation-error");
const admin_model_1 = __importDefault(require("@models/admin/admin-model"));
const request_model_1 = __importDefault(require("@models/admin/request-model"));
const admin_controllers_utils_1 = require("./admin-controllers-utils");
const getRole = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userData.userId;
    try {
        const admin = yield admin_model_1.default.findById(userId).select("role");
        if (!admin || !admin.role) {
            return next(new http_errors_1.default("Nothing to activate found!", 404));
        }
        return res
            .status(200)
            .json({ data: { role: admin.role }, message: "Activated successfully!" });
    }
    catch (error) {
        return next(new http_errors_1.default("Internal server error!", 500));
    }
});
exports.getRole = getRole;
const getReqAccess = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validation_error_1.handleValidationErrors)(req, next);
    const userId = req.userData.userId;
    const { status, role_applied } = req.body;
    try {
        (0, admin_controllers_utils_1.authorisedAdmin)(userId, next);
        const requestList = yield request_model_1.default.find({
            status,
            role_applied,
        })
            .sort({ updatedAt: -1 })
            .populate({ path: "user", select: "email" });
        if (!requestList || requestList.length === 0) {
            return next(new http_errors_1.default(`No ${status} ${role_applied} found!`, 404));
        }
        return res
            .status(200)
            .json({ data: requestList, message: "Fetched successfully!" });
    }
    catch (error) {
        return next(new http_errors_1.default("Failed to fetch requests.", 500));
    }
});
exports.getReqAccess = getReqAccess;
const accessUpdate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validation_error_1.handleValidationErrors)(req, next);
    const session = yield request_model_1.default.startSession();
    session.startTransaction();
    try {
        const userId = req.userData.userId;
        const { status, req_id, role_applied } = req.body;
        (0, admin_controllers_utils_1.authorisedAdmin)(userId, next);
        const request = yield request_model_1.default.findById(req_id).session(session);
        if (!request) {
            yield session.abortTransaction();
            session.endSession();
            return next(new http_errors_1.default("Request not found!", 404));
        }
        if (request.status === status) {
            yield session.abortTransaction();
            session.endSession();
            return next(new http_errors_1.default(`Request is already ${status}!`, 400));
        }
        if (request.role_applied != role_applied) {
            yield session.abortTransaction();
            session.endSession();
            return next(new http_errors_1.default("Role applied not match!", 400));
        }
        if (status === "rejected") {
            if (!request.expireAt) {
                request.expireAt = new Date();
            }
            yield admin_model_1.default.findByIdAndDelete(req_id).session(session);
        }
        else if (status === "approved") {
            if (request.expireAt) {
                request.expireAt = undefined;
            }
            const existingAdmin = yield admin_model_1.default.findById(req_id).session(session);
            if (existingAdmin) {
                existingAdmin.role = request.role_applied;
                yield existingAdmin.save({ session });
            }
            else {
                yield new admin_model_1.default({
                    user: req_id,
                    _id: req_id,
                    role: request.role_applied,
                }).save({ session });
            }
        }
        else {
            const existingAdmin = yield admin_model_1.default.findById(req_id).session(session);
            if (existingAdmin) {
                existingAdmin.role = "none";
                yield existingAdmin.save({ session });
            }
            request.expireAt = undefined;
        }
        request.status = status;
        yield request.save({ session });
        yield session.commitTransaction();
        session.endSession();
        return res.status(200).json({
            message: `Status successfully updated to '${status}'.`,
        });
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        console.error("Error updating publisher access:", error);
        return next(new http_errors_1.default("Failed to handle access request.", 500));
    }
});
exports.accessUpdate = accessUpdate;
