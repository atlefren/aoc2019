const add = (read, write) => {
  write(2, read(0) + read(1));
};
const mult = (read, write) => write(2, read(0) * read(1));

const read = (read, write, input) => write(0, input());
const print = (read, write, input, output) => {
  output(read(0));
};

const jumpIfTrue = read => (read(0) !== 0 ? read(1) : undefined);
const jumpIfFalse = read => {
  if (read(0) === 0) {
    return read(1);
  }
  return undefined;
};

const lessThan = (read, write) => write(2, read(0) < read(1) ? 1 : 0);
const equals = (read, write) => write(2, read(0) === read(1) ? 1 : 0);

const adjustRelativeBase = (read, write, input, output, relativeBase, setRelativeBase) => {
  const val = read(0);
  setRelativeBase(relativeBase + val);
};

const ops = {
  1: {execute: add, numParams: 3, name: 'add'},
  2: {execute: mult, numParams: 3, name: 'multiply'},
  3: {execute: read, numParams: 1, name: 'read'},
  4: {execute: print, numParams: 1, name: 'print'},
  5: {execute: jumpIfTrue, numParams: 2, name: 'jumpIfTrue'},
  6: {execute: jumpIfFalse, numParams: 2, name: 'jumpIfFalse'},
  7: {execute: lessThan, numParams: 3, name: 'lessThan'},
  8: {execute: equals, numParams: 3, name: 'equals'},
  9: {execute: adjustRelativeBase, numParams: 1, name: 'adjustRelativeBase'}
};

const getParams = (program, offset, num) => {
  const params = [];
  for (let i = offset + 1; i <= offset + num; i++) {
    params.push(program[i]);
  }
  return params;
};

const reader = (program, params, modes, relativeBase) => index => {
  const mode = modes[index];

  let value = undefined;
  if (mode === 0) {
    //position mode
    value = program[params[index]];
  } else if (mode === 1) {
    //immediate mode
    value = params[index];
  } else if (mode === 2) {
    //relative mode
    value = program[params[index] + relativeBase];
  }

  if (value === undefined && mode !== 1) {
    value = 0;
  }
  return value;
};

const writer = (program, params, modes, relativeBase) => (index, value) => {
  const mode = modes[index];
  if (mode === 0) {
    program[params[index]] = value;
  } else if (mode === 2) {
    //relative mode
    program[params[index] + relativeBase] = value;
  } else {
    throw new Error('Got write to mode ' + mode);
  }
};

const getModes = (modeStr, numParams) => {
  const modes = [];

  for (let i = 0; i < numParams; i++) {
    const mode = modeStr.pop();
    modes.push(mode ? parseInt(mode, 10) : 0);
  }
  return modes;
};

const getCode = (program, pointer) => {
  const param = program[pointer].toString();
  return parseInt(param.slice(-2), 10);
};

const getOperation = (program, pointer, relativeBase) => {
  const param = program[pointer].toString();
  const opcode = getCode(program, pointer);

  const op = ops[opcode];
  if (op) {
    const modes = getModes(param.substr(0, param.length - 2).split(''), op.numParams);
    const params = getParams(program, pointer, op.numParams);
    const read = reader(program, params, modes, relativeBase);
    const write = writer(program, params, modes, relativeBase);

    return {op, read, write};
  }
  throw new Error('Unknown opcode ', opcode);
};

const computeBlock = (program, pointer, input, output, relativeBase, setRelativeBase) => {
  const {op, read, write} = getOperation(program, pointer, relativeBase);
  const newPointer = op.execute(read, write, input, output, relativeBase, setRelativeBase);

  return newPointer !== undefined ? newPointer : pointer + op.numParams + 1;
};

const compute = (inputProgram, input, output) => {
  let program = [...inputProgram];

  let relativeBase = 0;

  const setRelativeBase = newRelativeBase => {
    relativeBase = newRelativeBase;
  };

  let pointer = 0;
  while (program[pointer] !== 99) {
    pointer = computeBlock(program, pointer, input, output, relativeBase, setRelativeBase);
  }

  return program[0];
};

module.exports = {compute, computeBlock, getCode};
