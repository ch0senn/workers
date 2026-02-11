// script.js
// Controls active button state and updates the YouTube iframe src.
// Replace VIDEO_ID_x placeholders in index.html with real YouTube video IDs.
// Format for embed URL: https://www.youtube.com/embed/VIDEO_ID?autoplay=1&rel=0&modestbranding=1

document.addEventListener('DOMContentLoaded', () => {
  const buttons = Array.from(document.querySelectorAll('.vid-btn'));
  const iframe = document.getElementById('player');

  if (!buttons.length || !iframe) return;

  // Helper: set a video id into iframe with autoplay
  function loadVideo(videoId) {
    if (!videoId) {
      iframe.src = 'about:blank';
      return;
    }
    // autoplay=1 may be blocked by browsers unless the video is muted.
    // For best compatibility consider using the YouTube IFrame API for programmatic control.
    iframe.src = `https://www.youtube.com/embed/${encodeURIComponent(videoId)}?autoplay=1&rel=0&modestbranding=1`;
  }

  // Set active state: only one button active at a time
  function setActiveButton(activeBtn) {
    buttons.forEach(btn => {
      const isActive = (btn === activeBtn);
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  // Click handler
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      // If same button clicked and already active, do nothing (or optionally pause)
      if (btn.classList.contains('active')) return;
      setActiveButton(btn);
      const vid = btn.dataset.video;
      loadVideo(vid);
      // Update focus for keyboard users
      btn.focus();
    });
  });

  // Initialize: activate first button if present
  const first = buttons[0];
  if (first) {
    setActiveButton(first);
    loadVideo(first.dataset.video);
  }

  // Optional: keyboard shortcuts 1..9,0, q..p for quick access (non-intrusive)
  document.addEventListener('keydown', (e) => {
    // only respond when user is not typing in an input/textarea
    const tag = document.activeElement && document.activeElement.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement.isContentEditable) return;

    // Map keys: digits 1-9,0 to buttons 0..9; letters a..t to 10..19
    const key = e.key;
    let idx = -1;
    if (/^[1-9]$/.test(key)) idx = parseInt(key, 10) - 1;          // 1->0 ... 9->8
    else if (key === '0') idx = 9;                                // 0 -> 9
    else {
      // letters a..t -> index 10..29; map a->10 .. t->29 (we only have 20)
      const code = key.toLowerCase().charCodeAt(0);
      if (code >= 97 && code <= 116) { // a..t
        idx = 10 + (code - 97);
      }
    }
    if (idx >= 0 && idx < buttons.length) {
      buttons[idx].click();
    }
  });

});