$(document).on('submit', '#product-form', function (event) {

  event.preventDefault();

  console.log('FORM ROK DIYA');

  var form = $(this);

  $.ajax({
    type: 'POST',
    url: window.Shopify.routes.root + 'cart/add.js',
    data: form.serialize(),
    dataType: 'json',

    success: function (response) {

      console.log('PRODUCT CART MEIN ADD HO GAYA');

      $('#cart-drawer').addClass('is-open');

    },

    error: function (error) {

      console.log('ERROR:', error);

    }
  });

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