// $(document).ready(function() {

//   console.log('jQuery chal rahi hai');

// });

document.addEventListener("DOMContentLoaded", function () {

  const drawer = document.querySelector("#cart-drawer");

  if (!drawer) return;


  function openCartDrawer() {
    drawer.classList.add("is-open");
  }


  function closeCartDrawer() {
    drawer.classList.remove("is-open");
  }


  document.addEventListener("click", function (event) {

    const closeButton = event.target.closest("[data-cart-close]");

    if (closeButton) {
      closeCartDrawer();
    }

  });


  document.addEventListener("submit", async function (event) {

    const form = event.target.closest("#product-form");

    if (!form) return;

    event.preventDefault();


    const formData = new FormData(form);


    try {

      const response = await fetch(
        window.Shopify.routes.root + "cart/add.js",
        {
          method: "POST",
          headers: {
            "Accept": "application/json"
          },
          body: formData
        }
      );


      if (!response.ok) {
        throw new Error("Product cart mein add nahi hua.");
      }


      await response.json();


      const cartResponse = await fetch(
        window.Shopify.routes.root + "cart.js"
      );

      const cart = await cartResponse.json();


      updateCartDrawer(cart);

      openCartDrawer();

    } catch (error) {

      console.error(error);

    }

  });


  function updateCartDrawer(cart) {

    const container = document.querySelector("#cart-drawer-items");

    if (!container) return;


    if (cart.item_count === 0) {

      container.innerHTML = "<p>Cart khali hai.</p>";

      return;

    }


    container.innerHTML = cart.items.map(function (item) {

      return `
        <div class="cart-item">

          <img
            src="${item.image}"
            alt="${item.product_title}"
            width="75"
            height="75"
          >

          <div>

            <h3>${item.product_title}</h3>

            <p>
              ${item.final_line_price / 100}
            </p>

            <p>
              Quantity: ${item.quantity}
            </p>

          </div>

        </div>
      `;

    }).join("");

  }

});