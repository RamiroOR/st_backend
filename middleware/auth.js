const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token');
  console.log('Auth Middleware: Token:', token);

  if (!token) {
    console.log('No token, authorization denied');
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Auth Middleware: Decoded:', decoded);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.log('Token is not valid:', err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Autenticación para Socket.IO
module.exports.socketAuth = function (socket, next) {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error('Authentication error'));
  }

  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    socket.user = decoded.user;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
};
