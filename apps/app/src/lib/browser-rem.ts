export function rootFontSizeInPixels() {
  return parseFloat(getComputedStyle(document.documentElement).fontSize);
}

export function toRem(length: string | number) {
  return parseFloat(String(length)) / rootFontSizeInPixels();
}
