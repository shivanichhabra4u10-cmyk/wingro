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
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCart = exports.saveCart = exports.getCart = void 0;
const User_1 = require("../models/User");
// Get cart for logged-in user
const getCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user || !req.user.userId)
            return res.status(401).json({ error: 'Unauthorized' });
        const userId = req.user.userId;
        const user = yield User_1.User.findById(userId);
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        res.json({ cart: user.cart || [] });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch cart' });
    }
});
exports.getCart = getCart;
// Save/update cart for logged-in user
const saveCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user || !req.user.userId)
            return res.status(401).json({ error: 'Unauthorized' });
        const userId = req.user.userId;
        const cart = req.body.cart || [];
        const user = yield User_1.User.findByIdAndUpdate(userId, { cart }, { new: true });
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        res.json({ cart: user.cart });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to save cart' });
    }
});
exports.saveCart = saveCart;
// Clear cart after purchase
const clearCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user || !req.user.userId)
            return res.status(401).json({ error: 'Unauthorized' });
        const userId = req.user.userId;
        const user = yield User_1.User.findByIdAndUpdate(userId, { cart: [] }, { new: true });
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        res.json({ cart: [] });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to clear cart' });
    }
});
exports.clearCart = clearCart;
