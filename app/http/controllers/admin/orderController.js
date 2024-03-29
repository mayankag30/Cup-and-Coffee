const Order = require("../../../models/orderModel");

function orderController() {
  return {
    index(req, res) {
      Order.find({ status: { $ne: "completed" } }, null, {
        sort: { createdAt: -1 },
      })
        .populate("customerId", "-password")
        .exec((err, orders) => {
          // check if it is axios request
          if (req.xhr) {
            return res.json(orders);
          }
          return res.render("admin/orders");
        });
    },
  };
}

module.exports = orderController;
