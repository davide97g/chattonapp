export function hexToHSL(hex: string): [number, number, number] {
  let r = 0,
    g = 0,
    b = 0;
  // 3 digits
  if (hex.length == 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  }
  // 6 digits
  else if (hex.length == 7) {
    r = parseInt(hex[1] + hex[2], 16);
    g = parseInt(hex[3] + hex[4], 16);
    b = parseInt(hex[5] + hex[6], 16);
  }
  // calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  // calculate hue
  let hue = 0;
  let min = Math.min(r, g, b);
  let max = Math.max(r, g, b);
  if (r == max) {
    hue = (g - b) / (max - min);
  } else if (g == max) {
    hue = 2 + (b - r) / (max - min);
  } else {
    hue = 4 + (r - g) / (max - min);
  }
  hue = hue * 60;
  if (hue < 0) {
    hue = hue + 360;
  }
  // calculate saturation
  let saturation = 0;
  if (luminance > 0 && luminance < 1) {
    saturation = (max - min) / (1 - Math.abs(2 * luminance - 1));
  }
  const [h, s, l] = [hue, saturation, luminance].map(
    (x) => Math.round(x * 100) / 100
  );
  return [h, s, l];
}

export function hexToRGB(hex: string): [number, number, number] | null {
  const matches = hex.match(/\w\w/g);
  if (!matches) {
    console.error("Invalid hex color", hex);
    return null;
  }
  const [r, g, b] = matches.map((x) => parseInt(x, 16));
  return [r, g, b];
}
