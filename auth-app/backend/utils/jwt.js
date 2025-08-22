const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'changeme';
exports.generateToken = (user) => jwt.sign({ id: user._id, role: user.role }, secret, { expiresIn: '15m' });
exports.verifyToken = (token) => jwt.verify(token, secret);
