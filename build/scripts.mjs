import "./static/js/chroma.min.js";

const getRandomColor = () => {
  const randomColor = chroma.random();
  return randomColor.hex();
};

const generateRandomTheme = () => {
  const background = getRandomColor();

  let color = getRandomColor();
  while (chroma.contrast(background, color) < 4.5) {
    color = getRandomColor();
  }

  const scale = chroma.scale([background, color]).colors(8);
  const accentColor = scale[1];
  return {
    background,
    color,
    accentColor,
    fontFamily: `"Karrik Regular", sans-serif`,
    fontSize: "16px",
  };
};

const DEFAULT_FONT = "Karrik Regular";
const DEFAULT_FONT_SIZE = "16px";

const THEMES = {
    light: {
      background: "rgb(255,255,255)",
      color: "rgb(51,51,51)",
      accentColor: "#eee",
      fontFamily: `"${DEFAULT_FONT}", sans-serif`,
      fontSize: DEFAULT_FONT_SIZE,
    },
    dark: {
      background: "rgb(34,34,34)",
      color: "rgb(255,255,255)",
      accentColor: "rgb(51,51,51)",
      fontFamily: `"${DEFAULT_FONT}", sans-serif`,
      fontSize: DEFAULT_FONT_SIZE,
    },
    outro: {
      background: "rgb(173,236,240)",
      color: "black",
      accentColor: "white",
      fontFamily: '"Noto Serif", serif',
      fontSize: "16px",
    },
    random: generateRandomTheme(),
  },
  AVAILABLE_THEMES = Object.keys(THEMES),
  FONT_MAX_SIZE = 20,
  FONT_MIN_SIZE = 8;

let currentTheme = "dark",
  currentFontSize = 16;

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
  document.documentElement.style.setProperty(
    "--font-size",
    THEMES[theme].fontSize
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
    THEMES.random = generateRandomTheme();
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

const showVideoPreview = (videoSrc) => {
  const sourceEl = document.querySelector('source[src="' + videoSrc + '"]');
  const videoEl = sourceEl.parentElement;

  videoEl.play();
  videoEl.classList.add("visible");
};

const hideVideoPreview = (videoSrc) => {
  const sourceEl = document.querySelector('source[src="' + videoSrc + '"]');
  const videoEl = sourceEl.parentElement;

  videoEl.pause();
  videoEl.classList.remove("visible");
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
  const { verticalSrc, horizontalSrc, action } = e.detail;

  if (verticalSrc && horizontalSrc && action === "show") {
    showVideoPreview(verticalSrc);
    showVideoPreview(horizontalSrc);
  } else {
    hideVideoPreview(verticalSrc);
    hideVideoPreview(horizontalSrc);
  }
};

const handleMouseMove = (e) => {
  const x = e.clientX;
  const y = e.clientY;

  document.documentElement.style.setProperty("--mouse-x", `${x}px`);
  document.documentElement.style.setProperty("--mouse-y", `${y}px`);
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
  window.addEventListener("mousemove", handleMouseMove);

  videoPreviewEventEmitter.addEventListener(
    "videoPreview",
    handleVideoPreviewEvents
  );

  linksWithVerticalVideoPlaceholder.forEach((el) => {
    el.addEventListener("focus", handleLinkHover);
    el.addEventListener("blur", handleLinkMouseLeave);
    el.addEventListener("mouseleave", handleLinkMouseLeave);
    el.addEventListener("mouseenter", handleLinkHover);
  });

  handleResize();
  loadBgImage();
  loadFonts().then(() => {
    document.documentElement.classList.add("fonts-loaded");
  });
};

document.addEventListener("DOMContentLoaded", handleOnLoad);

const loadKarrikFont = () => {
  return new Promise((resolve) => {
    const font = new FontFace(
      "Karrik Regular",
      "url(static/fonts/Karrik-Regular.ttf)",
      { style: "normal", weight: "400" }
    );

    font.load().then(() => {
      document.fonts.add(font);
      resolve();
    });
  });
};

const loadKarrikItalicFont = () => {
  return new Promise((resolve) => {
    const font = new FontFace(
      "Karrik Italic",
      "url(static/fonts/Karrik-Italic.ttf)",
      { style: "italic", weight: "400" }
    );

    font.load().then(() => {
      document.fonts.add(font);
      resolve();
    });
  });
};

const loadFonts = () => {
  return Promise.all([loadKarrikFont(), loadKarrikItalicFont()]);
};

const loadBgImage = () => {
  const imgEl = document.querySelector(".bg img");

  const handleLoad = () => {
    imgEl.classList.add("loaded");
  };

  if (imgEl.complete) {
    handleLoad();
    return;
  }

  imgEl.addEventListener("load", handleLoad);
};
