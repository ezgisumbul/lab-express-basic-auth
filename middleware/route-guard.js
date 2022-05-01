const routeGuard = (req, res, next) => {
  if (req.session.userId) {
    // or if (req.user) because we deserialized user already
    next();
  } else {
    next(new Error('User is not authenticated'));
    // or even res.redirect('/login)
  }
};

module.exports = routeGuard;
