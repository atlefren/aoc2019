const readFile = require('../read');

const add = (params, read, write) => write(params[2], read(params[0]) + read(params[1]));
const mult = (params, read, write) => write(params[2], read(params[0]) * read(params[1]));

const ops = {
  1: {execute: add, numParams: 3},
  2: {execute: mult, numParams: 3}
};

const getParams = (program, offset, num) => {
  const params = [];
  for (let i = offset + 1; i <= offset + num; i++) {
    params.push(program[i]);
  }
  return params;
};

const reader = program => index => program[index];
const writer = program => (index, value) => (program[index] = value);

const computeBlock = (program, index, read, write) => {
  const opcode = program[index];
  const op = ops[opcode];
  if (op) {
    const params = getParams(program, index, op.numParams);
    op.execute(params, read, write);
    return 1 + op.numParams;
  }
  throw new Error('Unknown opcode ', opcode);
};

const compute = (inputProgram, verb, noun) => {
  let program = [...inputProgram];
  if (noun) {
    program[1] = noun;
  }
  if (verb) {
    program[2] = verb;
  }
  let i = 0;
  const read = reader(program);
  const write = writer(program);
  while (i < program.length) {
    if (program[i] === 99) {
      break;
    } else {
      i += computeBlock(program, i, read, write);
    }
  }

  return program[0];
};

const p2 = program => {
  for (let noun = 0; noun < 100; noun++) {
    for (let verb = 0; verb < 100; verb++) {
      const res = compute(program, verb, noun);
      if (res === 19690720) {
        return 100 * noun + verb;
      }
    }
  }
  return 'meh';
};

async function run() {
  console.log('tests');
  console.log(compute([1, 9, 10, 3, 2, 3, 11, 0, 99, 30, 40, 50]) === 3500);
  console.log(compute([1, 0, 0, 0, 99]) === 2);
  console.log(compute([2, 3, 0, 3, 99]) === 2);
  console.log(compute([2, 4, 4, 5, 99, 0]) === 2);
  console.log(compute([1, 1, 1, 4, 99, 5, 6, 0, 99]) === 30);

  const input = await readFile('input', l => parseInt(l, 10), ',');
  console.log('task1');
  console.log(compute(input, 2, 12) === 5534943);

  console.log('task1');
  console.log(p2(input) === 7603);
}

run();
