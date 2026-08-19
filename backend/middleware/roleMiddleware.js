// middleware/roleMiddleware.js

exports.isCooperative = (req, res, next) => {
  if (req.user.role !== "cooperative") {
    return res.status(403).json({
      message: "Access denied",
    });
  }

  next();
};

exports.isVendor = (req, res, next) => {
  if (req.user.role !== "vendor") {
    return res.status(403).json({
      message: "Access denied",
    });
  }

  next();
};