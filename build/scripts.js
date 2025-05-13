const getRandomColor = ()=>{
  const red = Math.floor(Math.random() * 256);
  const green = Math.floor(Math.random() * 256);
  const blue = Math.floor(Math.random() * 256);
  return `rgb(${red}, ${green}, ${blue})`;
}
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
    random:{
      background: getRandomColor(),
      color: getRandomColor(),
      accentColor: getRandomColor(),
      fontFamily: '"Space Grotesk", sans-serif',
    }
    
  },
  AVAILABLE_THEMES = Object.keys(THEMES),
  FONT_MAX_SIZE = 20,
  FONT_MIN_SIZE = 8,
  HOVER_ANIMATION_DURATION = 350,
  HOVER_ANIMATION_EASING = "cubic-bezier(0.22, 1, 0.36, 1)",
  HOVER_ANIMATION_OUT_EASING = "cubic-bezier(0.64, 0, 0.78, 0)",
  VIDEO_PREVIEW_STATE = {
    verticalSrc: null,
    horizontalSrc: null,
    controller: new AbortController(),
  };

let currentTheme = "dark",
  currentFontSize = 16;

let hVideoAnimation, vVideoAnimation, handleVideoPreviewEventsDebounceTimeout;

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

const showVideoPreview = async (verticalSrc, HorizontalSrc) => {
  if (VIDEO_PREVIEW_STATE.verticalSrc) {
    try {
      await hideVideoPreview(
        VIDEO_PREVIEW_STATE.verticalSrc,
        VIDEO_PREVIEW_STATE.horizontalSrc
      );
    } catch (_) {}
  }

  VIDEO_PREVIEW_STATE.controller = new AbortController();
  const signal = VIDEO_PREVIEW_STATE.controller.signal;

  VIDEO_PREVIEW_STATE.verticalSrc = verticalSrc;
  VIDEO_PREVIEW_STATE.horizontalSrc = HorizontalSrc;

  try {
    vplaceholderEl.defaultPlaybackRate = 2;
    hplaceholderEl.defaultPlaybackRate = 2;
  } catch (_) {}

  if (signal.aborted) return;

  vSourceEl.setAttribute("src", verticalSrc);
  hSourceEl.setAttribute("src", HorizontalSrc);

  vplaceholderEl.load();
  hplaceholderEl.load();

  if (signal.aborted) return;

  try {
    hVideoAnimation = hplaceholderEl.animate(
      [
        {},
        {
          opacity: 1,
          transform: "translateY(0)",
        },
      ],
      {
        fill: "forwards",
        duration: HOVER_ANIMATION_DURATION,
        easing: HOVER_ANIMATION_EASING,
      }
    );
    vVideoAnimation = vplaceholderEl.animate(
      [
        {},
        {
          opacity: 1,
          transform: "translateX(0)",
        },
      ],
      {
        fill: "forwards",
        duration: HOVER_ANIMATION_DURATION,
        easing: HOVER_ANIMATION_EASING,
      }
    );

    signal.addEventListener("abort", () => {
      if (hVideoAnimation) {
        hVideoAnimation.commitStyles();
        hVideoAnimation.cancel();
      }
      if (vVideoAnimation) {
        vVideoAnimation.commitStyles();
        vVideoAnimation.cancel();
      }
    });

    await Promise.all([hVideoAnimation.finished, vVideoAnimation.finished]);

    if (signal.aborted) return;

    if (hVideoAnimation) {
      hVideoAnimation.commitStyles();
      hVideoAnimation.cancel();
    }
    if (hSourceEl) {
      hSourceEl.removeAttribute("src");
    }
    if (vVideoAnimation) {
      vVideoAnimation.commitStyles();
      vVideoAnimation.cancel();
    }
    if (vSourceEl) {
      vSourceEl.removeAttribute("src");
    }
  } catch (_) {
    if (hVideoAnimation) {
      try {
        hVideoAnimation.cancel();
      } catch (_) {}
    }
    if (vVideoAnimation) {
      try {
        vVideoAnimation.cancel();
      } catch (_) {}
    }
  }
};

const hideVideoPreview = async () => {
  if (VIDEO_PREVIEW_STATE.controller) {
    VIDEO_PREVIEW_STATE.controller.abort();
  }

  VIDEO_PREVIEW_STATE.controller = new AbortController();
  const signal = VIDEO_PREVIEW_STATE.controller.signal;

  if (signal.aborted) return;

  try {
    hVideoAnimation = hplaceholderEl.animate(
      [
        {},
        {
          opacity: 0,
          transform: "translateY(33%)",
        },
      ],
      {
        fill: "forwards",
        duration: HOVER_ANIMATION_DURATION,
        easing: HOVER_ANIMATION_OUT_EASING,
      }
    );

    vVideoAnimation = vplaceholderEl.animate(
      [
        {},
        {
          opacity: 0,
          transform: "translateX(33%)",
        },
      ],
      {
        fill: "forwards",
        duration: HOVER_ANIMATION_DURATION,
        easing: HOVER_ANIMATION_OUT_EASING,
      }
    );

    signal.addEventListener("abort", () => {
      if (hVideoAnimation) {
        try {
          hVideoAnimation.commitStyles();
          hVideoAnimation.cancel();
        } catch (_) {}
      }
      if (vVideoAnimation) {
        try {
          vVideoAnimation.commitStyles();
          vVideoAnimation.cancel();
        } catch (_) {}
      }
    });

    await Promise.all([hVideoAnimation.finished, vVideoAnimation.finished]);

    if (signal.aborted) return;

    if (hVideoAnimation) {
      hVideoAnimation.commitStyles();
      hplaceholderEl.style.setProperty("transform", "translateY(-55%)");
      hVideoAnimation.cancel();
    }
    if (hSourceEl) {
      hSourceEl.removeAttribute("src");
    }
    if (vVideoAnimation) {
      vVideoAnimation.commitStyles();
      vplaceholderEl.style.setProperty("transform", "translateX(-55%)");
      vVideoAnimation.cancel();
    }
    if (vSourceEl) {
      vSourceEl.removeAttribute("src");
    }

    VIDEO_PREVIEW_STATE.verticalSrc = null;
    VIDEO_PREVIEW_STATE.horizontalSrc = null;
  } catch (_) {
    if (hVideoAnimation) {
      try {
        hVideoAnimation.cancel();
      } catch (_) {}
    }
    if (vVideoAnimation) {
      try {
        vVideoAnimation.cancel();
      } catch (_) {}
    }
  }
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

const handleVideoPreviewEvents = (e) => {
  if (handleVideoPreviewEventsDebounceTimeout) {
    clearTimeout(handleVideoPreviewEventsDebounceTimeout);
  }
  handleVideoPreviewEventsDebounceTimeout = setTimeout(() => {
    const { verticalSrc, horizontalSrc, action } = e.detail;
    if (verticalSrc && horizontalSrc && action === "show") {
      showVideoPreview(verticalSrc, horizontalSrc);
    } else if (verticalSrc && horizontalSrc && action === "hide") {
      hideVideoPreview(verticalSrc, horizontalSrc);
    }
  }, HOVER_ANIMATION_DURATION);
};

const handleOnLoad = () => {
  setTheme(preferredTheme);

  vplaceholderEl = document.getElementById("v_vplaceholder");
  hplaceholderEl = document.getElementById("v_hplaceholder");

  vSourceEl = vplaceholderEl.querySelector("source");
  hSourceEl = hplaceholderEl.querySelector("source");

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
    el.addEventListener("mouseenter", handleLinkHover);
  });

  linksWithVerticalVideoPlaceholder.forEach((el) => {
    el.addEventListener("mouseleave", handleLinkMouseLeave);
  });

  handleResize();
};

document.addEventListener("DOMContentLoaded", handleOnLoad);
