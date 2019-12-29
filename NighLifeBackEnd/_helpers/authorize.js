module.exports = authorize;

// Written by Dr. Esakia, edited by Bilal Taha
function authorize(roles = []) {
  // Array of roles (e.g. [Role., Role.User] or ['Admin', 'User'])
  if (typeof roles === "string") {
    roles = [roles];
  }
  return (req, res, next) => {
    if (roles.length && !roles.includes(req.user.role)) {
      // user's role is not authorized for the given route.
      return res.status(501).json({ message: "Unauthorized" });
    }
    // authentication and authorization successful
    next();
  };
}
