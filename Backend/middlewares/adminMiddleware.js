const adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'admin' && req.user.role !== 'instructor') {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
  
  module.exports = adminMiddleware;