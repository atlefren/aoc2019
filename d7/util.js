const range = (min, max) => {
  let r = [];
  for (let i = min; i <= max; i++) {
    r.push(i);
  }
  return r;
};

const generatePhaseSettings = (min, max) => {
  let settings = range(min, max);
  results = [[settings.shift()]];
  while (settings.length) {
    const currSetting = settings.shift();
    let tmpResults = [];
    results.forEach(result => {
      let rIdx = 0;
      while (rIdx <= result.length) {
        const tmp = [...result];
        tmp.splice(rIdx, 0, currSetting);
        tmpResults.push(tmp);
        rIdx++;
      }
    });
    results = tmpResults;
  }
  return results;
};

const getMaxInputSignal = (program, run, min, max) => {
  const phaseSettingsArr = generatePhaseSettings(min, max);

  let signal = -Infinity;
  for (let phaseSettings of phaseSettingsArr) {
    const input = run(program, phaseSettings);
    if (input > signal) {
      signal = input;
    }
  }
  return signal;
};

module.exports = {generatePhaseSettings, getMaxInputSignal};
