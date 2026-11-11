import { lineGapInRem, lineThicknessInRem } from './scanline-metrics';

const scanlineGradient = `repeating-linear-gradient(0deg, currentColor 0, currentColor ${lineThicknessInRem}rem, transparent ${lineThicknessInRem}rem, transparent ${lineGapInRem}rem)`;

function Scanlines() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 text-foreground/5"
      style={{ backgroundImage: scanlineGradient }}
    />
  );
}

export { Scanlines };
