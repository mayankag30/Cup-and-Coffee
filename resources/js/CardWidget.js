export class CardWidget {
  stripe = null;
  card = null;

  // Style to be given to the widget
  style = {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  };

  constructor(stripe) {
    this.stripe = stripe;
  }

  mount() {
    const elements = this.stripe.elements();

    // Type of widget = card
    this.card = elements.create("card", {
      style: this.style,
      hidePostalCode: true,
    });

    // Place where the widget will be shown
    this.card.mount("#card-element");
  }

  destroy() {
    this.card.destroy();
  }

  async createToken() {
    // Verify Card
    try {
      const result = await this.stripe.createToken(this.card);
      return result.token;
    } catch (err) {
      console.log(err);
    }
  }
}
