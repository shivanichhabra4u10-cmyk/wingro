"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminOnly = void 0;
function adminOnly(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({ error: 'Admin access required' });
}
exports.adminOnly = adminOnly;
