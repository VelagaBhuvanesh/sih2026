(function () {
  var video = document.getElementById('bg-video');
  if (video) {
    var src = 'https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8';

    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls();
      hls.loadSource(src);
      hls.attachMedia(video);

      window.addEventListener('beforeunload', function () {
        hls.destroy();
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (Safari)
      video.src = src;
    }
  }

  // ---------- Loading progress ----------
  var fill = document.getElementById('loader-fill');
  var percentEl = document.getElementById('loader-percent');
  var labelEl = document.getElementById('loader-label');
  if (!fill || !percentEl || !labelEl) return;

  var stages = [
    { at: 0, label: 'Loading assets' },
    { at: 35, label: 'Preparing preview' },
    { at: 70, label: 'Almost there' },
    { at: 95, label: 'Finishing up' }
  ];

  var progress = 0;
  var currentStage = 0;

  function tick() {
    // Ease toward 100: faster at the start, slower near the end.
    var remaining = 100 - progress;
    var step = Math.max(0.4, remaining * 0.035);
    progress = Math.min(100, progress + step);

    while (
      currentStage < stages.length - 1 &&
      progress >= stages[currentStage + 1].at
    ) {
      currentStage += 1;
      labelEl.textContent = stages[currentStage].label;
    }

    fill.style.width = progress + '%';
    percentEl.textContent = Math.round(progress) + '%';

    if (progress < 100) {
      requestAnimationFrame(function () {
        setTimeout(tick, 30);
      });
    } else {
      labelEl.textContent = 'Ready';
    }
  }

  requestAnimationFrame(function () {
    setTimeout(tick, 200);
  });
})();
