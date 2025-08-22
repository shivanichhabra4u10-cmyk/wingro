"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cart_controller_1 = require("../controllers/cart.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Get cart for logged-in user
router.get('/', auth_1.validateJWT, cart_controller_1.getCart);
// Save/update cart for logged-in user
router.post('/', auth_1.validateJWT, cart_controller_1.saveCart);
// Clear cart after purchase
router.post('/clear', auth_1.validateJWT, cart_controller_1.clearCart);
exports.default = router;
