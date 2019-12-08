const readFile = require('../read');
const {compute} = require('../intcode');

async function runA() {
  const input = () => 1;
  const output = val => console.log('OutputA', val);

  const program = await readFile('input', l => parseInt(l, 10), ',');
  compute(program, undefined, undefined, input, output);
}

runA();

async function runB() {
  const input = () => 5;
  const output = val => console.log('OutputB', val);
  const program = await readFile('input', l => parseInt(l, 10), ',');
  compute(program, undefined, undefined, input, output);
}

runB();
