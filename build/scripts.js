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
  const headerSvg = headerBackgroundBaseSvg
    .replace(/MAIN_COLOR/g, themes[currentTheme].color)
    .replace(/SECOND_COLOR/g, themes[currentTheme].background);

  document.documentElement.style.setProperty("--header-background", headerSvg);

  const footerBg = headerSvg.replace("rotate(0)", "rotate(90)");
  document.documentElement.style.setProperty("--footer-background", footerBg);
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

  window.addEventListener("resize", handleResize);

  handleResize();

  const linksWithVerticalVideoPlaceholder = document.querySelectorAll(
    "[data-vvplaceholder]"
  );

  linksWithVerticalVideoPlaceholder.forEach((el) => {
    el.addEventListener("mouseenter", onLinkHover);
    el.addEventListener("mouseleave", onLinkLeave);
  });
};

let hVideoAnimation;
let vVideoAnimation;

const onLinkLeave = (e) => {
  if (hVideoAnimation) {
    hVideoAnimation.cancel();
  }
  if (vVideoAnimation) {
    vVideoAnimation.cancel();
  }

  const thisVerticalPlaceholder = e.target.getAttribute("data-vvplaceholder");
  const thisHorizontalPlaceholder = e.target.getAttribute("data-vhplaceholder");

  const vplaceholderEl = document.getElementById("v_vplaceholder");
  try {
    vplaceholderEl.defaultPlaybackRate = 2;
  } catch (_) {}
  const sourceEl = vplaceholderEl.querySelector(
    `source[src="${thisVerticalPlaceholder}"]`
  );

  const hplaceholderEl = document.getElementById("v_hplaceholder");
  try {
    hplaceholderEl.defaultPlaybackRate = 2;
  } catch (_) {}
  const hSourceEl = hplaceholderEl.querySelector(
    `source[src="${thisHorizontalPlaceholder}"]`
  );

  hVideoAnimation = hplaceholderEl.animate(
    [
      {},
      {
        opacity: 0,
        transform: "translateY(-100%)",
      },
    ],
    {
      duration: 500,
      fill: "forwards",
      easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    }
  );

  hVideoAnimation.finished
    .then(() => {
      if (hVideoAnimation) {
        hVideoAnimation.commitStyles();
        hVideoAnimation.cancel();
      }
      if (hSourceEl) {
        hSourceEl.removeAttribute("src");
      }
    })
    .catch((_) => {});

  vVideoAnimation = vplaceholderEl.animate(
    [
      {},
      {
        opacity: 0,
        transform: "translateX(-100%)",
      },
    ],
    {
      duration: 500,
      fill: "forwards",
      easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    }
  );

  vVideoAnimation.finished
    .then(() => {
      if (vVideoAnimation) {
        vVideoAnimation.commitStyles();
        vVideoAnimation.cancel();
      }
      if (sourceEl) {
        sourceEl.removeAttribute("src");
      }
    })
    .catch((_) => {});
};

const onLinkHover = (e) => {
  if (hVideoAnimation) {
    hVideoAnimation.cancel();
  }
  if (vVideoAnimation) {
    vVideoAnimation.cancel();
  }

  const thisVerticalPlaceholder = e.target.getAttribute("data-vvplaceholder");
  const thisHorizontalPlaceholder = e.target.getAttribute("data-vhplaceholder");

  if (thisVerticalPlaceholder) {
    const vplaceholderEl = document.getElementById("v_vplaceholder");
    const sourceEl = vplaceholderEl.querySelector("source");
    sourceEl.setAttribute("src", thisVerticalPlaceholder);
    vplaceholderEl.load();

    vVideoAnimation = vplaceholderEl.animate(
      [
        {},
        {
          opacity: 1,
          transform: "translateX(0)",
        },
      ],
      {
        duration: 500,
        fill: "forwards",
        easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      }
    );

    vVideoAnimation.finished
      .then(() => {
        if (vVideoAnimation) {
          vVideoAnimation.commitStyles();
          vVideoAnimation.cancel();
        }
      })
      .catch((_) => {});
  }

  if (thisHorizontalPlaceholder) {
    const hplaceholderEl = document.getElementById("v_hplaceholder");
    const sourceEl = hplaceholderEl.querySelector("source");
    sourceEl.setAttribute("src", thisHorizontalPlaceholder);
    hplaceholderEl.load();

    hVideoAnimation = hplaceholderEl.animate(
      [
        {},
        {
          opacity: 1,
          transform: "translateY(0)",
        },
      ],
      {
        duration: 500,
        fill: "forwards",
        easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      }
    );

    hVideoAnimation.finished
      .then(() => {
        if (hVideoAnimation) {
          hVideoAnimation.commitStyles();
          hVideoAnimation.cancel();
        }
      })
      .catch((_) => {});
  }
};

document.addEventListener("DOMContentLoaded", onLoad);

const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
  ? "dark"
  : "light";

setTheme(preferredTheme);

const handleResize = () => {
  const width = window.innerWidth - 40;
  const bodyEl = document.getElementsByTagName("body")[0];

  if (width < 576) {
    bodyEl.style.setProperty("--fg-grid-width", `${width}px`);
  } else {
    bodyEl.style.setProperty("--fg-grid-width", ``);
  }
};
