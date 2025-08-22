"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = exports.OrganizationAssessment = exports.IndividualAssessment = exports.Contact = void 0;
// server/src/models/index.ts
const Contact_1 = __importDefault(require("./Contact"));
exports.Contact = Contact_1.default;
const Assessment_1 = require("./Assessment");
Object.defineProperty(exports, "IndividualAssessment", { enumerable: true, get: function () { return Assessment_1.IndividualAssessment; } });
Object.defineProperty(exports, "OrganizationAssessment", { enumerable: true, get: function () { return Assessment_1.OrganizationAssessment; } });
const Product_1 = __importDefault(require("./Product"));
exports.Product = Product_1.default;
