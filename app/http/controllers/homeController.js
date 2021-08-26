const Menu = require("../../models/menuModel");

function homeController() {
  return {
    async index(req, res) {
      const pizzas = await Menu.find();
      // console.log(pizzas);
      res.render("home", {
        pizzas: pizzas,
      });
    },
  };
}

module.exports = homeController;
