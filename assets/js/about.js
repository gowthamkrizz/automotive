/**
 * CarLink - About Us Interactive Scripts
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
      offset: 60,
      easing: 'ease-out-cubic'
    });
  }

  // 3. Check Reduced Motion Preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 4. GSAP 3 & ScrollTrigger Animations
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    if (!prefersReducedMotion) {
      // Parallax image zoom on Story Section Main Image
      const storyMainImg = document.querySelector('.story-main-img');
      const storySection = document.getElementById('storySection');
      if (storyMainImg && storySection) {
        gsap.to(storyMainImg, {
          scale: 1.08,
          ease: 'none',
          scrollTrigger: {
            trigger: storySection,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2
          }
        });
      }

      // Parallax image zoom on Inspection Car Image
      const inspectionCarImg = document.querySelector('.inspection-car-img');
      const qualitySection = document.getElementById('qualitySection');
      if (inspectionCarImg && qualitySection) {
        gsap.to(inspectionCarImg, {
          scale: 1.05,
          ease: 'none',
          scrollTrigger: {
            trigger: qualitySection,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2
          }
        });
      }

      // GSAP Micro-interactions for Why Feature Cards
      const featureCards = document.querySelectorAll('.why-feature-card');
      featureCards.forEach(card => {
        const iconBox = card.querySelector('.why-icon-box');
        card.addEventListener('mouseenter', () => {
          if (iconBox) gsap.to(iconBox, { y: -5, scale: 1.12, duration: 0.3, ease: 'back.out(2)' });
        });
        card.addEventListener('mouseleave', () => {
          if (iconBox) gsap.to(iconBox, { y: 0, scale: 1, duration: 0.25, ease: 'power2.out' });
        });
      });

      // GSAP Micro-interactions for Journey Step Cards
      const stepCards = document.querySelectorAll('.journey-step-card');
      stepCards.forEach(card => {
        const iconWrap = card.querySelector('.step-icon-wrap');
        card.addEventListener('mouseenter', () => {
          if (iconWrap) gsap.to(iconWrap, { scale: 1.15, duration: 0.3, ease: 'back.out(2)' });
        });
        card.addEventListener('mouseleave', () => {
          if (iconWrap) gsap.to(iconWrap, { scale: 1, duration: 0.25, ease: 'power2.out' });
        });
      });
    }

    // 5. Animated Number Counters in Story Section
    const counters = document.querySelectorAll('.story-counter');
    const storySection = document.getElementById('storySection');
    if (counters.length > 0 && storySection) {
      ScrollTrigger.create({
        trigger: storySection,
        start: 'top 75%',
        once: true,
        onEnter: () => {
          counters.forEach(counter => {
            const target = parseFloat(counter.dataset.count || '0');
            const suffix = counter.dataset.suffix || '';
            const isDecimal = parseInt(counter.dataset.decimal || '0', 10) > 0;
            const obj = { val: 0 };

            gsap.to(obj, {
              val: target,
              duration: 2.0,
              ease: 'power2.out',
              onUpdate: () => {
                if (isDecimal) {
                  counter.textContent = obj.val.toFixed(1) + suffix;
                } else if (target >= 1000) {
                  counter.textContent = Math.floor(obj.val).toLocaleString() + suffix;
                } else {
                  counter.textContent = Math.floor(obj.val) + suffix;
                }
              }
            });
          });
        }
      });
    }

    // 6. GSAP ScrollTrigger Timeline Progress Bar
    const timelineProgress = document.getElementById('timelineProgressLine');
    const timelineSection = document.getElementById('journeyTimelineSection');
    if (timelineProgress && timelineSection) {
      gsap.to(timelineProgress, {
        height: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: timelineSection,
          start: 'top 60%',
          end: 'bottom 80%',
          scrub: 0.5
        }
      });
    }

    // Refresh ScrollTrigger on window load
    window.addEventListener('load', () => {
      ScrollTrigger.refresh();
    });
  }

  // 7. Interactive Inspection Checkpoint Hotspots, Tabs & Cards
  const inspectionTabs = document.querySelectorAll('.inspection-tab');
  const hotspots = document.querySelectorAll('.inspection-hotspot');
  const checkpointCards = document.querySelectorAll('.checkpoint-card');
  const inspectionMainImg = document.getElementById('inspectionMainImg');
  const inspectionHudBadge = document.getElementById('inspectionHudBadge');
  const inspectionHudTitle = document.getElementById('inspectionHudTitle');
  const inspectionHudReadout = document.getElementById('inspectionHudReadout');
  const inspectionMetric1 = document.getElementById('inspectionMetric1');
  const inspectionMetric2 = document.getElementById('inspectionMetric2');
  const screenWrap = document.querySelector('.inspection-screen-wrap');

  const inspectionModules = {
    overview: {
      title: "150-Point Master Laser Telemetry Scan",
      badge: "FULL CHASSIS SCAN • ACTIVE",
      readout: "<i class=\"fa-solid fa-circle-check\"></i> SYSTEMS 100% OK",
      metric1: "150 Checkpoints Scanned",
      metric2: "0.0 Micron Variance",
      img: "assets/images/inspection/chassis-overview.jpg"
    },
    tires: {
      title: "Tread Depth, Damper & Road-Force Balancing",
      badge: "MICHELIN SPORT • 95% TREAD",
      readout: "<i class=\"fa-solid fa-circle-check text-emerald\"></i> 6.2mm TREAD DEPTH",
      metric1: "Laser Road Balanced",
      metric2: "Active Coilovers OK",
      img: "assets/images/inspection/tires-inspection.jpg"
    },
    engine: {
      title: "Engine & Drivetrain Compression Diagnostics",
      badge: "CYLINDER COMPRESSION • TESTED",
      readout: "<i class=\"fa-solid fa-circle-check text-emerald\"></i> 175 PSI BALANCED",
      metric1: "Dyno Certified Output",
      metric2: "Zero Fluid Dilution",
      img: "assets/images/inspection/engine-inspection.jpg"
    },
    brakes: {
      title: "Carbon Ceramic Brake & Caliper Telemetry",
      badge: "ROTOR WEAR DEPTH • 98%",
      readout: "<i class=\"fa-solid fa-circle-check text-emerald\"></i> 11.5mm CARBON PAD",
      metric1: "Brembo Racing Spec",
      metric2: "Thermal Parity Verified",
      img: "assets/images/inspection/brakes-inspection.jpg"
    },
    interior: {
      title: "Cockpit, Infotainment & Digital Cluster Scan",
      badge: "AVIONICS & HUD • PASS",
      readout: "<i class=\"fa-solid fa-circle-check text-emerald\"></i> ZERO FAULT CODES",
      metric1: "Premium Audio Calibrated",
      metric2: "Seat Motors 100% OK",
      img: "assets/images/inspection/cockpit-inspection.jpg"
    },
    safety: {
      title: "LiDAR, Radar & 360° Safety Matrix Alignment",
      badge: "ACTIVE RADAR • 150m RANGE",
      readout: "<i class=\"fa-solid fa-circle-check text-emerald\"></i> 84k DATA POINTS/SEC",
      metric1: "Autonomous Radar Parity",
      metric2: "Zero Sensor Drift",
      img: "assets/images/inspection/safety-inspection.jpg"
    },
    exterior: {
      title: "Ultrasonic Paint Depth & Body Integrity",
      badge: "MICRON DEPTH • FACTORY SPECS",
      readout: "<i class=\"fa-solid fa-circle-check text-emerald\"></i> 148.5 µm UNIFORM",
      metric1: "Zero Body Fillers",
      metric2: "Ceramic Seal Verified",
      img: "assets/images/inspection/paint-inspection.jpg"
    }
  };

  function setActiveInspectionTarget(target, shouldScroll = false) {
    const data = inspectionModules[target] || inspectionModules.overview;

    // Update Tabs
    inspectionTabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.target === target);
    });

    // Update Hotspots
    hotspots.forEach(spot => {
      const isMatch = (spot.dataset.target === target);
      spot.classList.toggle('active', isMatch);
      // Hide hotspots if in specific component view, show all in overview or target highlighted
      if (target === 'overview') {
        spot.style.opacity = '1';
        spot.style.pointerEvents = 'auto';
      } else {
        spot.style.opacity = isMatch ? '1' : '0.2';
      }
    });

    // Update Checkpoint Cards
    checkpointCards.forEach(card => {
      const isMatch = (card.dataset.checkpoint === target);
      card.classList.toggle('active', isMatch);
      if (isMatch && shouldScroll) {
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });

    // Update Image with smooth fade and scan trigger
    if (inspectionMainImg && data.img && inspectionMainImg.getAttribute('src') !== data.img) {
      inspectionMainImg.style.opacity = '0.3';
      inspectionMainImg.style.transform = 'scale(0.98)';
      setTimeout(() => {
        inspectionMainImg.src = data.img;
        inspectionMainImg.style.opacity = '1';
        inspectionMainImg.style.transform = 'scale(1)';
      }, 150);
    }

    // Trigger Laser Scan Animation
    if (screenWrap) {
      const laser = screenWrap.querySelector('.laser-scan-line');
      if (laser) {
        laser.style.animation = 'none';
        laser.offsetHeight; /* trigger reflow */
        laser.style.animation = 'laserScan 3.5s cubic-bezier(0.4, 0, 0.2, 1) infinite';
      }
    }

    // Update HUD text
    if (inspectionHudTitle) inspectionHudTitle.textContent = data.title;
    if (inspectionHudBadge) inspectionHudBadge.textContent = data.badge;
    if (inspectionHudReadout) inspectionHudReadout.innerHTML = data.readout;
    if (inspectionMetric1) inspectionMetric1.textContent = data.metric1;
    if (inspectionMetric2) inspectionMetric2.textContent = data.metric2;
  }

  // Tabs Events
  inspectionTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.stopPropagation();
      const target = tab.dataset.target;
      setActiveInspectionTarget(target, false);
    });
  });

  // Hotspot Events
  hotspots.forEach(spot => {
    spot.addEventListener('click', (e) => {
      e.stopPropagation();
      const target = spot.dataset.target;
      setActiveInspectionTarget(target, true);
    });

    spot.addEventListener('mouseenter', () => {
      const target = spot.dataset.target;
      setActiveInspectionTarget(target, false);
    });
  });

  // Checkpoint Cards Events
  checkpointCards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.stopPropagation();
      const target = card.dataset.checkpoint;
      setActiveInspectionTarget(target, false);
    });

    card.addEventListener('mouseenter', () => {
      const target = card.dataset.checkpoint;
      setActiveInspectionTarget(target, false);
    });
  });

  // 8. Mobile/Touch Click-to-Flip Support for Journey Cards
  const flipCards = document.querySelectorAll('.journey-flip-card');
  flipCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // If user clicked directly on a link or button inside, allow standard link behavior
      if (e.target.closest('a') || e.target.closest('button')) {
        return;
      }
      card.classList.toggle('flipped');
    });
  });
});

