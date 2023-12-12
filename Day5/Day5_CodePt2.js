var fs = require('fs');

const SEED_TO_SOIL = 'seed-to-soil';
const SOIL_TO_FERTILIZER = 'soil-to-fertilizer';
const FERTILIZER_TO_WATER = 'fertilizer-to-water';
const WATER_TO_LIGHT = 'water-to-light';
const LIGHT_TO_TEMP = 'light-to-temperature';
const TEMP_TO_HUMIDITY = 'temperature-to-humidity';
const HUMIDITY_TO_LOCATION = 'humidity-to-location';

// NEW PART 2 LOGIC: seeds are formatted as [seedRangeStart, seedRangeEnd]
// destinationMaps are formatted as [sourceStart, sourceEnd, destination]
// {
//   seeds: [ [Array], [Array] ],
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
  const tempSeedArray = input[0].map((value) => parseInt(value.trim()));

  const seedArray = [];
  for (let j = 0; j < tempSeedArray.length; j += 2) {
    const seedRangeStart = tempSeedArray[j];
    const seedRangeLength = tempSeedArray[j + 1];
    const seedRangeEnd = seedRangeStart + seedRangeLength;

    seedArray.push([seedRangeStart, seedRangeEnd]);
  }

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

// sorts and combined the ranges if it is overlapping
const sortAndCombineRanges = (unsortedRanges) => {
  if (unsortedRanges.length === 1) {
    return unsortedRanges;
  }

  unsortedRanges.sort((a, b) => {
    if (a[0] > b[0]) {
      return 1;
    } else if (b[0] > a[0]) {
      return -1;
    }
  });

  const combinedSeeds = [];

  let currSeed = null;
  for (let i = 0; i < unsortedRanges.length; i++) {
    if (currSeed === null) {
      currSeed = unsortedRanges[i];
      continue;
    }
    const nextSeed = unsortedRanges[i];

    // these are overlapping or they are one apart, combine then continue
    if (currSeed[1] > nextSeed[0]) {
      const firstNumber = currSeed[0];
      const secondNumber = nextSeed[1];
      currSeed = [firstNumber, secondNumber];
      continue;
    }

    if (currSeed[1] + 1 === nextSeed[0]) {
      const firstNumber = currSeed[0];
      const secondNumber = nextSeed[1];
      currSeed = [firstNumber, secondNumber];
      combinedSeeds.push(currSeed);
      continue;
    }

    // if no overlap
    combinedSeeds.push(currSeed);
    // pushed the last array if it is the last one
    if (i + 1 === unsortedRanges.length) {
      combinedSeeds.push(nextSeed);
    }
    currSeed = null;
  }

  return combinedSeeds;
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

// NEW PART 2 LOGIC: See if the seedStart fits within each map range.
// If it fits, check if the entire seed range fits.
// if it does, return the entire destination RANGE (ie. [30, 35])
// If it doesnt, repeat from the end range and return all destination RANGES.
// need to check the ranges for all of them

// TODO: for the above logic, we can use a map to reduce time complexity
const determineDestination = (seedRange, destinationMaps) => {
  let seedRangeStart = seedRange[0];
  let seedRangeEnd = seedRange[1];

  // if seedRange END is smaller than the smallest sourceStart, return the targetDestination as seed
  if (seedRangeEnd < destinationMaps[0][0]) {
    return [[seedRangeStart, seedRangeEnd]];
  }

  // if seedRange START is greater than the greatest sourceEnd, return the targetDestination as seed
  if (seedRangeStart > destinationMaps[destinationMaps.length - 1][1]) {
    return [[seedRangeStart, seedRangeEnd]];
  }

  const returnRanges = [];

  const sortedDestinationMap = destinationMaps.sort((a, b) => {
    if (a[2] > b[2]) {
      return 1;
    } else {
      return -1;
    }
  });

  // ALGO: Sort through the map by smallest to largest distance. Go through each one with the following checks:
  // 1) check if it fits nicely. If yes, just push the remaining
  // 2) If it starts earlier, push [mapStart, seedEnd]. Store the remaining values to be checked.
  // 3) if it starts later, push [seedStart, mapEnd]. Store the remaning values to be checked.
  // IF there is no more values for the rangeStart/End, can exit out of loop early.
  let continueLoop = true;
  let i = 0;
  while (continueLoop) {
    while (i < sortedDestinationMap.length && continueLoop) {
      const sourceStart = sortedDestinationMap[i][0];
      const sourceEnd = sortedDestinationMap[i][1];
      const destination = sortedDestinationMap[i][2];

      // If seedrangeStart is within the map
      //      |---seedStart----|
      //  |----Map----|
      if (seedRangeStart >= sourceStart && seedRangeStart <= sourceEnd) {
        const startDifference = seedRangeStart - sourceStart;
        const startDestination = startDifference + destination;
        // fits nicely, no need to continue.
        //      |--seedStart---|
        //  |-----------Map---------|
        if (seedRangeEnd <= sourceEnd) {
          const endDifference = seedRangeEnd - seedRangeStart;
          const endDestination = startDestination + endDifference;
          returnRanges.push([startDestination, endDestination]);
          continueLoop = false;
          continue;
          // If the end is LARGER than the mapEnd. Move start up
          //      |---seedStart-------------|
          //  |-------Map-----|^ new seedStart
        } else {
          // to find the end. Find the distance of the map. add to startDestination
          const mapDistance = sourceEnd - sourceStart;
          const endDestination = startDestination + mapDistance;
          returnRanges.push([startDestination, endDestination]);

          seedRangeStart = sourceEnd + 1;
          i++;
          continue;
        }
      } else {
        // if the seedrange END is within the map but the seedrange Start is NOT.
        // |---seedStart----|
        //             |----Map----|
        if (seedRangeEnd <= sourceEnd && seedRangeEnd >= sourceStart) {
          const startDestination = destination;
          const endDestination = seedRangeEnd;

          returnRanges.push([startDestination, endDestination]);
          seedRangeEnd = sourceStart - 1;
          i++;
          continue;
          // if the seedrange END is greater than the map and the seedrange Start is NOT within the map.
          // |---seedStart------------------|
          //             |----Map----|
        } else {
          // LAZY SOLUTION
          // return the distance by map length.
          // create two different arrays and re-run this algo

          continue;
        }
      }
    }
    // if out of bounds / reaches the end of the destination maps. just add to array
    if (i >= sortedDestinationMap.length && continueLoop) {
      returnRanges.push([seedRangeStart, seedRangeEnd]);
      continueLoop = false;
    }
  }

  // // for (let i = 0; i < destinationMaps.length; i++) {
  // //   const sourceStart = destinationMaps[i][0];
  // //   const sourceEnd = destinationMaps[i][1];
  // //   const destination = destinationMaps[i][2];

  // //   if (seedRangeStart >= sourceStart) {
  // //     if (seedRangeEnd <= sourceEnd) {
  // //       returnRanges.push([seedRangeStart, seedRangeEnd]);
  // //     } else if (seedRangeEnd > sourceEnd) {
  // //       const startDifference = seedRangeStart - sourceStart;
  // //       const startDestination = startDifference + destination;

  // //       const endDifference = sourceEnd - seedRangeStart;
  // //       const endDestination = startDestination + endDifference;
  // //       returnRanges.push([startDestination, endDestination]);
  // //     }
  // //   }
  // // }

  // let continueLoop = true;
  // let i = 0;
  // while (continueLoop) {
  //   while (i < destinationMaps.length && continueLoop) {
  //     const sourceStart = destinationMaps[i][0];
  //     const sourceEnd = destinationMaps[i][1];
  //     const destination = destinationMaps[i][2];

  //     // This checks if the range is LESS than the map range
  //     if (seedRangeStart < sourceStart) {
  //       if (seedRangeEnd < sourceStart) {
  //         returnRanges.push([seedRangeStart, seedRangeEnd]);
  //         continueLoop = false;
  //         continue;
  //       } else {
  //         returnRanges.push([seedRangeStart, sourceStart]);
  //         seedRangeStart = sourceStart + 1;
  //         i++;
  //         continue;
  //       }
  //     }

  //     if (seedRangeStart > sourceStart && seedRangeStart < sourceEnd) {
  //       const startDifference = seedRangeStart - sourceStart;
  //       const startDestination = startDifference + destination;

  //       // if it fits within a range nicely
  //       if (seedRangeEnd <= sourceEnd) {
  //         const endDifference = seedRangeEnd - seedRangeStart;
  //         const endDestination = startDestination + endDifference;

  //         returnRanges.push([startDestination, endDestination]);
  //         continueLoop = false;
  //       } else {
  //         // if there is more range afterwards
  //         const endDifference = sourceEnd - seedRangeStart;
  //         const endDestination = startDestination + endDifference;
  //         returnRanges.push([startDestination, endDestination]);
  //         seedRangeStart = seedRangeStart + endDifference + 1;
  //         i++;
  //         continue;
  //       }
  //     }
  //     i++;
  //   }
  //   // if out of bounds / reaches the end of the destination maps. just add to array
  //   if (i >= destinationMaps.length && continueLoop) {
  //     returnRanges.push([seedRangeStart, seedRangeEnd]);
  //     continueLoop = false;
  //   }
  // }

  // if there is no location suitable, return targetDestination as seed;
  return returnRanges;
};

const retrieveAllDestinations = (combinedRanges, targetDestinationMap) => {
  let allDestinations = [];

  const rangesToCheck = [...combinedRanges];

  rangesToCheck.forEach((eachSoilRange) => {
    const tempSoilRange = determineDestination(
      eachSoilRange,
      targetDestinationMap
    );

    if (tempSoilRange.AdditionalRangesTocheck.length !== 0) {
      tempSoilRange.forEach((eachItem) => {
        rangesToCheck.push(eachItem);
      });
    }

    allDestinations.push(...tempSoilRange);
  });

  const combinedDestinationRanges = sortAndCombineRanges(allDestinations);

  return combinedDestinationRanges;
};

fs.readFile('Day5_Test.txt', 'utf-8', function (err, data) {
  if (err) throw err;

  let lowestLocation = Infinity;

  const { seeds, destinationMaps } = formatInput(data);

  const sortedSeeds = sortAndCombineRanges(seeds);
  const sortedDestinationMaps = sortDestinationMaps(destinationMaps);

  const flattenedLocationDistances = [];

  sortedSeeds.forEach((eachSeedRange) => {
    const soilDestination = determineDestination(
      eachSeedRange,
      sortedDestinationMaps[SEED_TO_SOIL]
    );
    const combinedSoilDestinations = sortAndCombineRanges(soilDestination);

    const allFertilizerDestinations = retrieveAllDestinations(
      combinedSoilDestinations,
      sortedDestinationMaps[SOIL_TO_FERTILIZER]
    );

    const allWaterDestinations = retrieveAllDestinations(
      allFertilizerDestinations,
      sortedDestinationMaps[FERTILIZER_TO_WATER]
    );

    const allLightDestinations = retrieveAllDestinations(
      allWaterDestinations,
      sortedDestinationMaps[WATER_TO_LIGHT]
    );

    const allTempDestinations = retrieveAllDestinations(
      allLightDestinations,
      sortedDestinationMaps[LIGHT_TO_TEMP]
    );

    const allHumidityDestinations = retrieveAllDestinations(
      allTempDestinations,
      sortedDestinationMaps[TEMP_TO_HUMIDITY]
    );

    const allLocationDestinations = retrieveAllDestinations(
      allHumidityDestinations,
      sortedDestinationMaps[HUMIDITY_TO_LOCATION]
    );

    flattenedLocationDistances.push(...allLocationDestinations);
    console.log('alllocaiton', allLocationDestinations);
  });

  console.log(flattenedLocationDistances.flat().sort()[0]);
});
