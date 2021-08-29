const Order = require("../../../models/orderModel");
const moment = require("moment");

function orderController() {
  return {
    store(req, res) {
      const { phone, address } = req.body;
      // Validate Request
      if (!phone || !address) {
        req.flash("error", "All fields are required");
        return res.redirect("/cart");
      }

      // Create Order and store in database
      const order = new Order({
        // Passport provides logged in user on req.user
        customerId: req.user._id,
        // We have stored entire cart on the session
        items: req.session.cart.items,
        phone: phone,
        address: address,
      });

      order
        .save()
        .then((result) => {
          Order.populate(result, { path: "customerId" }, (err, placedOrder) => {
            req.flash("success", "Order Placed Successfully!");
            // Empty the cart, we use delete keyword to delete any property of an object
            delete req.session.cart;

            // Emit when the order is placed
            const eventEmitter = req.app.get("eventEmitter");
            eventEmitter.emit("orderPlaced", placedOrder);

            return res.redirect("/customer/orders");
          });
        })
        .catch((err) => {
          req.flash("error", "Something Went Wrong!");
          return res.redirect("/cart");
        });
    },
    async index(req, res) {
      const orders = await Order.find({ customerId: req.user._id }, null, {
        // Sort according to createdAt in descending order
        sort: { createdAt: -1 },
      });
      res.header(
        "Cache-Control",
        "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
      );
      res.render("customers/orders", {
        orders: orders,
        // to setup time format we pass this
        moment: moment,
      });
    },
    async show(req, res) {
      const order = await Order.findById(req.params.id);
      // Authorize user
      if (req.user._id.toString() === order.customerId.toString()) {
        return res.render("customers/singleOrder", {
          order: order,
        });
      }
      return res.redirect("/");
    },
  };
}

module.exports = orderController;
