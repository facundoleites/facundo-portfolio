const themes = {
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
  generateSvgBackground();

};


const generateSvgBackground = () => {
  const headerBackgroundBaseSvg = `url("data:image/svg+xml,<svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' patternUnits='userSpaceOnUse' width='20' height='20' patternTransform='scale(0.75) rotate(0)'><rect x='0' y='0' width='100%' height='100%' fill='SECOND_COLOR'/><path d='M0 10h20z'   stroke-width='5' stroke='MAIN_COLOR' fill='none'/></pattern></defs><rect width='800%' height='800%' transform='translate(0,0)' fill='url(%23a)'/></svg>")`;
  const headerSvg = headerBackgroundBaseSvg.replace(/MAIN_COLOR/g, 
    themes[currentTheme].color
  ).replace(
    /SECOND_COLOR/g,
    themes[currentTheme].background
  )


  
  document.documentElement.style.setProperty(
    "--header-background",
    headerSvg
  );

  const footerBg = headerSvg.replace('rotate(0)', 'rotate(90)');
  document.documentElement.style.setProperty(
    "--footer-background",
    footerBg
  );
}


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