const UID_BYTE_LENGTH = 32;

export function uid(): string {
  const bytes = [];

  for (let i = 0; i < UID_BYTE_LENGTH; i++) {
    bytes.push(String.fromCharCode((Math.random() * 0x100) & 0xff)); // tslint:disable-line:no-bitwise
  }

  return btoa(bytes.join(""))
    .replace("+", "-")
    .replace("/", "_")
    .replace("=", "");
}
