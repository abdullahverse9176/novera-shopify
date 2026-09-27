$(document).on('submit', '#product-form', function (event) {

  event.preventDefault();

  console.log('Add to Cart form submit hua');

  var form = $(this);

  $.ajax({
    type: 'POST',
    url: window.Shopify.routes.root + 'cart/add.js',
    data: form.serialize(),
    dataType: 'json',

    success: function (response) {

      console.log('Product successfully added:', response);

      $('#cart-drawer').addClass('is-open');

    },

    error: function (error) {

      console.log('Add to cart error:', error);

    }

  });

});