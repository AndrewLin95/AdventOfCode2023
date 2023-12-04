var fs = require('fs');

const maxNumOfCubes = {
  red: 12,
  green: 13,
  blue: 14
};

const formatInput = (input) => {
  const formattedData = [];
  let newString = [];

  const newDataArray = input.split('');
  for (let i = 0; i < newDataArray.length; i++) {
    if (newDataArray[i] === '\r' || newDataArray[i] === '\n') {
      const _newString = newString.join('').split(': ')[1].split('; ');

      const eachGameArray = [];

      for (let j = 0; j < _newString.length; j++) {
        const eachGame = _newString[j].split(', ');

        const eachGameObject = {};
        eachGame.forEach((eachCube) => {
          const eachCubeSplit = eachCube.split(' ');
          const quantity = eachCubeSplit[0];
          const color = eachCubeSplit[1];

          eachGameObject[color] = quantity;
        });
        eachGameArray.push(eachGameObject);
      }

      formattedData.push(eachGameArray);
      newString = [];
      i++;

      continue;
    }

    newString.push(newDataArray[i]);
  }

  return formattedData;
};

// Part 1 Solution Code
fs.readFile('Day2_Input.txt', 'utf-8', function (err, data) {
  if (err) throw err;

  const formattedInput = formatInput(data);

  let validGameCount = 0;
  formattedInput.forEach((eachGame, index) => {
    let isValidGame = true;

    for (const [_key, value] of Object.entries(eachGame)) {
      if (!isValidGame) {
        break;
      }
      const eachSubGame = value;

      for (const [color, count] of Object.entries(eachSubGame)) {
        if (count > maxNumOfCubes[color]) {
          isValidGame = false;
          break;
        }
      }
    }
    if (isValidGame) {
      validGameCount += index + 1;
    }
  });

  console.log('Part 1 Solution:', validGameCount);
});

// Part 2 Solution Code
fs.readFile('Day2_Input.txt', 'utf-8', function (err, data) {
  if (err) throw err;

  const formattedInput = formatInput(data);

  let sumOfAllCubePowers = 0;
  formattedInput.forEach((eachGame) => {
    const currGameColorCountMin = {
      red: 0,
      green: 0,
      blue: 0
    };

    for (const [_key, value] of Object.entries(eachGame)) {
      const eachSubGame = value;

      for (const [color, count] of Object.entries(eachSubGame)) {
        if (
          currGameColorCountMin[color] === 0 ||
          count > currGameColorCountMin[color]
        ) {
          currGameColorCountMin[color] = parseInt(count);
        }
      }
    }

    const eachGameCubePower = getPower(
      currGameColorCountMin['red'],
      currGameColorCountMin['green'],
      currGameColorCountMin['blue']
    );
    sumOfAllCubePowers += eachGameCubePower;
  });

  console.log('Part 2 Solution:', sumOfAllCubePowers);
});

// assuming each color cube is > 0
const getPower = (red, green, blue) => {
  return red * green * blue;
};
