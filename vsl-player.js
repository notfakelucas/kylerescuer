/**
 * Self-hosted VSL Player for Kyle Rescuer
 * High-conversion minimalist VSL player with instant autoplay, English unmute banner, and sleek progress bar only.
 */
(function() {
  'use strict';

  function getBasePrefix() {
    var loc = window.location;
    if (loc.protocol === 'file:') {
      return '';
    }
    var path = loc.pathname;
    if (path.match(/\/(v\d+|thank-you|privacy-policy|terms-and-conditions|cookie-policy|donation-policy|refund-policy)\/?$/)) {
      return '../';
    }
    return '';
  }

  function resolvePath(relativePath) {
    if (relativePath.startsWith('/') && !window.location.protocol.startsWith('file')) {
      var parts = window.location.pathname.split('/').filter(Boolean);
      if (parts.length > 0 && parts[0] === 'kylerescuer') {
        return '/kylerescuer' + relativePath;
      }
      return relativePath;
    }
    return getBasePrefix() + relativePath.replace(/^\//, '');
  }

  var VIDEO_SRC = resolvePath('/vsl-kylerescuer.mp4');
  var POSTER_SRC = resolvePath('/caio/vsl-poster.webp');

  // Inject keyframe animation for unmute banner
  if (!document.getElementById('vsl-player-style')) {
    var style = document.createElement('style');
    style.id = 'vsl-player-style';
    style.innerHTML = '@keyframes vslPulse{0%,100%{transform:translate(-50%,-50%) scale(1);box-shadow:0 6px 20px rgba(220,38,38,0.5);}50%{transform:translate(-50%,-50%) scale(1.06);box-shadow:0 12px 35px rgba(220,38,38,0.9);}}';
    document.head.appendChild(style);
  }

  // Register mock smartplayer global
  window.smartplayer = window.smartplayer || {
    instances: {},
    destroy: function() {},
    pause: function() {}
  };

  function createPlayerUI(container, videoSrc, posterSrc) {
    var existingVideo = container.querySelector('video');

    container.innerHTML = '';
    container.style.position = 'relative';
    container.style.width = '100%';
    container.style.paddingTop = '78.15%'; // 922x720 aspect ratio
    container.style.backgroundColor = '#000';
    container.style.borderRadius = '14px';
    container.style.overflow = 'hidden';
    container.style.boxShadow = '0 20px 40px rgba(0,0,0,0.4)';
    container.style.cursor = 'pointer';

    var wrapper = document.createElement('div');
    wrapper.style.position = 'absolute';
    wrapper.style.inset = '0';
    wrapper.style.display = 'flex';
    wrapper.style.alignItems = 'center';
    wrapper.style.justifyContent = 'center';

    var video = existingVideo || document.createElement('video');
    video.src = videoSrc;
    video.poster = posterSrc;
    video.setAttribute('autoplay', '');
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('x5-playsinline', '');
    video.autoplay = true;
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.preload = 'auto';
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.objectFit = 'cover';
    video.style.display = 'block';

    // Unmute Banner (in English, high-conversion VSL copy)
    var unmuteBanner = document.createElement('div');
    unmuteBanner.style.position = 'absolute';
    unmuteBanner.style.top = '50%';
    unmuteBanner.style.left = '50%';
    unmuteBanner.style.transform = 'translate(-50%, -50%)';
    unmuteBanner.style.zIndex = '30';
    unmuteBanner.style.backgroundColor = '#dc2626';
    unmuteBanner.style.color = '#fff';
    unmuteBanner.style.padding = '14px 28px';
    unmuteBanner.style.borderRadius = '9999px';
    unmuteBanner.style.fontSize = '15px';
    unmuteBanner.style.fontWeight = '800';
    unmuteBanner.style.letterSpacing = '0.04em';
    unmuteBanner.style.textTransform = 'uppercase';
    unmuteBanner.style.display = 'flex';
    unmuteBanner.style.alignItems = 'center';
    unmuteBanner.style.gap = '10px';
    unmuteBanner.style.cursor = 'pointer';
    unmuteBanner.style.animation = 'vslPulse 1.8s infinite ease-in-out';
    unmuteBanner.innerHTML = '<span style="font-size:22px;">🔊</span> <span>CLICK TO LISTEN!</span>';

    // Minimalist Full-Width Video Progress Bar ONLY (no play button, no time, no volume, no fullscreen)
    var progressContainer = document.createElement('div');
    progressContainer.style.position = 'absolute';
    progressContainer.style.bottom = '0';
    progressContainer.style.left = '0';
    progressContainer.style.right = '0';
    progressContainer.style.height = '6px';
    progressContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.45)';
    progressContainer.style.zIndex = '25';
    progressContainer.style.cursor = 'pointer';

    var progressBar = document.createElement('div');
    progressBar.style.height = '100%';
    progressBar.style.width = '0%';
    progressBar.style.backgroundColor = '#dc2626';
    progressBar.style.boxShadow = '0 0 10px rgba(220, 38, 38, 0.7)';
    progressBar.style.transition = 'width 0.1s linear';
    progressContainer.appendChild(progressBar);

    wrapper.appendChild(video);
    wrapper.appendChild(unmuteBanner);
    wrapper.appendChild(progressContainer);
    container.appendChild(wrapper);

    // Toggle Play/Pause
    function togglePlay(e) {
      if (e) e.stopPropagation();
      if (video.paused) {
        if (video.muted) {
          video.muted = false;
          unmuteBanner.style.display = 'none';
        }
        video.play();
      } else {
        video.pause();
      }
    }

    // Unmute Action
    function handleUnmute(e) {
      if (e) e.stopPropagation();
      video.muted = false;
      video.volume = 1;
      video.currentTime = 0; // Restart from start with full audio
      video.play();
      unmuteBanner.style.display = 'none';
    }

    // Click anywhere on player
    container.addEventListener('click', function(e) {
      if (video.muted) {
        handleUnmute(e);
      } else {
        togglePlay(e);
      }
    });

    unmuteBanner.addEventListener('click', handleUnmute);

    progressContainer.addEventListener('click', function(e) {
      e.stopPropagation();
      var rect = progressContainer.getBoundingClientRect();
      var pos = (e.clientX - rect.left) / rect.width;
      video.currentTime = pos * video.duration;
    });

    video.addEventListener('timeupdate', function() {
      if (video.duration) {
        var pct = (video.currentTime / video.duration) * 100;
        progressBar.style.width = pct + '%';
      }
    });

    video.addEventListener('ended', function() {
      video.currentTime = 0;
    });

    // Guaranteed Autoplay
    function startAutoplay() {
      video.muted = true;
      video.defaultMuted = true;
      var playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.then(function() {
          unmuteBanner.style.display = 'flex';
        }).catch(function() {
          // If browser policy requires gesture, listen once on window
          var oneTouch = function() {
            video.play();
            window.removeEventListener('click', oneTouch);
            window.removeEventListener('touchstart', oneTouch);
          };
          window.addEventListener('click', oneTouch, { once: true });
          window.addEventListener('touchstart', oneTouch, { once: true });
        });
      }
    }

    startAutoplay();
    video.addEventListener('canplay', function() {
      if (video.paused) startAutoplay();
    }, { once: true });

    window.smartplayer[container.id || 'main'] = video;
  }

  class VTurbSmartPlayerElement extends HTMLElement {
    connectedCallback() {
      createPlayerUI(this, VIDEO_SRC, POSTER_SRC);
    }
  }

  if (!customElements.get('vturb-smartplayer')) {
    customElements.define('vturb-smartplayer', VTurbSmartPlayerElement);
  }

  function initAll() {
    var players = document.querySelectorAll('vturb-smartplayer');
    players.forEach(function(p) {
      if (!p.querySelector('video')) {
        createPlayerUI(p, VIDEO_SRC, POSTER_SRC);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
