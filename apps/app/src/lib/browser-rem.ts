export function rootFontSizeInPixels() {
  return parseFloat(getComputedStyle(document.documentElement).fontSize);
}

export function toRem(length: string | number) {
  return parseFloat(String(length)) / rootFontSizeInPixels();
}

export function isDesktopViewport() {
  return window.innerWidth / rootFontSizeInPixels() >= 64;
}
