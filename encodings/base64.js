function encodeBase64(text) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const encoded = btoa(Array.from(new TextEncoder().encode(text), byte => String.fromCharCode(byte)).join(''));
  const groups = [];
  for (const symbol of encoded.replace(/=+$/, '')) {
    groups.push({ label: symbol, bits: alphabet.indexOf(symbol).toString(2).padStart(6, '0') });
  }
  return { encoded, groups };
}
