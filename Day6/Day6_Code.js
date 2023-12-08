var fs = require('fs');
const UP = 'up';
const DOWN = 'down';

// {
//     game: [{
//         time:
//         distance:
//     }]
// }
const formatInput = (inputData) => {
  const input = inputData.split('\n').map((input) => input.split(':'));

  const timeInput = input[0][1].split(' ').filter((value) => value !== '');
  const distanceInput = input[1][1].split(' ').filter((value) => value !== '');

  const gameObject = [];
  for (let i = 0; i < timeInput.length; i++) {
    const tempObj = {
      time: parseInt(timeInput[i].trim(), 10),
      distance: parseInt(distanceInput[i].trim(), 10)
    };
    gameObject.push(tempObj);
  }

  return gameObject;
};

const evaluateRace = (time, distanceToBeat, holdTime, direction) => {
  let count = 0;
  let stopCount = false;
  let currHoldTime = holdTime;

  if (direction === UP) {
    while (!stopCount) {
      const distanceTravelled = currHoldTime * (time - currHoldTime);
      if (distanceTravelled > distanceToBeat) {
        count++;
        currHoldTime++;
      } else {
        stopCount = true;
      }
    }
  } else {
    while (!stopCount) {
      const distanceTravelled = currHoldTime * (time - currHoldTime);
      if (distanceTravelled > distanceToBeat) {
        count++;
        currHoldTime--;
      } else {
        stopCount = true;
      }
    }
  }

  return count;
};

// Part 1
fs.readFile('Day6_Test.txt', 'utf-8', function (err, data) {
  if (err) throw err;

  const gameObject = formatInput(data);
  let numbersOfWaysWon = 1;

  gameObject.forEach((eachGame) => {
    const midPoint = Math.floor(eachGame.time / 2);
    // check up
    const upCount = evaluateRace(
      eachGame.time,
      eachGame.distance,
      midPoint + 1,
      UP
    );
    // check down
    const downCount = evaluateRace(
      eachGame.time,
      eachGame.distance,
      midPoint,
      DOWN
    );

    const totalCount = upCount + downCount;

    numbersOfWaysWon *= totalCount;
  });

  console.log(numbersOfWaysWon);
});

// {
//     game: [{
//         time:
//         distance:
//     }]
// }
const formatSingleInput = (inputData) => {
  const input = inputData.split('\n').map((input) => input.split(':'));

  const timeInput = input[0][1]
    .split(' ')
    .filter((value) => value !== '')
    .join('')
    .trim();
  const distanceInput = input[1][1]
    .split(' ')
    .filter((value) => value !== '')
    .join('')
    .trim();

  const gameObject = {
    time: timeInput,
    distance: distanceInput
  };

  return gameObject;
};

// Part 2
fs.readFile('Day6_Test.txt', 'utf-8', function (err, data) {
  if (err) throw err;

  const gameObject = formatSingleInput(data);
  let numbersOfWaysWon = 1;

  const midPoint = Math.floor(gameObject.time / 2);
  // check up
  const upCount = evaluateRace(
    gameObject.time,
    gameObject.distance,
    midPoint + 1,
    UP
  );
  // check down
  const downCount = evaluateRace(
    gameObject.time,
    gameObject.distance,
    midPoint,
    DOWN
  );

  const totalCount = upCount + downCount;

  numbersOfWaysWon *= totalCount;

  console.log(numbersOfWaysWon);
});
