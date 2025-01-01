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
exports.contributeToPost = exports.reqAccess = void 0;
const validation_error_1 = require("@controllers/sharedControllers/validation-error");
const admin_model_1 = __importDefault(require("@models/admin/admin-model"));
const request_model_1 = __importDefault(require("@models/admin/request-model"));
const contribution_model_1 = __importDefault(require("@models/user/contribution-model"));
const user_model_1 = __importDefault(require("@models/user/user-model"));
const env_data_1 = require("@shared/env-data");
const http_errors_1 = __importDefault(require("@utils/http-errors"));
const mongoose_1 = __importDefault(require("mongoose"));
//TEMP: someone can send none, while expireAt active. to start new req to remove expireAt, but the person will have to loose earlier access then.
const reqAccess = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validation_error_1.handleValidationErrors)(req, next);
    const { userId } = req.userData;
    const { reason, role_applied } = req.body;
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        let request = yield request_model_1.default.findById(userId).session(session);
        //revoke access management which user himself requested
        if (role_applied === "none") {
            if (!request) {
                yield session.abortTransaction();
                session.endSession();
                //here this means that request will exist forever, and if deleted, then for sure admin will exist
                return next(new http_errors_1.default("No existing request found to delete.", 400));
            }
            yield request.deleteOne({ session });
            yield admin_model_1.default.findByIdAndDelete(userId, { session });
            yield session.commitTransaction();
            session.endSession();
            return res
                .status(200)
                .json({ message: "Request / Access deleted successfully." });
        }
        if (request) {
            if (request.expireAt) {
                const daysLeft = Math.ceil((new Date(request.expireAt).getTime() +
                    env_data_1.ADMIN_DATA.REQUEST_DOC_EXPIRY * 60 * 1000 -
                    Date.now()) /
                    (1000 * 3600 * 24));
                yield session.abortTransaction();
                session.endSession();
                return next(new http_errors_1.default(`Your request application has already been rejected. Please try again after ${daysLeft} days.`, 400));
            }
            if (request.role_applied === role_applied) {
                yield session.abortTransaction();
                session.endSession();
                return next(new http_errors_1.default("You already applied or have the access you are applying for.", 400));
            }
            request.role_applied = role_applied;
            request.status = "pending";
            yield request.save({ session });
        }
        else {
            yield new request_model_1.default({
                _id: userId,
                reason,
                role_applied,
                user: userId,
                admin: userId,
            }).save({ session });
        }
        yield session.commitTransaction();
        session.endSession();
        return res.status(200).json({ message: "Request sent for approval!" });
    }
    catch (error) {
        console.error(error);
        yield session.abortTransaction();
        session.endSession();
        return next(new http_errors_1.default("Failed to process access request.", 500));
    }
});
exports.reqAccess = reqAccess;
const contributeToPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { data, section, post_code } = req.body;
    const userId = req.userData.userId;
    const session = yield mongoose_1.default.startSession(); // Start the session
    try {
        session.startTransaction(); // Start the transaction
        (0, validation_error_1.handleValidationErrors)(req, next);
        // Find the user and populate contribution field
        let user = yield user_model_1.default.findById(userId)
            .populate("contribution")
            .select("contribution")
            .session(session); // Use the session in the find query
        if (!user)
            return next(new http_errors_1.default("No user found!", 400));
        let contribution = user === null || user === void 0 ? void 0 : user.contribution;
        // If no contribution exists for the user, create a new one
        if (!contribution) {
            contribution = new contribution_model_1.default({
                _id: userId,
                contribution: new Map(), // Initialize the contribution Map
            });
            user.contribution = userId;
            yield user.save({ session }); // Use the session in the save query
        }
        // Ensure contribution.contribution is always a Map
        if (!(contribution.contribution instanceof Map)) {
            contribution.contribution = new Map(); // Initialize it as a Map if not already
        }
        // Ensure the Map for the specific postCode exists
        const postContribution = contribution.contribution.get(post_code) || {};
        // If section is already present, merge data, else create a new entry
        if (postContribution[section]) {
            postContribution[section] = Object.assign(Object.assign({}, postContribution[section]), data);
        }
        else {
            postContribution[section] = data; // Create new section if not present
        }
        // Set the updated contribution back to the Map
        contribution.contribution.set(post_code, postContribution);
        // Save the contribution document
        yield contribution.save({ session }); // Use the session in the save query
        // Commit the transaction if all operations were successful
        yield session.commitTransaction();
        // End the session
        session.endSession();
        // Return a success response
        return res.status(200).json({
            message: "Contributed to post successfully",
        });
    }
    catch (error) {
        // If an error occurs, abort the transaction and roll back
        yield session.abortTransaction();
        session.endSession();
        console.log(error);
        return next(new http_errors_1.default("An error occurred while contributing", 500));
    }
});
exports.contributeToPost = contributeToPost;
