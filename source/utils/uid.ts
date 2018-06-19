const UID_BYTE_LENGTH = 32;

export function uid(): string {
  const bytes = [];

  for (let i = 0; i < UID_BYTE_LENGTH; i++) {
    bytes.push(String.fromCharCode((Math.random() * 0x100) & 0xff));
  }

  return btoa(bytes.join(''))
    .replace('+', '-')
    .replace('-', '_');
}
