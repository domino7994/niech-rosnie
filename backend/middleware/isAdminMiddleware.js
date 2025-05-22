function isAdminMiddleware(req, res, next) {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: 'Dostęp tylko dla administratora' });
    }
    next();
  }
  
  module.exports = isAdminMiddleware;
  