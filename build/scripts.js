const themes = {
  light: {
    background: "#fff",
    color: "#333",
    accentColor: "#eee",
    fontFamily: '"Space Grotesk", sans-serif',
  },
  dark: {
    background: "#222",
    color: "#fff",
    accentColor: "#333",
    fontFamily: '"Space Grotesk", sans-serif',
  },
  outro: {
    background: "#ADECF0",
    color: "black",
    accentColor: "white",
    fontFamily: '"Noto Serif", serif',
  },
};

const availableThemes = Object.keys(themes);
let currentTheme = "dark";
const maxSize = 20;
const minSize = 8;
let currentFontSize = 16;

const setTheme = (theme) => {
  document.documentElement.style.setProperty(
    "--background-color",
    themes[theme].background
  );
  document.documentElement.style.setProperty(
    "--accent-color",
    themes[theme].accentColor
  );
  document.documentElement.style.setProperty(
    "--font-family",
    themes[theme].fontFamily
  );
  document.documentElement.style.setProperty("--color", themes[theme].color);
  currentTheme = theme;
};


const toggleTheme = (e) => {
  e.preventDefault();
  const index = availableThemes.indexOf(currentTheme);
  let nextIndex = (index + 1) % availableThemes.length;
  const nextTheme = availableThemes[nextIndex];
  setTheme(nextTheme);
};

const setFontSize = (size) => {
  if (size > maxSize || size < minSize) {
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

const onLoad = () => {
  document
    .getElementById("toggle-theme")
    .addEventListener("click", toggleTheme);
  document
    .getElementById("size-more")
    .addEventListener("click", incrementFontSize);
  document
    .getElementById("size-less")
    .addEventListener("click", decrementFontSize);
};

document.addEventListener("DOMContentLoaded", onLoad);

const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)")
  .matches
  ? "dark"
  : "light";

setTheme(preferredTheme);