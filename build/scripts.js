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
};

document.addEventListener("DOMContentLoaded", handleOnLoad);
