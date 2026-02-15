module.exports = function requireAuth(req, res, next) {
  if (!req.session.userId) {

    // If a browser request 
    if (req.accepts("html")) {
      return res.redirect("/login.html?error=Please log in first");
    }

   
    return res.status(401).json({ error: "Login required" });
  }

  next();
};
