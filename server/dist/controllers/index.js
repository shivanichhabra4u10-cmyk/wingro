"use strict";
// Export all controllers from one centralized file
// This makes importing controllers more convenient
Object.defineProperty(exports, "__esModule", { value: true });
exports.productController = exports.assessmentController = exports.authController = exports.contactController = void 0;
// Import and export controllers
const contact_controller_1 = require("./contact.controller");
Object.defineProperty(exports, "contactController", { enumerable: true, get: function () { return contact_controller_1.contactController; } });
const auth_controller_1 = require("./auth.controller");
Object.defineProperty(exports, "authController", { enumerable: true, get: function () { return auth_controller_1.authController; } });
const assessment_controller_1 = require("./assessment.controller");
Object.defineProperty(exports, "assessmentController", { enumerable: true, get: function () { return assessment_controller_1.assessmentController; } });
const product_controller_1 = require("./product.controller");
Object.defineProperty(exports, "productController", { enumerable: true, get: function () { return product_controller_1.productController; } });
// Export default object with all controllers
exports.default = {
    contact: contact_controller_1.contactController,
    auth: auth_controller_1.authController,
    assessment: assessment_controller_1.assessmentController,
    product: product_controller_1.productController
};
