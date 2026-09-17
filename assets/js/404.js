function stacklyGoBack(e) {
  if (e && typeof e.preventDefault === 'function') e.preventDefault();
  
  const prevPage = sessionStorage.getItem('stackly_prev_page');
  const prevSection = sessionStorage.getItem('stackly_prev_section');

  // 1. If we have a recorded previous page with exact section
  if (prevPage && !prevPage.includes('404')) {
    const target = (prevSection && !prevPage.includes('#')) ? (prevPage + '#' + prevSection) : prevPage;
    window.location.href = target;
    return;
  }

  // 2. Try browser history back
  if (window.history.length > 1 && document.referrer && !document.referrer.includes('404')) {
    window.history.back();
    return;
  }

  // 3. Try document.referrer
  if (document.referrer && !document.referrer.includes('404') && document.referrer !== window.location.href) {
    window.location.href = document.referrer;
    return;
  }

  // 4. Default fallback to buyer dashboard if logged in, otherwise index
  const authUser = localStorage.getItem('stackly_auth_user');
  if (authUser) {
    window.location.href = 'customer-dashboard.html#overviewTab';
  } else {
    window.location.href = 'index.html';
  }
}

window.stacklyGoBack = stacklyGoBack;

document.addEventListener('DOMContentLoaded', () => {
  // 1. Smart Go Back Button
  const goBackBtn = document.getElementById('errorGoBackBtn');
  if (goBackBtn) {
    goBackBtn.addEventListener('click', stacklyGoBack);
  }

  // 2. High-Performance 3D Perspective Tilt with Smooth Lerp
  const stage = document.querySelector('.error-3d-stage');
  const wrapper = document.querySelector('.error-page-wrapper');
  const cyberGrid = document.querySelector('.error-cyber-grid');

  if (stage && wrapper && window.innerWidth > 768) {
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    wrapper.addEventListener('mousemove', (e) => {
      const rect = wrapper.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      // Max rotation angles (degrees)
      targetX = -y * 18; // tilt up/down
      targetY = x * 22;  // tilt left/right
    });

    wrapper.addEventListener('mouseleave', () => {
      targetX = 0;
      targetY = 0;
    });

    // Smooth Animation Frame Loop (Linear Interpolation)
    function animate3DTilt() {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      stage.style.transform = `rotateX(${currentX.toFixed(2)}deg) rotateY(${currentY.toFixed(2)}deg)`;
      
      if (cyberGrid) {
        cyberGrid.style.transform = `translateZ(-80px) translate3d(${(-currentY * 1.8).toFixed(1)}px, ${(currentX * 1.8).toFixed(1)}px, 0)`;
      }

      requestAnimationFrame(animate3DTilt);
    }

    animate3DTilt();
  }
});
