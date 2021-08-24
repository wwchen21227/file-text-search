'use strict';

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const SKIP_NEXT_LINE_REGEX_PATTERN = 'skip-next-line';

const isObjInArray = (obj, array) => array.indexOf(obj) > -1;

const getAllFilesFromDirectory = (dirPath, excludeDirectories = []) => {
  if (!fs.existsSync(dirPath)) return [];

  let foundFiles = [];
  const walkDir = (currentPath) => {
    const files = fs.readdirSync(currentPath);

    for (const file of files) {
      const curFile = path.join(currentPath, file);

      if (fs.statSync(curFile).isFile()) {
        foundFiles.push(path.join(__dirname, curFile));
      } else if (
        fs.statSync(curFile).isDirectory() &&
        !isObjInArray(file, excludeDirectories)
      ) {
        walkDir(curFile);
      }
    }
  };

  walkDir(dirPath);

  return foundFiles;
};

const searchTextInFileStream = (filePath, text) => {
  return new Promise((resolve, reject) => {
    const result = [];
    const regEx = new RegExp(text);
    const skipNextLineRegEx = new RegExp(SKIP_NEXT_LINE_REGEX_PATTERN);

    let lineNumber = 0;
    let skipLineNumber = -1;

    const inStream = fs.createReadStream(filePath);
    inStream.on('error', err => reject(err));

    const rl = readline.createInterface(inStream);
    rl.on('line', (line) => {
      lineNumber++;

      if (lineNumber === skipLineNumber) return;

      if (line.search(skipNextLineRegEx) >= 0) {
        skipLineNumber = lineNumber + 1;
      }

      if (line.search(regEx) >= 0) {
        result.push({
          filePath,
          lineNumber,
          line: line.trim(),
        });
      }
    });

    rl.on('close', () => resolve(result));
  });
};

const saveJsonToFile = (filePath, jsonData) => {
  fs.writeFileSync(path.resolve(__dirname, filePath), JSON.stringify(jsonData));
};

module.exports = {
  saveJsonToFile,
  searchTextInFileStream,
  getAllFilesFromDirectory,
};
