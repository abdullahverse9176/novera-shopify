/**
 * Shopify OS 2.0 Product Variant Picker & Interactive Handlers
 * Handles variant switching, price updates, image changes, availability, and URL updates
 */

(function () {
  'use strict';

  function initVariantPickers() {
    const pickers = document.querySelectorAll('variant-picker');
    if (!pickers.length) return;

    pickers.forEach((picker) => {
      const sectionId = picker.dataset.section;
      const variantsDataEl = document.getElementById(`ProductVariants-${sectionId}`);
      if (!variantsDataEl) return;

      let variants = [];
      try {
        variants = JSON.parse(variantsDataEl.textContent);
      } catch (err) {
        console.error('Failed to parse product variants JSON:', err);
        return;
      }

      // Detect currency format from current price container if available
      const priceContainer = document.getElementById(`PriceCurrent-${sectionId}`);
      let currencyPrefix = '';
      let currencySuffix = '';
      if (priceContainer) {
        const text = priceContainer.textContent.trim();
        const match = text.match(/^([^\d.,\s]+)?\s*[\d.,]+\s*([^\d.,\s]+)?$/);
        if (match) {
          currencyPrefix = match[1] ? match[1] + ' ' : '';
          currencySuffix = match[2] ? ' ' + match[2] : '';
        }
      }

      function formatMoney(cents) {
        if (window.Shopify && typeof window.Shopify.formatMoney === 'function') {
          return window.Shopify.formatMoney(cents);
        }
        const amount = (cents / 100).toFixed(2);
        return `${currencyPrefix}${amount}${currencySuffix}`.trim();
      }

      function getSelectedOptions() {
        const selected = [];
        // Handle radio buttons (pills)
        const fieldsets = picker.querySelectorAll('.product-option');
        fieldsets.forEach((fieldset) => {
          const checkedRadio = fieldset.querySelector('input[type="radio"]:checked');
          const select = fieldset.querySelector('select');
          if (checkedRadio) {
            selected.push(checkedRadio.value);
          } else if (select) {
            selected.push(select.value);
          }
        });
        return selected;
      }

      function updateVariant() {
        const selectedOptions = getSelectedOptions();

        // Find matching variant
        const currentVariant = variants.find((variant) => {
          return variant.options.every((optValue, index) => {
            return optValue === selectedOptions[index];
          });
        });

        // 1. Update Option Label Display (e.g., Color: Red)
        selectedOptions.forEach((val, idx) => {
          const labelVal = picker.querySelector(`[data-header-option-val="${idx}"]`);
          if (labelVal) {
            labelVal.textContent = val;
          }
        });

        // 2. Form Input Update
        const hiddenInput = document.getElementById(`SelectedVariantId-${sectionId}`);
        const addToCartBtn = document.getElementById(`AddToCart-${sectionId}`);
        const addToCartText = document.getElementById(`AddToCartText-${sectionId}`);
        const priceCurrent = document.getElementById(`PriceCurrent-${sectionId}`);
        const priceCompare = document.getElementById(`PriceCompare-${sectionId}`);
        const saleBadge = document.getElementById(`SaleBadge-${sectionId}`);

        if (!currentVariant) {
          // Variant combination doesn't exist
          if (addToCartBtn && addToCartText) {
            addToCartBtn.disabled = true;
            addToCartText.textContent = 'Unavailable';
          }
          return;
        }

        // Set hidden variant id
        if (hiddenInput) {
          hiddenInput.value = currentVariant.id;
          hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
        }

        // 3. Update Price
        if (priceCurrent) {
          priceCurrent.innerHTML = formatMoney(currentVariant.price);
        }
        if (priceCompare) {
          if (currentVariant.compare_at_price && currentVariant.compare_at_price > currentVariant.price) {
            priceCompare.innerHTML = formatMoney(currentVariant.compare_at_price);
            priceCompare.style.display = 'inline';
            if (saleBadge) saleBadge.style.display = 'inline-block';
          } else {
            priceCompare.style.display = 'none';
            if (saleBadge) saleBadge.style.display = 'none';
          }
        }

        // 4. Update Button State (Available vs Sold Out)
        if (addToCartBtn && addToCartText) {
          if (currentVariant.available) {
            addToCartBtn.disabled = false;
            addToCartText.textContent = 'Add to Cart';
          } else {
            addToCartBtn.disabled = true;
            addToCartText.textContent = 'Sold Out';
          }
        }

        // 5. Update Main Featured Image if variant has an image
        if (currentVariant.featured_image && currentVariant.featured_image.src) {
          const featuredImg = document.getElementById(`ProductFeaturedImage-${sectionId}`) || document.querySelector(`#ProductMedia-${sectionId} img`);
          if (featuredImg) {
            featuredImg.src = currentVariant.featured_image.src;
            if (currentVariant.featured_image.alt) {
              featuredImg.alt = currentVariant.featured_image.alt;
            }
          }
        }

        // 6. Update URL query parameter without page reload
        if (window.history.replaceState) {
          const newUrl = new URL(window.location.href);
          newUrl.searchParams.set('variant', currentVariant.id);
          window.history.replaceState({ path: newUrl.href }, '', newUrl.href);
        }
      }

      // Listen for changes
      picker.addEventListener('change', updateVariant);
    });
  }

  // Handle Quantity Increment / Decrement Buttons
  function initQuantitySelectors() {
    document.addEventListener('click', function (e) {
      const btn = e.target.closest('[data-quantity-change]');
      if (!btn) return;

      const change = parseInt(btn.dataset.quantityChange, 10);
      const container = btn.closest('.quantity-selector');
      if (!container) return;

      const input = container.querySelector('.quantity-input');
      if (!input) return;

      const currentVal = parseInt(input.value, 10) || 1;
      const minVal = parseInt(input.getAttribute('min'), 10) || 1;
      const newVal = Math.max(minVal, currentVal + change);

      input.value = newVal;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initVariantPickers();
    initQuantitySelectors();
  });
})();
