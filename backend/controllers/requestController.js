const Request = require("../models/Request");

exports.createRequest = async (req, res) => {
  const { item_name, item_specification, quantity, cooperative_id } = req.body;

  const request = await Request.create({
    customer_id: req.user.id,
    cooperative_id,
    item_name,
    item_specification,
    quantity,
  });

  res.status(201).json(request);
};

exports.getRequestsByCustomer = async (req, res) => {
  const requests = await Request.find({ customer_id: req.user.id });
  res.json(requests);
};

exports.getAllRequests = async (req, res) => {
  const requests = await Request.find();
  res.json(requests);
};
