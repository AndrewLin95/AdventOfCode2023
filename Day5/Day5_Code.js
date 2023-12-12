var fs = require('fs');

const SEED_TO_SOIL = 'seed-to-soil';
const SOIL_TO_FERTILIZER = 'soil-to-fertilizer';
const FERTILIZER_TO_WATER = 'fertilizer-to-water';
const WATER_TO_LIGHT = 'water-to-light';
const LIGHT_TO_TEMP = 'light-to-temperature';
const TEMP_TO_HUMIDITY = 'temperature-to-humidity';
const HUMIDITY_TO_LOCATION = 'humidity-to-location';

// Formattedinput is below. Each array within the destinationMaps are a tuple defined as:
// [sourceStart, sourceEnd, destination]
// {
//   seeds: [ 79, 14, 55, 13 ],
//   destinationMaps: {
//     'seed-to-soil': [ [Array], [Array] ],
//     'soil-to-fertilizer': [ [Array], [Array], [Array] ],
//     'fertilizer-to-water': [ [Array], [Array], [Array], [Array] ],
//     'water-to-light': [ [Array], [Array] ],
//     'light-to-temperature': [ [Array], [Array], [Array] ],
//     'temperature-to-humidity': [ [Array], [Array] ],
//     'humidity-to-location': [ [Array], [Array] ]
//   }
// }
const formatInput = (inputData) => {
  const input = inputData
    .split('\n')
    .map((input) => input.split(' '))
    .filter((value) => !value.includes('\r'));

  input[0].shift();
  const seedArray = input[0].map((value) => parseInt(value.trim()));

  let map = {
    'seed-to-soil': [],
    'soil-to-fertilizer': [],
    'fertilizer-to-water': [],
    'water-to-light': [],
    'light-to-temperature': [],
    'temperature-to-humidity': [],
    'humidity-to-location': []
  };

  let currMapName = null;
  let tempMap = [];
  for (let i = 1; i < input.length; i++) {
    if (!/^[0-9]*$/.test(parseInt(input[i][0]))) {
      // if it is a new map, push the current map, then reset
      if (tempMap.length !== 0) {
        map[currMapName] = tempMap;
      }

      currMapName = input[i][0];
      tempMap = [];
      i++;
    }
    // for each tuple, instead of having it as
    // [destination, source, distance], change to:
    // [sourceStart, sourceEnd, destination]
    // can calculate the target location using the abovelater
    if (currMapName !== null) {
      const destination = parseInt(input[i][0]);
      const source = parseInt(input[i][1]);
      const distance = parseInt(input[i][2].trim());

      const sourceStart = source;
      const sourceEnd = source + distance;

      // [sourceStart, sourceEnd, destination];
      const newFormattedTuple = [sourceStart, sourceEnd, destination];

      tempMap.push(newFormattedTuple);
    }
    // on the last item, push to map
    if (i === input.length - 1) {
      map[currMapName] = tempMap;
    }
  }

  const returnObject = {
    seeds: seedArray,
    destinationMaps: map
  };

  return returnObject;
};

const sortDestinationMaps = (unsortedDestinationMap) => {
  let sortedDestinationMap = {
    'seed-to-soil': [],
    'soil-to-fertilizer': [],
    'fertilizer-to-water': [],
    'water-to-light': [],
    'light-to-temperature': [],
    'temperature-to-humidity': [],
    'humidity-to-location': []
  };

  Object.entries(unsortedDestinationMap).forEach(([mapType, valueArray]) => {
    valueArray.sort((a, b) => {
      if (a[0] > b[0]) {
        return 1;
      } else if (b[0] > a[0]) {
        return -1;
      }
    });

    sortedDestinationMap[mapType] = valueArray;
  });

  return sortedDestinationMap;
};

const determineDestination = (seed, destinationMaps) => {
  // if seed is smaller than the smallest sourceStart, return the targetDestination as seed
  if (seed < destinationMaps[0][0]) {
    return seed;
  }

  // if seed is greater than the greatest sourceEnd, return the targetDestination as seed
  if (seed > destinationMaps[destinationMaps.length - 1][1]) {
    return seed;
  }

  let i = 0;
  while (i < destinationMaps.length) {
    const sourceStart = destinationMaps[i][0];
    const sourceEnd = destinationMaps[i][1];
    const destination = destinationMaps[i][2];

    // if seed is within this map, determine the difference,
    // then add the difference to destination which gives us the targetDestination
    if (seed > sourceStart && seed < sourceEnd) {
      const difference = seed - sourceStart;
      return difference + destination;
    }

    i++;
  }

  // if there is no location suitable, return targetDestination as seed;
  return seed;
};

fs.readFile('Day5_Input.txt', 'utf-8', function (err, data) {
  if (err) throw err;

  let lowestLocation = Infinity;

  const { seeds, destinationMaps } = formatInput(data);

  const sortedDestinationMaps = sortDestinationMaps(destinationMaps);

  seeds.forEach((eachSeed) => {
    const soilDestination = determineDestination(
      eachSeed,
      sortedDestinationMaps[SEED_TO_SOIL]
    );

    const fertilizerDestination = determineDestination(
      soilDestination,
      sortedDestinationMaps[SOIL_TO_FERTILIZER]
    );

    const waterDestination = determineDestination(
      fertilizerDestination,
      sortedDestinationMaps[FERTILIZER_TO_WATER]
    );

    const lightDestination = determineDestination(
      waterDestination,
      sortedDestinationMaps[WATER_TO_LIGHT]
    );

    const temperatureDestination = determineDestination(
      lightDestination,
      sortedDestinationMaps[LIGHT_TO_TEMP]
    );

    const humidityDestination = determineDestination(
      temperatureDestination,
      sortedDestinationMaps[TEMP_TO_HUMIDITY]
    );

    const finalLocation = determineDestination(
      humidityDestination,
      sortedDestinationMaps[HUMIDITY_TO_LOCATION]
    );

    if (finalLocation < lowestLocation) {
      lowestLocation = finalLocation;
    }
  });

  console.log(lowestLocation);
});
