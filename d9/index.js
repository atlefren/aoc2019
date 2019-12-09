const {compute} = require('../intcode');
const readFile = require('../read');

const test1 = () => {
  const prog = [109, 1, 204, -1, 1001, 100, 1, 100, 1008, 100, 16, 101, 1006, 101, 0, 99];

  const res = [];

  compute(
    prog,
    () => null,
    o => res.push(o)
  );
  console.log(res);
  console.log(prog);
};

const test2 = () => {
  const prog = [1102, 34915192, 34915192, 7, 4, 7, 99, 0];

  compute(
    prog,
    () => null,
    o => console.log('out', o, o.toString().length === 16)
  );
};

const test3 = () => {
  const prog = [104, 1125899906842624, 99];

  compute(
    prog,
    () => null,
    o => console.log('out', o, o === prog[1])
  );
};

async function task1() {
  /*test1();
  test2();
  test3();*/

  const program = await readFile('input', l => parseInt(l, 10), ',');
  const res = [];
  compute(
    program,
    () => 1,
    o => res.push(o)
  );
  console.log(res);
}

async function task2() {
  const program = await readFile('input', l => parseInt(l, 10), ',');
  const res = [];
  compute(
    program,
    () => 2,
    o => res.push(o)
  );
  console.log(res);
}

//task1();
task2();
