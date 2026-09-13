const mongoose = require("mongoose");
const Request = require("../models/Request");

exports.canAccessRequest = async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ message: "Request not found" });
  }

  try {
    const request = await Request.findById(req.params.id).select(
      "customer status"
    );

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (req.user.role === "cooperative") {
      return next();
    }

    if (
      req.user.role === "customer" &&
      request.customer.toString() === req.user.id.toString()
    ) {
      return next();
    }

    if (req.user.role === "vendor" && request.status === "published") {
      return next();
    }

    return res.status(404).json({ message: "Request not found" });
  } catch (err) {
    return next(err);
  }
};
