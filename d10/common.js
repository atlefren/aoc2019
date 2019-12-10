const getAngle = (p1, p2) => {
  const deltaY = p1[1] - p2[1];
  const deltaX = p2[0] - p1[0];
  const result = Math.atan2(deltaX, deltaY) * (180 / Math.PI);
  return result < 0 ? 360 + result : result;
};

const loopMap = (map, cb) => {
  let y = 0;
  for (let line of map.split('\n')) {
    let x = 0;
    for (let p of line.split('')) {
      const res = cb(x, y, p);
      if (res === true) {
        break;
      }
      x++;
    }
    y++;
  }
};

const getAsteroids = map => {
  const asteroids = [];
  loopMap(map, (x, y, p) => {
    if (p === '#') {
      asteroids.push([x, y]);
    }
  });

  return asteroids;
};

const countVisible = (asteroid, asteroids) => {
  const angles = [];
  for (let other of asteroids) {
    if (!equals(asteroid, other)) {
      const angleTo = getAngle(asteroid, other);
      if (angles.indexOf(angleTo) === -1) {
        angles.push(angleTo);
      }
    }
  }
  return angles.length;
};

const getBestAsteroidWithLocation = asteroids => {
  let max = -Infinity;
  let best = undefined;
  for (let asteroid of asteroids) {
    const num = countVisible(asteroid, asteroids);
    if (num > max) {
      max = num;
      best = asteroid;
    }
  }

  return [best, max];
};

const equals = (p1, p2) => p1[0] === p2[0] && p1[1] === p2[1];

module.exports = {getAngle, getAsteroids, equals, loopMap, getBestAsteroidWithLocation};
