{{ 'cart-drawer.js' | asset_url | script_tag }}

$(document).ready(function () {

  var $drawer = $('#cart-drawer');

  if (!$drawer.length) {
    return;
  }


  // Drawer open
  function openCartDrawer() {
    $drawer.addClass('is-open');
  }


  // Drawer close
  function closeCartDrawer() {
    $drawer.removeClass('is-open');
  }


  // Close button / overlay
  $(document).on('click', '[data-cart-close]', function () {
    closeCartDrawer();
  });


  // Add to Cart
  $(document).on('submit', '#product-form', function (event) {

    event.preventDefault();

    var $form = $(this);

    $.ajax({

      type: 'POST',

      url: window.Shopify.routes.root + 'cart/add.js',

      data: $form.serialize(),

      dataType: 'json',

      success: function (response) {

        console.log('Product cart mein add ho gaya');

        // Cart ki latest information lao
        $.ajax({

          type: 'GET',

          url: window.Shopify.routes.root + 'cart.js',

          dataType: 'json',

          success: function (cart) {

            updateCartDrawer(cart);

            openCartDrawer();

          },

          error: function (error) {

            console.log('Cart data nahi mili:', error);

          }

        });

      },

      error: function (error) {

        console.log('Product cart mein add nahi hua:', error);

      }

    });

  });


  // Cart Drawer update
  function updateCartDrawer(cart) {

    var $container = $('#cart-drawer-items');

    if (!$container.length) {
      return;
    }


    // Cart empty hai
    if (cart.item_count === 0) {

      $container.html(
        '<p>Cart khali hai.</p>'
      );

      return;
    }


    var html = '';


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
              ${formatMoney(item.final_line_price)}
            </p>

            <p>
              Quantity: ${item.quantity}
            </p>

          </div>

        </div>

      `;

    });


    $container.html(html);

  }


  // Price ko Shopify format mein dikhana
  function formatMoney(price) {

    return 'Rs. ' + (price / 100).toFixed(2);

  }

});