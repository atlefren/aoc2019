const fs = require('fs').promises;
const {getBestAsteroidWithLocation, getAsteroids} = require('./common');

const getBestAsteroid = map => {
  const asteroids = getAsteroids(map);
  const [best, max] = getBestAsteroidWithLocation(asteroids);
  return max;
};

const test = () => {
  const map1 = `.#..#
.....
#####
....#
...##`;
  console.log(getBestAsteroid(map1) == 8);

  const map2 = `......#.#.
#..#.#....
..#######.
.#.#.###..
.#..#.....
..#....#.#
#..#....#.
.##.#..###
##...#..#.
.#....####`;
  console.log(getBestAsteroid(map2) == 33);

  const map3 = `#.#...#.#.
.###....#.
.#....#...
##.#.#.#.#
....#.#.#.
.##..###.#
..#...##..
..##....##
......#...
.####.###.`;

  console.log(getBestAsteroid(map3) == 35);

  const map4 = `.#..#..###
####.###.#
....###.#.
..###.##.#
##.##.#.#.
....###..#
..#.#..#.#
#..#.#.###
.##...##.#
.....#.#..`;

  console.log(getBestAsteroid(map4) == 41);

  const map5 = `.#..##.###...#######
##.############..##.
.#.######.########.#
.###.#######.####.#.
#####.##.#.##.###.##
..#####..#.#########
####################
#.####....###.#.#.##
##.#################
#####.##.###..####..
..######..##.#######
####.##.####...##..#
.#####..#.######.###
##...#.##########...
#.##########.#######
.####.#.###.###.#.##
....##.##.###..#####
.#.#.###########.###
#.#.#.#####.####.###
###.##.####.##.#..##`;

  console.log(getBestAsteroid(map5) == 210);
};

async function task1() {
  const map = await fs.readFile('./input');
  const result = getBestAsteroid(map.toString());
  console.log(result, result === 314);
}
test();
task1();
