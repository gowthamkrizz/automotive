/**
 * CarLink - Premium Vehicle Listings & Showroom Interactive Script
 * Handles Search, Multi-parameter Filters, Sorting, Comparison Matrix & Safe Animations
 */

document.addEventListener('DOMContentLoaded', () => {
  // Safe dismiss preloader
  const loader = document.getElementById('pageLoader');
  if (loader) {
    loader.classList.add('loaded');
  }

  // Initialize AOS (Animate On Scroll)
  if (typeof AOS !== 'undefined') {
    AOS.init({
      once: true,
      duration: 800,
      offset: 50,
      easing: 'ease-out-cubic'
    });
  }

  // Motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Vehicle Dataset
  const vehiclesData = [
    {
      id: 'car-1',
      brand: 'Audi',
      model: 'RS e-tron GT Quattro',
      category: 'electric',
      bodyType: 'sedan',
      year: 2024,
      mileage: 3200,
      price: 142400,
      monthly: 1290,
      fuel: 'Electric',
      transmission: '2-Speed Auto',
      engine: 'Dual Synchronous Motors',
      hp: 637,
      accel: '3.1 sec',
      safety: '5 Star NHTSA',
      image: 'assets/images/slider1-1.webp',
      badge: 'FEATURED',
      badgeType: 'badge-featured-gold',
      features: ['Carbon Roof', 'Matrix LED Headlights', 'Ceramic Brakes', 'Bang & Olufsen 3D']
    },
    {
      id: 'car-2',
      brand: 'Porsche',
      model: '911 Carrera 4S Coupe',
      category: 'sports',
      bodyType: 'coupe',
      year: 2023,
      mileage: 4100,
      price: 138500,
      monthly: 1150,
      fuel: 'Gasoline',
      transmission: '8-Speed PDK',
      engine: '3.0L Twin-Turbo Flat-6',
      hp: 443,
      accel: '3.4 sec',
      safety: '5 Star Euro NCAP',
      image: 'assets/images/0-1635455.webp',
      badge: 'HOT',
      badgeType: 'badge-featured-red',
      features: ['Sport Chrono', 'PASM Suspension', 'Sport Exhaust', 'BOSE Surround']
    },
    {
      id: 'car-3',
      brand: 'BMW',
      model: 'M4 Competition xDrive',
      category: 'sports',
      bodyType: 'coupe',
      year: 2024,
      mileage: 1800,
      price: 88900,
      monthly: 840,
      fuel: 'Gasoline',
      transmission: '8-Speed M Steptronic',
      engine: '3.0L M TwinPower Turbo S58',
      hp: 503,
      accel: '3.4 sec',
      safety: '5 Star Euro NCAP',
      image: 'assets/images/0-1282548-2.webp',
      badge: 'NEW ARRIVAL',
      badgeType: 'badge-featured-red',
      features: ['M Carbon Bucket Seats', 'M Head-Up Display', 'Harman Kardon', 'Laserlights']
    },
    {
      id: 'car-4',
      brand: 'Mercedes-Benz',
      model: 'GLE 53 AMG 4MATIC+ Coupe',
      category: 'suv',
      bodyType: 'suv',
      year: 2023,
      mileage: 8500,
      price: 82300,
      monthly: 790,
      fuel: 'Hybrid',
      transmission: '9G-Tronic AMG',
      engine: '3.0L Turbo Inline-6 EQ Boost',
      hp: 429,
      accel: '5.2 sec',
      safety: '5 Star Top Safety Pick+',
      image: 'assets/images/0-1538402-1.webp',
      badge: 'CERTIFIED',
      badgeType: 'badge-featured-gold',
      features: ['Airmatic Suspension', 'Burmester Sound', 'Panoramic Sunroof', 'MBUX Augmented Reality']
    },
    {
      id: 'car-5',
      brand: 'Alfa Romeo',
      model: 'Giulia Quadrifoglio',
      category: 'sedan',
      bodyType: 'sedan',
      year: 2023,
      mileage: 6200,
      price: 79800,
      monthly: 750,
      fuel: 'Gasoline',
      transmission: '8-Speed Auto',
      engine: '2.9L Bi-Turbo V6 (Ferrari Dev)',
      hp: 505,
      accel: '3.8 sec',
      safety: '5 Star Euro NCAP',
      image: 'assets/images/0-1516192-scaled.webp',
      badge: 'PERFORMANCE',
      badgeType: 'badge-featured-red',
      features: ['Carbon Fiber Hood', 'Active Aero Splitter', 'DNA Pro Drive Modes', 'Sparco Seats']
    },
    {
      id: 'car-6',
      brand: 'Audi',
      model: 'Q8 55 TFSI Quattro Prestige',
      category: 'luxury',
      bodyType: 'suv',
      year: 2024,
      mileage: 5000,
      price: 74500,
      monthly: 710,
      fuel: 'Hybrid',
      transmission: '8-Speed Tiptronic',
      engine: '3.0L Turbocharged V6 MHEV',
      hp: 335,
      accel: '5.6 sec',
      safety: '5 Star IIHS Top Safety',
      image: 'assets/images/0-1347358-scaled.webp',
      badge: 'EXECUTIVE',
      badgeType: 'badge-featured-gold',
      features: ['Virtual Cockpit Plus', 'Adaptive Air Suspension', 'HD Matrix Lights', 'Valcona Leather']
    },
    {
      id: 'car-7',
      brand: 'GMC',
      model: 'Acadia AT4 All-Terrain AWD',
      category: 'suv',
      bodyType: 'suv',
      year: 2023,
      mileage: 12400,
      price: 48600,
      monthly: 490,
      fuel: 'Gasoline',
      transmission: '9-Speed Auto',
      engine: '2.5L Turbo 4-Cylinder',
      hp: 328,
      accel: '6.4 sec',
      safety: '5 Star NHTSA',
      image: 'assets/images/gmc-acadia-front-side-0-707031-scaled.webp',
      badge: 'READY',
      badgeType: 'badge-featured-gold',
      features: ['Off-Road AWD Twin-Clutch', 'Super Cruise Assist', '15-inch Touchscreen', 'All-Terrain Tires']
    },
    {
      id: 'car-8',
      brand: 'Peugeot',
      model: '208 GT Hybrid 136 e-DCS6',
      category: 'hybrid',
      bodyType: 'hatchback',
      year: 2024,
      mileage: 2100,
      price: 32400,
      monthly: 320,
      fuel: 'Hybrid',
      transmission: '6-Speed Dual-Clutch',
      engine: '1.2L PureTech 48V Hybrid',
      hp: 136,
      accel: '7.9 sec',
      safety: '5 Star Euro NCAP',
      image: 'assets/images/peugeot-208-5-door-front-0-707913-1-1.webp',
      badge: 'ECO HYBRID',
      badgeType: 'badge-featured-gold',
      features: ['i-Cockpit 3D Cluster', 'Full LED Claw Lights', 'Drive Assist Plus', 'Wireless CarPlay']
    }
  ];

  // Extra vehicles for "Load More" action
  const extraVehicles = [
    {
      id: 'car-9',
      brand: 'Porsche',
      model: 'Taycan Turbo S Cross Turismo',
      category: 'electric',
      bodyType: 'sedan',
      year: 2024,
      mileage: 1200,
      price: 187600,
      monthly: 1650,
      fuel: 'Electric',
      transmission: '2-Speed Auto',
      engine: 'Dual Permanent Magnet Motors',
      hp: 750,
      accel: '2.7 sec',
      safety: '5 Star Euro NCAP',
      image: 'assets/images/slider3.webp',
      badge: 'HYPER ELECTRIC',
      badgeType: 'badge-featured-gold',
      features: ['Offroad Design Pkg', 'Rear Axle Steering', 'Porsche InnoDrive', 'Burmester 3D High-End']
    },
    {
      id: 'car-10',
      brand: 'Mercedes-Benz',
      model: 'AMG GT 63 S 4-Door Coupe',
      category: 'luxury',
      bodyType: 'coupe',
      year: 2023,
      mileage: 4900,
      price: 159000,
      monthly: 1420,
      fuel: 'Gasoline',
      transmission: '9-Speed AMG MCT',
      engine: '4.0L Handcrafted V8 Biturbo',
      hp: 630,
      accel: '3.1 sec',
      safety: '5 Star Euro NCAP',
      image: 'assets/images/slider2.webp',
      badge: 'V8 BITURBO',
      badgeType: 'badge-featured-red',
      features: ['AMG Ride Control+', 'Dynamic Plus Pkg', 'Nappa Leather', 'AMG Track Pace']
    }
  ];

  let currentCategory = 'all';
  let comparisonSlots = ['car-1', 'car-2', null]; // 3 comparison slots
  let favorites = JSON.parse(localStorage.getItem('stackly_favs') || localStorage.getItem('carlink_favs') || '[]');

  // 2. DOM Elements
  const searchInput = document.getElementById('searchKeyword');
  const makeFilter = document.getElementById('filterMake');
  const modelFilter = document.getElementById('filterModel');
  const priceFilter = document.getElementById('filterPrice');
  const bodyFilter = document.getElementById('filterBody');
  const fuelFilter = document.getElementById('filterFuel');
  const transFilter = document.getElementById('filterTransmission');
  const yearFilter = document.getElementById('filterYear');
  const btnToggleAdv = document.getElementById('btnToggleAdvanced');
  const advDrawer = document.getElementById('advancedFilterDrawer');
  const btnReset = document.getElementById('btnResetFilters');
  const chipsContainer = document.getElementById('activeFilterChips');
  const categoryCards = document.querySelectorAll('.category-card');
  const sortSelect = document.getElementById('inventorySort');
  const catalogGrid = document.getElementById('inventoryGrid');
  const resultsCounter = document.getElementById('resultsCounter');
  const btnLoadMore = document.getElementById('btnLoadMore');

  // 3. Render Inventory Grid
  function renderInventory(items) {
    if (!catalogGrid) return;
    
    if (items.length === 0) {
      catalogGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: #f9f9f9; border-radius: 12px; border: 1.5px dashed #e0e0e0;" data-aos="fade-up">
          <i class="fa-solid fa-car-tunnel" style="font-size: 48px; color: #888; margin-bottom: 16px;"></i>
          <h3 style="color: #111; font-size: 20px; margin-bottom: 8px;">No Vehicles Found</h3>
          <p style="color: #777; font-size: 14px; margin-bottom: 20px;">Try adjusting your search criteria or resetting filters.</p>
          <button class="btn btn-primary" onclick="window.resetAllFilters()">Reset All Filters</button>
        </div>
      `;
      if (resultsCounter) resultsCounter.innerHTML = 'Showing <strong>0</strong> Vehicles';
      return;
    }

    catalogGrid.innerHTML = items.map((car, idx) => {
      const isFav = favorites.includes(car.id);
      const inCompare = comparisonSlots.includes(car.id);

      return `
        <div class="car-inventory-card" data-id="${car.id}">
          <div class="car-card-media">
            <img src="${car.image}" alt="${car.brand} ${car.model}" loading="eager">
            <span class="card-top-tag">${car.badge}</span>
            <div class="card-top-actions">
              <a href="404.html" class="btn-quick-icon btn-favorite ${isFav ? 'active' : ''}" data-id="${car.id}" title="Add to Favorites" aria-label="Add to Favorites">
                <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
              </a>
              <a href="404.html" class="btn-quick-icon btn-add-compare ${inCompare ? 'active' : ''}" data-id="${car.id}" title="Share / Compare Vehicle" aria-label="Share or Compare Vehicle">
                <i class="fa-solid fa-code-compare"></i>
              </a>
            </div>
          </div>
          <div class="car-card-body">
            <span class="car-brand-subtitle">${car.brand}</span>
            <h3 class="car-card-name">${car.year} ${car.model}</h3>
            
            <div class="car-specs-grid">
              <div class="car-spec-pill">
                <i class="fa-solid fa-gauge-high"></i> ${car.mileage.toLocaleString()} mi
              </div>
              <div class="car-spec-pill">
                <i class="fa-solid fa-charging-station"></i> ${car.fuel}
              </div>
              <div class="car-spec-pill">
                <i class="fa-solid fa-gears"></i> ${car.transmission.split(' ')[0]}
              </div>
              <div class="car-spec-pill">
                <i class="fa-solid fa-bolt"></i> ${car.hp} HP
              </div>
            </div>

            <div class="car-pricing-row">
              <div>
                <span class="car-price-estimate">Starting from</span>
                <div class="car-price-main">$${car.price.toLocaleString()}</div>
              </div>
              <div style="text-align: right;">
                <span class="car-price-estimate">Est. Financing</span>
                <div style="color: var(--primary-color); font-weight: 700; font-size: 13px;">$${car.monthly}/mo</div>
              </div>
            </div>

            <a href="404.html" class="btn-view-car-full" title="View Vehicle Details">
              <span>View Vehicle</span>
              <i class="fa-solid fa-car-side"></i>
            </a>
          </div>
        </div>
      `;
    }).join('');

    if (resultsCounter) {
      resultsCounter.innerHTML = `Showing <strong>${items.length}</strong> of <strong>48</strong> Vehicles`;
    }

    // GSAP Stagger Entrance for Cards
    const renderedCards = catalogGrid.querySelectorAll('.car-inventory-card');
    if (typeof gsap !== 'undefined' && renderedCards.length > 0 && !prefersReducedMotion) {
      gsap.fromTo(renderedCards, 
        { opacity: 0, y: 16 }, 
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.04, ease: 'power2.out' }
      );
    }

    // Attach card event listeners
    attachCardListeners();
  }

  // 4. Filtering Logic
  function getFilteredVehicles() {
    const keyword = (searchInput?.value || '').toLowerCase().trim();
    const make = (makeFilter?.value || 'all').toLowerCase();
    const model = (modelFilter?.value || 'all').toLowerCase();
    const price = priceFilter?.value || 'all';
    const body = (bodyFilter?.value || 'all').toLowerCase();
    const fuel = (fuelFilter?.value || 'all').toLowerCase();
    const trans = (transFilter?.value || 'all').toLowerCase();
    const year = yearFilter?.value || 'all';
    const sort = sortSelect?.value || 'newest';

    let result = vehiclesData.filter(car => {
      // Category tab
      if (currentCategory !== 'all' && car.category !== currentCategory) return false;

      // Keyword
      if (keyword) {
        const text = `${car.brand} ${car.model} ${car.bodyType} ${car.fuel} ${car.year}`.toLowerCase();
        if (!text.includes(keyword)) return false;
      }

      // Make
      if (make !== 'all' && car.brand.toLowerCase() !== make) return false;

      // Model
      if (model !== 'all' && !car.model.toLowerCase().includes(model)) return false;

      // Price
      if (price !== 'all') {
        if (price === 'under-50' && car.price >= 50000) return false;
        if (price === '50-80' && (car.price < 50000 || car.price > 80000)) return false;
        if (price === '80-120' && (car.price < 80000 || car.price > 120000)) return false;
        if (price === 'above-120' && car.price <= 120000) return false;
      }

      // Body
      if (body !== 'all' && car.bodyType.toLowerCase() !== body) return false;

      // Fuel
      if (fuel !== 'all' && car.fuel.toLowerCase() !== fuel) return false;

      // Transmission
      if (trans !== 'all') {
        if (trans === 'auto' && !car.transmission.toLowerCase().includes('auto') && !car.transmission.toLowerCase().includes('pdk') && !car.transmission.toLowerCase().includes('tiptronic') && !car.transmission.toLowerCase().includes('tronic')) return false;
        if (trans === 'dual-clutch' && !car.transmission.toLowerCase().includes('pdk') && !car.transmission.toLowerCase().includes('dual-clutch') && !car.transmission.toLowerCase().includes('e-dcs6')) return false;
      }

      // Year
      if (year !== 'all' && car.year.toString() !== year) return false;

      return true;
    });

    // Sort
    result.sort((a, b) => {
      if (sort === 'price-low') return a.price - b.price;
      if (sort === 'price-high') return b.price - a.price;
      if (sort === 'mileage') return a.mileage - b.mileage;
      if (sort === 'horsepower') return b.hp - a.hp;
      if (sort === 'newest') return b.year - a.year || b.price - a.price;
      return 0;
    });

    return result;
  }

  function updateView() {
    const items = getFilteredVehicles();
    renderInventory(items);
    renderActiveFilterChips();
  }

  // 5. Active Filter Chips
  function renderActiveFilterChips() {
    if (!chipsContainer) return;
    const chips = [];

    if (currentCategory !== 'all') chips.push({ type: 'category', label: `Category: ${currentCategory.toUpperCase()}` });
    if (searchInput?.value.trim()) chips.push({ type: 'keyword', label: `"${searchInput.value.trim()}"` });
    if (makeFilter && makeFilter.value !== 'all') chips.push({ type: 'make', label: `Make: ${makeFilter.value.toUpperCase()}` });
    if (modelFilter && modelFilter.value !== 'all') chips.push({ type: 'model', label: `Model: ${modelFilter.options[modelFilter.selectedIndex].text}` });
    if (priceFilter && priceFilter.value !== 'all') chips.push({ type: 'price', label: `Price: ${priceFilter.options[priceFilter.selectedIndex].text}` });
    if (bodyFilter && bodyFilter.value !== 'all') chips.push({ type: 'body', label: `Body: ${bodyFilter.value.toUpperCase()}` });
    if (fuelFilter && fuelFilter.value !== 'all') chips.push({ type: 'fuel', label: `Fuel: ${fuelFilter.value.toUpperCase()}` });
    if (yearFilter && yearFilter.value !== 'all') chips.push({ type: 'year', label: `Year: ${yearFilter.value}` });

    if (chips.length === 0) {
      chipsContainer.style.display = 'none';
      chipsContainer.innerHTML = '';
      return;
    }

    chipsContainer.style.display = 'flex';
    chipsContainer.innerHTML = `
      <span class="chips-title"><i class="fa-solid fa-filter text-red"></i> Active Filters:</span>
      ${chips.map(c => `
        <span class="filter-chip">
          ${c.label}
          <span class="chip-remove" onclick="window.removeFilterChip('${c.type}')">&times;</span>
        </span>
      `).join('')}
      <button class="btn-reset-filters" onclick="window.resetAllFilters()" style="margin-left: 8px;">
        <i class="fa-solid fa-rotate-left"></i> Reset All
      </button>
    `;
  }

  const catLabel = document.getElementById('catCurrentLabel');
  const catScrollContainer = document.getElementById('categoryScrollContainer');
  const catNavPrev = document.getElementById('catNavPrev');
  const catNavNext = document.getElementById('catNavNext');

  window.removeFilterChip = function(type) {
    if (type === 'category') {
      currentCategory = 'all';
      categoryCards.forEach(c => c.classList.toggle('active', c.dataset.category === 'all'));
      if (catLabel) catLabel.textContent = 'All Vehicles';
    }
    if (type === 'keyword' && searchInput) searchInput.value = '';
    if (type === 'make' && makeFilter) makeFilter.value = 'all';
    if (type === 'model' && modelFilter) modelFilter.value = 'all';
    if (type === 'price' && priceFilter) priceFilter.value = 'all';
    if (type === 'body' && bodyFilter) bodyFilter.value = 'all';
    if (type === 'fuel' && fuelFilter) fuelFilter.value = 'all';
    if (type === 'year' && yearFilter) yearFilter.value = 'all';
    updateView();
  };

  window.resetAllFilters = function() {
    if (searchInput) searchInput.value = '';
    if (makeFilter) makeFilter.value = 'all';
    if (modelFilter) modelFilter.value = 'all';
    if (priceFilter) priceFilter.value = 'all';
    if (bodyFilter) bodyFilter.value = 'all';
    if (fuelFilter) fuelFilter.value = 'all';
    if (transFilter) transFilter.value = 'all';
    if (yearFilter) yearFilter.value = 'all';
    currentCategory = 'all';
    categoryCards.forEach(c => c.classList.toggle('active', c.dataset.category === 'all'));
    if (catLabel) catLabel.textContent = 'All Vehicles';
    updateView();
  };

  // 6. Search Validation & 404 Redirection Handler
  function executeSearch() {
    const keyword = (searchInput?.value || '').trim();
    const make = (makeFilter?.value || 'all').toLowerCase();
    const model = (modelFilter?.value || 'all').toLowerCase();
    const price = priceFilter?.value || 'all';
    const body = (bodyFilter?.value || 'all').toLowerCase();
    const fuel = (fuelFilter?.value || 'all').toLowerCase();
    const trans = (transFilter?.value || 'all').toLowerCase();
    const year = yearFilter?.value || 'all';

    const hasValidDetails = (
      keyword.length > 0 ||
      make !== 'all' ||
      model !== 'all' ||
      price !== 'all' ||
      body !== 'all' ||
      fuel !== 'all' ||
      trans !== 'all' ||
      year !== 'all'
    );

    if (hasValidDetails) {
      try {
        sessionStorage.setItem('stackly_prev_page', window.location.href);
        sessionStorage.setItem('stackly_prev_path', 'inventory.html#smartSearchPanel');
        sessionStorage.setItem('stackly_prev_section', 'smartSearchPanel');
        sessionStorage.setItem('stackly_prev_scroll', window.scrollY.toString());
      } catch (err) {}

      window.location.href = '404.html';
    } else {
      // User clicked search without entering valid details: prompt validation
      const searchPanel = document.getElementById('smartSearchPanel');
      if (searchPanel) {
        searchPanel.classList.add('search-panel-shake');
        setTimeout(() => searchPanel.classList.remove('search-panel-shake'), 600);
      }
      if (searchInput) {
        searchInput.focus();
        const originalPlaceholder = searchInput.placeholder;
        searchInput.placeholder = 'Please enter keywords or select vehicle details...';
        setTimeout(() => {
          searchInput.placeholder = originalPlaceholder;
        }, 3000);
      }
    }
  }

  window.executeSearch = executeSearch;

  const btnSearch = document.getElementById('btnSearchHero') || document.querySelector('.btn-search-hero');
  if (btnSearch) {
    btnSearch.addEventListener('click', (e) => {
      e.preventDefault();
      executeSearch();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        executeSearch();
      }
    });
  }

  // Event Handlers for Filters
  [searchInput, makeFilter, modelFilter, priceFilter, bodyFilter, fuelFilter, transFilter, yearFilter, sortSelect].forEach(elem => {
    if (!elem) return;
    elem.addEventListener('input', () => updateView());
    elem.addEventListener('change', () => updateView());
  });

  // Advanced Filters Drawer Toggle
  if (btnToggleAdv && advDrawer) {
    btnToggleAdv.addEventListener('click', () => {
      advDrawer.classList.toggle('open');
      btnToggleAdv.classList.toggle('active');
    });
  }

  if (btnReset) {
    btnReset.addEventListener('click', () => window.resetAllFilters());
  }

  // Category Selector Cards
  categoryCards.forEach(card => {
    card.addEventListener('click', () => {
      categoryCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      currentCategory = card.dataset.category || 'all';
      if (catLabel) {
        catLabel.textContent = card.dataset.name || (currentCategory === 'all' ? 'All Vehicles' : currentCategory.toUpperCase());
      }
      updateView();
      
      // Smooth scroll into view of the catalog if user is on mobile
      if (window.innerWidth < 768) {
        document.getElementById('inventoryCatalogSection')?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Category Navigation Arrows (Prev / Next Scroll)
  if (catNavPrev && catScrollContainer) {
    catNavPrev.addEventListener('click', () => {
      catScrollContainer.scrollBy({ left: -220, behavior: 'smooth' });
    });
  }

  if (catNavNext && catScrollContainer) {
    catNavNext.addEventListener('click', () => {
      catScrollContainer.scrollBy({ left: 220, behavior: 'smooth' });
    });
  }

  // 7. Favorites & Comparison Interactions
  function attachCardListeners() {
    // Buttons are routed directly to 404.html with automatic section restoration
  }

  // 8. Vehicle Comparison Matrix Engine
  function toggleCompareSlot(carId) {
    const slotIndex = comparisonSlots.indexOf(carId);
    if (slotIndex > -1) {
      // Remove
      comparisonSlots[slotIndex] = null;
    } else {
      // Add to first available slot
      const emptyIdx = comparisonSlots.indexOf(null);
      if (emptyIdx > -1) {
        comparisonSlots[emptyIdx] = carId;
      } else {
        // replace last slot
        comparisonSlots[2] = carId;
      }
    }
    renderComparisonDashboard();
    updateView(); // refresh compare button states on cards
  }

  window.removeCompareSlot = function(index) {
    comparisonSlots[index] = null;
    renderComparisonDashboard();
    updateView();
  };

  window.clearAllCompareSlots = function() {
    comparisonSlots = [null, null, null];
    renderComparisonDashboard();
    updateView();
  };

  function renderComparisonDashboard() {
    const dashboard = document.getElementById('comparisonDashboard');
    if (!dashboard) return;

    const allCars = [...vehiclesData, ...extraVehicles];
    const slotCars = comparisonSlots.map(id => allCars.find(c => c.id === id) || null);
    const filledCount = slotCars.filter(Boolean).length;

    // Render Slots Header
    const slotsHeader = document.getElementById('comparisonSlotsHeader');
    if (slotsHeader) {
      slotsHeader.innerHTML = `
        <div class="comparison-slot-legend">
          <div class="legend-badge-tag"><i class="fa-solid fa-layer-group"></i> MATRIX VIEW</div>
          <h4 class="legend-title">BENCHMARK <span>SUITE</span></h4>
          <p class="legend-desc">Compare dynamic specs, power outputs &amp; acquisition prices.</p>
          <div class="legend-footer-meta">
            <span class="matrix-status-chip"><i class="fa-solid fa-circle-dot"></i> ${filledCount}/3 Active</span>
            ${filledCount > 0 ? `<a href="404.html" class="btn-clear-all-slots" title="Reset comparison matrix"><i class="fa-solid fa-rotate-left"></i> Reset</a>` : ''}
          </div>
        </div>
        ${slotCars.map((car, idx) => {
          if (!car) {
            return `
              <a href="404.html" class="comparison-slot-card empty-slot" title="Click to add a vehicle from inventory">
                <div class="empty-icon-circle">
                  <i class="fa-solid fa-plus"></i>
                </div>
                <div class="empty-slot-title">Add Vehicle</div>
                <div class="empty-slot-sub">Slot 0${idx + 1} &bull; Choose Model</div>
                <span class="empty-slot-action-btn"><i class="fa-solid fa-arrow-pointer"></i> Select Car</span>
              </a>
            `;
          }
          return `
            <div class="comparison-slot-card filled-slot">
              <div class="slot-card-badge">SLOT 0${idx + 1}</div>
              <div class="slot-thumb-container">
                <img src="${car.image}" alt="${car.brand} ${car.model}" class="slot-car-thumb">
                <a href="404.html" class="btn-slot-remove" title="Remove vehicle from slot">
                  <i class="fa-solid fa-xmark"></i>
                </a>
              </div>
              <div class="slot-car-info">
                <span class="slot-brand-tag">${car.brand}</span>
                <h4 class="slot-car-title">${car.model}</h4>
                <div class="slot-price-pill">
                  <span class="slot-price-val">$${car.price.toLocaleString()}</span>
                  <span class="slot-price-est">Est. $${Math.round(car.price / 60)}/mo</span>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      `;
    }

    // Render Spec Rows
    const tableBody = document.getElementById('comparisonTableBody');
    if (tableBody) {
      const specDefinitions = [
        { 
          label: 'Acquisition Price', 
          icon: 'fa-tag', 
          format: c => c ? `<span class="spec-price-highlight">$${c.price.toLocaleString()}</span>` : '<span class="spec-empty-dash">&mdash;</span>' 
        },
        { 
          label: 'Year & Category', 
          icon: 'fa-calendar-check', 
          format: c => c ? `<span class="spec-text-main">${c.year} &bull; <strong style="text-transform:capitalize;">${c.category}</strong></span>` : '<span class="spec-empty-dash">&mdash;</span>' 
        },
        { 
          label: 'Mileage', 
          icon: 'fa-gauge-high', 
          format: c => c ? `<span class="spec-badge-mileage">${c.mileage.toLocaleString()} mi</span>` : '<span class="spec-empty-dash">&mdash;</span>' 
        },
        { 
          label: 'Engine Power', 
          icon: 'fa-bolt', 
          format: c => c ? `
            <div class="spec-hp-container">
              <div class="spec-hp-top"><span class="hp-num">${c.hp}</span> <span class="hp-unit">HP</span></div>
              <div class="hp-bar-wrap">
                <div class="hp-bar-fill" style="width: ${Math.min(100, Math.max(15, (c.hp / 750) * 100))}%;"></div>
              </div>
            </div>
          ` : '<span class="spec-empty-dash">&mdash;</span>' 
        },
        { 
          label: '0 - 60 MPH Sprint', 
          icon: 'fa-stopwatch', 
          format: c => c ? `<span class="spec-accel-pill"><i class="fa-solid fa-bolt text-red"></i> ${c.accel}</span>` : '<span class="spec-empty-dash">&mdash;</span>' 
        },
        { 
          label: 'Engine Spec', 
          icon: 'fa-gears', 
          format: c => c ? `<span class="spec-text-main">${c.engine}</span>` : '<span class="spec-empty-dash">&mdash;</span>' 
        },
        { 
          label: 'Fuel & Drivetrain', 
          icon: 'fa-gas-pump', 
          format: c => c ? `<span class="spec-text-main">${c.fuel}</span>` : '<span class="spec-empty-dash">&mdash;</span>' 
        },
        { 
          label: 'Transmission', 
          icon: 'fa-sliders', 
          format: c => c ? `<span class="spec-text-main">${c.transmission}</span>` : '<span class="spec-empty-dash">&mdash;</span>' 
        },
        { 
          label: 'Safety Certification', 
          icon: 'fa-shield-halved', 
          format: c => c ? `<span class="spec-safety-badge"><i class="fa-solid fa-star"></i> ${c.safety} Rating</span>` : '<span class="spec-empty-dash">&mdash;</span>' 
        },
        { 
          label: 'Key Feature Highlight', 
          icon: 'fa-circle-check', 
          format: c => c ? `<span class="spec-feature-tag">${c.features && c.features.length ? c.features.slice(0, 2).join(' &bull; ') : 'Certified Multi-Point Inspection'}</span>` : '<span class="spec-empty-dash">&mdash;</span>' 
        }
      ];

      tableBody.innerHTML = specDefinitions.map(spec => `
        <div class="compare-row">
          <div class="compare-label">
            <div class="compare-icon-box">
              <i class="fa-solid ${spec.icon}"></i>
            </div>
            <span>${spec.label}</span>
          </div>
          ${slotCars.map(car => `
            <div class="compare-value ${car ? 'has-car' : 'empty-car'}">${spec.format(car)}</div>
          `).join('')}
        </div>
      `).join('');
    }
  }

  window.promptSelectCarForCompare = function(slotIdx) {
    const unselected = vehiclesData.find(c => !comparisonSlots.includes(c.id));
    if (unselected) {
      comparisonSlots[slotIdx] = unselected.id;
      renderComparisonDashboard();
      updateView();
    }
  };

  // 9. Load More Extra Vehicles
  if (btnLoadMore) {
    let extraLoaded = false;
    btnLoadMore.addEventListener('click', () => {
      if (extraLoaded) {
        // Redirect to 404.html with originating section recorded
        try {
          sessionStorage.setItem('stackly_prev_page', window.location.href);
          sessionStorage.setItem('stackly_prev_path', 'inventory.html#inventoryCatalogSection');
          sessionStorage.setItem('stackly_prev_scroll', window.scrollY.toString());
          sessionStorage.setItem('stackly_prev_section', 'inventoryCatalogSection');
        } catch (e) {}
        window.location.href = '404.html';
        return;
      }
      btnLoadMore.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Loading More Cars...';
      setTimeout(() => {
        vehiclesData.push(...extraVehicles);
        updateView();
        btnLoadMore.innerHTML = '<i class="fa-solid fa-check"></i> All Available Vehicles Loaded';
        btnLoadMore.disabled = false;
        btnLoadMore.style.cursor = 'pointer';
        btnLoadMore.style.opacity = '1';
        btnLoadMore.title = 'Click to explore full inventory archive';
        extraLoaded = true;
      }, 600);
    });
  }

  // 10. GSAP 3 & ScrollTrigger Animations
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    if (!prefersReducedMotion) {
      // Parallax image zoom on Featured Hero Vehicle
      const heroCarImg = document.querySelector('.card-hero-img');
      const featuredShowcase = document.querySelector('.featured-showcase-section');
      if (heroCarImg && featuredShowcase) {
        gsap.to(heroCarImg, {
          scale: 1.08,
          ease: 'none',
          scrollTrigger: {
            trigger: featuredShowcase,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2
          }
        });
      }

      // Micro-interactions for Category Selector Cards
      const catCards = document.querySelectorAll('.category-card');
      catCards.forEach(card => {
        const thumb = card.querySelector('.category-thumb-img');
        card.addEventListener('mouseenter', () => {
          if (thumb) gsap.to(thumb, { y: -4, scale: 1.1, duration: 0.28, ease: 'back.out(2)' });
        });
        card.addEventListener('mouseleave', () => {
          if (thumb) gsap.to(thumb, { y: 0, scale: 1, duration: 0.22, ease: 'power2.out' });
        });
      });

      // Micro-interactions for Service Assist Boxes
      const assistBoxes = document.querySelectorAll('.service-assist-box');
      assistBoxes.forEach(box => {
        const iconWrap = box.querySelector('.service-icon-wrap');
        box.addEventListener('mouseenter', () => {
          if (iconWrap) gsap.to(iconWrap, { y: -6, scale: 1.12, duration: 0.3, ease: 'back.out(2)' });
        });
        box.addEventListener('mouseleave', () => {
          if (iconWrap) gsap.to(iconWrap, { y: 0, scale: 1, duration: 0.25, ease: 'power2.out' });
        });
      });

      // Micro-interactions for Search Button Pulse
      const searchBtn = document.querySelector('.btn-search-hero');
      if (searchBtn) {
        searchBtn.addEventListener('mouseenter', () => {
          gsap.to(searchBtn, { scale: 1.03, duration: 0.2, ease: 'power1.out' });
        });
        searchBtn.addEventListener('mouseleave', () => {
          gsap.to(searchBtn, { scale: 1, duration: 0.2, ease: 'power1.out' });
        });
      }
    }

    window.addEventListener('load', () => {
      ScrollTrigger.refresh();
    });
  }

  // Initial render
  updateView();
  renderComparisonDashboard();
});

window.viewCarDetails = function(carId) {
  alert(`Viewing vehicle details for ID: ${carId}.`);
};
