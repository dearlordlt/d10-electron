const tries = 10000;

const model = {
  dices: 5,
  hunger: 1,
  difficulty: 2,
  rolls: 0,
  tries: tries,
  output: `ROLL`,
  log: `~\n`
};

const roll = () => {
  return Math.floor(Math.random() * 10 + 1);
};

const rollPool = (dices, hunger) => {
  const black = [];
  const red = [];

  for (let i = 0; i < dices; i++) {
    black.push(roll());
  }

  for (let i = 0; i < hunger; i++) {
    red.push(roll());
  }

  return [black, red];
};

const isBestial = (diff, pool) => {
  if (
    pool.flat().filter(item => item > 5).length < diff &&
    pool[1].filter(item => item === 1).length >= 1
  ) {
    return 1;
  }
  return 0;
};

const calcSuccess = (diff, pool) => {
  const result = pool.flat().filter(item => item > 5).length;
  const decimals = pool.flat().filter(item => item === 10).length;
  return result + Math.floor(decimals / 2) >= diff
    ? result + Math.floor(decimals / 2) - diff
    : 0;
};

const isMessy = (diff, pool) => {
  const result = pool.flat().filter(item => item > 5).length;
  const decimals = pool.flat().filter(item => item === 10).length;
  if (
    result + Math.floor(decimals / 2) >= diff &&
    Math.floor(decimals / 2) &&
    pool[1].flat().filter(item => item === 10).length
  ) {
    return 1;
  }
  return 0;
};

const getTotall = (pool) => {
  const result = pool.flat().filter(item => item > 5).length;
  const decimals = pool.flat().filter(item => item === 10).length;
  return result + Math.floor(decimals / 2);
};

const app = new Vue({
  el: "#app",
  data: model,
  methods: {
    calc: function() {
      let success = 0;
      let bestial = 0;
      let messy = 0;
      let avgSuccess = 0;
      let avgTotall = 0;
      for (let i = 0; i < tries; i++) {
        const pool = rollPool(this.dices, this.hunger);
        const isSuccess = calcSuccess(this.difficulty, pool);
        if (isSuccess) {
          success++;
          avgSuccess += isSuccess;
        }
        if (isBestial(this.difficulty, pool)) {
          bestial++;
        }
        if (isMessy(this.difficulty, pool)) {
          messy++;
        }
        avgTotall += getTotall(pool);
      }
      this.output = `
\nSUCCESS: ${((success / tries) * 100).toFixed(2)}% AVG SUCCESS: ${(avgSuccess / tries).toFixed(2)} AVG TOTAL: ${(avgTotall / tries).toFixed(2)}
\nMESSY  : ${((messy / tries) * 100).toFixed(2)}%
\nFAILURE: ${(((tries - success) / tries) * 100).toFixed(2)}%
\nBESTIAL: ${((bestial / tries) * 100).toFixed(2)}%
\n
      `;

      this.rolls++;
      this.log += `[${this.rolls}] ${this.output}`;
    }
  }
});
