/**
 * CarLink - Main JavaScript Application
 * High-performance, clean vanilla ES6+
 */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Preloader Removal
  const pageLoader = document.getElementById('pageLoader');
  if (pageLoader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        pageLoader.classList.add('loaded');
      }, 350);
    });
    setTimeout(() => {
      if (!pageLoader.classList.contains('loaded')) {
        pageLoader.classList.add('loaded');
      }
    }, 1500);
  }

  // Track last visited active page & section for precise 404 recovery
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  if (currentPage && !currentPage.includes('404')) {
    try {
      sessionStorage.setItem('stackly_prev_page', window.location.href);
      sessionStorage.setItem('stackly_prev_path', currentPage);
    } catch (e) {}
  }

  // Intercept any navigation to 404 to capture the exact originating section and scroll position
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href*="404.html"], a[href*="404"]');
    if (link) {
      const section = link.closest('section[id], footer[id], header[id], div[id], [id]');
      const sectionId = section && section.id ? section.id : '';
      const currentPath = window.location.pathname.split('/').pop() || 'index.html';
      const cleanPath = currentPath.split('#')[0];
      const returnUrl = sectionId ? (cleanPath + '#' + sectionId) : cleanPath;
      
      try {
        sessionStorage.setItem('stackly_prev_page', window.location.href);
        sessionStorage.setItem('stackly_prev_path', returnUrl);
        sessionStorage.setItem('stackly_prev_scroll', window.scrollY.toString());
        if (sectionId) {
          sessionStorage.setItem('stackly_prev_section', sectionId);
        } else {
          sessionStorage.removeItem('stackly_prev_section');
        }
      } catch (err) {}
    }
  });

  // Restore previous section scroll if returning from 404
  const returnSectionId = sessionStorage.getItem('stackly_prev_section');
  const returnScroll = sessionStorage.getItem('stackly_prev_scroll');
  if (returnSectionId || returnScroll) {
    sessionStorage.removeItem('stackly_prev_section');
    sessionStorage.removeItem('stackly_prev_scroll');
    
    setTimeout(() => {
      if (returnSectionId) {
        const targetEl = document.getElementById(returnSectionId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
      }
      if (returnScroll) {
        window.scrollTo({ top: parseInt(returnScroll, 10), behavior: 'smooth' });
      }
    }, 180);
  }

  // 2. Sticky Header Scroll Effect
  const siteHeader = document.getElementById('siteHeader');
  if (siteHeader) {
    const handleHeaderScroll = () => {
      if (window.scrollY > 80) {
        siteHeader.classList.add('is-scrolled');
      } else {
        siteHeader.classList.remove('is-scrolled');
      }
    };
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll();
  }

  // 3. Mobile Navigation Drawer (Full Viewport with Interactive Animations)
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');

  function openMobileMenu() {
    if (mobileDrawer) mobileDrawer.classList.add('active');
    if (drawerOverlay) drawerOverlay.classList.add('active');
    if (mobileMenuBtn) mobileMenuBtn.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (mobileDrawer) mobileDrawer.classList.remove('active');
    if (drawerOverlay) drawerOverlay.classList.remove('active');
    if (mobileMenuBtn) mobileMenuBtn.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (mobileDrawer && mobileDrawer.classList.contains('active')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMobileMenu();
    });
  }

  if (drawerOverlay) {
    drawerOverlay.addEventListener('click', closeMobileMenu);
  }

  // Close with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('active')) {
      closeMobileMenu();
    }
  });

  // Mobile Accordion Submenus
  const mobileDropdownToggles = document.querySelectorAll('.mobile-dropdown-toggle');
  mobileDropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const parentRow = toggle.closest('.mobile-nav-item');
      const subMenu = parentRow ? parentRow.querySelector('.mobile-sub-menu') : null;
      if (subMenu) {
        const isOpen = subMenu.classList.contains('open');
        document.querySelectorAll('.mobile-sub-menu.open').forEach(menu => {
          if (menu !== subMenu) {
            menu.classList.remove('open');
            const toggleBtn = menu.closest('.mobile-nav-item')?.querySelector('.mobile-dropdown-toggle');
            if (toggleBtn) toggleBtn.classList.remove('open');
          }
        });
        subMenu.classList.toggle('open', !isOpen);
        toggle.classList.toggle('open', !isOpen);
      }
    });
  });

  document.querySelectorAll('.mobile-nav-list a, .mobile-drawer__footer a').forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  // 4. Hero Car Showcase Slider
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  let currentSlide = 0;
  let slideInterval = null;

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    
    currentSlide = (index + slides.length) % slides.length;
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  function startSlideShow() {
    stopSlideShow();
    slideInterval = setInterval(() => {
      goToSlide(currentSlide + 1);
    }, 6000);
  }

  function stopSlideShow() {
    if (slideInterval) clearInterval(slideInterval);
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-index'), 10);
      goToSlide(idx);
      startSlideShow();
    });
  });

  if (slides.length > 0) {
    startSlideShow();
  }

    // Search Input live filter
  const carSearchInput = document.getElementById('carSearchInput');
  if (carSearchInput) {
    carSearchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const cards = document.querySelectorAll('.vehicle-card');
      cards.forEach(card => {
        const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
        const specs = card.querySelector('.card-specs')?.textContent.toLowerCase() || '';
        const type = card.querySelector('.card-type')?.textContent.toLowerCase() || '';
        if (title.includes(query) || specs.includes(query) || type.includes(query)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

  // 5. Vehicle Inventory Filtering
  const filterBtns = document.querySelectorAll('.filter-tab-btn');
  const vehicleCards = document.querySelectorAll('.vehicle-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      vehicleCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Favorite buttons link naturally to 404.html

  // 6. Testimonials Drag / Pause Support
  const testimonialTrack = document.getElementById('testimonialTrack');
  if (testimonialTrack) {
    let isDown = false;
    let startX, scrollLeft;
    const marqueeWrapper = testimonialTrack.parentElement;

    marqueeWrapper.addEventListener('mouseenter', () => {
      testimonialTrack.style.animationPlayState = 'paused';
    });

    marqueeWrapper.addEventListener('mouseleave', () => {
      testimonialTrack.style.animationPlayState = 'running';
    });

    marqueeWrapper.addEventListener('touchstart', () => {
      testimonialTrack.style.animationPlayState = 'paused';
    }, { passive: true });

    marqueeWrapper.addEventListener('touchend', () => {
      testimonialTrack.style.animationPlayState = 'running';
    }, { passive: true });
  }

  // 7. Video Modal Lightbox
  const openVideoBtn = document.getElementById('openVideoModalBtn');
  const openVideoSecondaryBtn = document.getElementById('openVideoModalSecondaryBtn');
  const videoModal = document.getElementById('videoModal');
  const videoModalClose = document.getElementById('videoModalClose');
  const videoModalBackdrop = document.getElementById('videoModalBackdrop');
  const videoIframe = document.getElementById('videoIframe');
  const demoVideoUrl = 'https://www.youtube.com/embed/ScMzIvxBSi4?autoplay=1';

  function openVideo() {
    videoIframe.src = demoVideoUrl;
    videoModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeVideo() {
    videoModal.classList.remove('active');
    videoIframe.src = '';
    document.body.style.overflow = '';
  }

  if (videoModalClose) videoModalClose.addEventListener('click', closeVideo);
  if (videoModalBackdrop) videoModalBackdrop.addEventListener('click', closeVideo);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal.classList.contains('active')) {
      closeVideo();
    }
  });

  // 8. Back to Top Button
  const backToTopBtn = document.getElementById('backToTopBtn');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 9. Scroll Reveal Animations & Number Counters
  const revealElements = document.querySelectorAll('.reveal-fade-right, .reveal-fade-left, .reveal-fade-up');
  
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          
          // Trigger number counter animation if inside the revealed section
          const counters = entry.target.querySelectorAll('.p-stat-num');
          counters.forEach(counter => {
            if (counter.dataset.animated) return;
            counter.dataset.animated = 'true';
            
            const targetVal = parseInt(counter.getAttribute('data-count'), 10);
            if (!targetVal) return;
            
            const originalText = counter.textContent;
            const suffix = originalText.replace(/^[0-9]+/, '');
            let current = 0;
            const duration = 1400;
            const stepTime = Math.max(20, Math.floor(duration / targetVal));
            const stepIncrement = Math.ceil(targetVal / (duration / stepTime));

            const timer = setInterval(() => {
              current += stepIncrement;
              if (current >= targetVal) {
                current = targetVal;
                counter.textContent = current + suffix;
                clearInterval(timer);
              } else {
                counter.textContent = current + suffix;
              }
            }, stepTime);
          });

          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver not supported
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  // 10. Subtle Interactive Tilt Effect on Presentation Media Card (Desktop)
  const mediaCard = document.querySelector('.presentation-media-wrapper');
  if (mediaCard && window.innerWidth > 992) {
    mediaCard.addEventListener('mousemove', (e) => {
      const rect = mediaCard.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const tiltX = (y / (rect.height / 2)) * -4;
      const tiltY = (x / (rect.width / 2)) * 4;
      
      const videoBox = mediaCard.querySelector('.presentation-video-box');
      if (videoBox) {
        videoBox.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-2px)`;
        videoBox.style.transition = 'transform 0.1s ease-out';
      }
    });

    mediaCard.addEventListener('mouseleave', () => {
      const videoBox = mediaCard.querySelector('.presentation-video-box');
      if (videoBox) {
        videoBox.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
        videoBox.style.transition = 'transform 0.5s ease';
      }
    });
  }

  // 11. Vehicle Brands & Categories Horizontal Carousel & Controls
  const catWrapper = document.getElementById('categoriesScrollWrapper');
  const catPrevBtn = document.getElementById('catPrevBtn');
  const catNextBtn = document.getElementById('catNextBtn');
  const catAutoplayBtn = document.getElementById('catAutoplayBtn');
  const catProgressBar = document.getElementById('catProgressBar');
  const catCards = document.querySelectorAll('.category-card');
  const catFilterPills = document.querySelectorAll('.cat-filter-pill');

  if (catWrapper) {
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    let autoScrollTimer = null;
    let isAutoScrolling = true;

    // A. Update Progress Bar
    function updateProgressBar() {
      if (!catProgressBar) return;
      const maxScroll = catWrapper.scrollWidth - catWrapper.clientWidth;
      if (maxScroll <= 0) {
        catProgressBar.style.width = '100%';
        catProgressBar.style.left = '0%';
        return;
      }
      const scrollPercent = (catWrapper.scrollLeft / maxScroll) * 100;
      const barWidth = 30; // 30% indicator width
      const maxLeft = 100 - barWidth;
      const currentLeft = (scrollPercent / 100) * maxLeft;
      
      catProgressBar.style.width = `${barWidth}%`;
      catProgressBar.style.left = `${Math.min(Math.max(0, currentLeft), maxLeft)}%`;
    }

    catWrapper.addEventListener('scroll', updateProgressBar, { passive: true });
    window.addEventListener('resize', updateProgressBar);
    setTimeout(updateProgressBar, 300);

    // B. Next / Prev Arrow Navigation
    const getScrollStep = () => {
      const firstCard = catWrapper.querySelector('.category-card');
      return firstCard ? firstCard.offsetWidth + 22 : 312;
    };

    if (catPrevBtn) {
      catPrevBtn.addEventListener('click', () => {
        catWrapper.scrollBy({ left: -getScrollStep() * 2, behavior: 'smooth' });
      });
    }

    if (catNextBtn) {
      catNextBtn.addEventListener('click', () => {
        const maxScroll = catWrapper.scrollWidth - catWrapper.clientWidth;
        if (catWrapper.scrollLeft >= maxScroll - 10) {
          catWrapper.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          catWrapper.scrollBy({ left: getScrollStep() * 2, behavior: 'smooth' });
        }
      });
    }

    // C. Drag to Scroll (Mouse & Touch)
    catWrapper.addEventListener('mousedown', (e) => {
      isDown = true;
      catWrapper.classList.add('is-dragging');
      startX = e.pageX - catWrapper.offsetLeft;
      scrollLeft = catWrapper.scrollLeft;
      pauseAutoScroll();
    });

    window.addEventListener('mouseup', () => {
      if (isDown) {
        isDown = false;
        catWrapper.classList.remove('is-dragging');
        if (isAutoScrolling) startAutoScroll();
      }
    });

    catWrapper.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - catWrapper.offsetLeft;
      const walk = (x - startX) * 1.6; // Scroll speed multiplier
      catWrapper.scrollLeft = scrollLeft - walk;
    });

    // D. Smooth Automatic Scroll Cycle
    function startAutoScroll() {
      stopAutoScroll();
      if (!isAutoScrolling) return;
      autoScrollTimer = setInterval(() => {
        if (isDown) return;
        const maxScroll = catWrapper.scrollWidth - catWrapper.clientWidth;
        if (catWrapper.scrollLeft >= maxScroll - 5) {
          catWrapper.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          catWrapper.scrollBy({ left: 1.5, behavior: 'auto' });
        }
      }, 30);
    }

    function stopAutoScroll() {
      if (autoScrollTimer) clearInterval(autoScrollTimer);
    }

    function pauseAutoScroll() {
      stopAutoScroll();
    }

    catWrapper.addEventListener('mouseenter', pauseAutoScroll);
    catWrapper.addEventListener('mouseleave', () => {
      if (isAutoScrolling && !isDown) startAutoScroll();
    });

    catWrapper.addEventListener('touchstart', pauseAutoScroll, { passive: true });
    catWrapper.addEventListener('touchend', () => {
      if (isAutoScrolling) startAutoScroll();
    }, { passive: true });

    if (catAutoplayBtn) {
      catAutoplayBtn.addEventListener('click', () => {
        isAutoScrolling = !isAutoScrolling;
        const icon = catAutoplayBtn.querySelector('i');
        if (isAutoScrolling) {
          catAutoplayBtn.classList.remove('paused');
          if (icon) {
            icon.classList.remove('fa-play');
            icon.classList.add('fa-pause');
          }
          startAutoScroll();
        } else {
          catAutoplayBtn.classList.add('paused');
          if (icon) {
            icon.classList.remove('fa-pause');
            icon.classList.add('fa-play');
          }
          stopAutoScroll();
        }
      });
    }

    // Start auto-scroll initially
    startAutoScroll();

    // E. Category Filter Pills Interactivity
    catFilterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        catFilterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        const filter = pill.getAttribute('data-cat-filter');
        let firstMatch = null;

        catCards.forEach(card => {
          const type = card.getAttribute('data-category-type') || '';
          if (filter === 'all' || type.includes(filter)) {
            card.classList.remove('dimmed');
            if (!firstMatch) firstMatch = card;
          } else {
            card.classList.add('dimmed');
          }
        });

        // Smoothly scroll to the first matching category card
        if (firstMatch && filter !== 'all') {
          const cardLeft = firstMatch.offsetLeft - catWrapper.offsetLeft - 30;
          catWrapper.scrollTo({ left: Math.max(0, cardLeft), behavior: 'smooth' });
        }
      });
    });

  }

});
