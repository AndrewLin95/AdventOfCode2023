var fs = require('fs');

const formatInput = (input) => {
  const winningNumbers = [];
  const scratchCards = [];

  let newString = [];
  const newDataArray = input.split('');
  for (let i = 0; i < newDataArray.length; i++) {
    if (newDataArray[i] === '\r' || newDataArray[i] === '\n') {
      const formattedString = newString.join('').split(':')[1];

      const tempWinningNumbers = formattedString
        .split('|')[0]
        .trim()
        .split(' ')
        .filter((value) => value !== '');
      const tempScratchCard = formattedString
        .split('|')[1]
        .trim()
        .split(' ')
        .filter((value) => value !== '');

      winningNumbers.push(tempWinningNumbers);
      scratchCards.push(tempScratchCard);

      i++;
      i++;
      newString = [];
    }

    newString.push(newDataArray[i]);
  }

  const returnObject = {
    winningNumbers: winningNumbers,
    scratchCards: scratchCards
  };

  return returnObject;
};

// Part 1 Solution Code //

const generateMapOfWinningNumbers = (winningNumbers) => {
  const winningNumbersMap = {};

  for (let i = 0; i < winningNumbers.length; i++) {
    if (!winningNumbersMap[winningNumbers[i]]) {
      winningNumbersMap[winningNumbers[i]] = 1;
    }
  }
  return winningNumbersMap;
};

const determineScratchCardWorth = (winningNumbersMap, eachScratchCard) => {
  let scratchCardWorth = 0;
  eachScratchCard.forEach((eachScratchCardNumber) => {
    if (winningNumbersMap[eachScratchCardNumber]) {
      if (scratchCardWorth === 0) {
        scratchCardWorth++;
      } else {
        scratchCardWorth = scratchCardWorth * 2;
      }
    }
  });

  return scratchCardWorth;
};

// For each game, create a map of the winning numbers
// Iterate through each scratch card and determine value
fs.readFile('Day4_Input.txt', 'utf-8', function (err, data) {
  if (err) throw err;

  const { winningNumbers: winningNumbers, scratchCards: scratchCards } =
    formatInput(data);

  let totalWorth = 0;
  for (let i = 0; i < winningNumbers.length; i++) {
    const winningNumbersMap = generateMapOfWinningNumbers(winningNumbers[i]);

    const scratchCardValue = determineScratchCardWorth(
      winningNumbersMap,
      scratchCards[i]
    );
    totalWorth += scratchCardValue;
  }

  console.log('Day 1 Solution:', totalWorth);
});

// Part 2 Solution Code //

const determineScratchCardsWon = (winningNumbersMap, eachScratchCard) => {
  let scratchCardsWon = 0;
  eachScratchCard.forEach((eachScratchCardNumber) => {
    if (winningNumbersMap[eachScratchCardNumber]) {
      scratchCardsWon++;
    }
  });

  return scratchCardsWon;
};

const updateNumCopiesWon = (scratchCardsWon, currIndex, currCopiesMap) => {
  const updatedCopiesMap = currCopiesMap;

  const indexToIncrement = currIndex + 1;

  for (let i = indexToIncrement; i < indexToIncrement + scratchCardsWon; i++) {
    if (!updatedCopiesMap[i]) {
      updatedCopiesMap[i] = 1;
    } else {
      updatedCopiesMap[i] = updatedCopiesMap[i] + 1;
    }
  }

  return updatedCopiesMap;
};

// For each game, create a map of the winning numbers
// For each card, determine the number of scratch cards won
// Update the map of all the copies won.
// Within the map of all copies won, loop through that and add the additional number of copies to the same map
fs.readFile('Day4_Input.txt', 'utf-8', function (err, data) {
  if (err) throw err;

  const { winningNumbers: winningNumbers, scratchCards: scratchCards } =
    formatInput(data);

  let copiesMap = {};

  let totalScratchCards = 0;
  for (let i = 0; i < winningNumbers.length; i++) {
    const winningNumbersMap = generateMapOfWinningNumbers(winningNumbers[i]);

    const scratchCardsWon = determineScratchCardsWon(
      winningNumbersMap,
      scratchCards[i]
    );

    // add the original card to the copies map
    const newCopiesMap = updateNumCopiesWon(scratchCardsWon, i, copiesMap);
    copiesMap = newCopiesMap;

    // add any copies from before to the copies map
    if (copiesMap[i]) {
      for (let j = 0; j < copiesMap[i]; j++) {
        const newCopiesMap = updateNumCopiesWon(scratchCardsWon, i, copiesMap);
        copiesMap = newCopiesMap;
      }
    }

    if (copiesMap[i]) {
      totalScratchCards += copiesMap[i] + 1;
    } else {
      totalScratchCards++;
    }
  }

  console.log('Day 2 Solution:', totalScratchCards);
});
