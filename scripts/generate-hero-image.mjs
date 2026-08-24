import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { deflateSync } from "node:zlib";

const width = 1800;
const height = 1120;
const image = new Uint8ClampedArray(width * height * 4);

function clamp(value) {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function mix(a, b, t) {
  return a + (b - a) * t;
}

function noise(x, y) {
  const value = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function setPixel(x, y, color, alpha = 1) {
  if (x < 0 || y < 0 || x >= width || y >= height) {
    return;
  }

  const index = (y * width + x) * 4;
  const existingAlpha = image[index + 3] / 255;
  const nextAlpha = alpha + existingAlpha * (1 - alpha);

  image[index] = clamp((color[0] * alpha + image[index] * existingAlpha * (1 - alpha)) / nextAlpha);
  image[index + 1] = clamp((color[1] * alpha + image[index + 1] * existingAlpha * (1 - alpha)) / nextAlpha);
  image[index + 2] = clamp((color[2] * alpha + image[index + 2] * existingAlpha * (1 - alpha)) / nextAlpha);
  image[index + 3] = clamp(nextAlpha * 255);
}

function fillRect(x, y, w, h, color, alpha = 1) {
  const left = Math.max(0, Math.floor(x));
  const top = Math.max(0, Math.floor(y));
  const right = Math.min(width, Math.ceil(x + w));
  const bottom = Math.min(height, Math.ceil(y + h));

  for (let yy = top; yy < bottom; yy += 1) {
    for (let xx = left; xx < right; xx += 1) {
      setPixel(xx, yy, color, alpha);
    }
  }
}

function fillGradientRect(x, y, w, h, topColor, bottomColor) {
  const left = Math.max(0, Math.floor(x));
  const top = Math.max(0, Math.floor(y));
  const right = Math.min(width, Math.ceil(x + w));
  const bottom = Math.min(height, Math.ceil(y + h));

  for (let yy = top; yy < bottom; yy += 1) {
    const t = (yy - y) / h;
    const color = [
      mix(topColor[0], bottomColor[0], t),
      mix(topColor[1], bottomColor[1], t),
      mix(topColor[2], bottomColor[2], t),
    ];

    for (let xx = left; xx < right; xx += 1) {
      setPixel(xx, yy, color, 1);
    }
  }
}

function fillEllipse(cx, cy, rx, ry, color, alpha = 1) {
  const left = Math.max(0, Math.floor(cx - rx));
  const top = Math.max(0, Math.floor(cy - ry));
  const right = Math.min(width, Math.ceil(cx + rx));
  const bottom = Math.min(height, Math.ceil(cy + ry));

  for (let yy = top; yy < bottom; yy += 1) {
    for (let xx = left; xx < right; xx += 1) {
      const dx = (xx - cx) / rx;
      const dy = (yy - cy) / ry;
      const d = dx * dx + dy * dy;

      if (d <= 1) {
        const edge = d > 0.84 ? (1 - d) / 0.16 : 1;
        setPixel(xx, yy, color, alpha * Math.max(0, Math.min(1, edge)));
      }
    }
  }
}

function strokeEllipse(cx, cy, rx, ry, thickness, color, alpha = 1) {
  const left = Math.max(0, Math.floor(cx - rx - thickness));
  const top = Math.max(0, Math.floor(cy - ry - thickness));
  const right = Math.min(width, Math.ceil(cx + rx + thickness));
  const bottom = Math.min(height, Math.ceil(cy + ry + thickness));

  for (let yy = top; yy < bottom; yy += 1) {
    for (let xx = left; xx < right; xx += 1) {
      const dx = (xx - cx) / rx;
      const dy = (yy - cy) / ry;
      const d = Math.sqrt(dx * dx + dy * dy);
      const ring = Math.abs(d - 1);

      if (ring <= thickness / Math.max(rx, ry)) {
        setPixel(xx, yy, color, alpha * (1 - ring / (thickness / Math.max(rx, ry))));
      }
    }
  }
}

function roundedRect(x, y, w, h, radius, color, alpha = 1) {
  const left = Math.max(0, Math.floor(x));
  const top = Math.max(0, Math.floor(y));
  const right = Math.min(width, Math.ceil(x + w));
  const bottom = Math.min(height, Math.ceil(y + h));

  for (let yy = top; yy < bottom; yy += 1) {
    for (let xx = left; xx < right; xx += 1) {
      const nearestX = Math.max(x + radius, Math.min(xx, x + w - radius));
      const nearestY = Math.max(y + radius, Math.min(yy, y + h - radius));
      const dx = xx - nearestX;
      const dy = yy - nearestY;

      if (dx * dx + dy * dy <= radius * radius) {
        setPixel(xx, yy, color, alpha);
      }
    }
  }
}

function drawLine(x1, y1, x2, y2, thickness, color, alpha = 1) {
  const left = Math.floor(Math.min(x1, x2) - thickness);
  const right = Math.ceil(Math.max(x1, x2) + thickness);
  const top = Math.floor(Math.min(y1, y2) - thickness);
  const bottom = Math.ceil(Math.max(y1, y2) + thickness);
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lengthSq = dx * dx + dy * dy;

  for (let yy = top; yy <= bottom; yy += 1) {
    for (let xx = left; xx <= right; xx += 1) {
      const t = Math.max(0, Math.min(1, ((xx - x1) * dx + (yy - y1) * dy) / lengthSq));
      const px = x1 + t * dx;
      const py = y1 + t * dy;
      const distance = Math.hypot(xx - px, yy - py);

      if (distance <= thickness) {
        setPixel(xx, yy, color, alpha * (1 - distance / thickness));
      }
    }
  }
}

fillGradientRect(0, 0, width, height, [21, 20, 19], [43, 34, 29]);

for (let y = 0; y < height; y += 1) {
  for (let x = 0; x < width; x += 1) {
    const index = (y * width + x) * 4;
    const vignette = Math.hypot((x - width * 0.58) / width, (y - height * 0.48) / height);
    const grain = (noise(x, y) - 0.5) * 16;
    const shade = Math.max(0.42, 1 - vignette * 1.18);

    image[index] = clamp(image[index] * shade + grain);
    image[index + 1] = clamp(image[index + 1] * shade + grain);
    image[index + 2] = clamp(image[index + 2] * shade + grain);
    image[index + 3] = 255;
  }
}

fillGradientRect(0, 720, width, 400, [50, 41, 34], [25, 20, 17]);
for (let x = -120; x < width + 120; x += 160) {
  drawLine(x, height, 760, 720, 1.6, [126, 96, 59], 0.25);
}
for (let y = 760; y < height; y += 92) {
  drawLine(0, y, width, y + 22, 1.2, [126, 96, 59], 0.2);
}

fillRect(0, 0, width, 132, [6, 6, 6], 0.24);
fillRect(0, 690, width, 42, [16, 13, 11], 0.42);
fillRect(0, 720, width, 8, [159, 116, 68], 0.28);

for (const [cx, cy, rx, ry] of [
  [1135, 420, 176, 270],
  [1450, 430, 146, 236],
]) {
  fillEllipse(cx, cy, rx + 18, ry + 18, [201, 155, 90], 0.2);
  strokeEllipse(cx, cy, rx, ry, 16, [199, 151, 83], 0.82);
  fillEllipse(cx, cy, rx - 18, ry - 18, [62, 60, 56], 0.78);
  fillEllipse(cx - rx * 0.32, cy - ry * 0.26, rx * 0.22, ry * 0.48, [225, 218, 196], 0.13);
  drawLine(cx - rx * 0.55, cy + ry * 0.16, cx + rx * 0.42, cy - ry * 0.32, 3, [255, 245, 214], 0.18);
}

for (const x of [1086, 1422]) {
  fillRect(x - 36, 174, 72, 18, [224, 187, 123], 0.86);
  fillGradientRect(x - 29, 192, 58, 168, [250, 213, 145], [114, 76, 42]);
  fillEllipse(x, 370, 80, 24, [224, 171, 94], 0.13);
}

roundedRect(1210, 585, 295, 94, 18, [24, 22, 20], 0.98);
roundedRect(1242, 480, 232, 160, 28, [31, 29, 27], 0.98);
roundedRect(1276, 514, 164, 86, 24, [65, 56, 48], 0.34);
roundedRect(1186, 647, 348, 86, 28, [31, 29, 27], 1);
fillEllipse(1362, 746, 186, 38, [9, 8, 8], 0.42);
drawLine(1274, 730, 1228, 888, 9, [26, 24, 23], 0.92);
drawLine(1452, 730, 1512, 888, 9, [26, 24, 23], 0.92);
drawLine(1360, 721, 1360, 894, 12, [23, 21, 20], 0.95);
drawLine(1260, 898, 1460, 898, 8, [24, 22, 20], 0.9);

roundedRect(154, 610, 390, 76, 10, [43, 32, 24], 0.9);
roundedRect(184, 550, 188, 64, 10, [57, 45, 35], 0.92);
fillRect(174, 686, 24, 184, [29, 23, 19], 0.9);
fillRect(506, 686, 24, 184, [29, 23, 19], 0.9);
drawLine(206, 536, 330, 500, 3, [185, 142, 82], 0.86);
drawLine(212, 536, 342, 566, 3, [185, 142, 82], 0.86);
fillEllipse(202, 534, 18, 18, [214, 175, 108], 0.9);

fillEllipse(865, 870, 520, 88, [3, 3, 3], 0.2);
for (const [x, h, color] of [
  [760, 144, [64, 84, 64]],
  [828, 190, [85, 111, 78]],
  [900, 162, [63, 91, 67]],
]) {
  drawLine(x, 690, x - 40, 690 - h, 7, color, 0.72);
  drawLine(x, 690, x + 52, 690 - h * 0.85, 7, color, 0.7);
  fillEllipse(x - 50, 690 - h, 52, 18, color, 0.55);
  fillEllipse(x + 62, 690 - h * 0.85, 52, 18, color, 0.48);
}
roundedRect(788, 684, 110, 86, 14, [73, 50, 38], 0.95);

fillEllipse(520, 330, 320, 300, [189, 148, 88], 0.08);
fillEllipse(1380, 390, 420, 360, [189, 148, 88], 0.12);
fillEllipse(1520, 760, 220, 120, [118, 55, 68], 0.16);

function crc32(buffer) {
  let crc = 0xffffffff;

  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }

  return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const typeBuffer = Buffer.from(type);
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);

  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 0);

  return Buffer.concat([length, typeBuffer, data, crc]);
}

const raw = Buffer.alloc((width * 4 + 1) * height);
for (let y = 0; y < height; y += 1) {
  const rowStart = y * (width * 4 + 1);
  raw[rowStart] = 0;
  Buffer.from(image.buffer, y * width * 4, width * 4).copy(raw, rowStart + 1);
}

const header = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(width, 0);
ihdr.writeUInt32BE(height, 4);
ihdr[8] = 8;
ihdr[9] = 6;
ihdr[10] = 0;
ihdr[11] = 0;
ihdr[12] = 0;

const png = Buffer.concat([
  header,
  pngChunk("IHDR", ihdr),
  pngChunk("IDAT", deflateSync(raw, { level: 9 })),
  pngChunk("IEND", Buffer.alloc(0)),
]);

const output = join(process.cwd(), "public", "studio-noir-hero.png");
mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, png);
console.log(`Generated ${output}`);
