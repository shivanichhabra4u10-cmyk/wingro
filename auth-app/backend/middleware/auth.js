const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'changeme';
module.exports = (roles = []) => (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).send('Unauthorized');
  try {
    const payload = jwt.verify(token, secret);
    if (roles.length && !roles.includes(payload.role)) return res.status(403).send('Forbidden');
    req.user = payload;
    next();
  } catch {
    res.status(401).send('Invalid token');
  }
};
