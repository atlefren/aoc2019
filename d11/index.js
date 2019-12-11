const {compute} = require('../intcode');
const readFile = require('../read');

const getUnique = tiles => [...new Set(tiles.map(t => `${t[0]},${t[1]}`))];

const advance = (pos, direction) => {
  let [x, y] = pos;
  if (direction === 0) {
    y = y - 1;
  }
  if (direction === 180) {
    y = y + 1;
  }
  if (direction === 270) {
    x = x - 1;
  }
  if (direction === 90) {
    x = x + 1;
  }
  return [x, y];
};

const normalize = angle => {
  const a = angle % 360;
  return a < 0 ? a + 360 : a;
};

const getNewDirection = (direction, turn) => {
  if (turn === 0) {
    //left
    return normalize(direction - 90);
  }
  if (turn === 1) {
    //right
    return normalize(direction + 90);
  }
};

const getTileColor = (tiles, position) => {
  for (let i = tiles.length - 1; i >= 0; i--) {
    const tile = tiles[i];
    if (tile[0] === position[0] && tile[1] === position[1]) {
      return tile[2];
    }
  }
  return 0;
};

const computer = startColor => {
  const tiles = []; //[[x, y, color]]
  let currentDirection = 0;
  let currentTile = [0, 0]; //x, y

  return {
    getInput: instructions => {
      if (!instructions.length) {
        return startColor;
      }
      const [color, turn] = instructions;
      //paint current tile
      tiles.push([currentTile[0], currentTile[1], color]);

      //compute next position
      currentDirection = getNewDirection(currentDirection, turn);
      currentTile = advance(currentTile, currentDirection);
      return getTileColor(tiles, currentTile);
    },
    getTiles: () => [...tiles]
  };
};

const getBounds = tiles => {
  //minx, miny, maxx, maxy
  const bounds = [Infinity, Infinity, -Infinity, -Infinity];
  for (let [x, y] of tiles) {
    if (x < bounds[0]) {
      bounds[0] = x;
    }
    if (x > bounds[2]) {
      bounds[2] = x;
    }

    if (y < bounds[1]) {
      bounds[1] = y;
    }
    if (y > bounds[3]) {
      bounds[3] = y;
    }
  }
  return bounds;
};

const draw = tiles => {
  const bounds = getBounds(tiles);
  const image = [];
  for (let y = bounds[1]; y <= bounds[3]; y++) {
    const line = [];
    for (let x = bounds[0]; x <= bounds[2]; x++) {
      line.push(getTileColor(tiles, [x, y]) === 0 ? ' ' : '#');
    }
    image.push(line.join(''));
  }
  return image.join('\n');
};

const test = () => {
  const c = computer(0);

  console.log(c.getInput([]) === 0);
  console.log(c.getInput([1, 0]) === 0);
  console.log(c.getInput([0, 0]) === 0);
  console.log(c.getInput([1, 0]) === 0);
  console.log(c.getInput([1, 0]) === 1);
  console.log(c.getInput([0, 1]) === 0);
  console.log(c.getInput([1, 0]) === 0);
  console.log(c.getInput([1, 0]) === 0);
  console.log(getUnique(c.getTiles()).length);
};

async function task1() {
  const program = await readFile('input', l => parseInt(l, 10), ',');
  let instructions = [];
  const c = computer(0);
  compute(
    program,
    () => {
      const color = c.getInput(instructions);
      instructions = [];
      return color;
    },
    o => {
      instructions.push(o);
    }
  );

  const length = getUnique(c.getTiles()).length;
  console.log(length, length === 1686);
}

async function task2() {
  const program = await readFile('input', l => parseInt(l, 10), ',');
  let instructions = [];

  const c = computer(1);

  compute(
    program,
    () => {
      const color = c.getInput(instructions);
      instructions = [];
      return color;
    },
    o => {
      instructions.push(o);
    }
  );

  const tiles = c.getTiles();

  console.log(draw(tiles));
}

test();
task1();
task2();
