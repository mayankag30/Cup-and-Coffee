const Order = require("../../../models/orderModel");

function statusController() {
  return {
    update(req, res) {
      // Update the status of the order
      Order.updateOne(
        { _id: req.body.orderId },
        {
          // fields to be updated
          status: req.body.status,
        },
        (err, data) => {
          if (err) {
            return res.redirect("/admin/orders");
          }
          // Emit event
          const eventEmitter = req.app.get("eventEmitter");
          eventEmitter.emit("orderUpdated", {
            id: req.body.orderId,
            status: req.body.status,
          });
          return res.redirect("/admin/orders");
        }
      );
    },
  };
}

module.exports = statusController;
