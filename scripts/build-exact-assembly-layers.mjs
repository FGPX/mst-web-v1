import sharp from "sharp";

const WIDTH = 1920;
const HEIGHT = 1441;

const layers = [
  {
    photo: "1.png",
    mask: "public/assembly-layers/tables-layer.png",
    output: "public/assembly-layers/tables-layer-exact.png",
    scaleX: 1.08,
    scaleY: 1.0583046875,
    translateX: 96.9921875,
    translateY: 403.55
  },
  {
    photo: "2.png",
    mask: "public/assembly-layers/sofa-layer.png",
    output: "public/assembly-layers/sofa-layer-exact.png",
    scaleX: 1.20852294921875,
    scaleY: 0.9793625,
    translateX: 35.05546875,
    translateY: 466
  }
];

function bilinearAlpha(data, width, height, x, y) {
  if (x < 0 || y < 0 || x >= width - 1 || y >= height - 1) return 0;

  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const dx = x - x0;
  const dy = y - y0;
  const alphaAt = (sampleX, sampleY) => data[(sampleY * width + sampleX) * 4 + 3];
  const top = alphaAt(x0, y0) * (1 - dx) + alphaAt(x0 + 1, y0) * dx;
  const bottom = alphaAt(x0, y0 + 1) * (1 - dx) + alphaAt(x0 + 1, y0 + 1) * dx;
  return Math.round(top * (1 - dy) + bottom * dy);
}

for (const layer of layers) {
  const photo = await sharp(layer.photo).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const mask = await sharp(layer.mask).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const output = Buffer.alloc(WIDTH * HEIGHT * 4);

  for (let y = 0; y < HEIGHT; y += 1) {
    for (let x = 0; x < WIDTH; x += 1) {
      const targetIndex = (y * WIDTH + x) * 4;
      const photoIndex = (y * WIDTH + x) * 3;
      const sourceX = (x - layer.translateX) / layer.scaleX;
      const sourceY = (y - layer.translateY) / layer.scaleY;
      let alpha = bilinearAlpha(mask.data, mask.info.width, mask.info.height, sourceX, sourceY);

      const red = photo.data[photoIndex];
      const green = photo.data[photoIndex + 1];
      const blue = photo.data[photoIndex + 2];

      // The supplied product images use pure white outside their crop. Never
      // let that canvas become part of the animated cutout.
      if (red >= 253 && green >= 253 && blue >= 253) alpha = 0;

      output[targetIndex] = red;
      output[targetIndex + 1] = green;
      output[targetIndex + 2] = blue;
      output[targetIndex + 3] = alpha;
    }
  }

  await sharp(output, { raw: { width: WIDTH, height: HEIGHT, channels: 4 } })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(layer.output);
}
