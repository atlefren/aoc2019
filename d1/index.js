const readFile = require('../read');

const fuel = mass => Math.floor(mass / 3) - 2;

async function p1() {
  const masses = await readFile('input', l => parseInt(l, 10));
  const total = masses.reduce((acc, m) => acc + fuel(m), 0);
  console.log(total);
}
/*
p1();

console.log(fuel(12) === 2);
console.log(fuel(14) === 2);
console.log(fuel(1969) === 654);
console.log(fuel(100756) === 33583);
*/
const fuel2 = (f, isMass = true) => {
  const prev = isMass ? fuel(f) : f;
  const res = fuel(prev);
  if (res <= 0) {
    return prev;
  }
  return prev + fuel2(res, false);
};

console.log(fuel2(12) === 2);
console.log(fuel2(1969) === 966);
console.log(fuel2(100756) === 50346);

async function p2() {
  const masses = await readFile('input', l => parseInt(l, 10));
  const total = masses.reduce((acc, m) => acc + fuel2(m), 0);
  console.log(total);
}

p2();
