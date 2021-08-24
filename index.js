'use strict';

const {
    getAllFilesFromDirectory,
    searchTextInFileStream,
    saveJsonToFile
} = require('./lib');

const DIRECTORY_TO_SEARCH = '.';
const EXCLUDED_DIRECTORIES = ['output-result', 'node_modules', '__tests__'];

/*skip-next-line*/
const KEYWORD_TO_SEARCH = 'TODO';
const RESULT_JSON_FILE = `output-result/results-${Date.now()}.json`;

(async () => {
    const files = getAllFilesFromDirectory(DIRECTORY_TO_SEARCH, EXCLUDED_DIRECTORIES);

    if(files.length === 0) {
        console.log('No files found');
        return;
    }

    let finalResults = [];
    try {
        for (const filePath of files) {
            const results = await searchTextInFileStream(filePath, KEYWORD_TO_SEARCH);
            finalResults = [...finalResults, ...results];
        }
    }
    catch (err) {
        console.error(err);
    }
    saveJsonToFile(RESULT_JSON_FILE, finalResults);
})();
