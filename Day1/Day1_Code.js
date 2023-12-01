var fs = require('fs');

const stringToNumMap = {
  "one": 1,
  "two" : 2,
  "three" : 3,
  "four" : 4,
  "five": 5,
  "six" : 6,
  "seven" : 7,
  "eight" : 8,
  "nine" : 9,
}

fs.readFile('Day1_Input.txt', 'utf-8', function(err, data) {
  if (err) throw err;


  // format the input text to an array of strings
  const formattedData = [];
  let newString = [];

  const newDataArray = data.split('');
  for (let i = 0; i < newDataArray.length; i++) {
    if (newDataArray[i] === "\r" || newDataArray[i] === "\n") {
      formattedData.push(newString.join(''));
      newString = [];
      i++;
      
      continue;
    }

    newString.push(newDataArray[i]);
  }

  const numberArray = [];

  // Determine the first and last numbers and pushes it into an array with the formatted number
  formattedData.forEach(string => {
    const stringArray = string.split('');

    let firstNum = null;
    let lastNum = null;
    let currString = "";

    stringArray.forEach(char => {
      currString += char;

      if (firstNum === null) {
        if (/\d/.test(char)) {
          firstNum = char;
        } else if (/(one|two|three|four|five|six|seven|eight|nine)/.test(currString)) {
          let match = currString.match(/(one|two|three|four|five|six|seven|eight|nine)/);

          firstNum = stringToNumMap[match[0]];
          // to account for a string like twone, keep the last two chars
          currString = currString.slice(-2);
        }
      } else if (/\d/.test(char)) {
        lastNum = char;
      } else if (/(one|two|three|four|five|six|seven|eight|nine)/.test(currString)) {
        let match = currString.match(/(one|two|three|four|five|six|seven|eight|nine)/);

        lastNum = stringToNumMap[match[0]];
        currString = currString.slice(-2);
      }
    });

    if (lastNum === null) {
      lastNum = firstNum;
    }
    const formattedNumber = parseInt(`${firstNum}${lastNum}`);
    numberArray.push(formattedNumber);
  });

  let sum = 0;
  numberArray.forEach(number => {
    sum += number;
  });

  console.log(sum);

  // fs.writeFile("C:/Users/Andre/OneDrive/Desktop/Odin Project/AdventOfCode2023/log.txt", JSON.stringify(numberArray), function(err) {
  //   if(err) {
  //       return console.log(err);
  //   }

  //   console.log("The file was saved!");
  // }); 
});