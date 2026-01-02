/*
 * Shared JavaScript helpers for the ePortfolio
 *
 * This script highlights the current page in the navigation bar based on the
 * URL.  It also exposes a simple helper to create accessible alerts when
 * needed by demos.  Additional page‑specific logic lives in demos.js.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Highlight active nav link by matching the end of the href with the current path
  const navLinks = document.querySelectorAll('.navbar-custom .nav-link');
  const current = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href === current) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
});

// Utility to announce messages to screen reader users
// Provide an announce function in the global scope.  This function
// creates or updates a hidden live region to relay dynamic messages to
// assistive technologies.  The politeness parameter controls the
// aria‑live property ("polite" or "assertive").
window.announce = function announce(message, politeness = 'polite') {
  let liveRegion = document.getElementById('live-region');
  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.id = 'live-region';
    liveRegion.setAttribute('aria-live', politeness);
    liveRegion.classList.add('visually-hidden');
    document.body.appendChild(liveRegion);
  }
  liveRegion.setAttribute('aria-live', politeness);
  liveRegion.textContent = '';
  // Delay insertion slightly to trigger screen readers reliably
  setTimeout(() => {
    liveRegion.textContent = message;
  }, 50);
};