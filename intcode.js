const add = (read, write) => write(2, read(0) + read(1));
const mult = (read, write) => write(2, read(0) * read(1));

const read = (read, write, input) => write(0, input());
const print = (read, write, input, output) => output(read(0));

const jumpIfTrue = read => (read(0) !== 0 ? read(1) : undefined);
const jumpIfFalse = read => (read(0) === 0 ? read(1) : undefined);

const lessThan = (read, write) => write(2, read(0) < read(1) ? 1 : 0);
const equals = (read, write) => write(2, read(0) === read(1) ? 1 : 0);

const ops = {
  1: {execute: add, numParams: 3, name: 'add'},
  2: {execute: mult, numParams: 3, name: 'multiply'},
  3: {execute: read, numParams: 1, name: 'read'},
  4: {execute: print, numParams: 1, name: 'print'},
  5: {execute: jumpIfTrue, numParams: 2, name: 'jumpIfTrue'},
  6: {execute: jumpIfFalse, numParams: 2, name: 'jumpIfFalse'},
  7: {execute: lessThan, numParams: 3, name: 'lessThan'},
  8: {execute: equals, numParams: 3, name: 'equals'}
};

const getParams = (program, offset, num) => {
  const params = [];
  for (let i = offset + 1; i <= offset + num; i++) {
    params.push(program[i]);
  }
  return params;
};

const reader = (program, params, modes) => index => (modes[index] === 0 ? program[params[index]] : params[index]);
const writer = (program, params, modes) => (index, value) => {
  if (modes[index] === 0) {
    program[params[index]] = value;
  } else {
    throw new Error('Got write to mode ', modes[index]);
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

const getOperation = (program, pointer) => {
  const param = program[pointer].toString();
  const opcode = getCode(program, pointer);

  const op = ops[opcode];
  if (op) {
    const modes = getModes(param.substr(0, param.length - 2).split(''), op.numParams);
    const params = getParams(program, pointer, op.numParams);
    const read = reader(program, params, modes);
    const write = writer(program, params, modes);

    return {op, read, write};
  }
  throw new Error('Unknown opcode ', opcode);
};

const computeBlock = (program, pointer, input, output) => {
  const {op, read, write} = getOperation(program, pointer);
  const newPointer = op.execute(read, write, input, output);
  return newPointer ? newPointer : pointer + op.numParams + 1;
};

const compute = (inputProgram, input, output) => {
  let program = [...inputProgram];
  let pointer = 0;
  while (program[pointer] !== 99) {
    pointer = computeBlock(program, pointer, input, output);
  }

  return program[0];
};

module.exports = {compute, computeBlock, getCode};
