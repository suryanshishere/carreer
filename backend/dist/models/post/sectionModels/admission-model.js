"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.admissionSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const common_section_data_1 = __importDefault(require("./common-section-data"));
const mongoose_2 = require("mongoose");
const admissionSchema = new mongoose_2.Schema({});
exports.admissionSchema = admissionSchema;
admissionSchema.add(common_section_data_1.default);
const AdmissionModel = mongoose_1.default.model("Admission", admissionSchema);
exports.default = AdmissionModel;
