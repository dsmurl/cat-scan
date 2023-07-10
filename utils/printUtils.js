const COLORS = {
  red: "\x1b[31m\x1b[1m",
  green: "\x1b[32m\x1b[1m",
  yellow: "\x1b[33m\x1b[1m",
  blue: "\x1b[34m\x1b[1m",
  magenta: "\x1b[35m\x1b[1m",
  cyan: "\x1b[36m\x1b[1m",
  black: "\x1b[30m\x1b[1m",
  white: "\x1b[37m\x1b[1m",
  gray: "\x1b[90m\x1b[1m",

  BgBlack: "\x1b[40m",
  BgRed: "\x1b[41m",
  BgGreen: "\x1b[42m",
  BgYellow: "\x1b[43m",
  BgBlue: "\x1b[44m",
  BgMagenta: "\x1b[45m",
  BgCyan: "\x1b[46m",
  BgWhite: "\x1b[47m",
  BgGray: "\x1b[100m",

  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  underscore: "\x1b[4m",
  blink: "\x1b[5m",
  reverse: "\x1b[7m",
  hidden: "\x1b[8m",
};

const printLine = (line, color, spaces = 0) => {
  console.log(
    `${new Array(spaces + 1).join(" ")}${
      COLORS[color] || color || COLORS.green
    }%s\x1b[0m`,
    line
  );
};

// CATSCAN JIRA-1342 The bug could be here too

const colorPalette = () => {
  printLine(" Color Palette: ", "green", 0);

  Object.keys(COLORS).forEach((colorKey) => {
    process.stdout.write("  + ");
    printLine(`${colorKey}`, COLORS[colorKey], 0);
  });
  // CATSCAN DEBUG Something is broke here, thanks Greg
  printLine("", COLORS.green, 0);
};

module.exports = {
  COLORS,
  printLine,
  colorPalette,
};
