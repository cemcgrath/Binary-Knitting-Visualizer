function encodeBinary(text) {
  const groups = [];
  for (const character of text) {
    const encoded = new TextEncoder().encode(character);
    for (const byte of encoded) {
      groups.push({ label: character === ' ' ? 'space' : character === '\n' ? '↵' : character, bits: byte.toString(2).padStart(8, '0') });
    }
  }
  return groups;
}
