/**
 * Self-hosted VSL Player for Kyle Rescuer
 * High-conversion video player with guaranteed instant autoplay, unmute banner, and full controls.
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
    style.innerHTML = '@keyframes vslPulse{0%,100%{transform:translateX(-50%) scale(1);box-shadow:0 4px 15px rgba(220,38,38,0.5);}50%{transform:translateX(-50%) scale(1.05);box-shadow:0 8px 30px rgba(220,38,38,0.9);}}';
    document.head.appendChild(style);
  }

  // Register mock smartplayer global
  window.smartplayer = window.smartplayer || {
    instances: {},
    destroy: function() {},
    pause: function() {}
  };

  function createPlayerUI(container, videoSrc, posterSrc) {
    // Check if video already exists inside placeholder (from SSR/HTML)
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
    // Guaranteed attributes for mobile and desktop autoplay
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

    // Unmute Banner (High-conversion banner)
    var unmuteBanner = document.createElement('div');
    unmuteBanner.style.position = 'absolute';
    unmuteBanner.style.top = '16px';
    unmuteBanner.style.left = '50%';
    unmuteBanner.style.transform = 'translateX(-50%)';
    unmuteBanner.style.zIndex = '30';
    unmuteBanner.style.backgroundColor = '#dc2626';
    unmuteBanner.style.color = '#fff';
    unmuteBanner.style.padding = '12px 24px';
    unmuteBanner.style.borderRadius = '9999px';
    unmuteBanner.style.fontSize = '14px';
    unmuteBanner.style.fontWeight = '800';
    unmuteBanner.style.letterSpacing = '0.04em';
    unmuteBanner.style.textTransform = 'uppercase';
    unmuteBanner.style.display = 'flex';
    unmuteBanner.style.alignItems = 'center';
    unmuteBanner.style.gap = '10px';
    unmuteBanner.style.cursor = 'pointer';
    unmuteBanner.style.animation = 'vslPulse 1.8s infinite ease-in-out';
    unmuteBanner.innerHTML = '<span style="font-size:20px;">🔊</span> <span>SEU VÍDEO JÁ COMEÇOU! CLIQUE PARA OUVIR</span>';

    // Big Center Play Button
    var playButton = document.createElement('div');
    playButton.style.position = 'absolute';
    playButton.style.top = '50%';
    playButton.style.left = '50%';
    playButton.style.transform = 'translate(-50%, -50%)';
    playButton.style.width = '76px';
    playButton.style.height = '76px';
    playButton.style.backgroundColor = 'rgba(220, 38, 38, 0.95)';
    playButton.style.borderRadius = '50%';
    playButton.style.display = 'none';
    playButton.style.alignItems = 'center';
    playButton.style.justifyContent = 'center';
    playButton.style.zIndex = '20';
    playButton.style.boxShadow = '0 10px 30px rgba(220, 38, 38, 0.6), 0 0 0 10px rgba(220, 38, 38, 0.2)';
    playButton.style.transition = 'transform 0.2s ease, opacity 0.2s ease';
    playButton.innerHTML = '<svg width="34" height="34" viewBox="0 0 24 24" fill="#ffffff" style="margin-left:4px;"><path d="M8 5v14l11-7z"/></svg>';

    // Controls Bar (bottom)
    var controlsBar = document.createElement('div');
    controlsBar.style.position = 'absolute';
    controlsBar.style.bottom = '0';
    controlsBar.style.left = '0';
    controlsBar.style.right = '0';
    controlsBar.style.height = '48px';
    controlsBar.style.background = 'linear-gradient(transparent, rgba(0,0,0,0.85))';
    controlsBar.style.display = 'flex';
    controlsBar.style.alignItems = 'center';
    controlsBar.style.padding = '0 14px';
    controlsBar.style.gap = '12px';
    controlsBar.style.zIndex = '25';
    controlsBar.style.opacity = '0';
    controlsBar.style.transition = 'opacity 0.25s ease';

    var miniPlayBtn = document.createElement('button');
    miniPlayBtn.style.background = 'none';
    miniPlayBtn.style.border = 'none';
    miniPlayBtn.style.color = '#fff';
    miniPlayBtn.style.cursor = 'pointer';
    miniPlayBtn.style.padding = '4px';
    miniPlayBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';

    var progressContainer = document.createElement('div');
    progressContainer.style.flex = '1';
    progressContainer.style.height = '6px';
    progressContainer.style.backgroundColor = 'rgba(255,255,255,0.3)';
    progressContainer.style.borderRadius = '3px';
    progressContainer.style.position = 'relative';
    progressContainer.style.cursor = 'pointer';

    var progressBar = document.createElement('div');
    progressBar.style.position = 'absolute';
    progressBar.style.top = '0';
    progressBar.style.left = '0';
    progressBar.style.bottom = '0';
    progressBar.style.width = '0%';
    progressBar.style.backgroundColor = '#dc2626';
    progressBar.style.borderRadius = '3px';
    progressContainer.appendChild(progressBar);

    var timeDisplay = document.createElement('span');
    timeDisplay.style.color = '#fff';
    timeDisplay.style.fontSize = '12px';
    timeDisplay.style.fontFamily = 'monospace';
    timeDisplay.innerText = '0:00 / 1:50';

    var volumeBtn = document.createElement('button');
    volumeBtn.style.background = 'none';
    volumeBtn.style.border = 'none';
    volumeBtn.style.color = '#fff';
    volumeBtn.style.cursor = 'pointer';
    volumeBtn.style.padding = '4px';
    volumeBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>';

    var fsBtn = document.createElement('button');
    fsBtn.style.background = 'none';
    fsBtn.style.border = 'none';
    fsBtn.style.color = '#fff';
    fsBtn.style.cursor = 'pointer';
    fsBtn.style.padding = '4px';
    fsBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>';

    controlsBar.appendChild(miniPlayBtn);
    controlsBar.appendChild(progressContainer);
    controlsBar.appendChild(timeDisplay);
    controlsBar.appendChild(volumeBtn);
    controlsBar.appendChild(fsBtn);

    wrapper.appendChild(video);
    wrapper.appendChild(unmuteBanner);
    wrapper.appendChild(playButton);
    wrapper.appendChild(controlsBar);
    container.appendChild(wrapper);

    function formatTime(s) {
      if (isNaN(s)) return '0:00';
      var m = Math.floor(s / 60);
      var sec = Math.floor(s % 60);
      return m + ':' + (sec < 10 ? '0' : '') + sec;
    }

    function updateIcons() {
      if (video.paused) {
        playButton.style.display = 'flex';
        miniPlayBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg>';
      } else {
        playButton.style.display = 'none';
        miniPlayBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
      }

      if (video.muted || video.volume === 0) {
        volumeBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>';
      } else {
        volumeBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>';
      }
    }

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
      updateIcons();
    }

    function handleUnmute(e) {
      if (e) e.stopPropagation();
      video.muted = false;
      video.volume = 1;
      video.currentTime = 0; // Restart from 00:00 with full audio
      video.play();
      unmuteBanner.style.display = 'none';
      updateIcons();
    }

    // Click on player
    container.addEventListener('click', function(e) {
      if (video.muted) {
        handleUnmute(e);
      } else {
        togglePlay(e);
      }
    });

    unmuteBanner.addEventListener('click', handleUnmute);
    miniPlayBtn.addEventListener('click', togglePlay);

    volumeBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      video.muted = !video.muted;
      updateIcons();
    });

    fsBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      if (video.requestFullscreen) video.requestFullscreen();
      else if (video.webkitRequestFullscreen) video.webkitRequestFullscreen();
    });

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
        timeDisplay.innerText = formatTime(video.currentTime) + ' / ' + formatTime(video.duration);
      }
    });

    video.addEventListener('play', updateIcons);
    video.addEventListener('pause', updateIcons);
    video.addEventListener('ended', function() {
      video.currentTime = 0;
      updateIcons();
    });

    container.addEventListener('mouseenter', function() {
      controlsBar.style.opacity = '1';
    });
    container.addEventListener('mouseleave', function() {
      if (!video.paused) controlsBar.style.opacity = '0';
    });

    // Guaranteed Autoplay trigger
    function startAutoplay() {
      video.muted = true;
      video.defaultMuted = true;
      var playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.then(function() {
          unmuteBanner.style.display = 'flex';
          playButton.style.display = 'none';
          updateIcons();
        }).catch(function() {
          // If strictly blocked, attach one-touch global listener to play instantly
          playButton.style.display = 'flex';
          updateIcons();
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

  // Also auto-initialize immediately or on DOM ready
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
