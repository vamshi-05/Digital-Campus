const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
 
    req.user = decoded.user;
    req.user.userId = decoded.user._id;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
}; 