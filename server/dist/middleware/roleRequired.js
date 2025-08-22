"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleRequired = void 0;
function roleRequired(roles) {
    return function (req, res, next) {
        if (!req.user || typeof req.user.role !== 'string' || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    };
}
exports.roleRequired = roleRequired;
