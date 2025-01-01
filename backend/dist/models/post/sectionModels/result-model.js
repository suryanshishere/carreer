"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resultSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const common_section_data_1 = __importDefault(require("./common-section-data"));
//current year
const resultDataSchema = new mongoose_1.Schema({
    general: { type: Number },
    obc: { type: Number },
    ews: { type: Number },
    sc: { type: Number },
    st: { type: Number },
    ph_dviyang: { type: Number },
});
const resultSchema = new mongoose_1.Schema({
    how_to_download_result: { type: String },
    result: resultDataSchema,
});
exports.resultSchema = resultSchema;
resultSchema.add(common_section_data_1.default);
const ResultModel = mongoose_1.default.model("Result", resultSchema);
exports.default = ResultModel;