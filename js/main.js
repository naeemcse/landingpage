/**
 * Egg Shop Landing Page - Interactive Script
 * Features:
 * - Dynamic Order Calculation
 * - Product Auto-Selection from Product Cards
 * - Quick Quantity Selection (+/- and Chips)
 * - Smooth Scrolling with Sticky Header Offset
 * - Flexible Redirection Hook (WhatsApp, Payment, or Checkout)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Product Catalog Configuration
  const PRODUCTS = {
    'desi-egg': {
      id: 'desi-egg',
      name: 'দেশি মুরগির ডিম',
      unitPrice: 220,
      unitLabel: 'ডজন (১২টি)',
      image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=300&q=80',
      badge: '১০০% খাঁটি দেশি'
    },
    'layer-egg': {
      id: 'layer-egg',
      name: 'ফার্মের লাল লেয়ার ডিম',
      unitPrice: 150,
      unitLabel: 'ডজন (১২টি)',
      image: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?auto=format&fit=crop&w=300&q=80',
      badge: 'জনপ্রিয় গ্রেড-এ'
    },
    'duck-egg': {
      id: 'duck-egg',
      name: 'তাজা দেশি হাঁসের ডিম',
      unitPrice: 210,
      unitLabel: 'ডজন (১২টি)',
      image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=300&q=80',
      badge: 'বড় সাইজ ও তাজা'
    },
    'live-duck': {
      id: 'live-duck',
      name: 'সুস্থ জীবিত দেশি হাঁস',
      unitPrice: 550,
      unitLabel: 'পিস (১.৩-১.৫ কেজি)',
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=300&q=80',
      badge: 'সুস্থ ও জীবন্ত'
    }
  };

  // Convert English numbers to Bangla digits
  const toBanglaDigits = (num) => {
    const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(num).replace(/[0-9]/g, (w) => banglaDigits[+w]);
  };

  // State Management
  let currentProduct = 'desi-egg';
  let currentQty = 1;
  let deliveryFee = 60; // Default Inside Dhaka

  // Elements
  const quantityInput = document.getElementById('orderQty');
  const qtyPlusBtn = document.getElementById('qtyPlusBtn');
  const qtyMinusBtn = document.getElementById('qtyMinusBtn');
  const qtyChips = document.querySelectorAll('.quick-qty-chip');
  const productRadios = document.querySelectorAll('input[name="selectedProduct"]');
  const deliveryRadios = document.querySelectorAll('input[name="deliveryArea"]');
  
  // Summary DOM Elements
  const summaryImg = document.getElementById('summaryImg');
  const summaryTitle = document.getElementById('summaryTitle');
  const summaryUnitPrice = document.getElementById('summaryUnitPrice');
  const summaryQty = document.getElementById('summaryQty');
  const summarySubtotal = document.getElementById('summarySubtotal');
  const summaryDelivery = document.getElementById('summaryDelivery');
  const summaryTotal = document.getElementById('summaryTotal');

  // Form Elements
  const orderForm = document.getElementById('orderForm');

  /**
   * Recalculate and update the order summary card in real-time
   */
  const updateOrderSummary = () => {
    const prod = PRODUCTS[currentProduct] || PRODUCTS['desi-egg'];
    const subtotal = prod.unitPrice * currentQty;
    const grandTotal = subtotal + deliveryFee;

    // Update visuals
    if (summaryImg) summaryImg.src = prod.image;
    if (summaryTitle) summaryTitle.textContent = prod.name;
    if (summaryUnitPrice) summaryUnitPrice.textContent = `৳ ${toBanglaDigits(prod.unitPrice)} / ${prod.unitLabel}`;
    if (summaryQty) summaryQty.textContent = `${toBanglaDigits(currentQty)} টি`;
    if (summarySubtotal) summarySubtotal.textContent = `৳ ${toBanglaDigits(subtotal)}`;
    if (summaryDelivery) summaryDelivery.textContent = `৳ ${toBanglaDigits(deliveryFee)}`;
    if (summaryTotal) summaryTotal.textContent = `৳ ${toBanglaDigits(grandTotal)}`;
  };

  // Product Selection Handlers
  productRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      currentProduct = e.target.value;
      updateOrderSummary();
    });
  });

  // Delivery Location Handlers
  deliveryRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      deliveryFee = parseInt(e.target.value, 10) || 60;
      updateOrderSummary();
    });
  });

  // Quantity Counter Actions
  if (qtyPlusBtn) {
    qtyPlusBtn.addEventListener('click', () => {
      currentQty++;
      if (quantityInput) quantityInput.value = currentQty;
      updateChipStates();
      updateOrderSummary();
    });
  }

  if (qtyMinusBtn) {
    qtyMinusBtn.addEventListener('click', () => {
      if (currentQty > 1) {
        currentQty--;
        if (quantityInput) quantityInput.value = currentQty;
        updateChipStates();
        updateOrderSummary();
      }
    });
  }

  // Quick Quantity Chips
  qtyChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const val = parseInt(chip.getAttribute('data-qty'), 10);
      if (val && val > 0) {
        currentQty = val;
        if (quantityInput) quantityInput.value = currentQty;
        updateChipStates();
        updateOrderSummary();
      }
    });
  });

  const updateChipStates = () => {
    qtyChips.forEach(chip => {
      const val = parseInt(chip.getAttribute('data-qty'), 10);
      if (val === currentQty) {
        chip.classList.add('active');
      } else {
        chip.classList.remove('active');
      }
    });
  };

  /**
   * Global trigger to select product from anywhere (e.g. from Product Grid "অর্ডার করুন" buttons)
   */
  window.selectProductAndScroll = (productId, qty = 1) => {
    if (PRODUCTS[productId]) {
      currentProduct = productId;
      currentQty = qty;
      if (quantityInput) quantityInput.value = currentQty;

      // Check radio button
      const targetRadio = document.querySelector(`input[name="selectedProduct"][value="${productId}"]`);
      if (targetRadio) {
        targetRadio.checked = true;
      }

      updateChipStates();
      updateOrderSummary();

      // Smooth scroll to order section
      const orderSection = document.getElementById('order-section');
      if (orderSection) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = orderSection.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  /**
   * Form Submission Handler
   */
  if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const customerName = document.getElementById('customerName').value.trim();
      const customerPhone = document.getElementById('customerPhone').value.trim();
      const customerAddress = document.getElementById('customerAddress').value.trim();
      const deliveryLocation = document.querySelector('input[name="deliveryArea"]:checked')?.dataset.label || 'ঢাকার ভিতরে';
      const notes = document.getElementById('customerNotes')?.value.trim() || 'কোনো বিশেষ নির্দেশনা নেই';

      // Basic validation
      if (!customerName || !customerPhone || !customerAddress) {
        alert('অনুগ্রহ করে নাম, মোবাইল নম্বর এবং সম্পূর্ণ ঠিকানা সঠিকভাবে পূরণ করুন।');
        return;
      }

      // Phone validation (Bangladesh 11 digits format)
      const bdPhoneRegex = /(^(\+8801|008801|01))[1|3-9]{1}(\d){8}$/;
      if (!bdPhoneRegex.test(customerPhone.replace(/[\s-]/g, ''))) {
        alert('অনুগ্রহ করে একটি সঠিক ১১ ডিজিটের বাংলাদেশী মোবাইল নম্বর দিন (যেমন: 017xxxxxxxx)');
        return;
      }

      const prod = PRODUCTS[currentProduct];
      const subtotal = prod.unitPrice * currentQty;
      const grandTotal = subtotal + deliveryFee;

      // Populate Success Modal Data
      const modalProdName = document.getElementById('modalOrderProduct');
      const modalQty = document.getElementById('modalOrderQty');
      const modalTotal = document.getElementById('modalOrderTotal');
      const modalPhone = document.getElementById('modalOrderPhone');

      if (modalProdName) modalProdName.textContent = prod.name;
      if (modalQty) modalQty.textContent = `${toBanglaDigits(currentQty)} (${prod.unitLabel})`;
      if (modalTotal) modalTotal.textContent = `৳ ${toBanglaDigits(grandTotal)}`;
      if (modalPhone) modalPhone.textContent = customerPhone;

      // Show Bootstrap Modal
      const successModal = new bootstrap.Modal(document.getElementById('orderSuccessModal'));
      successModal.show();

      // Log order payload for developer
      const orderPayload = {
        name: customerName,
        phone: customerPhone,
        address: customerAddress,
        deliveryLocation: deliveryLocation,
        product: prod.name,
        quantity: currentQty,
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        total: grandTotal,
        notes: notes,
        timestamp: new Date().toISOString()
      };
      console.log('Order Submitted Successfully:', orderPayload);

      /* =====================================================================
         FUTURE PURCHASE REDIRECTION CONFIGURATION:
         Uncomment or customize either of these when you are ready to redirect!
         ===================================================================== */
      
      // OPTION A: WhatsApp Direct Order Link (pre-formatted message)
      const whatsappBtn = document.getElementById('modalWhatsAppBtn');
      if (whatsappBtn) {
        const waMessage = encodeURIComponent(
          `নতুন ডিমের অর্ডার!\n` +
          `----------------------\n` +
          `নাম: ${customerName}\n` +
          `মোবাইল: ${customerPhone}\n` +
          `পণ্য: ${prod.name} (${currentQty} টি)\n` +
          `মোট প্রদেয়: ৳${grandTotal}\n` +
          `ঠিকানা: ${customerAddress}\n` +
          `ডেলিভারি এলাকা: ${deliveryLocation}\n` +
          `নোট: ${notes}`
        );
        // Replace with your real WhatsApp business number (e.g., 8801700000000)
        whatsappBtn.href = `https://wa.me/8801700000000?text=${waMessage}`;
      }

      // OPTION B: Redirect to an external checkout or payment gateway after a short delay:
      /*
      setTimeout(() => {
        // window.location.href = `https://your-checkout-page.com/pay?amount=${grandTotal}&orderId=...`;
      }, 3000);
      */

      // Reset form on complete
      orderForm.reset();
      currentQty = 1;
      if (quantityInput) quantityInput.value = 1;
      updateChipStates();
      updateOrderSummary();
    });
  }

  // Navbar Sticky Scroll Effect & Back to Top Button
  const navbar = document.querySelector('.navbar-custom');
  const scrollTopBtn = document.getElementById('scrollTopBtn');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar?.classList.add('scrolled');
      scrollTopBtn?.classList.add('show');
    } else {
      navbar?.classList.remove('scrolled');
      scrollTopBtn?.classList.remove('show');
    }
  });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Initialize summary on first load
  updateOrderSummary();
});
