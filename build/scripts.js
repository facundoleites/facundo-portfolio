const getRandomColor = () => {
  const red = Math.floor(Math.random() * 256);
  const green = Math.floor(Math.random() * 256);
  const blue = Math.floor(Math.random() * 256);
  return `rgb(${red}, ${green}, ${blue})`;
};
const THEMES = {
    light: {
      background: "rgb(255,255,255)",
      color: "rgb(51,51,51)",
      accentColor: "#eee",
      fontFamily: '"Space Grotesk", sans-serif',
    },
    dark: {
      background: "rgb(34,34,34)",
      color: "rgb(255,255,255)",
      accentColor: "rgb(51,51,51)",
      fontFamily: '"Space Grotesk", sans-serif',
    },
    outro: {
      background: "rgb(173,236,240)",
      color: "black",
      accentColor: "white",
      fontFamily: '"Noto Serif", serif',
    },
    random: {
      background: getRandomColor(),
      color: getRandomColor(),
      accentColor: getRandomColor(),
      fontFamily: '"Space Grotesk", sans-serif',
    },
  },
  AVAILABLE_THEMES = Object.keys(THEMES),
  FONT_MAX_SIZE = 20,
  FONT_MIN_SIZE = 8,
  HOVER_ANIMATION_DURATION = 250,
  HOVER_ANIMATION_EASING = "cubic-bezier(0.22, 1, 0.36, 1)",
  HOVER_ANIMATION_OUT_EASING = "cubic-bezier(0.64, 0, 0.78, 0)",
  VIDEO_PREVIEW_STATE = {
    currentZ: 100,
    controller: new AbortController(),
    hoverVert: null,
    hoverHor: null,
    lastHoverTime: 0,
    lastLeaveTime: 0,
    animations: {
      "static/videos/art_facundoleites_mobile.webm": null,
      "static/videos/daily_tsurunomundo_mobile.webm": null,
      "static/videos/felicette_dev_mobile.webm": null,
      "static/videos/tsurunomundo_mobile.webm": null,
      "static/videos/art_facundoleites_wide.webm": null,
      "static/videos/daily_tsurunomundo_wide.webm": null,
      "static/videos/felicette_dev_wide.webm": null,
      "static/videos/tsurunomundo_wide.webm": null,
    },
  },
  VIDEO_PREVIEW_ANIMATION_DIRECTION = {
    VERTICAL: "vertical",
    HORIZONTAL: "horizontal",
  };

let currentTheme = "dark",
  currentFontSize = 16;

let handleVideoPreviewEventsDebounceTimeout,
  mouseLeaveTimeout = 0;

let vplaceholderEl, hplaceholderEl, vSourceEl, hSourceEl;

const videoPreviewEventEmitter = new EventTarget();

const setTheme = (theme) => {
  document.documentElement.style.setProperty(
    "--background-color",
    THEMES[theme].background
  );
  document.documentElement.style.setProperty(
    "--accent-color",
    THEMES[theme].accentColor
  );
  document.documentElement.style.setProperty(
    "--font-family",
    THEMES[theme].fontFamily
  );
  document.documentElement.style.setProperty("--color", THEMES[theme].color);
  currentTheme = theme;
};

const toggleTheme = (e) => {
  e.preventDefault();
  const index = AVAILABLE_THEMES.indexOf(currentTheme);
  let nextIndex = (index + 1) % AVAILABLE_THEMES.length;
  const nextTheme = AVAILABLE_THEMES[nextIndex];

  if (nextTheme === "random") {
    THEMES.random.background = getRandomColor();
    THEMES.random.color = getRandomColor();
    THEMES.random.accentColor = getRandomColor();
  }
  setTheme(nextTheme);
};

const setFontSize = (size) => {
  if (size > FONT_MAX_SIZE || size < FONT_MIN_SIZE) {
    return;
  }
  document.documentElement.style.setProperty("--font-size", `${size}px`);
  currentFontSize = size;
};

const incrementFontSize = () => {
  currentFontSize += 1;
  setFontSize(currentFontSize);
};

const decrementFontSize = () => {
  currentFontSize -= 1;
  setFontSize(currentFontSize);
};

getVideoAnimation = (videoSrc) => {
  return VIDEO_PREVIEW_STATE.animations[videoSrc];
};

setVideoAnimation = (videoSrc, animation) => {
  VIDEO_PREVIEW_STATE.animations[videoSrc] = animation;
};

const showVideoPreview = async (videoSrc, direction) => {
  const sourceEl = document.querySelector('source[src="' + videoSrc + '"]');

  const videoEl = sourceEl.parentElement;

  videoEl.play();

  let currentAnim = getVideoAnimation(videoSrc);
  if (currentAnim) {
    if (currentAnim.pending) {
      await currentAnim.finished;
    }
  }

  VIDEO_PREVIEW_STATE.currentZ += 1;
  videoEl.style.setProperty("z-index", VIDEO_PREVIEW_STATE.currentZ);

  setVideoAnimation(
    videoSrc,
    videoEl.animate(
      [
        {},
        {
          opacity: 1,
          transform:
            direction === VIDEO_PREVIEW_ANIMATION_DIRECTION.VERTICAL
              ? "translateX(0)"
              : "translateY(0)",
        },
      ],
      {
        duration: HOVER_ANIMATION_DURATION,
        easing: HOVER_ANIMATION_EASING,
        fill: "forwards",
        iterations: 1,
      }
    )
  );

  getVideoAnimation(videoSrc)
    .finished.then(() => {
      const currentAnim = getVideoAnimation(videoSrc);
      if (currentAnim) {
        currentAnim.commitStyles();
        currentAnim.cancel();
        setVideoAnimation(videoSrc, null);
      }
    })
    .catch((_) => {});
};

const hideVideoPreview = async (videoSrc, direction) => {
  return new Promise(async (resolve) => {
    const sourceEl = document.querySelector('source[src="' + videoSrc + '"]');
    const videoEl = sourceEl.parentElement;

    videoEl.pause();

    const currentAnim = getVideoAnimation(videoSrc);

    if (currentAnim) {
      if (currentAnim.pending) {
        await currentAnim.finished;
      }
      currentAnim.commitStyles();
      currentAnim.cancel();
    }

    VIDEO_PREVIEW_STATE.currentZ += 1;
    videoEl.style.setProperty("z-index", VIDEO_PREVIEW_STATE.currentZ);

    setVideoAnimation(
      videoSrc,
      videoEl.animate(
        [
          {},
          {
            opacity: 0,
            transform:
              direction === VIDEO_PREVIEW_ANIMATION_DIRECTION.VERTICAL
                ? "translateX(-30%)"
                : "translateY(-30%)",
          },
        ],
        {
          duration: HOVER_ANIMATION_DURATION,
          easing: HOVER_ANIMATION_OUT_EASING,
          fill: "forwards",
          iterations: 1,
        }
      )
    );

    getVideoAnimation(videoSrc)
      .finished.then(() => {
        const currentVideoAnim = getVideoAnimation(videoSrc);
        if (currentVideoAnim) {
          currentVideoAnim.commitStyles();
          currentVideoAnim.cancel();

          videoEl.style.setProperty(
            "transform",
            direction === VIDEO_PREVIEW_ANIMATION_DIRECTION.VERTICAL
              ? "translateX(30%)"
              : "translateY(30%)"
          );
          setVideoAnimation(videoSrc, null);
        }

        resolve();
      })
      .catch((_) => {});
  });
};

const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
  ? "dark"
  : "light";

const handleLinkMouseLeave = async (e) => {
  videoPreviewEventEmitter.dispatchEvent(
    new CustomEvent("videoPreview", {
      detail: {
        verticalSrc: e.target.getAttribute("data-vvplaceholder"),
        horizontalSrc: e.target.getAttribute("data-vhplaceholder"),
        action: "hide",
      },
    })
  );
};

const handleLinkHover = async (e) => {
  videoPreviewEventEmitter.dispatchEvent(
    new CustomEvent("videoPreview", {
      detail: {
        verticalSrc: e.target.getAttribute("data-vvplaceholder"),
        horizontalSrc: e.target.getAttribute("data-vhplaceholder"),
        action: "show",
      },
    })
  );
};

const handleResize = () => {
  const width = window.innerWidth - 40;
  const bodyEl = document.getElementsByTagName("body")[0];

  if (width < 576) {
    bodyEl.style.setProperty("--fg-grid-width", `${width}px`);
  } else {
    bodyEl.style.setProperty("--fg-grid-width", ``);
  }
};

const handleVideoPreviewEvents = async (e) => {
  if (mouseLeaveTimeout) {
    clearTimeout(mouseLeaveTimeout);
  }
  const currentTime = Date.now();

  const { verticalSrc, horizontalSrc, action } = e.detail;

  if (verticalSrc && horizontalSrc && action === "show") {
    VIDEO_PREVIEW_STATE.lastHoverTime = currentTime;
    const promises = [];
    if (
      VIDEO_PREVIEW_STATE.hoverVert &&
      VIDEO_PREVIEW_STATE.hoverVert !== verticalSrc
    ) {
      promises.push(
        hideVideoPreview(
          VIDEO_PREVIEW_STATE.hoverVert,
          VIDEO_PREVIEW_ANIMATION_DIRECTION.VERTICAL
        )
      );
    }

    if (
      VIDEO_PREVIEW_STATE.hoverHor &&
      VIDEO_PREVIEW_STATE.hoverHor !== horizontalSrc
    ) {
      promises.push(
        hideVideoPreview(
          VIDEO_PREVIEW_STATE.hoverHor,
          VIDEO_PREVIEW_ANIMATION_DIRECTION.HORIZONTAL
        )
      );
    }

    const startSrcHoverHor = horizontalSrc;
    const startSrcHoverVert = verticalSrc;
    VIDEO_PREVIEW_STATE.hoverHor = horizontalSrc;
    VIDEO_PREVIEW_STATE.hoverVert = verticalSrc;

    await Promise.all(promises);

    if (
      VIDEO_PREVIEW_STATE.hoverHor !== startSrcHoverHor ||
      VIDEO_PREVIEW_STATE.hoverVert !== startSrcHoverVert
    ) {
      return;
    }

    if (VIDEO_PREVIEW_STATE.lastHoverTime > currentTime) {
      return;
    }

    showVideoPreview(verticalSrc, VIDEO_PREVIEW_ANIMATION_DIRECTION.VERTICAL);
    showVideoPreview(
      horizontalSrc,
      VIDEO_PREVIEW_ANIMATION_DIRECTION.HORIZONTAL
    );
  } else if (action === "hide") {
    VIDEO_PREVIEW_STATE.lastLeaveTime = currentTime;

    mouseLeaveTimeout = setTimeout(async () => {
      const promises = [];
      if (VIDEO_PREVIEW_STATE.hoverHor === horizontalSrc) {
        promises.push(
          hideVideoPreview(
            VIDEO_PREVIEW_STATE.hoverHor,
            VIDEO_PREVIEW_ANIMATION_DIRECTION.HORIZONTAL
          )
        );
      }
      if (VIDEO_PREVIEW_STATE.hoverVert === verticalSrc) {
        promises.push(
          hideVideoPreview(
            VIDEO_PREVIEW_STATE.hoverVert,
            VIDEO_PREVIEW_ANIMATION_DIRECTION.VERTICAL
          )
        );
      }
      await Promise.all(promises);

      if (
        VIDEO_PREVIEW_STATE.hoverHor !== horizontalSrc ||
        VIDEO_PREVIEW_STATE.hoverVert !== verticalSrc
      ) {
        return;
      }
      if (
        VIDEO_PREVIEW_STATE.lastHoverTime > VIDEO_PREVIEW_STATE.lastLeaveTime
      ) {
        return;
      }
      VIDEO_PREVIEW_STATE.hoverHor = null;
      VIDEO_PREVIEW_STATE.hoverVert = null;
    }, HOVER_ANIMATION_DURATION * 2);
  }
};

const handleOnLoad = () => {
  setTheme(preferredTheme);

  const linksWithVerticalVideoPlaceholder = document.querySelectorAll(
    "[data-vvplaceholder]"
  );

  document
    .getElementById("toggle-theme")
    .addEventListener("click", toggleTheme);
  document
    .getElementById("size-more")
    .addEventListener("click", incrementFontSize);
  document
    .getElementById("size-less")
    .addEventListener("click", decrementFontSize);

  window.addEventListener("resize", handleResize);

  videoPreviewEventEmitter.addEventListener(
    "videoPreview",
    handleVideoPreviewEvents
  );

  linksWithVerticalVideoPlaceholder.forEach((el) => {
    el.addEventListener("mouseleave", handleLinkMouseLeave);
  });

  linksWithVerticalVideoPlaceholder.forEach((el) => {
    el.addEventListener("mouseenter", handleLinkHover);
  });

  handleResize();
};

document.addEventListener("DOMContentLoaded", handleOnLoad);
