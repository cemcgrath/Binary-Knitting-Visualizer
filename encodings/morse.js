const morseAlphabet = {
  A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.',
  H: '....', I: '..', J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.',
  O: '---', P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-',
  V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..',
  0: '-----', 1: '.----', 2: '..---', 3: '...--', 4: '....-', 5: '.....',
  6: '-....', 7: '--...', 8: '---..', 9: '----.',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--',
  '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...',
  ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', _: '..--.-',
  '"': '.-..-.', '$': '...-..-', '@': '.--.-.'
};

function encodeMorse(text) {
  const groups = [];
  const unsupported = [];
  for (const character of text) {
    if (/\s/u.test(character)) {
      groups.push({ label: character === '\n' ? '↵' : 'space', bits: '', code: '/' });
    } else {
      const code = /^[a-z0-9.,?'!/()&:;=+_"$@-]$/i.test(character)
        ? morseAlphabet[character.toUpperCase()]
        : undefined;
      if (code) {
        groups.push({ label: character, bits: code.replaceAll('.', '1').replaceAll('-', '0'), code });
      } else {
        unsupported.push(character);
      }
    }
  }
  return { groups, unsupported };
}

function morseStitches(groups) {
  let wordBoundary = false;
  let stitches = '';
  for (const group of groups) {
    if (!group.bits) {
      wordBoundary = true;
    } else {
      if (stitches) stitches += wordBoundary ? 'sss' : 's';
      stitches += group.bits;
      wordBoundary = false;
    }
  }
  return stitches;
}
