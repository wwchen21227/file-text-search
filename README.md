# File Text Search

A simple project for experiment with searching word/text in files from directory.

---
## Requirements

To run the project, you will only need Node.js and npm installed.

## Install

    $ git clone https://github.com/YOUR_USERNAME/PROJECT_TITLE
    $ cd file-text-search
    $ npm install

## Running the project

    $ npm start

## Running the project using docker

    $ docker-compose up

## Run unit tests

    $ npm test

## Project Structure
| File  | Description |
| ------------- | ------------- |
| index.js | The main entry of the project. This is the file that will run. |
| lib.js  | Contained the 3 main functions of this project.  |
| output-result  | Folder to store the output json result file. |
| __tests__ | Folder to store the unit test file. |
| __tests__/index.test.js | Unit tests for the 3 main functions. |

## Functions
The final output was a composition of 3 main functions. Each of this function can be use independently from one another.
| Function  | Description |
| ------------- | ------------- |
| getAllFilesFromDirectory | To get all the files from a start directory and sub-directories. |
| searchTextInFileStream | To find all line with the text specified in a file.  |
| saveJsonToFile | To save the json object to a file. |

## Variables
| Variable  | Description |
| ------------- | ------------- |
| DIRECTORY_TO_SEARCH | The start directory that the program will search. |
| EXCLUDED_DIRECTORIES | The directories you want the program to skip searching.  |
| KEYWORD_TO_SEARCH | The keyword/text to search in files. |

## Skip next line
You can specify skip-next-line comment to skip the line for searching.

```
/*skip-next-line*/
// Don't search this line of TODO
```
