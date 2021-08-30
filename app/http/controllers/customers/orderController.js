const Order = require("../../../models/orderModel");
const moment = require("moment");
// Pass the private key
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

function orderController() {
  return {
    store(req, res) {
      const { phone, address, stripeToken, paymentType } = req.body;
      // Validate Request
      if (!phone || !address) {
        return res.status(422).json({ message: "All fields are required" });
        // req.flash("error", "All fields are required");
        // return res.redirect("/cart");
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
          // Populate the order: to get the customer details in the order
          Order.populate(result, { path: "customerId" }, (err, placedOrder) => {
            // req.flash("success", "Order Placed Successfully!");

            // Stripe Payment
            if (paymentType === "card") {
              stripe.charges
                .create({
                  // This amount is in paise in stripe, so convert Rs. to Paisa
                  amount: req.session.cart.totalPrice * 100,
                  // source will be the token
                  source: stripeToken,
                  // currency - Rs. - INR
                  currency: "inr",
                  // Description - for us to check in stripe dashboard
                  description: `Pizza order: ${placedOrder._id}`,
                })
                .then(() => {
                  // Payment Successfull
                  placedOrder.paymentStatus = true;
                  placedOrder.paymentType = paymentType;
                  placedOrder
                    .save()
                    .then((ord) => {
                      // Emit when the order is placed
                      const eventEmitter = req.app.get("eventEmitter");
                      eventEmitter.emit("orderPlaced", ord);
                      // Empty the cart, we use delete keyword to delete any property of an object
                      delete req.session.cart;
                      return res.json({
                        message:
                          "Payment Successful, Order Placed Successfully",
                      });
                    })
                    .catch((e) => {
                      console.log(e);
                    });
                })
                .catch((err) => {
                  // Empty the cart, we use delete keyword to delete any property of an object
                  delete req.session.cart;
                  // Payment Fail
                  return res.json({
                    message:
                      "Order Placed but Payment Failed, You can pay at delivery time",
                  });
                });
            } else {
              // Empty the cart, we use delete keyword to delete any property of an object
              delete req.session.cart;
              // payment - COD
              return res.json({
                message: "Order Placed Successfully, Payment - COD",
              });
            }
            // return res.redirect("/customer/orders");
          });
        })
        .catch((err) => {
          // req.flash("error", "Something Went Wrong!");
          // return res.redirect("/cart");
          return res.status(500).json({
            message: "Something Went Wrong",
          });
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
