const d = document;
const names = [
  'Asim',
  'Betty',
  'Bradley',
  'Brett',
  'Bryan',
  'Chris',
  'Drew',
  'Dom',
  'G',
  'Gregory',
  'Jesse',
  'John',
  'Jordan',
  'Megan',
  'Mike',
  'Rich',
  'Tyler',
  'Xiaojun',
  'Ytalo'
];

// voice
window.speechSynthesis.getVoices();
const say = msgTxt => {
  const msg = new SpeechSynthesisUtterance(msgTxt);
  const voices = window.speechSynthesis.getVoices()
    .filter(v => v.lang === 'en-GB' && v.name.indexOf('Male') > -1);
  msg.voice = voices[0];
  window.speechSynthesis.speak(msg);
}

// util
const getRandom = arr => arr[Math.floor(Math.random() * arr.length)];
const getNameFromElement = e => {
  const name = e.getAttribute('data-name');
  return name === 'Asim' ? 'Ahhsim' : name;
}

// create name tags
const container = d.querySelector('.container');
const deg = 360 / names.length;
names.forEach((name, i) => {
  const tag = d.createElement('span');
  tag.classList.add('tag');
  tag.style.transform = `rotate(${deg*(i)}deg)`;
  tag.setAttribute('data-name', name);

  const text = d.createElement('span');
  text.textContent = name;
  tag.append(text);
  text.style.transform = `rotate(-${deg*(i)}deg)`;

  container.append(tag);
});

const state = {
  idx: 0, // currently highlighted name
  v: 33, // speed of spin
  ts: +new Date(), // timestamp when a name last advanced
  fr: 33, // frame rate (interval rate)
  tta: 1000 / 33, // amount of time to advance to next name
  slowdown: 0, // amount the wheel will slow each frame
  winner: false // if there is a winner
};
const resetState = () => {
  state.v = 33;
  state.ts = +new Date();
  state.fr = 33;
  state.tta = 1000 / 33;
  state.slowdown = 0;
  state.winner = false;
};

// main wheel animation
const startGame = () => {
  state.v = 33;
  state.ts = +new Date();
  state.fr = 33;
  state.tta = 1000 / state.v;
  state.slowdown = 0;

  return window.setInterval(() => {
    // slow down the wheel if necessary
    if (state.slowdown > 0 && state.v > 0) {
      state.v = Math.max(0, state.v - state.slowdown);
      state.tta = 1000 / state.v;
    }

    // select a winner if the wheel stopped
    if (state.v === 0 && !state.winner) {
      const winner = d.querySelector('.tag.highlight');
      winner.classList.add('winner');
      const name = getNameFromElement(winner);
      say(`${name} is the winner!`);
      state.winner = true;
      return;
    }

    // advance the selected name
    const cts = +new Date();
    if (cts - state.ts > state.tta) {
      state.idx = (state.idx + 1) % names.length;
      state.ts = cts;
    }

    const highlighted = d.querySelector('.tag.highlight');
    if (highlighted) {
      highlighted.classList.remove('highlight');
    }
    d.querySelectorAll('.tag')[state.idx].classList.add('highlight');
  }, state.fr);
}
let interval = startGame();

// stop button click handler
d.querySelector('.stop-btn').addEventListener('click', (evt) => {
  const btn = evt.target;
  btn.classList.toggle('disabled');

  // reset state
  if (!btn.classList.contains('disabled')) {
    const winner = d.querySelector('.tag.winner');
    if (winner) {
      winner.classList.remove('winner');
      say('Never mind.');
    }
    resetState();
    return;
  }
  state.slowdown = Math.random() * 0.1 + 0.25;
});
