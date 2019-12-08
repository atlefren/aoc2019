const readFile = require('../read');

const createLayers = (width, height) => {
  const numPixels = width * height;

  return pixels => {
    const layers = [[]];
    let c = 0;
    let layer = 0;
    for (let pixel of pixels) {
      if (c === numPixels) {
        layer++;
        layers[layer] = [];
        c = 0;
      }

      layers[layer].push(pixel);
      c++;
    }
    return layers;
  };
};

const countDigits = (layer, digit) => {
  let c = 0;
  for (let pixel of layer) {
    c += pixel === digit ? 1 : 0;
  }
  return c;
};

const getLeast = layers => {
  let c = Infinity;
  let l = undefined;
  for (let layer of layers) {
    const num = countDigits(layer, '0');
    if (num < c) {
      c = num;
      l = layer;
    }
  }
  return l;
};

const layers = createLayers(2, 3)('023456789112'.split(''));
const layer = getLeast(layers);
const c = countDigits(layer, '1') * countDigits(layer, '2');

//console.log(layer, c);

async function task1() {
  const pixels = await readFile('input', l => l, '');
  const layers = createLayers(25, 6)(pixels);

  const layer = getLeast(layers);

  const c = countDigits(layer, '1') * countDigits(layer, '2');
  console.log('part1=', c);
}

const getPixel = (layers, i) => layers.map(l => l[i]);

const getColor = pixel => {
  for (let i = 0; i < pixel.length; i++) {
    if (pixel[i] !== '2') {
      return pixel[i];
    }
  }
};

const blend = layers => {
  let pixels = [];
  for (let i = 0; i < layers[0].length; i++) {
    pixels.push(getColor(getPixel(layers, i)));
  }
  return pixels;
};

const partition = (arr, num) => {
  let parts = [[]];

  let row = 0;
  for (let e of arr) {
    if (parts[row].length === num) {
      row++;
      parts[row] = [];
    }
    parts[row].push(e);
  }

  return parts;
};

const print = (w, h, pixels) => {
  console.log(
    partition(pixels, w)
      .map(l => l.join(''))
      .join('\n')
  );
};

async function task2() {
  /*const w = 2;
  const h = 2;
  const layers = createLayers(w, h)('0222112222120000'.split(''));
  print(w, h, blend(layers));
*/

  const pixels = await readFile('input', l => l, '');
  const layers = createLayers(25, 6)(pixels);
  print(
    25,
    6,
    blend(layers).map(p => (p === '0' ? ' ' : 'x'))
  );
}

//task1();
task2();
