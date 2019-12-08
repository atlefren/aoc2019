const {getMaxInputSignal} = require('./util');
const {computeBlock, getCode} = require('../intcode');
const readFile = require('../read');

const amplifier = (program, getData, writeData) => {
  let pointer = 0;
  let data = undefined;

  return {
    next: () => {
      const code = getCode(program, pointer);
      if (code === 3) {
        data = getData();
        if (data === undefined) {
          return true;
        }
      }
      pointer = computeBlock(program, pointer, () => data, writeData);
      return false;
    },
    finished: () => {
      return program[pointer] === 99;
    }
  };
};

const getNext = (num, i) => {
  let next = i + 1;
  return next > num ? 0 : next;
};

function runAmps(program, phaseSettings) {
  const data = [];
  const amplifiers = [];

  const getData = i => data[i].shift();

  const writeData = (i, value) => {
    data[getNext(4, i)].push(value);
  };

  for (let i = 0; i < 5; i++) {
    data[i] = [phaseSettings[i]];
    amplifiers[i] = amplifier(
      [...program],
      () => getData(i),
      data => writeData(i, data)
    );
  }
  data[0].push(0);

  let currentAmp = 0;
  while (!amplifiers[4].finished()) {
    if (amplifiers[currentAmp] && !amplifiers[currentAmp].finished()) {
      const isWaiting = amplifiers[currentAmp].next();
      if (isWaiting) {
        currentAmp = getNext(4, currentAmp);
      }
    } else {
      amplifiers[currentAmp] = undefined;
      currentAmp = getNext(4, currentAmp);
    }
  }
  return data[0][0];
}

function test1() {
  const program = '3, 15, 3, 16, 1002, 16, 10, 16, 1, 16, 15, 15, 4, 15, 99, 0, 0'
    .split(',')
    .map(e => parseInt(e.trim(), 10));
  const inputSignal = getMaxInputSignal(program, runAmps, 0, 4);
  console.log(inputSignal, inputSignal === 43210);
}

function test2() {
  const program = '3, 23, 3, 24, 1002, 24, 10, 24, 1002, 23, -1, 23, 101, 5, 23, 23, 1, 24, 23, 23, 4, 23, 99, 0, 0'
    .split(',')
    .map(e => parseInt(e.trim()));
  const inputSignal = getMaxInputSignal(program, runAmps, 0, 4);
  console.log(inputSignal, inputSignal === 54321);
}

function test3() {
  const program = '3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0'
    .split(',')
    .map(e => parseInt(e.trim()));
  const inputSignal = getMaxInputSignal(program, runAmps, 0, 4);
  console.log(inputSignal, inputSignal === 65210);
}

async function part1() {
  test1();
  test2();
  test3();

  const program = await readFile('input', l => parseInt(l, 10), ',');
  const inputSignal = getMaxInputSignal(program, runAmps, 0, 4);
  console.log(inputSignal, inputSignal === 272368);
}

function test21() {
  const program = '3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5'
    .split(',')
    .map(e => parseInt(e.trim(), 10));
  const inputSignal = getMaxInputSignal(program, runAmps, 5, 9);
  console.log(inputSignal, inputSignal === 139629729);
}

function test22() {
  const program = '3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,-5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10'
    .split(',')
    .map(e => parseInt(e.trim(), 10));
  const inputSignal = getMaxInputSignal(program, runAmps, 5, 9);
  console.log(inputSignal, inputSignal === 18216);
}

async function part2() {
  test21();
  test22();

  const program = await readFile('input', l => parseInt(l, 10), ',');
  const inputSignal = getMaxInputSignal(program, runAmps, 5, 9);
  console.log(inputSignal, inputSignal === 19741286);
}

part1();
part2();
