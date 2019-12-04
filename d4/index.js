const decreases = digits => {
  for (let i = 1; i < digits.length; i++) {
    let a = digits[i - 1];
    let b = digits[i];
    if (a > b) {
      return true;
    }
  }
  return false;
};

const hasDouble = digits => {
  for (let i = 1; i < digits.length; i++) {
    let a = digits[i - 1];
    let b = digits[i];
    if (a === b) {
      return true;
    }
  }
  return false;
};

const isValidA = pwd => {
  const digits = pwd.toString().split('');
  return !decreases(digits) && hasDouble(digits);
};

const countValid = (first, last, isValid) => {
  let c = 0;
  for (let i = first; i <= last; i++) {
    if (isValid(i)) {
      c++;
    }
  }
  return c;
};

console.log(isValidA(111111) === true);
console.log(isValidA(111110) === false);
console.log(isValidA(223450) === false);
console.log(isValidA(123789) === false);
console.log('part1:', countValid(178416, 676461, isValidA));

const hasDouble2 = digits => {
  const groups = {};
  for (let d of digits) {
    if (!groups[d]) {
      groups[d] = [];
    }
    groups[d].push(d);
  }

  for (let g of Object.values(groups)) {
    if (g.length === 2) {
      return true;
    }
  }
  return false;
};

const isValidB = pwd => {
  const digits = pwd.toString().split('');
  return !decreases(digits) && hasDouble2(digits);
};

console.log(isValidB(112233) === true);
console.log(isValidB(123444) === false);
console.log(isValidB(111122) === true);

console.log('part2:', countValid(178416, 676461, isValidB));
