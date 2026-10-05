
  
  document.addEventListener("DOMContentLoaded", () => {

  const searchButton = document.querySelector("#header_search");
  const searchModal = document.querySelector("#searchModal");
  const searchInput = document.querySelector("#searchInput");
  const searchForm = document.querySelector("#searchForm");
  const searchResults = document.querySelector("#searchResults");
  const closeButtons = document.querySelectorAll("[data-search-close]");

  if (!searchButton || !searchModal || !searchInput) {
    return;
  }


  /* =========================
     OPEN SEARCH MODAL
  ========================= */

  searchButton.addEventListener("click", (event) => {

    event.preventDefault();

    searchModal.hidden = false;
    searchModal.setAttribute("aria-hidden", "false");

    searchInput.focus();

  });


  /* =========================
     CLOSE SEARCH MODAL
  ========================= */

  closeButtons.forEach((button) => {

    button.addEventListener("click", () => {

      searchModal.hidden = true;
      searchModal.setAttribute("aria-hidden", "true");

      searchInput.value = "";
      searchResults.innerHTML = "";

    });

  });


  /* =========================
     SEARCH
  ========================= */

  searchForm.addEventListener("submit", (event) => {

    event.preventDefault();

    searchProducts(searchInput.value.trim());

  });


  /* =========================
     LIVE SEARCH
  ========================= */

  searchInput.addEventListener("input", () => {

    const query = searchInput.value.trim();

    if (query.length < 2) {

      searchResults.innerHTML = `
        <div class="search-modal__empty">
          <p>Search for products</p>
        </div>
      `;

      return;

    }

    searchProducts(query);

  });


  /* =========================
     AJAX FUNCTION
  ========================= */

  async function searchProducts(query) {

    searchResults.innerHTML = `
      <div class="search-loading">
        Searching...
      </div>
    `;

    try {

      const url =
        window.Shopify.routes.root +
        "search/suggest.json?q=" +
        encodeURIComponent(query) +
        "&resources[type]=product" +
        "&resources[limit]=8";

      const response = await fetch(url, {
        headers: {
          "Accept": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Search request failed");
      }

      const data = await response.json();

      console.log("Search response:", data);

      const products =
        data.resources?.results?.products || [];

      renderProducts(products);

    } catch (error) {

      console.error("Search error:", error);

      searchResults.innerHTML = `
        <div class="search-no-results">
          <p>Something went wrong. Please try again.</p>
        </div>
      `;

    }

  }


  /* =========================
     DYNAMIC HTML
  ========================= */

  function renderProducts(products) {

    if (!products.length) {

      searchResults.innerHTML = `
        <div class="search-no-results">
          <p>No products found</p>
        </div>
      `;

      return;

    }


    searchResults.innerHTML = products.map((product) => {

      const image = product.image
        ? product.image
        : "";

      const price = product.price
        ? product.price
        : "";

      return `
        <a
          href="${product.url}"
          class="search-product"
        >

          ${
            image
              ? `
                <img
                  src="${image}"
                  alt="${escapeHTML(product.title)}"
                  class="search-product__image"
                  loading="lazy"
                  width="70"
                  height="70"
                >
              `
              : ""
          }

          <div class="search-product__info">

            <h3 class="search-product__title">
              ${escapeHTML(product.title)}
            </h3>

            <p class="search-product__price">
              ${price}
            </p>

          </div>

        </a>
      `;

    }).join("");

  }


  /* =========================
     ESCAPE HTML
  ========================= */

  function escapeHTML(value) {

    const div = document.createElement("div");

    div.textContent = value;

    return div.innerHTML;

  }


  /* =========================
     ESC KEY
  ========================= */

  document.addEventListener("keydown", (event) => {

    if (event.key === "Escape" && !searchModal.hidden) {

      searchModal.hidden = true;
      searchModal.setAttribute("aria-hidden", "true");

    }

  });

});
