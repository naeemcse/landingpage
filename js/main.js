/**
 * Egg Shop Landing Page - Interactive Script
 * Features:
 * - Dynamic Site Config via data/site-config.json
 * - Dynamic Product Catalog via data/products.json
 * - Real-Time Dynamic Order Calculation
 * - Product Auto-Selection from Product Cards & Footer Links
 * - Quick Quantity Selection (+/- and Chips)
 * - Smooth Scrolling with Sticky Header Offset
 * - WhatsApp Order Confirmation & Floating Chat
 * - Robust Fallback & SEO Structured Data Sync
 */

document.addEventListener('DOMContentLoaded', () => {
  // Convert English numbers to Bangla digits
  const toBanglaDigits = (num) => {
    const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(num).replace(/[0-9]/g, (w) => banglaDigits[+w]);
  };

  // Fallback Site Configuration (used if JSON fetch fails)
  const DEFAULT_CONFIG = {
    brand: {
      name: "ডিম বাড়ি",
      tagline: "খামার ফ্রেশ এগ্রো",
      description: "১০০% অর্গানিক ও প্রাকৃতিক উপায়ে উৎপাদিত তাজা ডিম এবং সুস্থ-সবল হাঁস সরাসরি আপনার পরিবারে পৌঁছে দেওয়াই আমাদের অঙ্গীকার।",
      copyright: "© ২০২৬ ডিম বাড়ি এগ্রো। সর্বস্বত্ব সংরক্ষিত।",
      credit: "ডিজাইন ও ডেভেলপমেন্ট: আধুনিক হাই-কনভার্সন ল্যান্ডিং পেজ"
    },
    contact: {
      phone: "01700000000",
      phoneDisplay: "০১৭০০-০০০০০০",
      supportHours: "সকাল ৮টা - রাত ১০টা",
      whatsappNumber: "8801700000000",
      whatsappDefaultMessage: "আমি ডিম বা হাঁস অর্ডার করতে চাই",
      email: "order@dimbari.com",
      farmAddress: "ডেমরা রোড, মাতুয়াইল, ঢাকা-১৩৬২",
      deliveryHours: "প্রতিদিন সকাল ৯টা থেকে সন্ধ্যা ৮টা"
    },
    notices: {
      topNotice1: "ঢাকা সিটিতে দ্রুততম হোম ডেলিভারি সুবিধা!",
      topNotice2: "১০০% প্রাকৃতিক খাবার ও ভাঙা ডিমের ফ্রি রিপ্লেসমেন্ট"
    },
    deliveryCharges: {
      insideDhaka: 60,
      outsideDhaka: 120
    },
    socialLinks: {
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      youtube: "https://youtube.com",
      whatsapp: "https://wa.me/8801700000000"
    }
  };

  // Fallback Product Catalog
  const DEFAULT_PRODUCTS = [
    {
      id: 'desi-egg',
      name: 'দেশি মুরগির ডিম',
      category: 'অর্গানিক দেশি',
      badge: '১০০% অর্গানিক',
      badgeClass: 'badge-organic',
      stockStatus: 'স্টকে আছে',
      image: './assets/images/deshi_dim.jpeg',
      alt: 'দেশি মুরগির ডিম',
      description: 'উন্মুক্ত চারণভূমিতে প্রাকৃতিক ঘাস ও পোকা-মাকড় খাওয়া দেশি মুরগির গাঢ় হলুদ কুসুমযুক্ত খাঁটি ডিম।',
      features: [
        'গাঢ় লালচে/হলুদ কুসুম',
        'উচ্চমাত্রার ওমেগা-৩ ও প্রোটিন',
        'শিশুদের জন্য পরম উপকারী'
      ],
      priceLabel: 'প্রতি ডজন (১২টি)',
      unitPrice: 220,
      unitLabel: 'ডজন (১২টি)',
      shortPriceLabel: '৳ ২২০ / ডজন',
      isDefault: true
    },
    {
      id: 'layer-egg',
      name: 'ফার্মের লাল লেয়ার ডিম',
      category: 'প্রিমিয়াম লেয়ার',
      badge: 'সেরা বিক্রয়',
      badgeClass: 'badge-popular',
      stockStatus: 'স্টকে আছে',
      image: './assets/images/poultry_egg_00.jpg',
      alt: 'ফার্মের লাল লেয়ার ডিম',
      description: 'আধুনিক স্বাস্থ্যসম্মত শেডে নিয়ন্ত্রিত পুষ্টিকর ফিড খাওয়া মুরগির বাছাইকৃত বড় সাইজের লাল ডিম।',
      features: [
        'এ-গ্রেড বড় সাইজ',
        'প্রতিদিনের নাস্তায় সাশ্রয়ী',
        'সম্পূর্ণ পরিষ্কার ও জীবাণুমুক্ত'
      ],
      priceLabel: 'প্রতি ডজন (১২টি)',
      unitPrice: 150,
      unitLabel: 'ডজন (১২টি)',
      shortPriceLabel: '৳ ১৫০ / ডজন',
      isDefault: false
    },
    {
      id: 'duck-egg',
      name: 'তাজা দেশি হাঁসের ডিম',
      category: 'হাওরের হাঁসের ডিম',
      badge: 'পুষ্টিগুণে সেরা',
      badgeClass: 'badge-fresh',
      stockStatus: 'স্টকে আছে',
      image: './assets/images/haser_dim01.webp',
      alt: 'তাজা দেশি হাঁসের ডিম',
      description: 'হাওর ও বিলের প্রাকৃতিক শামুক-ঝিনুক খাওয়া দেশি হাঁসের বড় আকারের তাজা ও ঘন কুসুমের ডিম।',
      features: [
        'প্রচুর আয়রন ও ভিটামিন বি-১২',
        'ঘন ও ক্রিমি কুসুমের স্বাদ',
        'বেকিং ও হালুয়ায় অতুলনীয়'
      ],
      priceLabel: 'প্রতি ডজন (১২টি)',
      unitPrice: 210,
      unitLabel: 'ডজন (১২টি)',
      shortPriceLabel: '৳ ২১০ / ডজন',
      isDefault: false
    },
    {
      id: 'live-duck',
      name: 'সুস্থ জীবিত খাঁটি হাঁস',
      category: 'জীবন্ত হাঁস',
      badge: 'জীবিত ও সুস্থ',
      badgeClass: 'badge-organic',
      stockStatus: 'সীমিত স্টক',
      image: './assets/images/haser_dim_00.jpg',
      alt: 'সুস্থ জীবিত দেশি হাঁস',
      description: 'খামারে দেশীয় পদ্ধতিতে লালিত সুস্থ-সবল তাজা জীবন্ত হাঁস। স্পেশাল খাবারের স্বাদ ও ঘরোয়া অনুষ্ঠানের জন্য সেরা।',
      features: [
        'ওজন: ১.৩ - ১.৫ কেজি আনুমানিক',
        'সম্পূর্ণ রোগমুক্ত ও অ্যাক্টিভ',
        'নিরাপদ ঝুড়িতে হোম ডেলিভারি'
      ],
      priceLabel: 'প্রতি পিস (আনুমানিক)',
      unitPrice: 550,
      unitLabel: 'পিস (১.৩-১.৫ কেজি)',
      shortPriceLabel: '৳ ৫৫০ / পিস',
      isDefault: false
    }
  ];

  // Active State
  let siteConfig = { ...DEFAULT_CONFIG };
  let productsList = [...DEFAULT_PRODUCTS];
  let PRODUCTS = {};
  DEFAULT_PRODUCTS.forEach(p => { PRODUCTS[p.id] = p; });

  let currentProduct = 'desi-egg';
  let currentQty = 1;
  let deliveryFee = 60; // Default Inside Dhaka

  // DOM Elements
  const quantityInput = document.getElementById('orderQty');
  const qtyPlusBtn = document.getElementById('qtyPlusBtn');
  const qtyMinusBtn = document.getElementById('qtyMinusBtn');
  const qtyChips = document.querySelectorAll('.quick-qty-chip');
  const orderForm = document.getElementById('orderForm');

  // Summary DOM Elements
  const summaryImg = document.getElementById('summaryImg');
  const summaryTitle = document.getElementById('summaryTitle');
  const summaryUnitPrice = document.getElementById('summaryUnitPrice');
  const summaryQty = document.getElementById('summaryQty');
  const summarySubtotal = document.getElementById('summarySubtotal');
  const summaryDelivery = document.getElementById('summaryDelivery');
  const summaryTotal = document.getElementById('summaryTotal');

  /**
   * Recalculate and update the live order summary card
   */
  const updateOrderSummary = () => {
    const prod = PRODUCTS[currentProduct] || Object.values(PRODUCTS)[0] || DEFAULT_PRODUCTS[0];
    if (!prod) return;

    const subtotal = prod.unitPrice * currentQty;
    const grandTotal = subtotal + deliveryFee;

    if (summaryImg) {
      summaryImg.src = prod.image;
      summaryImg.alt = prod.name;
    }
    if (summaryTitle) summaryTitle.textContent = prod.name;
    if (summaryUnitPrice) summaryUnitPrice.textContent = `৳ ${toBanglaDigits(prod.unitPrice)} / ${prod.unitLabel}`;
    if (summaryQty) summaryQty.textContent = `${toBanglaDigits(currentQty)} টি`;
    if (summarySubtotal) summarySubtotal.textContent = `৳ ${toBanglaDigits(subtotal)}`;
    if (summaryDelivery) summaryDelivery.textContent = `৳ ${toBanglaDigits(deliveryFee)}`;
    if (summaryTotal) summaryTotal.textContent = `৳ ${toBanglaDigits(grandTotal)}`;
  };

  /**
   * Render Site Configuration into DOM
   */
  const renderSiteConfig = (config) => {
    if (!config) return;

    // Top Notice Bar
    if (config.notices) {
      const notice1El = document.getElementById('topNotice1');
      if (notice1El && config.notices.topNotice1) {
        notice1El.innerHTML = `<i class="bi bi-truck me-1"></i> ${config.notices.topNotice1}`;
      }
      const notice2El = document.getElementById('topNotice2');
      if (notice2El && config.notices.topNotice2) {
        notice2El.innerHTML = `<i class="bi bi-shield-check me-1"></i> ${config.notices.topNotice2}`;
      }
    }

    // Phone / Helpline
    if (config.contact) {
      const topPhoneLink = document.getElementById('topPhoneLink');
      const topPhoneDisplay = document.getElementById('topPhoneDisplay');
      if (topPhoneLink && config.contact.phone) {
        topPhoneLink.href = `tel:${config.contact.phone}`;
      }
      if (topPhoneDisplay && config.contact.phoneDisplay) {
        topPhoneDisplay.textContent = config.contact.phoneDisplay;
      }

      // Footer Contact Info
      const footerFarmAddress = document.getElementById('footerFarmAddress');
      if (footerFarmAddress && config.contact.farmAddress) {
        footerFarmAddress.textContent = `খামার: ${config.contact.farmAddress}`;
      }

      const footerPhoneLink = document.getElementById('footerPhoneLink');
      const footerPhoneDisplay = document.getElementById('footerPhoneDisplay');
      if (footerPhoneLink && config.contact.phone) {
        footerPhoneLink.href = `tel:${config.contact.phone}`;
      }
      if (footerPhoneDisplay && config.contact.phoneDisplay) {
        footerPhoneDisplay.textContent = config.contact.phoneDisplay;
      }

      const footerSupportHours = document.getElementById('footerSupportHours');
      if (footerSupportHours && config.contact.supportHours) {
        footerSupportHours.textContent = `(${config.contact.supportHours})`;
      }

      const footerEmail = document.getElementById('footerEmail');
      const footerEmailLink = document.getElementById('footerEmailLink');
      if (footerEmail && config.contact.email) {
        footerEmail.textContent = config.contact.email;
      }
      if (footerEmailLink && config.contact.email) {
        footerEmailLink.href = `mailto:${config.contact.email}`;
      }

      const footerDeliveryHours = document.getElementById('footerDeliveryHours');
      if (footerDeliveryHours && config.contact.deliveryHours) {
        footerDeliveryHours.textContent = `ডেলিভারি সময়: ${config.contact.deliveryHours}`;
      }

      // Floating WhatsApp Button
      const floatingWhatsAppBtn = document.getElementById('floatingWhatsAppBtn');
      if (floatingWhatsAppBtn && config.contact.whatsappNumber) {
        const defaultMsg = encodeURIComponent(config.contact.whatsappDefaultMessage || 'আমি ডিম বা হাঁস অর্ডার করতে চাই');
        floatingWhatsAppBtn.href = `https://wa.me/${config.contact.whatsappNumber}?text=${defaultMsg}`;
      }
    }

    // Delivery Charges
    if (config.deliveryCharges) {
      const insideRadio = document.getElementById('deliveryInsideRadio');
      const insideLabel = document.getElementById('deliveryInsideLabel');
      if (insideRadio && config.deliveryCharges.insideDhaka) {
        insideRadio.value = config.deliveryCharges.insideDhaka;
        if (insideRadio.checked) deliveryFee = parseInt(config.deliveryCharges.insideDhaka, 10);
      }
      if (insideLabel && config.deliveryCharges.insideDhaka) {
        insideLabel.textContent = `ঢাকার ভিতরে (৳${toBanglaDigits(config.deliveryCharges.insideDhaka)})`;
      }

      const outsideRadio = document.getElementById('deliveryOutsideRadio');
      const outsideLabel = document.getElementById('deliveryOutsideLabel');
      if (outsideRadio && config.deliveryCharges.outsideDhaka) {
        outsideRadio.value = config.deliveryCharges.outsideDhaka;
        if (outsideRadio.checked) deliveryFee = parseInt(config.deliveryCharges.outsideDhaka, 10);
      }
      if (outsideLabel && config.deliveryCharges.outsideDhaka) {
        outsideLabel.textContent = `ঢাকার বাইরে / জেলা শহর (৳${toBanglaDigits(config.deliveryCharges.outsideDhaka)})`;
      }
    }

    // Social Links
    if (config.socialLinks) {
      const fb = document.getElementById('footerSocialFacebook');
      if (fb && config.socialLinks.facebook) fb.href = config.socialLinks.facebook;

      const ig = document.getElementById('footerSocialInstagram');
      if (ig && config.socialLinks.instagram) ig.href = config.socialLinks.instagram;

      const yt = document.getElementById('footerSocialYouTube');
      if (yt && config.socialLinks.youtube) yt.href = config.socialLinks.youtube;

      const wa = document.getElementById('footerSocialWhatsApp');
      if (wa && config.socialLinks.whatsapp) wa.href = config.socialLinks.whatsapp;
    }

    // Brand & Copyright
    if (config.brand) {
      const cp = document.getElementById('footerCopyright');
      if (cp && config.brand.copyright) cp.innerHTML = config.brand.copyright;

      const cr = document.getElementById('footerCredit');
      if (cr && config.brand.credit) cr.textContent = config.brand.credit;
    }

    // SEO Organization Schema Update
    const orgSchemaScript = document.getElementById('seoOrganizationSchema');
    if (orgSchemaScript && config.brand && config.contact) {
      try {
        const orgData = {
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": config.brand.name || "ডিম বাড়ি",
          "description": config.brand.description || "খামারের খাঁটি দেশি মুরগির ডিম, লেয়ার ডিম, হাঁসের ডিম ও সুস্থ জীবিত হাঁস পাইকারি ও খুচরা মূল্যে হোম ডেলিভারি।",
          "telephone": config.contact.phone || "01700000000",
          "email": config.contact.email || "order@dimbari.com",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": config.contact.farmAddress || "ডেমরা রোড, মাতুয়াইল",
            "addressLocality": "ঢাকা",
            "postalCode": "1362",
            "addressCountry": "BD"
          },
          "openingHours": "Mo-Su 08:00-22:00",
          "priceRange": "৳৳"
        };
        orgSchemaScript.textContent = JSON.stringify(orgData, null, 2);
      } catch (err) {
        console.warn('Could not update SEO Org Schema:', err);
      }
    }
  };

  /**
   * Bind event listeners to product radio buttons
   */
  const bindProductRadioEvents = () => {
    const radios = document.querySelectorAll('input[name="selectedProduct"]');
    radios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        currentProduct = e.target.value;
        updateOrderSummary();
      });
    });
  };

  /**
   * Render Product Catalog into:
   * 1. Product Showcase Grid (#productsGrid)
   * 2. Order Form Radio Options (#productRadioGrid)
   * 3. Footer Links (#footerProductLinks)
   * 4. SEO Product Schema (#seoProductsSchema)
   */
  const renderProducts = (products) => {
    if (!Array.isArray(products) || products.length === 0) return;

    // Refresh PRODUCTS map
    PRODUCTS = {};
    products.forEach(p => {
      PRODUCTS[p.id] = p;
    });

    // Ensure valid currentProduct
    if (!PRODUCTS[currentProduct]) {
      const defaultProd = products.find(p => p.isDefault) || products[0];
      currentProduct = defaultProd.id;
    }

    // 1. Render Product Cards Grid
    const productsGrid = document.getElementById('productsGrid');
    if (productsGrid) {
      productsGrid.innerHTML = products.map(prod => `
        <div class="col-md-6 col-lg-3">
          <div class="product-card">
            <span class="product-badge ${prod.badgeClass || 'badge-organic'}">${prod.badge || 'খামার ফ্রেশ'}</span>
            <div class="product-img-wrap">
              <img src="${prod.image}" alt="${prod.alt || prod.name}" loading="lazy">
              <span class="product-stock"><i class="bi bi-check2-circle text-success me-1"></i>${prod.stockStatus || 'স্টকে আছে'}</span>
            </div>
            <div class="product-body">
              <span class="product-category">${prod.category || 'খামার পণ্য'}</span>
              <h3 class="product-title">${prod.name}</h3>
              <p class="product-desc">${prod.description || ''}</p>

              <ul class="product-features-list">
                ${(prod.features || []).map(feat => `<li><i class="bi bi-check-circle-fill"></i> ${feat}</li>`).join('')}
              </ul>

              <div class="product-footer">
                <div class="product-price-box">
                  <span class="price-label">${prod.priceLabel || 'প্রতি ডজন (১২টি)'}</span>
                  <span class="price-value">৳ ${toBanglaDigits(prod.unitPrice)}</span>
                </div>
                <button type="button" class="btn btn-order-select" onclick="selectProductAndScroll('${prod.id}')">
                  অর্ডার করুন <i class="bi bi-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      `).join('');
    }

    // 2. Render Order Form Radio Grid
    const productRadioGrid = document.getElementById('productRadioGrid');
    if (productRadioGrid) {
      productRadioGrid.innerHTML = products.map((prod, index) => {
        const isChecked = prod.id === currentProduct || (!PRODUCTS[currentProduct] && index === 0);
        return `
          <label class="product-radio-item">
            <input type="radio" name="selectedProduct" value="${prod.id}" ${isChecked ? 'checked' : ''}>
            <div class="product-radio-card">
              <img src="${prod.image}" class="radio-img" alt="${prod.alt || prod.name}">
              <div class="radio-details">
                <p class="radio-title">${prod.name}</p>
                <p class="radio-price">${prod.shortPriceLabel || `৳ ${toBanglaDigits(prod.unitPrice)} / ${prod.unitLabel || 'ডজন'}`}</p>
              </div>
            </div>
          </label>
        `;
      }).join('');

      bindProductRadioEvents();
    }

    // 3. Render Footer Links
    const footerProductLinks = document.getElementById('footerProductLinks');
    if (footerProductLinks) {
      footerProductLinks.innerHTML = products.map(prod => `
        <li><a href="#order-section" onclick="selectProductAndScroll('${prod.id}')">${prod.name}</a></li>
      `).join('');
    }

    // 4. Update SEO Product Schema
    const productsSchemaScript = document.getElementById('seoProductsSchema');
    if (productsSchemaScript) {
      try {
        const schemaData = {
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": "খামারের তাজা পণ্য তালিকা",
          "itemListElement": products.map((prod, idx) => ({
            "@type": "ListItem",
            "position": idx + 1,
            "item": {
              "@type": "Product",
              "name": prod.name,
              "image": prod.image,
              "description": prod.description,
              "offers": {
                "@type": "Offer",
                "price": String(prod.unitPrice),
                "priceCurrency": "BDT",
                "availability": prod.stockStatus && prod.stockStatus.includes('স্টক') ? "https://schema.org/InStock" : "https://schema.org/LimitedAvailability"
              }
            }
          }))
        };
        productsSchemaScript.textContent = JSON.stringify(schemaData, null, 2);
      } catch (err) {
        console.warn('Could not update SEO Product Schema:', err);
      }
    }

    // Refresh live summary
    updateOrderSummary();
  };

  /**
   * Load JSON Data Asynchronously with Cache-Busting
   */
  const loadData = async () => {
    // 1. Fetch site configuration
    try {
      const configRes = await fetch(`./data/site-config.json?v=${Date.now()}`, { cache: 'no-cache' });
      if (configRes.ok) {
        const configData = await configRes.json();
        siteConfig = { ...DEFAULT_CONFIG, ...configData };
        renderSiteConfig(siteConfig);
      } else {
        renderSiteConfig(DEFAULT_CONFIG);
      }
    } catch (err) {
      console.warn('Site config JSON fetch error, using defaults:', err.message);
      renderSiteConfig(DEFAULT_CONFIG);
    }

    // 2. Fetch products catalog
    try {
      const prodRes = await fetch(`./data/products.json?v=${Date.now()}`, { cache: 'no-cache' });
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        if (Array.isArray(prodData) && prodData.length > 0) {
          productsList = prodData;
          renderProducts(productsList);
        } else {
          renderProducts(DEFAULT_PRODUCTS);
        }
      } else {
        renderProducts(DEFAULT_PRODUCTS);
      }
    } catch (err) {
      console.warn('Products JSON fetch error, using defaults:', err.message);
      renderProducts(DEFAULT_PRODUCTS);
    }
  };

  // Delivery Location Radios
  const deliveryRadios = document.querySelectorAll('input[name="deliveryArea"]');
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

      const prod = PRODUCTS[currentProduct] || Object.values(PRODUCTS)[0];
      const subtotal = prod.unitPrice * currentQty;
      const grandTotal = subtotal + deliveryFee;

      // Populate Success Modal Data
      const modalProdName = document.getElementById('modalOrderProduct');
      const modalQty = document.getElementById('modalOrderQty');
      const modalTotal = document.getElementById('modalOrderTotal');
      const modalPhone = document.getElementById('modalOrderPhone');

      if (modalProdName) modalProdName.textContent = prod.name;
      if (modalQty) modalQty.textContent = `${toBanglaDigits(currentQty)} (${prod.unitLabel || 'টি'})`;
      if (modalTotal) modalTotal.textContent = `৳ ${toBanglaDigits(grandTotal)}`;
      if (modalPhone) modalPhone.textContent = customerPhone;

      // WhatsApp Direct Order Link (pre-formatted message)
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
        const waNumber = siteConfig.contact?.whatsappNumber || '8801700000000';
        whatsappBtn.href = `https://wa.me/${waNumber}?text=${waMessage}`;
      }

      // Show Bootstrap Modal
      const modalEl = document.getElementById('orderSuccessModal');
      if (modalEl && typeof bootstrap !== 'undefined') {
        const successModal = new bootstrap.Modal(modalEl);
        successModal.show();
      }

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

  // Initialize Hero Swiper Slider
  if (typeof Swiper !== 'undefined') {
    new Swiper('.hero-swiper', {
      loop: true,
      speed: 700,
      effect: 'fade',
      fadeEffect: {
        crossFade: true
      },
      grabCursor: true,
      autoplay: {
        delay: 3500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      },
      pagination: {
        el: '.hero-swiper-pagination',
        clickable: true,
        dynamicBullets: true
      },
      navigation: {
        nextEl: '.hero-swiper-next',
        prevEl: '.hero-swiper-prev'
      },
      keyboard: {
        enabled: true,
        onlyInViewport: true
      }
    });
  }

  // Bind initial radio events and update summary
  bindProductRadioEvents();
  updateOrderSummary();

  // Load JSON Data (site-config.json and products.json)
  loadData();
});
