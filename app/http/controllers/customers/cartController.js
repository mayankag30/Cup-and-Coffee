function cartController() {
  return {
    index(req, res) {
      res.render("customers/cart");
    },
    update(req, res) {
      // Check for Empty Cart and not present in Session
      if (!req.session.cart) {
        req.session.cart = {
          items: {},
          totalQty: 0,
          totalPrice: 0,
        };
      }
      const cart = req.session.cart;
      // check if the item does not exist in cart
      if (!cart.items[req.body._id]) {
        cart.items[req.body._id] = {
          item: req.body,
          qty: 1,
        };
        cart.totalQty += 1;
        cart.totalPrice += req.body.price;
      } else {
        cart.items[req.body._id].qty += 1;
        cart.totalQty += 1;
        cart.totalPrice += req.body.price;
      }
      return res.json({
        totalQty: req.session.cart.totalQty,
      });
    },
    delElement(req, res) {
      const cart = req.session.cart;
      // check if the item does not exist in cart
      if (cart.items[req.body._id]) {
        cart.items[req.body._id].qty -= 1;
        cart.totalQty -= 1;
        cart.totalPrice -= req.body.price;
      }
      if (cart.items[req.body._id].qty === 0) {
        delete cart.items[req.body._id];
      }
      if (cart.totalQty === 0) {
        delete req.session.cart;
      }
      return res.json({
        totalQty: req.session.cart ? req.session.cart.totalQty : 0,
      });
    },
  };
}

module.exports = cartController;
