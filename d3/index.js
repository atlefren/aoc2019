const readFile = require('../read');

const advance = (prev, p) => {
  let s = p.split('');
  let dir = s.shift();
  let dist = parseInt(s.join(''), 10);

  let deltaX = 0;
  let deltaY = 0;
  if (dir === 'U') {
    deltaY = dist;
  } else if (dir === 'D') {
    deltaY = -dist;
  } else if (dir === 'R') {
    deltaX = dist;
  } else if (dir === 'L') {
    deltaX = -dist;
  }

  return [prev[0] + deltaX, prev[1] + deltaY];
};

const last = arr => arr[arr.length - 1];

const trace = w => w.reduce((acc, path) => [...acc, advance(last(acc), path)], [[0, 0]]);

const getIntersection = (l1, l2) => {
  let x1 = l1[0][0];
  let y1 = l1[0][1];

  let x2 = l1[1][0];
  let y2 = l1[1][1];

  let x3 = l2[0][0];
  let y3 = l2[0][1];

  let x4 = l2[1][0];
  let y4 = l2[1][1];

  const den = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
  const noma = (x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3);
  const nomb = (x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3);

  if (den === 0) {
    if (noma === 0 && nomb === 0) {
      return null;
    }
    return null;
  }

  const ua = noma / den;
  const ub = nomb / den;

  if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
    let x = x1 + ua * (x2 - x1);
    let y = y1 + ua * (y2 - y1);
    return [x, y];
  }

  return null;
};

const distToClosest = (p1, p2) => {
  const path1 = trace(p1.split(','));
  const path2 = trace(p2.split(','));
  const intersects = [];
  for (let i = 1; i < path1.length; i++) {
    for (let j = 1; j < path2.length; j++) {
      const intersect = getIntersection([path1[i - 1], path1[i]], [path2[j - 1], path2[j]]);
      if (intersect && intersect[0] !== 0 && intersect[1] !== 0) {
        intersects.push(intersect);
      }
    }
  }

  return manhattanFromOrigin(closest(intersects)[0]);
};

const manhattan = (a, b) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
const manhattanFromOrigin = p => manhattan([0, 0], p);

const closest = points => points.sort((a, b) => manhattanFromOrigin(a) - manhattanFromOrigin(b));

const countSteps = (path, index, intersect) => {
  const pathToIntersect = [...path.slice(0, index), intersect];
  let steps = 0;
  for (let i = 1; i < pathToIntersect.length; i++) {
    let s = manhattan(pathToIntersect[i - 1], pathToIntersect[i]);
    steps += s;
  }
  return steps;
};

const minSteps = (p1, p2) => {
  const path1 = trace(p1.split(','));
  const path2 = trace(p2.split(','));
  let minDist = Infinity;
  for (let i = 1; i < path1.length; i++) {
    for (let j = 1; j < path2.length; j++) {
      const intersect = getIntersection([path1[i - 1], path1[i]], [path2[j - 1], path2[j]]);
      if (intersect && intersect[0] !== 0 && intersect[1] !== 0) {
        const totalSteps = countSteps(path1, i, intersect) + countSteps(path2, j, intersect);
        if (totalSteps < minDist) {
          minDist = totalSteps;
        }
      }
    }
  }

  return minDist;
};

console.log(distToClosest('R8,U5,L5,D3', 'U7,R6,D4,L4') === 6);
console.log(distToClosest('R75,D30,R83,U83,L12,D49,R71,U7,L72', 'U62,R66,U55,R34,D71,R55,D58,R83') === 159);
console.log(
  distToClosest('R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51', 'U98,R91,D20,R16,D67,R40,U7,R15,U6,R7') === 135
);

async function t1() {
  const input = await readFile('input');
  console.log(distToClosest(input[0], input[1]) === 1519);
}

t1();

console.log(minSteps('R8,U5,L5,D3', 'U7,R6,D4,L4') === 30);
console.log(minSteps('R75,D30,R83,U83,L12,D49,R71,U7,L72', 'U62,R66,U55,R34,D71,R55,D58,R83') === 610);
console.log(minSteps('R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51', 'U98,R91,D20,R16,D67,R40,U7,R15,U6,R7') === 410);

async function t2() {
  const input = await readFile('input');
  console.log(minSteps(input[0], input[1]) === 14358);
}

t2();
