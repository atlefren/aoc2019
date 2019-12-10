const fs = require('fs').promises;
const {getBestAsteroidWithLocation, getAngle, getAsteroids, equals, loopMap} = require('./common');

const getCannon = map => {
  let cannon = undefined;
  loopMap(map, (x, y, p) => {
    if (p === 'X') {
      cannon = [x, y];
      return true;
    }
  });
  return cannon;
};

const getDistanceCalc = a => b => Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));

const getByAngle = (asteroids, cannon) => {
  const angles = {};

  for (let asteroid of asteroids) {
    const angle = getAngle(cannon, asteroid);

    if (!angles[angle]) {
      angles[angle] = [];
    }
    angles[angle].push(asteroid);
  }
  const sorted = [];
  const getDistance = getDistanceCalc(cannon);
  for (let angle of Object.keys(angles).sort((a, b) => parseFloat(a) - parseFloat(b))) {
    sorted.push({angle: parseFloat(angle), asteroids: angles[angle].sort((a, b) => getDistance(a) - getDistance(b))});
  }
  return sorted;
};

const clone = a => {
  const cloned = [];

  for (let obj of a) {
    cloned.push({angle: obj.angle, asteroids: [...obj.asteroids]});
  }
  return cloned;
};

const vaporize = (sorted, num) => {
  const pos = clone(sorted);
  let i = 1;
  for (let angle of pos) {
    const asteroid = angle.asteroids.shift();
    if (i === num) {
      return asteroid;
    }
    i++;
  }
};

const test = () => {
  const map = `.#....#####...#..
##...##.#####..##
##...#...#.#####.
..#.....X...###..
..#.#.....#....##`;

  const asteroids = getAsteroids(map);
  const cannon = getCannon(map);
  const sorted = getByAngle(asteroids, cannon);

  console.log(equals(vaporize(sorted, 1), [8, 1]));
  console.log(equals(vaporize(sorted, 2), [9, 0]));
  console.log(equals(vaporize(sorted, 3), [9, 1]));
  console.log(equals(vaporize(sorted, 4), [10, 0]));
  console.log(equals(vaporize(sorted, 5), [9, 2]));
  console.log(equals(vaporize(sorted, 6), [11, 1]));
  console.log(equals(vaporize(sorted, 7), [12, 1]));
  console.log(equals(vaporize(sorted, 8), [11, 2]));
  console.log(equals(vaporize(sorted, 9), [15, 1]));
};

async function task2() {
  const map = await fs.readFile('./input');
  const asteroids = getAsteroids(map.toString());

  const [cannon] = getBestAsteroidWithLocation(asteroids);

  const a = vaporize(
    getByAngle(
      asteroids.filter(a => !equals(a, cannon)),
      cannon
    ),
    200
  );
  const solution = a[0] * 100 + a[1];
  console.log(solution, solution === 1513);
}

test();
task2();
