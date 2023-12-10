var fs = require('fs');

const FIVE = 'Five';
const FOUR = 'Four';
const FULL_HOUSE = 'FullHouse';
const THREE = 'Three';
const TWO_PAIR = 'TwoPair';
const ONE_PAIR = 'OnePair';
const HIGH_CARD = 'HighCard';

const indvCardStrength = {
  A: 1,
  K: 2,
  Q: 3,
  J: 4,
  T: 5,
  9: 6,
  8: 7,
  7: 8,
  6: 9,
  5: 10,
  4: 11,
  3: 12,
  2: 13,
  1: 14,
  69: Infinity
};

// Five > Four > FullHouse > Three > Two Pair > One Pair > High Card
// If same, compare the indexes to see which is higher starting from the left

// Returns object formatted:
// [
//   { game: index, hand: 'string', bid: int },
//   { game: index, hand: 'string', bid: int },
//   { game: index, hand: 'string', bid: int },
// ]
const formatInput = (inputData) => {
  const input = inputData.split('\n').map((input) => input.split(' '));

  const returnObject = [];
  for (let i = 0; i < input.length; i++) {
    const tempObj = {
      game: i,
      hand: input[i][0],
      bid: parseInt(input[i][1].trim())
    };
    returnObject.push(tempObj);
  }

  return returnObject;
};

const determineStrength = (handMap) => {
  let strength = null;
  let highCard = 69;

  let threeCount = 0;
  let pairCount = 0;

  Object.entries(handMap).map(([currCardType, count]) => {
    if (count === 5) {
      strength = FIVE;
    } else if (count === 4) {
      strength = FOUR;
    } else if (count === 3) {
      threeCount++;
    } else if (count === 2) {
      pairCount++;
    }

    if (indvCardStrength[currCardType] < indvCardStrength[highCard]) {
      highCard = currCardType;
    }
  });

  if (strength === null) {
    if (threeCount === 1 && pairCount === 1) {
      strength = FULL_HOUSE;
    } else if (threeCount === 1) {
      strength = THREE;
    } else if (pairCount === 2) {
      strength = TWO_PAIR;
    } else if (pairCount === 1) {
      strength = ONE_PAIR;
    } else {
      strength = HIGH_CARD;
    }
  }

  const strengthObject = {
    highCard: highCard,
    strength: strength
  };

  return strengthObject;
};

const getCardInfo = (eachHand) => {
  const handMap = {};

  const eachHandArray = eachHand.split('');
  eachHandArray.forEach((eachCard) => {
    if (!handMap[eachCard]) {
      handMap[eachCard] = 0;
    }
    handMap[eachCard]++;
  });

  const strengthObject = determineStrength(handMap);

  const returnObject = {
    strength: strengthObject.strength,
    highCard: strengthObject.highCard
  };
  return returnObject;
};

const sortStrengthMap = (unsortedMap) => {
  const sortedMap = {
    Five: [],
    Four: [],
    FullHouse: [],
    Three: [],
    TwoPair: [],
    OnePair: [],
    HighCard: []
  };

  Object.entries(unsortedMap).forEach(([strength, eachStrengthHandArray]) => {
    if (eachStrengthHandArray.length === 0) {
      return;
    }

    const tempArray = [...eachStrengthHandArray];

    tempArray.sort((a, b) => {
      const aArray = a.hand.split('');
      const bArray = b.hand.split('');

      let i = 0;
      while (i < aArray.length) {
        if (indvCardStrength[aArray[i]] > indvCardStrength[bArray[i]]) {
          return 1;
        } else if (indvCardStrength[bArray[i]] > indvCardStrength[aArray[i]]) {
          return -1;
        }
        i++;
      }
    });

    sortedMap[strength] = tempArray;
  });

  return sortedMap;
};

// TODO: o(N) sort... if i decide to implement it. go through each item and create an array based on the last card. If it is the only item in the array, return the rank value
// strengthMap:
// {
//   Five: [],
//   Four: [],
//   FullHouse: [],
//   Three: [
//     { hand: 'T55J5', bid: 684, strength: 'Three', highCard: 'J' },
//     { hand: 'QQQJA', bid: 483, strength: 'Three', highCard: 'A' }
//   ],
//   TwoPair: [
//     { hand: 'KK677', bid: 28, strength: 'TwoPair', highCard: 'K' },
//     { hand: 'KTJJT', bid: 220, strength: 'TwoPair', highCard: 'K' }
//   ],
//   OnePair: [ { hand: '32T3K', bid: 765, strength: 'OnePair', highCard: 'K' } ],
//   HighCard: []
// }
const getOrdersAndRanks = (strengthMap) => {
  Object.entries(strengthMap).map(([strength, eachStrengthCardArray]) => {
    const sortedMap = {
      strength: strength,
      cards: []
    };

    let eachCardIndex = 0;
    for (let i = 0; i < eachStrengthCardArray.length; i++) {
      const eachCardSplit = eachStrengthCardArray[i].hand.split('');

      if (!sortedMap.cards[eachCardSplit[eachCardIndex]]) {
        sortedMap.cards[eachCardSplit[eachCardIndex]] = [];
      }
      const tempArray = sortedMap.cards[eachCardSplit[eachCardIndex]];
      tempArray.push({
        hand: eachStrengthCardArray[i].hand,
        bid: eachStrengthCardArray[i].bid
      });
    }

    console.log(sortedMap);
  });
};

const getTotalWinnings = (sortedStrengthMap, totalHands) => {
  let totalWinnings = 0;
  let rank = totalHands;

  Object.entries(sortedStrengthMap).forEach(
    ([_strength, eachStrengthCardArray]) => {
      if (eachStrengthCardArray.length === 0) {
        return;
      }

      for (let i = 0; i < eachStrengthCardArray.length; i++) {
        totalWinnings += eachStrengthCardArray[i].bid * rank;
        rank--;
      }
    }
  );
  return totalWinnings;
};

// Logic:
// Create a map that maps based off of strength.
// KEY = strength
// VALUE = array of eachHand
// Sort prior to inserting to map. complexity is p bad here because inserting. CAN SORT AFTER to reduce time complexity
// to calculate, take length of the value and assign rank one by one. O(n)
fs.readFile('Day7_Input.txt', 'utf-8', function (err, data) {
  if (err) throw err;
  const formattedInput = formatInput(data);
  const totalHands = formattedInput.length;

  const strengthMap = {
    Five: [],
    Four: [],
    FullHouse: [],
    Three: [],
    TwoPair: [],
    OnePair: [],
    HighCard: []
  };

  formattedInput.forEach((eachHand) => {
    const eachCardInfo = getCardInfo(eachHand.hand);

    const eachCardObject = {
      hand: eachHand.hand,
      bid: eachHand.bid,
      strength: eachCardInfo.strength,
      highCard: eachCardInfo.highCard
    };

    const tempStrengthObjectArray = strengthMap[eachCardObject.strength];
    tempStrengthObjectArray.push(eachCardObject);

    strengthMap[eachCardObject.strength] = tempStrengthObjectArray;
  });

  const sortedStrengthMap = sortStrengthMap(strengthMap);

  const totalWinnings = getTotalWinnings(sortedStrengthMap, totalHands);

  console.log(totalWinnings);
});
