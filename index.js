#!/usr/bin/env node

const path = require("path");
const commander = require("commander");

const fs = require("fs");
const { COLORS, printLine } = require("./utils/printUtils.js");
const { exit } = require("process");

const pjson = require("./package.json");
const version = pjson.version;

commander
  .version(version, "-v, --version")
  .usage(`[...options]           // version: ${version}`)
  .option("-d, --dir <char>", "Dir to cat scan (defaults to .)")
  .option(
    "-m, --maxSize <char>",
    "Sets the max file size ot scan (defaults to 50)"
  )
  .option(
    "-s, --skipped",
    "Includes a section in the output listing the skipped files (defaults to false)"
  )
  .option(
    "-a, --all",
    "Include all found data about files, like file size, in all outputs (defaults to false)"
  )
  .parse(process.argv);

const options = commander.opts();
const dir = options.dir || ".";
const skipDirs = ["node_modules", ".git"];
const skipAt = parseInt(options.maxSize) || 50;
const skipTagName = `>${skipAt}k-too-big-skipped`;

try {
  if (!fs.existsSync(dir)) {
    printLine(`Directory "${dir}" does not exist.`, COLORS.red, 2);
    exit();
  }
} catch (e) {
  printLine(`Problem with file.`, COLORS.red, 2);
  exit();
}

const scanObject = { general: [] };

function searchDirectory(directory, searchString) {
  const files = fs.readdirSync(directory);

  if (!files) {
    console.error(`Error reading directory: ${directory}`);
    return;
  }

  files.forEach((file) => {
    const filePath = path.join(directory, file);

    const stats = fs.statSync(filePath);

    if (!stats) {
      console.error(`Error retrieving file stats: ${filePath}`);
      return;
    }

    if (stats.isDirectory()) {
      if (skipDirs.indexOf(file) === -1) {
        searchDirectory(filePath, searchString);
      }
    } else {
      const fileSizeInKBytes = Math.round((stats.size / 1024) * 10) / 10;

      if (fileSizeInKBytes > skipAt && options.skipped) {
        if (!scanObject[skipTagName]) {
          scanObject[skipTagName] = [];
        }

        scanObject[skipTagName].push({
          filePath,
          fileSizeInKBytes: `${fileSizeInKBytes}k`,
          lineNumber: "",
          text: "",
        });
      } else {
        const roundedFileSizeInKBytes = fileSizeInKBytes.toFixed(1);

        searchFile(filePath, searchString, roundedFileSizeInKBytes);
      }
    }
  });
}

const dissect = (filePath, fileSizeInKBytes, lineNumber, line) => {
  const parts = line.split(" ").filter((part) => part !== "");
  const initPart = parts.indexOf(searchTerms[0]);

  if (initPart < 1) {
    return;
  }

  // CATSCAN JIRA-1342 This is around where the bug is

  const tag = (parts[initPart + 1] || "general").toLowerCase();
  const text = parts.splice(initPart + 2).join(" ");

  if (!scanObject[tag]) {
    scanObject[tag] = [];
  }

  const size = options.all && `${fileSizeInKBytes}k`;

  scanObject[tag].push({ filePath, fileSizeInKBytes: size, lineNumber, text });
};

function searchFile(filePath, searchString, fileSizeInKBytes) {
  const data = fs.readFileSync(filePath, "utf8");

  const lines = data.split("\n");
  lines.forEach((line, index) => {
    if (line.includes(searchString)) {
      dissect(filePath, fileSizeInKBytes, index + 1, line);
    }
  });
}

///////// Main

const searchTerms = ["CATSCAN"];
const directory = dir; // Replace with the directory you want to search
const searchString = searchTerms[0]; // Replace with the string you want to search for

searchDirectory(directory, searchString);

Object.keys(scanObject).forEach((tag) => {
  if (scanObject[tag].length === 0) {
    return;
  }

  printLine(`${tag}:`, COLORS.magenta, 4);

  scanObject[tag].forEach((occurrence) => {
    const occurrenceNumber = occurrence.lineNumber
      ? `:${occurrence.lineNumber}`
      : "";

    const occurrenceFileSizeInKBytes = occurrence.fileSizeInKBytes
      ? ` ${occurrence.fileSizeInKBytes}`
      : "";

    printLine(
      `[ ${occurrence.filePath}${occurrenceNumber}${occurrenceFileSizeInKBytes} ] ${occurrence.text}`,
      COLORS.white,
      6
    );
  });
});
