/**
 * CarLink - Blog & Automotive Editorial Magazine Scripts
 * Enhanced GSAP 3 + ScrollTrigger & AOS Integration
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Safe Dismiss Preloader
  const loader = document.getElementById('pageLoader');
  if (loader) {
    loader.classList.add('loaded');
  }

  // 2. Initialize AOS (Animate On Scroll)
  if (typeof AOS !== 'undefined') {
    AOS.init({
      once: true,
      duration: 800,
      offset: 50,
      easing: 'ease-out-cubic'
    });
  }

  // 3. Check Reduced Motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 4. GSAP 3 & ScrollTrigger Animations
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    if (!prefersReducedMotion) {
      // Parallax image zoom on Featured Main Story
      const featuredMainImg = document.querySelector('.featured-main-img');
      const featuredSection = document.getElementById('featuredStoriesSection');
      if (featuredMainImg && featuredSection) {
        gsap.to(featuredMainImg, {
          scale: 1.08,
          ease: 'none',
          scrollTrigger: {
            trigger: featuredSection,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2
          }
        });
      }

      // Parallax image zoom on Expert Review Showcase
      const reviewMainImg = document.querySelector('.review-main-img');
      const reviewSection = document.getElementById('expertReviewsSection');
      if (reviewMainImg && reviewSection) {
        gsap.to(reviewMainImg, {
          scale: 1.07,
          ease: 'none',
          scrollTrigger: {
            trigger: reviewSection,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2
          }
        });
      }

      // Parallax image zoom on Insights Spotlight Guide
      const spotlightImg = document.querySelector('.insights-spotlight-img');
      const insightsSection = document.getElementById('insightsTipsSection');
      if (spotlightImg && insightsSection) {
        gsap.to(spotlightImg, {
          scale: 1.07,
          ease: 'none',
          scrollTrigger: {
            trigger: insightsSection,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2
          }
        });
      }

      // GSAP Micro-interactions for Category Cards
      const categoryCards = document.querySelectorAll('.blog-category-card');
      categoryCards.forEach(card => {
        const iconBox = card.querySelector('.blog-cat-icon-box');

        card.addEventListener('mouseenter', () => {
          if (iconBox) {
            gsap.to(iconBox, { y: -5, scale: 1.1, duration: 0.3, ease: 'back.out(2)' });
          }
        });

        card.addEventListener('mouseleave', () => {
          if (iconBox) {
            gsap.to(iconBox, { y: 0, scale: 1, duration: 0.25, ease: 'power2.out' });
          }
        });
      });

      // GSAP Micro-interactions for Read More links with Arrow Translation
      const cardLinks = document.querySelectorAll('.read-more-link, .featured-main-footer, .btn-newsletter-sub');
      cardLinks.forEach(link => {
        const arrow = link.querySelector('i, svg');
        link.addEventListener('mouseenter', () => {
          if (arrow) gsap.to(arrow, { x: 5, duration: 0.25, ease: 'power2.out' });
        });
        link.addEventListener('mouseleave', () => {
          if (arrow) gsap.to(arrow, { x: 0, duration: 0.25, ease: 'power2.out' });
        });
      });
    }

    // Rating Score Counter in Section 4 (Expert Car Reviews)
    const scoreElement = document.getElementById('reviewMainScore');
    const reviewSection = document.getElementById('expertReviewsSection');

    if (scoreElement && reviewSection) {
      const targetScore = parseFloat(scoreElement.dataset.score || '9.8');
      const counterObj = { val: 0.0 };

      ScrollTrigger.create({
        trigger: reviewSection,
        start: 'top 75%',
        once: true,
        onEnter: () => {
          gsap.to(counterObj, {
            val: targetScore,
            duration: 1.8,
            ease: 'power2.out',
            onUpdate: () => {
              scoreElement.textContent = counterObj.val.toFixed(1);
            }
          });
        }
      });
    } else if (scoreElement) {
      scoreElement.textContent = scoreElement.dataset.score || '9.8';
    }

    // Refresh ScrollTrigger after window load
    window.addEventListener('load', () => {
      ScrollTrigger.refresh();
    });
  }

  // 5. Interactive Category 3D Flip Card Toggle
  const categoryFlipCards = document.querySelectorAll('.category-flip-card');
  categoryFlipCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // If user clicked directly on explore button/link, allow default link navigation
      if (e.target.closest('.btn-cat-explore')) {
        return;
      }
      categoryFlipCards.forEach(c => {
        if (c !== card) c.classList.remove('active-card', 'flipped');
      });
      card.classList.toggle('flipped');
      card.classList.add('active-card');
    });
  });

  // 6. Section 1 Editorial Filter Pills with Smooth Scroll Navigation
  const filterPills = document.querySelectorAll('.editorial-filter-pill');
  const editorialArticles = document.querySelectorAll('.featured-editorial-grid article');

  const storyTargetMap = {
    'all': '#featuredStoriesSection',
    'hypercar': '#story-hypercar',
    'suv': '#story-suv',
    'offroad': '#story-offroad'
  };

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const targetFilter = pill.dataset.filter;

      editorialArticles.forEach(article => {
        const cat = article.dataset.category;
        article.classList.remove('story-card-pulse');
        if (targetFilter === 'all' || cat === targetFilter) {
          article.classList.remove('is-dimmed');
          article.classList.add('is-highlighted');
        } else {
          article.classList.remove('is-highlighted');
          article.classList.add('is-dimmed');
        }
      });

      // Smooth scroll to the target section or story card
      const targetSelector = storyTargetMap[targetFilter];
      if (targetSelector) {
        const targetEl = document.querySelector(targetSelector);
        if (targetEl) {
          const header = document.querySelector('.site-header');
          const headerHeight = header ? header.offsetHeight : 80;
          const targetY = targetEl.getBoundingClientRect().top + window.pageYOffset - (headerHeight + 24);

          window.scrollTo({
            top: targetY,
            behavior: 'smooth'
          });

          // Add pulse highlight animation to specific story card
          if (targetFilter !== 'all') {
            targetEl.classList.remove('story-card-pulse');
            void targetEl.offsetWidth; // Trigger DOM reflow to restart animation
            targetEl.classList.add('story-card-pulse');
          }
        }
      }
    });
  });

  // 7. Section 2 News Filter Pills
  const newsFilterPills = document.querySelectorAll('.news-filter-pill');
  const newsCardItems = document.querySelectorAll('.news-cards-grid .news-card-item');

  newsFilterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      newsFilterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const targetFilter = pill.dataset.newsFilter;

      newsCardItems.forEach(card => {
        const cat = card.dataset.category;
        if (targetFilter === 'all' || cat === targetFilter) {
          card.classList.remove('is-dimmed');
          card.classList.add('is-highlighted');
        } else {
          card.classList.remove('is-highlighted');
          card.classList.add('is-dimmed');
        }
      });
    });
  });

  // 8. Interactive Story Bookmark Toggle (routed to 404.html with section recovery)
  const bookmarkButtons = document.querySelectorAll('.story-bookmark-btn:not([href])');
  bookmarkButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      btn.classList.toggle('saved');
    });
  });

  // 8. Newsletter Subscription Form Handler with JavaScript Validation & 404 Redirection
  const newsletterForm = document.getElementById('blogNewsletterForm');
  if (newsletterForm) {
    const emailInput = newsletterForm.querySelector('.newsletter-input');
    const feedbackMsg = document.getElementById('newsletterFeedbackMsg');
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const clearError = () => {
      newsletterForm.classList.remove('has-error');
      if (feedbackMsg) {
        feedbackMsg.style.display = 'none';
        feedbackMsg.className = 'newsletter-feedback-msg';
        feedbackMsg.innerHTML = '';
      }
    };

    if (emailInput) {
      emailInput.addEventListener('input', clearError);
      emailInput.addEventListener('focus', clearError);
    }

    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailValue = emailInput ? emailInput.value.trim() : '';

      if (!emailValue) {
        // Empty validation error via JavaScript
        newsletterForm.classList.remove('has-error');
        void newsletterForm.offsetWidth; // trigger reflow for shake animation
        newsletterForm.classList.add('has-error');
        if (feedbackMsg) {
          feedbackMsg.className = 'newsletter-feedback-msg error-msg';
          feedbackMsg.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Please enter your email address to subscribe.';
          feedbackMsg.style.display = 'flex';
        }
        if (emailInput) emailInput.focus();
        return;
      }

      if (!emailRegex.test(emailValue)) {
        // Invalid email format error via JavaScript
        newsletterForm.classList.remove('has-error');
        void newsletterForm.offsetWidth;
        newsletterForm.classList.add('has-error');
        if (feedbackMsg) {
          feedbackMsg.className = 'newsletter-feedback-msg error-msg';
          feedbackMsg.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Please enter a valid email address (e.g. name@domain.com).';
          feedbackMsg.style.display = 'flex';
        }
        if (emailInput) emailInput.focus();
        return;
      }

      // Valid email entered -> Redirect to 404 error page with section recovery
      clearError();
      try {
        sessionStorage.setItem('stackly_prev_page', window.location.href);
        sessionStorage.setItem('stackly_prev_path', 'blog.html#newsletterTrendingSection');
        sessionStorage.setItem('stackly_prev_section', 'newsletterTrendingSection');
        sessionStorage.setItem('stackly_prev_scroll', window.scrollY.toString());
      } catch (err) {}

      window.location.href = '404.html';
    });
  }
});
