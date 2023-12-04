var fs = require('fs');
const MIN_SCAN_VALUE = 3;

const formatInput = (inputData) => {
  const formattedInput = [];

  const inputDataArray = inputData.split('');
  let eachLine = [];
  for (let i = 0; i < inputDataArray.length; i++) {
    if (inputDataArray[i] === '\r' || inputDataArray[i] === '\n') {
      formattedInput.push(eachLine);
      eachLine = [];
      i++;
      i++;
    }

    eachLine.push(inputDataArray[i]);
  }

  return formattedInput;
};

// Part 1 Solution Code
fs.readFile('Day3_Input.txt', 'utf-8', function (err, data) {
  if (err) throw err;

  const addTraversedIndex = (i, j) => {
    if (!traversedIndicies.hasOwnProperty(`${i}, ${j}`)) {
      traversedIndicies[`${i}, ${j}`] = 1;
    }
  };

  // Return the full number, TBD: determine if i need to return the index too. No. adding to map immediately.
  const getFullNumbers = (i, j) => {
    const fullNumbers = [];

    // Scan the left side to find the first occurance of a non number.
    // Then determine the number by scanning right to the first non number.
    let currIndex = j;
    let currScanCount = 0;

    while (currScanCount < MIN_SCAN_VALUE) {
      // if traversed, continue
      if (traversedIndicies[`${i}, ${currIndex}`]) {
        currIndex--;
        currScanCount++;
        continue;
      }

      // if no match, continue
      if (!/[0-9]/.test(formattedInput[i][currIndex])) {
        currIndex--;
        currScanCount++;
        continue;
      }

      // if match, find first occurance, then add until reach a non number.
      if (/[0-9]/.test(formattedInput[i][currIndex])) {
        currScanCount++;
        const targetNumberArray = [];

        let targetNumberStartIndex = currIndex;
        currIndex--;
        while (/[0-9]/.test(formattedInput[i][targetNumberStartIndex - 1])) {
          targetNumberStartIndex--;
          currIndex--;
          currScanCount++;
        }

        while (/[0-9]/.test(formattedInput[i][targetNumberStartIndex])) {
          addTraversedIndex(i, targetNumberStartIndex);
          targetNumberArray.push(formattedInput[i][targetNumberStartIndex]);
          targetNumberStartIndex++;
        }

        const targetNumber = parseInt(targetNumberArray.join(''));
        fullNumbers.push(targetNumber);
      }
    }

    return fullNumbers;
  };

  const formattedInput = formatInput(data);

  // solution:
  // have a map of the numbers that were added so that no duplicates are added.
  // go through each item and find a symbol.
  // If a symbol is identified, check adjacent + diagonals.

  // key = outerloop (row), value = innerloop (column)
  const traversedIndicies = {};
  let sum = 0;
  for (let i = 0; i < formattedInput.length; i++) {
    for (let j = 0; j < formattedInput[i].length; j++) {
      // Regex matching for all non numbers and "."
      if (/[^0-9.]/.test(formattedInput[i][j])) {
        addTraversedIndex(i, j);
        let targetNumbersTop = [];
        let targetNumbersBottom = [];
        let targetNumbersCurrRow = [];

        if (i - 1 < formattedInput.length && j + 1 < formattedInput[i].length) {
          targetNumbersTop = getFullNumbers(i - 1, j + 1);
        }

        if (i + 1 >= 0) {
          targetNumbersBottom = getFullNumbers(i + 1, j + 1);
        }

        if (j + 1 < formattedInput[i].length) {
          targetNumbersCurrRow = getFullNumbers(i, j + 1);
        }

        const allNumbersForSymbol = [
          ...targetNumbersTop,
          ...targetNumbersBottom,
          ...targetNumbersCurrRow
        ];
        allNumbersForSymbol.forEach((eachNumber) => {
          sum += eachNumber;
        });
      }
    }
  }
  console.log(sum);
});

// Part 2 Solution Code
fs.readFile('Day3_Input.txt', 'utf-8', function (err, data) {
  if (err) throw err;

  const addTraversedIndex = (i, j) => {
    if (!traversedIndicies.hasOwnProperty(`${i}, ${j}`)) {
      traversedIndicies[`${i}, ${j}`] = 1;
    }
  };

  // Return the full number, TBD: determine if i need to return the index too. No. adding to map immediately.
  const getFullNumbers = (i, j) => {
    const fullNumbers = [];

    // Scan the left side to find the first occurance of a non number.
    // Then determine the number by scanning right to the first non number.
    let currIndex = j;
    let currScanCount = 0;

    while (currScanCount < MIN_SCAN_VALUE) {
      // if traversed, continue
      if (traversedIndicies[`${i}, ${currIndex}`]) {
        currIndex--;
        currScanCount++;
        continue;
      }

      // if no match, continue
      if (!/[0-9]/.test(formattedInput[i][currIndex])) {
        currIndex--;
        currScanCount++;
        continue;
      }

      // if match, find first occurance, then add until reach a non number.
      if (/[0-9]/.test(formattedInput[i][currIndex])) {
        currScanCount++;
        const targetNumberArray = [];

        let targetNumberStartIndex = currIndex;
        currIndex--;
        while (/[0-9]/.test(formattedInput[i][targetNumberStartIndex - 1])) {
          targetNumberStartIndex--;
          currIndex--;
          currScanCount++;
        }

        while (/[0-9]/.test(formattedInput[i][targetNumberStartIndex])) {
          addTraversedIndex(i, targetNumberStartIndex);
          targetNumberArray.push(formattedInput[i][targetNumberStartIndex]);
          targetNumberStartIndex++;
        }

        const targetNumber = parseInt(targetNumberArray.join(''));
        fullNumbers.push(targetNumber);
      }
    }

    return fullNumbers;
  };

  const formattedInput = formatInput(data);

  // The only difference between day 1 and day 2 is that we check the length of the allNumbersForSymbols.
  // If === 2, then multiple and add to sum.

  const traversedIndicies = {};
  let sum = 0;
  for (let i = 0; i < formattedInput.length; i++) {
    for (let j = 0; j < formattedInput[i].length; j++) {
      // Regex matching for only * (gears)
      if (/[*]/.test(formattedInput[i][j])) {
        addTraversedIndex(i, j);
        let targetNumbersTop = [];
        let targetNumbersBottom = [];
        let targetNumbersCurrRow = [];

        if (i - 1 < formattedInput.length && j + 1 < formattedInput[i].length) {
          targetNumbersTop = getFullNumbers(i - 1, j + 1);
        }

        if (i + 1 >= 0) {
          targetNumbersBottom = getFullNumbers(i + 1, j + 1);
        }

        if (j + 1 < formattedInput[i].length) {
          targetNumbersCurrRow = getFullNumbers(i, j + 1);
        }

        const allNumbersForSymbol = [
          ...targetNumbersTop,
          ...targetNumbersBottom,
          ...targetNumbersCurrRow
        ];
        if (allNumbersForSymbol.length === 2) {
          sum += allNumbersForSymbol[0] * allNumbersForSymbol[1];
        }
      }
    }
  }
  console.log(sum);
});
