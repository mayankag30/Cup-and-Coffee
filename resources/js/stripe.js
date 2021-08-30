import { loadStripe } from "@stripe/stripe-js";
import { placeOrder } from "./apiService";
import { CardWidget } from "./CardWidget";

export async function initStripe() {
  const stripe = await loadStripe(
    "pk_test_51ImkS7SG7iYnCZqllaJzyokTcgEUQAl2s2BKQdwVltpoYqV0y4niE2JXnXsldnNTavM5tiP0ZaGkqWE9YDInmY1O00US4fZKcP"
  );

  let card = null;
  //   function mountWidget() {
  //     const elements = stripe.elements();

  //     // Style to be given to the widget
  //     let style = {
  //       base: {
  //         color: "#32325d",
  //         fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
  //         fontSmoothing: "antialiased",
  //         fontSize: "16px",
  //         "::placeholder": {
  //           color: "#aab7c4",
  //         },
  //       },
  //       invalid: {
  //         color: "#fa755a",
  //         iconColor: "#fa755a",
  //       },
  //     };

  //     // Type of widget = card
  //     card = elements.create("card", {
  //       style: style,
  //       hidePostalCode: true,
  //     });

  //     // Place where the widget will be shown
  //     card.mount("#card-element");
  //   }

  // Display the widget for CARD NUMBER
  const paymentType = document.querySelector("#paymentType");
  if (!paymentType) {
    return;
  }

  paymentType.addEventListener("change", (e) => {
    // show the widget when "pay with card" option is selected
    if (e.target.value === "card") {
      // Display Widget
      card = new CardWidget(stripe);
      card.mount();
      //   mountWidget();
    } else {
      // Destroy the widget
      card.destroy();
    }
  });

  // Ajax call to submit the form
  const paymentForm = document.querySelector("#payment-form");
  if (paymentForm) {
    paymentForm.addEventListener("submit", async (e) => {
      // to avoid the submission of form and refreshing of browser
      e.preventDefault();
      let formData = new FormData(paymentForm);
      let formObject = {};

      // formObject: {phone: "1232123321", address: "XYZ"}
      for (let [key, value] of formData.entries()) {
        formObject[key] = value;
      }

      // create the token only when option is pay with card
      // when COD, the card will be null
      if (!card) {
        // Ajax
        placeOrder(formObject);
        return;
      }

      const token = await card.createToken();
      // Add token to the formObject
      formObject.stripeToken = token.id;
      placeOrder(formObject);

      // Verify Card
      //   stripe
      //     .createToken(card)
      //     .then((result) => {
      //       console.log(result);
      //       // Add token to the formObject
      //       formObject.stripeToken = result.token.id;
      //       placeOrder(formObject);
      //     })
      //     .catch((err) => {
      //       console.log(err);
      //     });
    });
  }
}
