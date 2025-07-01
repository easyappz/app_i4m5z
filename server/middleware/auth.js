const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ message: 'Authentication token missing. Please provide a token in the Authorization header.' });
  }

  const token = authHeader.replace('Bearer ', '').trim();
  if (!token) {
    return res.status(401).json({ message: 'Authentication token missing. Token value is empty or invalid.' });
  }

  try {
    const decoded = jwt.verify(token, 'SECRET_KEY');
    if (!decoded.userId) {
      return res.status(401).json({ message: 'Invalid token. Token does not contain required user information.' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Invalid token error:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired. Please log in again to obtain a new token.' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token. Token is malformed or not valid.' });
    }
    res.status(401).json({ message: 'Authentication failed. Unable to verify token.' });
  }
};

module.exports = authMiddleware;
