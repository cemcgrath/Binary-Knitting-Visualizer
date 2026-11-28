const message = document.querySelector('#message');
const width = document.querySelector('#width');
const widthValue = document.querySelector('#width-value');
const repeats = document.querySelector('#repeats');
const repeatsValue = document.querySelector('#repeats-value');
const building = document.querySelector('#building');
const buildingHelp = document.querySelector('#building-help');
const instructionsHelp = document.querySelector('#instructions-help');
const encoding = document.querySelector('#encoding');
const encodingHelp = document.querySelector('#encoding-help');
const encodingError = document.querySelector('#encoding-error');
const messageHelp = document.querySelector('#message-help');
const knitKey = document.querySelector('#knit-key');
const purlKey = document.querySelector('#purl-key');
const separatorControls = document.querySelector('#separator-controls');
const separatorColor = document.querySelector('#separator-color');
const codeHelp = document.querySelector('#code-help');
const base64Text = document.querySelector('#base64-text');
const chart = document.querySelector('#chart');
const instructions = document.querySelector('#instructions');
const bytesContainer = document.querySelector('#bytes');
const dimensions = document.querySelector('#dimensions');
const copyButton = document.querySelector('#copy');
const copyStatus = document.querySelector('#copy-status');
const chartPanel = document.querySelector('#chart-panel');
const fullscreenButton = document.querySelector('#fullscreen');
const fullscreenStatus = document.querySelector('#fullscreen-status');
let binary = '';
let copyText = '';
function render() {
  const stitchWidth = Number(width.value);
  const repeatCount = Number(repeats.value);
  const inTheRound = building.value === 'round';
  buildingHelp.textContent = inTheRound
    ? 'Work every round on the right side, reading left to right.'
    : 'Start left to right, then alternate right-side and wrong-side rows.';
  instructionsHelp.textContent = inTheRound
    ? 'For knitting in the round: every round is right-side. Read each round left to right; stitches are worked as shown on the front.'
    : 'For flat knitting: work right-side rows left to right and wrong-side rows right to left. Wrong-side stitches are reversed so the chart appears correctly on the front.';
  widthValue.value = stitchWidth;
  repeatsValue.value = repeatCount;
  const useBase64 = encoding.value === 'base64';
  const useMorse = encoding.value === 'morse';
  separatorControls.hidden = !useMorse;
  document.documentElement.style.setProperty('--separator-color', separatorColor.value);
  messageHelp.textContent = useMorse
    ? 'Morse code is case-insensitive. Letters, digits, and common punctuation are supported.'
    : 'Letters, spaces, and punctuation all become stitches. Case matters.';
  knitKey.textContent = useMorse ? '−  /  Knit' : '0  /  Knit';
  purlKey.textContent = useMorse ? '.  /  Purl' : '1  /  Purl';
  encodingHelp.textContent = useMorse
    ? 'Each dot is a purl and each dash is a knit. Colored knit stitches separate letters (1) and words (3).'
    : useBase64
    ? 'Each Base64 symbol becomes 6 stitches. The message bits stay the same, with up to 4 trailing knit stitches added per repeat to complete a symbol. Each repeat encodes the message separately.'
    : 'UTF-8 bytes become 8-bit groups of knit and purl stitches.';
  codeHelp.textContent = useMorse
    ? 'Each group is a letter or punctuation mark. / marks whitespace; colored stitches separate letters and words in the chart.'
    : useBase64
    ? 'Each group is a Base64 symbol’s 6-bit value (A–Z, a–z, 0–9, +, /). The = markers are not stitches; trailing zero bits are included.'
    : 'Each group is one 8-bit byte, read in order.';
  copyButton.textContent = useMorse ? 'Copy Morse code' : useBase64 ? 'Copy stitch bits' : 'Copy binary';
  base64Text.hidden = !useBase64;
  let messageBytes;
  let unsupported = [];
  if (useMorse) {
    ({ groups: messageBytes, unsupported } = encodeMorse(message.value));
  } else if (useBase64) {
    const { encoded, groups } = encodeBase64(message.value);
    messageBytes = groups;
    base64Text.textContent = encoded ? `Base64 for one message: ${encoded}` : '';
  } else {
    messageBytes = encodeBinary(message.value);
  }
  encodingError.hidden = !unsupported.length;
  encodingError.textContent = unsupported.length
    ? `Morse code cannot encode: ${[...new Set(unsupported)].join(' ')}. Remove or replace these characters.`
    : '';
  const bytes = unsupported.length ? [] : Array.from({ length: repeatCount }, () => messageBytes).flat();
  binary = useMorse ? morseStitches(bytes) : bytes.map(byte => byte.bits).join('');
  copyText = bytes.map(byte => useMorse ? byte.code : byte.bits).join(' ');
  copyButton.disabled = !binary;
  copyStatus.textContent = '';
  bytesContainer.replaceChildren();
  for (const byte of bytes) {
    const chip = document.createElement('span');
    chip.className = 'byte';
    const label = document.createElement('small');
    label.textContent = byte.label;
    chip.append(label, document.createTextNode(useMorse ? byte.code : byte.bits));
    bytesContainer.append(chip);
  }
  chart.replaceChildren();
  instructions.replaceChildren();
  if (!binary) {
    dimensions.textContent = '0 stitches · 0 rows';
    chart.className = 'empty';
    chart.textContent = unsupported.length ? 'Fix the unsupported characters to make your pattern.' : 'Your stitches will appear here. Start by adding a message.';
    instructions.className = 'instructions empty';
    instructions.textContent = unsupported.length ? 'Fix the unsupported characters to make your pattern.' : 'Add a message to make your pattern.';
    return;
  }
  chart.className = 'chart-inner';
  instructions.className = 'instructions';
  const rowCount = Math.ceil(binary.length / stitchWidth);
  const padding = rowCount * stitchWidth - binary.length;
  dimensions.textContent = `${stitchWidth} stitches wide · ${rowCount} ${rowCount === 1 ? 'row' : 'rows'} · ${padding} padding`;
  const rows = [];
  for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
    const row = [];
    for (let column = 0; column < stitchWidth; column++) {
      const index = rowIndex * stitchWidth + column;
      row.push({ bit: binary[index] ?? '0', padding: index >= binary.length });
    }
    rows.push(row);
  }
  for (let rowIndex = rows.length - 1; rowIndex >= 0; rowIndex--) {
    const rowElement = document.createElement('div');
    rowElement.className = 'chart-row';
    const number = document.createElement('span');
    number.className = 'row-number';
    number.textContent = rowIndex + 1;
    rowElement.append(number);
    const wrongSide = !inTheRound && rowIndex % 2 === 1;
    const visualRow = wrongSide ? [...rows[rowIndex]].reverse() : rows[rowIndex];
    for (const stitch of visualRow) {
      const cell = document.createElement('span');
      const separator = stitch.bit === 's';
      cell.className = `stitch ${stitch.bit === '1' ? 'purl' : 'knit'}${separator ? ' separator' : ''}${stitch.padding ? ' padding' : ''}`;
      cell.textContent = stitch.bit === '1' ? '–' : '∨';
      cell.title = stitch.padding ? 'Padding: knit on front' : separator ? 'Separator: knit on front' : stitch.bit === '0' ? `${useMorse ? 'Dash' : '0'}: knit on front` : `${useMorse ? 'Dot' : '1'}: purl on front`;
      cell.setAttribute('aria-label', cell.title);
      rowElement.append(cell);
    }
    const side = document.createElement('span');
    side.className = 'row-side';
    side.textContent = wrongSide ? '← WS' : '→ RS';
    rowElement.append(side);
    chart.append(rowElement);
  }
  rows.forEach((row, index) => {
    const wrongSide = !inTheRound && index % 2 === 1;
    const line = document.createElement('div');
    line.className = 'instruction';
    const heading = document.createElement('strong');
    heading.textContent = `${inTheRound ? 'Round' : 'Row'} ${index + 1} (${wrongSide ? 'WS' : 'RS'})`;
    const code = document.createElement('code');
    code.textContent = row.map(stitch => {
      const knit = (stitch.bit !== '1') !== wrongSide;
      return `${knit ? 'K' : 'P'}${stitch.bit === 's' ? '[separator]' : ''}${stitch.padding ? '*' : ''}`;
    }).join(' ');
    line.append(heading, code);
    instructions.append(line);
  });
  if (useMorse && binary.includes('s')) {
    const note = document.createElement('p');
    note.className = 'helper';
    note.textContent = '[separator] Use the separator color. These stitches appear as knit on the front.';
    instructions.append(note);
  }
  if (padding) {
    const note = document.createElement('p');
    note.className = 'helper';
    note.textContent = '* Padding stitch, not part of the message.';
    instructions.append(note);
  }
}

message.addEventListener('input', render);
width.addEventListener('input', render);
repeats.addEventListener('input', render);
building.addEventListener('change', render);
encoding.addEventListener('change', render);
separatorColor.addEventListener('input', render);
fullscreenButton.addEventListener('click', async () => {
  fullscreenStatus.hidden = true;
  try {
    if (document.fullscreenElement === chartPanel) {
      await document.exitFullscreen();
    } else {
      await chartPanel.requestFullscreen();
    }
  } catch {
    fullscreenStatus.textContent = 'Could not change fullscreen mode. Check your browser settings and try again.';
    fullscreenStatus.hidden = false;
  }
});
document.addEventListener('fullscreenchange', () => {
  const active = document.fullscreenElement === chartPanel;
  fullscreenButton.textContent = active ? 'Exit fullscreen' : 'Open fullscreen';
  fullscreenButton.setAttribute('aria-pressed', String(active));
});
const tabs = [...document.querySelectorAll('[role=tab]')];
function selectTab(tab) {
  tabs.forEach(item => {
    const active = item === tab;
    item.classList.toggle('active', active);
    item.setAttribute('aria-selected', String(active));
    item.tabIndex = active ? 0 : -1;
    document.getElementById(item.getAttribute('aria-controls')).hidden = !active;
  });
  document.querySelector('#view-title').textContent = tab.id === 'chart-tab' ? 'Your stitch chart' : 'Your row instructions';
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTab(tab));
  tab.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const next = tabs[(index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
    selectTab(next);
    next.focus();
  });
});
copyButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(copyText);
    copyStatus.textContent = encoding.value === 'morse' ? 'Morse code copied.' : encoding.value === 'base64' ? 'Stitch bits copied.' : 'Binary copied.';
  } catch {
    copyStatus.textContent = 'Could not copy. Select the code above to copy it manually.';
  }
});
selectTab(tabs[0]);
render();
