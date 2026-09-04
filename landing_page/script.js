// ---------- Logo marquee content ----------
const logos = ["Vortex", "Nimbus", "Prysma", "Cirrus", "Kynder", "Halcyn"];

function buildLogoItem(name) {
  const item = document.createElement("div");
  item.className = "logo-item";

  const icon = document.createElement("div");
  icon.className = "logo-icon liquid-glass";
  icon.textContent = name.charAt(0);

  const label = document.createElement("span");
  label.className = "logo-name";
  label.textContent = name;

  item.appendChild(icon);
  item.appendChild(label);
  return item;
}

function initMarquee() {
  const track = document.getElementById("marqueeTrack");
  if (!track) return;
  // duplicate the set twice so translateX(-50%) loops seamlessly
  [...logos, ...logos].forEach((name) => {
    track.appendChild(buildLogoItem(name));
  });
}

// ---------- Background video fade loop ----------
const FADE_MS = 500;
const REPLAY_DELAY_MS = 100;

function fade(el, from, to, duration) {
  return new Promise((resolve) => {
    const start = performance.now();
    function step(now) {
      const t = Math.min((now - start) / duration, 1);
      el.style.opacity = from + (to - from) * t;
      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        resolve();
      }
    }
    requestAnimationFrame(step);
  });
}

function initVideoLoop() {
  const video = document.getElementById("bgVideo");
  if (!video) return;

  async function playLoop() {
    video.currentTime = 0;
    video.style.opacity = 0;
    try {
      await video.play();
    } catch (e) {
      // autoplay might be blocked until user interacts; retry on interaction
      document.addEventListener("click", () => video.play(), { once: true });
    }
    await fade(video, 0, 1, FADE_MS);

    // schedule the fade-out to land right before the video ends
    const scheduleFadeOut = () => {
      const remainingMs = (video.duration - video.currentTime) * 1000;
      const delay = Math.max(remainingMs - FADE_MS, 0);
      setTimeout(() => {
        fade(video, 1, 0, FADE_MS);
      }, delay);
    };

    if (video.duration && !isNaN(video.duration)) {
      scheduleFadeOut();
    } else {
      video.addEventListener("loadedmetadata", scheduleFadeOut, { once: true });
    }
  }

  video.addEventListener("ended", () => {
    video.style.opacity = 0;
    setTimeout(() => {
      playLoop();
    }, REPLAY_DELAY_MS);
  });

  if (video.readyState >= 1) {
    playLoop();
  } else {
    video.addEventListener("loadedmetadata", playLoop, { once: true });
  }
}

// ---------- Logo fallback if the image path 404s ----------
function initLogoFallback() {
  const img = document.getElementById("navLogoImg");
  if (!img) return;
  img.addEventListener("error", () => {
    img.style.display = "none";
    const fallback = document.createElement("span");
    fallback.className = "nav-logo-fallback";
    fallback.textContent = "Logo";
    img.insertAdjacentElement("afterend", fallback);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initMarquee();
  initVideoLoop();
  initLogoFallback();
});
