/**
 * Stackly Luxury Automotive - Dashboard Interactivity Engine
 * Supports Buyer / Customer Dashboard & Admin Executive Suite
 */

document.addEventListener('DOMContentLoaded', () => {

  // -------------------------------------------------------------
  // 1. ACTIVE USER SESSION & PERSONALIZATION
  // -------------------------------------------------------------
  function loadUserSession() {
    const authData = localStorage.getItem('stackly_auth_user');
    const regData = localStorage.getItem('stackly_registered_user');
    let user = null;

    try {
      if (authData) user = JSON.parse(authData);
      else if (regData) user = JSON.parse(regData);
    } catch(e) {}

    const userNameEls = document.querySelectorAll('.dash-user-name');
    const greetingNameEls = document.querySelectorAll('.user-greeting-name');
    const portalBadgeEls = document.querySelectorAll('.dash-user-role');

    if (user && (user.name || user.username)) {
      const displayName = user.name || user.username;
      userNameEls.forEach(el => el.textContent = displayName);
      greetingNameEls.forEach(el => el.textContent = displayName.split(' ')[0]);
      if (user.portal === 'admin') {
        portalBadgeEls.forEach(el => el.textContent = 'Dealership Executive');
      }
    }
  }
  loadUserSession();

  // -------------------------------------------------------------
  // 2. MOBILE SIDEBAR DRAWER TOGGLE
  // -------------------------------------------------------------
  const mobileMenuBtn = document.getElementById('dashMobileMenuBtn');
  const sidebar = document.getElementById('dashSidebar');
  const overlay = document.getElementById('dashSidebarOverlay');
  const sidebarCloseBtn = document.getElementById('dashSidebarCloseBtn');

  function openSidebar() {
    if (sidebar) sidebar.classList.add('open');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openSidebar();
    });
  }
  if (sidebarCloseBtn) {
    sidebarCloseBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeSidebar();
    });
  }
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      e.preventDefault();
      closeSidebar();
    });
  }

  // -------------------------------------------------------------
  // 3. TAB SWITCHING (SIDEBAR & MOBILE BOTTOM APP BAR)
  // -------------------------------------------------------------
  const tabLinks = document.querySelectorAll('[data-tab-target]');
  const tabPanes = document.querySelectorAll('.dash-tab-pane');

  function switchTab(targetId, updateHistory = true) {
    tabPanes.forEach(pane => {
      if (pane.id === targetId) {
        pane.classList.add('active');
      } else {
        pane.classList.remove('active');
      }
    });

    tabLinks.forEach(link => {
      const parentItem = link.closest('.dash-nav-item') || link;
      if (link.getAttribute('data-tab-target') === targetId) {
        parentItem.classList.add('active');
      } else {
        parentItem.classList.remove('active');
      }
    });

    if (updateHistory && window.history && window.history.replaceState) {
      window.history.replaceState(null, null, '#' + targetId);
    }
    sessionStorage.setItem('stackly_current_tab', targetId);
    sessionStorage.setItem('stackly_prev_page', window.location.href);

    // Scroll viewport to top so section headers and content are fully visible
    window.scrollTo({ top: 0, behavior: 'instant' });
    const mainStage = document.querySelector('.dash-main-stage');
    if (mainStage) mainStage.scrollTop = 0;

    // Close mobile drawer if open
    closeSidebar();
  }

  tabLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('data-tab-target');
      if (targetId) {
        switchTab(targetId);
      }
    });
  });

  // Track active section for any links navigating to 404
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href*="404"]');
    if (link) {
      const activePane = document.querySelector('.dash-tab-pane.active');
      const activeTabId = activePane ? activePane.id : 'overviewTab';
      sessionStorage.setItem('stackly_prev_page', window.location.pathname + '#' + activeTabId);
      sessionStorage.setItem('stackly_prev_section', activeTabId);
    }
  });

  // Check URL hash on load to restore exact previous tab
  function initTabFromHash() {
    const hash = window.location.hash.replace('#', '');
    const hashMap = {
      'overview': 'overviewTab',
      'overviewTab': 'overviewTab',
      'orders': 'ordersTab',
      'ordersTab': 'ordersTab',
      'testdrives': 'testDrivesTab',
      'testDrivesTab': 'testDrivesTab',
      'garage': 'garageTab',
      'garageTab': 'garageTab',
      'service': 'serviceTab',
      'serviceTab': 'serviceTab',
      'rewards': 'rewardsTab',
      'rewardsTab': 'rewardsTab',
      'admin-overview': 'adminOverviewTab',
      'adminOverviewTab': 'adminOverviewTab',
      'admin-inventory': 'adminInventoryTab',
      'adminInventoryTab': 'adminInventoryTab',
      'admin-orders': 'adminOrdersTab',
      'adminOrdersTab': 'adminOrdersTab',
      'admin-drives': 'adminDrivesTab',
      'adminDrivesTab': 'adminDrivesTab',
      'admin-clients': 'adminClientsTab',
      'adminClientsTab': 'adminClientsTab',
      'admin-service': 'adminServiceTab',
      'adminServiceTab': 'adminServiceTab',
      'admin-settings': 'adminSettingsTab',
      'adminSettingsTab': 'adminSettingsTab'
    };

    const targetTab = hashMap[hash] || sessionStorage.getItem('stackly_current_tab');
    if (targetTab && document.getElementById(targetTab)) {
      switchTab(targetTab, false);
    }
  }
  initTabFromHash();

  // -------------------------------------------------------------
  // 4. NOTIFICATIONS DROPDOWN
  // -------------------------------------------------------------
  const notifBtn = document.getElementById('dashNotifBtn');
  const notifDropdown = document.getElementById('dashNotifDropdown');

  if (notifBtn && notifDropdown) {
    notifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      notifDropdown.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!notifDropdown.contains(e.target) && !notifBtn.contains(e.target)) {
        notifDropdown.classList.remove('active');
      }
    });
  }

  // -------------------------------------------------------------
  // 5. TOAST NOTIFICATION ENGINE
  // -------------------------------------------------------------
  let toastContainer = document.querySelector('.dash-toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'dash-toast-container';
    toastContainer.style.cssText = 'position:fixed;top:20px;right:20px;z-index:999999;display:flex;flex-direction:column;gap:10px;pointer-events:none;';
    document.body.appendChild(toastContainer);
  }

  function showToast(title, message, type = 'info', duration = 4000) {
    const toast = document.createElement('div');
    toast.style.cssText = `
      pointer-events:auto;min-width:280px;max-width:380px;background:#161820;color:#ffffff;
      border-radius:12px;padding:0.9rem 1.1rem;box-shadow:0 14px 35px rgba(0,0,0,0.5);
      border-left:4px solid ${type === 'success' ? '#10b981' : type === 'error' ? '#DD0005' : '#06b6d4'};
      border-top:1px solid rgba(255,255,255,0.08);border-right:1px solid rgba(255,255,255,0.08);border-bottom:1px solid rgba(255,255,255,0.08);
      display:flex;align-items:flex-start;gap:0.75rem;animation:toastSlideIn 0.3s ease forwards;
    `;

    toast.innerHTML = `
      <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : type === 'error' ? 'fa-triangle-exclamation' : 'fa-circle-info'}" style="color:${type === 'success' ? '#10b981' : type === 'error' ? '#DD0005' : '#06b6d4'};font-size:1.1rem;margin-top:2px;"></i>
      <div style="flex:1;">
        <div style="font-size:0.86rem;font-weight:800;color:#ffffff;margin-bottom:0.15rem;">${title}</div>
        <div style="font-size:0.78rem;color:#94a3b8;line-height:1.35;">${message}</div>
      </div>
      <button style="color:#64748b;font-size:1rem;cursor:pointer;" class="toast-close-btn">&times;</button>
    `;

    toastContainer.appendChild(toast);

    const closeBtn = toast.querySelector('.toast-close-btn');
    const dismiss = () => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 300);
    };

    closeBtn.addEventListener('click', dismiss);
    setTimeout(dismiss, duration);
  }

  // Make showToast accessible globally
  window.showToast = showToast;

  // -------------------------------------------------------------
  // 6. INTERACTIVE MODALS (TEST DRIVE, SERVICE, CARRIER, DIGITAL KEY, SPEC SHEET)
  // -------------------------------------------------------------
  function setupModal(modalId, triggerSelector, formId, successTitle, successMsg) {
    const modal = document.getElementById(modalId);
    const triggers = document.querySelectorAll(triggerSelector);
    if (!modal) return;

    const closeBtns = modal.querySelectorAll('.dash-modal-close-btn, .btn-modal-cancel');

    triggers.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();

        // Check if button has specific data attributes
        const vehicle = btn.getAttribute('data-vehicle') || btn.getAttribute('data-model') || btn.getAttribute('data-car');
        const vin = btn.getAttribute('data-vin');
        const price = btn.getAttribute('data-price');

        if (modalId === 'carrierGpsModal' && vehicle) {
          const titleEl = document.getElementById('carrierModalTitle');
          if (titleEl) titleEl.innerHTML = `Live Carrier GPS Telemetry &bull; ${vehicle}`;
        }

        if (modalId === 'digitalKeyModal' && vehicle) {
          const carNameEl = document.getElementById('digitalKeyCarName');
          if (carNameEl) carNameEl.textContent = `${vehicle} &bull; Remote Access`;
        }

        if (modalId === 'specSheetModal') {
          if (vehicle) {
            const modelEl = document.getElementById('specModelName');
            if (modelEl) modelEl.textContent = vehicle;
          }
          if (vin) {
            const vinEl = document.getElementById('specVinNumber');
            if (vinEl) vinEl.textContent = `VIN: ${vin}`;
          }
          if (price) {
            const priceEl = document.getElementById('specMSRPAmount');
            if (priceEl) priceEl.textContent = price;
          }
        }

        // Test drive select prefill if triggered from card
        if (modalId === 'bookTestDriveModal') {
          const card = btn.closest('.dash-vehicle-card');
          if (card) {
            const cardTitle = card.querySelector('.dash-card-title');
            if (cardTitle) {
              const select = document.getElementById('testDriveVehicleSelect');
              if (select) {
                for (let i = 0; i < select.options.length; i++) {
                  if (cardTitle.textContent.includes(select.options[i].value) || select.options[i].text.includes(cardTitle.textContent)) {
                    select.selectedIndex = i;
                    break;
                  }
                }
              }
            }
          }
        }

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    closeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    if (formId) {
      const form = document.getElementById(formId);
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          modal.classList.remove('active');
          document.body.style.overflow = '';
          showToast(successTitle || 'Action Confirmed', successMsg || 'Your request has been processed successfully.', 'success');
          form.reset();
        });
      }
    }
  }

  setupModal('bookTestDriveModal', '.trigger-test-drive-modal', 'bookTestDriveForm', 'VIP Test Drive Booked', 'Our concierge director will prepare the vehicle for your private track drive.');
  setupModal('scheduleServiceModal', '.trigger-service-modal', 'scheduleServiceForm', 'Service Bay Reserved', 'Priority appointment confirmed with certified technicians.');
  setupModal('addVehicleModal', '.trigger-add-vehicle-modal', 'addVehicleForm', 'Vehicle Listed', 'New exotic vehicle published to Stackly showroom inventory.');
  setupModal('carrierGpsModal', '.trigger-carrier-modal', null, null, null);
  setupModal('digitalKeyModal', '.trigger-digital-key-modal', null, null, null);
  setupModal('specSheetModal', '.trigger-spec-modal', null, null, null);

  // -------------------------------------------------------------
  // 7. WISHLIST INTERACTIVE REMOVAL
  // -------------------------------------------------------------
  const removeWishlistBtns = document.querySelectorAll('.btn-remove-wishlist');
  removeWishlistBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const cardId = btn.getAttribute('data-card-id');
      const card = document.getElementById(cardId) || btn.closest('.dash-vehicle-card');
      if (card) {
        card.style.transform = 'scale(0.9)';
        card.style.opacity = '0';
        card.style.transition = 'all 0.3s ease';
        setTimeout(() => {
          if (card.parentNode) card.parentNode.removeChild(card);
          showToast('Vehicle Removed', 'The vehicle has been removed from your saved garage.', 'info');
        }, 300);
      }
    });
  });

  // -------------------------------------------------------------
  // 8. VIP REWARDS REDEMPTION & REFERRAL PROGRAM
  // -------------------------------------------------------------
  let currentPoints = 18500;
  const redeemBtns = document.querySelectorAll('.trigger-redeem-perk');
  const pointsDisplay = document.getElementById('userRewardsBalance');

  redeemBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const reward = btn.getAttribute('data-reward');
      const cost = parseInt(btn.getAttribute('data-cost') || '0', 10);

      if (cost === 0) {
        showToast('Credit Applied', '$1,000 Trade-in cash credit has been locked to your member wallet!', 'success');
        btn.textContent = 'Applied to Account ✓';
        btn.disabled = true;
        btn.style.opacity = '0.6';
        return;
      }

      if (currentPoints >= cost) {
        currentPoints -= cost;
        if (pointsDisplay) pointsDisplay.textContent = currentPoints.toLocaleString();
        showToast('Privilege Redeemed!', `You redeemed: ${reward}. Concierge voucher dispatched!`, 'success');
        btn.textContent = 'Redeemed ✓';
        btn.disabled = true;
        btn.style.opacity = '0.6';
      } else {
        showToast('Insufficient Points', `You need ${cost.toLocaleString()} points for this reward.`, 'error');
      }
    });
  });

  // Copy Referral Link
  const copyReferralBtn = document.getElementById('copyReferralBtn');
  const referralInput = document.getElementById('referralLinkInput');
  if (copyReferralBtn && referralInput) {
    copyReferralBtn.addEventListener('click', () => {
      referralInput.select();
      navigator.clipboard.writeText(referralInput.value).then(() => {
        showToast('Link Copied!', 'Your VIP referral link has been copied to your clipboard.', 'success');
      }).catch(() => {
        showToast('Link Selected', 'Press Ctrl+C to copy your referral link.', 'info');
      });
    });
  }

  // -------------------------------------------------------------
  // 9. INVENTORY FILTER & SEARCH
  // -------------------------------------------------------------
  const inventorySearch = document.getElementById('tableSearchInput');
  if (inventorySearch) {
    inventorySearch.addEventListener('input', () => {
      const query = inventorySearch.value.toLowerCase().trim();
      const rows = document.querySelectorAll('.dash-data-table tbody tr');
      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(query) ? '' : 'none';
      });
    });
  }

  // -------------------------------------------------------------
  // 10. LOGOUT FLOW
  // -------------------------------------------------------------
  const logoutBtns = document.querySelectorAll('.btn-dash-logout');
  logoutBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('Signing Out', 'Ending session securely... Redirecting to Showroom.', 'info', 2000);
      localStorage.removeItem('stackly_auth_user');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1000);
    });
  });

  // -------------------------------------------------------------
  // 11. HEADER SEARCH BAR (Redirects to 404 only after text is entered)
  // -------------------------------------------------------------
  const headerSearchInput = document.getElementById('dashSearchInput') || document.querySelector('.dash-search-input');
  const headerSearchBtn = document.getElementById('dashSearchBtn') || document.querySelector('.dash-search-icon-btn');
  const headerSearchForm = document.getElementById('dashSearchForm');

  function handleHeaderSearch(e) {
    if (e) e.preventDefault();
    if (!headerSearchInput) return;

    const query = headerSearchInput.value.trim();
    if (query.length > 0) {
      // Record active tab/section for the 404 page's "Back to Previous" button
      const activePane = document.querySelector('.dash-tab-pane.active');
      const activeTabId = activePane ? activePane.id : 'overviewTab';
      sessionStorage.setItem('stackly_prev_page', window.location.pathname + '#' + activeTabId);
      sessionStorage.setItem('stackly_prev_section', activeTabId);

      // Redirect to 404 page
      window.location.href = `404.html?search=${encodeURIComponent(query)}`;
    } else {
      headerSearchInput.focus();
    }
  }

  if (headerSearchBtn) {
    headerSearchBtn.addEventListener('click', handleHeaderSearch);
  }

  if (headerSearchInput) {
    headerSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleHeaderSearch(e);
      }
    });
  }

  if (headerSearchForm) {
    headerSearchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleHeaderSearch(e);
    });
  }

  // Expose globally for inline onclick
  window.executeDashboardSearch = handleHeaderSearch;

});
