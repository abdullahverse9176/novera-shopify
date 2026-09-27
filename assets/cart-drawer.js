$(document).ready(function () {


  // =========================
  // QUANTITY PLUS
  // =========================

  $(document).on('click', '.quantity-plus', function () {

    var input = $(this).siblings('.quantity-input');

    var currentValue = parseInt(input.val());

    input.val(currentValue + 1);

  });


  // =========================
  // QUANTITY MINUS
  // =========================

  $(document).on('click', '.quantity-minus', function () {

    var input = $(this).siblings('.quantity-input');

    var currentValue = parseInt(input.val());

    if (currentValue > 1) {
      input.val(currentValue - 1);
    }

  });


  // =========================
  // ADD TO CART
  // =========================

  $(document).on('submit', '#product-form', function (event) {

    event.preventDefault();

    var form = $(this);

    console.log('Add to Cart clicked');


    $.ajax({

      type: 'POST',

      url: window.Shopify.routes.root + 'cart/add.js',

      data: form.serialize(),

      dataType: 'json',

      success: function (response) {

        console.log('Product cart mein add ho gaya');

        getCart();

      },

      error: function (error) {

        console.log('Add to Cart Error:', error);

      }

    });

  });


  // =========================
  // GET CART
  // =========================

  function getCart() {

    $.ajax({

      type: 'GET',

      url: window.Shopify.routes.root + 'cart.js',

      dataType: 'json',

      success: function (cart) {

        console.log('Latest Cart:', cart);

        updateCartDrawer(cart);

        openCartDrawer();

      },

      error: function (error) {

        console.log('Cart Error:', error);

      }

    });

  }


  // =========================
  // UPDATE CART DRAWER
  // =========================

  function updateCartDrawer(cart) {

    var container = $('#cart-drawer-items');

    var html = '';


    if (cart.item_count === 0) {

      container.html('<p>Cart khali hai.</p>');

      return;

    }


    $.each(cart.items, function (index, item) {

      html += `

        <div class="cart-item">

          <img
            src="${item.image}"
            alt="${item.product_title}"
            width="75"
            height="75"
          >

          <div>

            <h3>
              ${item.product_title}
            </h3>

            <p>
              Rs. ${(item.final_line_price / 100).toFixed(2)}
            </p>

            <p>
              Quantity: ${item.quantity}
            </p>

          </div>

        </div>

      `;

    });


    container.html(html);


    // Total update

    $('#cart-drawer-total').text(
      'Rs. ' + (cart.total_price / 100).toFixed(2)
    );

  }


  // =========================
  // OPEN DRAWER
  // =========================

  function openCartDrawer() {

    $('#cart-drawer').addClass('is-open');

  }


  // =========================
  // CLOSE DRAWER
  // =========================

  $(document).on('click', '[data-cart-close]', function () {

    $('#cart-drawer').removeClass('is-open');

  });


});