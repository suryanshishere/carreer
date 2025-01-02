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
exports.contactUs = void 0;
const http_errors_1 = __importDefault(require("../../utils/http-errors"));
const contact_us_model_1 = __importDefault(require("../../models/other/contact-us-model"));
const contactUs = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, reason } = req.body;
        const userId = req.userData.userId;
        const contactRequest = new contact_us_model_1.default({
            user_id: userId,
            name,
            email,
            reason,
        });
        yield contactRequest.save();
        return res
            .status(201)
            .json({ message: "Contact request submitted successfully." });
    }
    catch (error) {
        console.error("Error saving contact request:", error);
        return next(new http_errors_1.default("Error occurred while sending, try again!", 500));
    }
});
exports.contactUs = contactUs;
