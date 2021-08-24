'use strict';

const {
  getAllFilesFromDirectory,
  searchTextInFileStream,
  saveJsonToFile,
} = require('../lib');
const mock = require('mock-fs');
const fs = require('fs');

describe('Search text in files', () => {
  beforeEach(() => {
    mock({
      'test-dir': {
        'file1.js': '//TODO first example',
        'file2.js': '//TODO second example',
        'file3.js': `//TODO third example
                      /*skip-next-line*/
                      //it should skip this TODO`,
        'sub-dir': {
          'file3.js': '//TODO first example',
          'file4.js': '//TODO second example',
        },
      },
      'result-dir': {
        'result.json': '',
      },
    });
  });

  afterEach(() => {
    mock.restore();
  });

  describe('getAllFilesFromDirectory', () => {
    it('should return array of files from the directory', () => {
      const files = getAllFilesFromDirectory('./test-dir');

      expect(files.length).toBe(5);
    });

    it('should return empty array with invalid directory', () => {
      const files = getAllFilesFromDirectory('/some-dir');

      expect(files.length).toBe(0);
    });

    it('should excluded sub-dir directory', () => {
      const excludedDirectories = ['sub-dir'];
      const files = getAllFilesFromDirectory('./test-dir', excludedDirectories);

      expect(files.length).toBe(3);
    });
  });

  describe('searchTextInFileStream', () => {
    it('should return array of results with TODO text', async () => {
      const results = await searchTextInFileStream(
        `${process.cwd()}/test-dir/file2.js`,
        'TODO'
      );

      expect(results.length).toBe(1);
      expect(results[0]).toHaveProperty('filePath');
      expect(results[0]).toHaveProperty('lineNumber');
      expect(results[0]).toHaveProperty('line');
      expect(results[0].line).toContain('TODO');
    });

    it('should skip searching next line', async () => {
      const results = await searchTextInFileStream(
        `${process.cwd()}/test-dir/file3.js`,
        'TODO'
      );

      expect(results.length).toBe(1);
    });

    it('should return empty array if no text match', async () => {
      const results = await searchTextInFileStream(
        `${process.cwd()}/test-dir/file1.js`,
        'TADA'
      );

      expect(results.length).toBe(0);
    });

    it('should return empty array if file not found', async () => {
      try {
        await searchTextInFileStream(
          `${process.cwd()}/test-dir/file.js`,
          'TODO'
        );
        throw new Error('It should throw this error');
      } catch (err) {
        expect(err.message).toContain('no such file or directory');
      }
    });
  });

  describe('saveJsonToFile', () => {
    it('should save json object to file', async () => {
      const fakeResult = [
        {
          filePath: 'test-dir/example.js',
          lineNumber: 1,
          line: '//TODO test',
        },
      ];

      saveJsonToFile('./result-dir/result.json', fakeResult);

      const fileContent = fs.readFileSync('./result-dir/result.json');
      const parsedJsonResult = JSON.parse(fileContent);

      expect(parsedJsonResult.length).toBe(1);
      expect(parsedJsonResult[0]).toHaveProperty('filePath');
      expect(parsedJsonResult[0]).toHaveProperty('lineNumber');
      expect(parsedJsonResult[0]).toHaveProperty('line');
      expect(parsedJsonResult[0].line).toContain('TODO');
    });
  });
});
