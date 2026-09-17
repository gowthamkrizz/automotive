/**
 * CarLink - Contact Page Interactive Scripts
 * GSAP 3 + ScrollTrigger & AOS Integration
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize AOS (Animate On Scroll)
  if (typeof AOS !== 'undefined') {
    AOS.init({
      once: true,
      duration: 800,
      offset: 50,
      easing: 'ease-out-cubic'
    });
  }

  // 2. Check Reduced Motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 3. Register GSAP ScrollTrigger
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    if (!prefersReducedMotion) {
      // Section 1: Flip Card Touch / Hover Micro-interactions
      const hubFlipCards = document.querySelectorAll('.contact-hub-flip-card');
      hubFlipCards.forEach(card => {
        card.addEventListener('click', (e) => {
          // If clicked on an interactive link inside back card, allow navigation
          if (e.target.closest('a') || e.target.closest('button')) return;
          // Toggle flipped class for mobile/touch
          card.classList.toggle('flipped');
        });
      });

      // Section 2: Showroom Map Marker Entry Animation with ScrollTrigger
      const mapMarker = document.getElementById('showroomMapMarker');
      const showroomSection = document.getElementById('showroomSection');
      if (mapMarker && showroomSection) {
        gsap.fromTo(
          mapMarker,
          { scale: 0.2, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.9,
            ease: 'back.out(1.8)',
            scrollTrigger: {
              trigger: showroomSection,
              start: 'top 75%',
              toggleActions: 'play none none none'
            }
          }
        );
      }

      // Section 2: Showroom visual subtle zoom
      const showroomVisual = document.querySelector('.showroom-visual-img');
      if (showroomVisual && showroomSection) {
        gsap.to(showroomVisual, {
          scale: 1.08,
          ease: 'none',
          scrollTrigger: {
            trigger: showroomSection,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2
          }
        });
      }

      // Section 3: Inquiry Automotive Image ScrollTrigger Scale
      const inquiryImg = document.querySelector('.inquiry-bg-img');
      const inquirySection = document.getElementById('inquirySection');
      if (inquiryImg && inquirySection) {
        gsap.fromTo(
          inquiryImg,
          { scale: 1.12 },
          {
            scale: 1.02,
            ease: 'none',
            scrollTrigger: {
              trigger: inquirySection,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.5
            }
          }
        );
      }

      // Section 3: Submit button hover animation
      const submitBtn = document.querySelector('.inquiry-submit-btn');
      if (submitBtn) {
        submitBtn.addEventListener('mouseenter', () => {
          gsap.to(submitBtn, { y: -3, duration: 0.25, ease: 'power2.out' });
        });
        submitBtn.addEventListener('mouseleave', () => {
          gsap.to(submitBtn, { y: 0, duration: 0.25, ease: 'power2.out' });
        });
      }

      // Section 4: Test Drive CTA Background Parallax / Slow Scale
      const testDriveImg = document.querySelector('.test-drive-bg-img');
      const testDriveSection = document.getElementById('testDriveSection');
      if (testDriveImg && testDriveSection) {
        gsap.fromTo(
          testDriveImg,
          { scale: 1.18, y: '-4%' },
          {
            scale: 1.04,
            y: '4%',
            ease: 'none',
            scrollTrigger: {
              trigger: testDriveSection,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2
            }
          }
        );
      }

      // Section 4: CTA Button hover interactions
      const ctaButtons = document.querySelectorAll('.test-drive-actions .cta-btn-primary, .test-drive-actions .cta-btn-secondary');
      ctaButtons.forEach(btn => {
        const icon = btn.querySelector('i');
        btn.addEventListener('mouseenter', () => {
          if (icon) gsap.to(icon, { x: 5, duration: 0.25, ease: 'power2.out' });
        });
        btn.addEventListener('mouseleave', () => {
          if (icon) gsap.to(icon, { x: 0, duration: 0.25, ease: 'power2.out' });
        });
      });
    }

    // Refresh ScrollTrigger after window load
    window.addEventListener('load', () => {
      ScrollTrigger.refresh();
    });
  }

  // 4. Functional Form Submission Handler with JavaScript Validation & 404 Redirection
  const contactInquiryForm = document.getElementById('contactInquiryForm');
  const formFeedbackAlert = document.getElementById('formFeedbackAlert');

  if (contactInquiryForm) {
    const fullNameInput = document.getElementById('inquiryFullName');
    const emailInput = document.getElementById('inquiryEmail');
    const phoneInput = document.getElementById('inquiryPhone');
    const typeSelect = document.getElementById('inquiryType');
    const messageInput = document.getElementById('inquiryMessage');
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Clear field error state on input/change
    const inputsToWatch = [fullNameInput, emailInput, phoneInput, typeSelect, messageInput].filter(Boolean);
    inputsToWatch.forEach(input => {
      const clearFieldError = () => {
        const wrapper = input.closest('.custom-input-wrapper');
        if (wrapper) wrapper.classList.remove('is-invalid');
        if (formFeedbackAlert) {
          formFeedbackAlert.style.display = 'none';
          formFeedbackAlert.className = 'form-feedback-alert';
          formFeedbackAlert.innerHTML = '';
        }
      };
      input.addEventListener('input', clearFieldError);
      input.addEventListener('change', clearFieldError);
    });

    contactInquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      let firstInvalidElement = null;
      let errorMessage = '';

      // Reset previous error classes
      inputsToWatch.forEach(input => {
        const wrapper = input.closest('.custom-input-wrapper');
        if (wrapper) wrapper.classList.remove('is-invalid');
      });

      // 1. Validate Full Name
      const nameVal = fullNameInput ? fullNameInput.value.trim() : '';
      if (!nameVal || nameVal.length < 2) {
        isValid = false;
        const wrapper = fullNameInput?.closest('.custom-input-wrapper');
        if (wrapper) wrapper.classList.add('is-invalid');
        if (!firstInvalidElement) {
          firstInvalidElement = fullNameInput;
          errorMessage = 'Please enter your full name (minimum 2 characters).';
        }
      }

      // 2. Validate Email
      const emailVal = emailInput ? emailInput.value.trim() : '';
      if (!emailVal) {
        isValid = false;
        const wrapper = emailInput?.closest('.custom-input-wrapper');
        if (wrapper) wrapper.classList.add('is-invalid');
        if (!firstInvalidElement) {
          firstInvalidElement = emailInput;
          errorMessage = 'Please enter your email address.';
        }
      } else if (!emailRegex.test(emailVal)) {
        isValid = false;
        const wrapper = emailInput?.closest('.custom-input-wrapper');
        if (wrapper) wrapper.classList.add('is-invalid');
        if (!firstInvalidElement) {
          firstInvalidElement = emailInput;
          errorMessage = 'Please enter a valid email address (e.g. name@domain.com).';
        }
      }

      // 3. Validate Phone Number
      const phoneVal = phoneInput ? phoneInput.value.trim() : '';
      const phoneDigits = phoneVal.replace(/[^0-9]/g, '');
      if (!phoneVal) {
        isValid = false;
        const wrapper = phoneInput?.closest('.custom-input-wrapper');
        if (wrapper) wrapper.classList.add('is-invalid');
        if (!firstInvalidElement) {
          firstInvalidElement = phoneInput;
          errorMessage = 'Please enter your phone number.';
        }
      } else if (phoneDigits.length < 7 || phoneDigits.length > 15 || !/^[+0-9\s\-().]{7,20}$/.test(phoneVal)) {
        isValid = false;
        const wrapper = phoneInput?.closest('.custom-input-wrapper');
        if (wrapper) wrapper.classList.add('is-invalid');
        if (!firstInvalidElement) {
          firstInvalidElement = phoneInput;
          errorMessage = 'Please enter a valid phone number (minimum 7-10 digits).';
        }
      }

      // 4. Validate Inquiry Type
      const typeVal = typeSelect ? typeSelect.value : '';
      if (!typeVal) {
        isValid = false;
        const wrapper = typeSelect?.closest('.custom-input-wrapper');
        if (wrapper) wrapper.classList.add('is-invalid');
        if (!firstInvalidElement) {
          firstInvalidElement = typeSelect;
          errorMessage = 'Please select an inquiry category.';
        }
      }

      // 5. Validate Message
      const messageVal = messageInput ? messageInput.value.trim() : '';
      if (!messageVal || messageVal.length < 5) {
        isValid = false;
        const wrapper = messageInput?.closest('.custom-input-wrapper');
        if (wrapper) wrapper.classList.add('is-invalid');
        if (!firstInvalidElement) {
          firstInvalidElement = messageInput;
          errorMessage = 'Please enter your message (minimum 5 characters).';
        }
      }

      // If validation fails, display JavaScript error message and focus first invalid field
      if (!isValid) {
        if (formFeedbackAlert) {
          formFeedbackAlert.className = 'form-feedback-alert error';
          formFeedbackAlert.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${errorMessage || 'Please fill in all required fields correctly.'}`;
          formFeedbackAlert.style.display = 'flex';
          formFeedbackAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        if (firstInvalidElement) {
          firstInvalidElement.focus();
        }
        return;
      }

      // All details, email ID, and phone number are valid -> Save return section & redirect to 404.html
      try {
        sessionStorage.setItem('stackly_prev_page', window.location.href);
        sessionStorage.setItem('stackly_prev_path', 'contact.html#inquirySection');
        sessionStorage.setItem('stackly_prev_section', 'inquirySection');
        sessionStorage.setItem('stackly_prev_scroll', window.scrollY.toString());
      } catch (err) {}

      window.location.href = '404.html';
    });
  }
});
