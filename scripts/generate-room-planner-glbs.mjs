import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import catalog from "../lib/generated/musterring-catalog.json" with { type: "json" };
import productColors from "../lib/generated/room-planner-colors.json" with { type: "json" };

class NodeFileReader {
  result = null;
  onloadend = null;
  onerror = null;
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((buffer) => {
      this.result = buffer;
      this.onloadend?.();
    }).catch((error) => this.onerror?.(error));
  }
  readAsDataURL(blob) {
    blob.arrayBuffer().then((buffer) => {
      this.result = `data:${blob.type};base64,${Buffer.from(buffer).toString("base64")}`;
      this.onloadend?.();
    }).catch((error) => this.onerror?.(error));
  }
}

globalThis.FileReader ??= NodeFileReader;

const verifiedDimensions = {
  "mr-260": [2.32, .96, 1.07],
  "mr-270": [2.5, 1.07, .87],
  "justb-pm100": [2.68, 2.32, .88],
  "mr-kleo": [.97, .88, .95],
  "mr-nils": [.7, .87, 1.12],
  "mr-pamela": [.93, 1.19, .61],
  "mr-281": [.78, .88, 1.1],
  "mr-9445": [.67, .87, .8],
  jana: [2.56, .53, .77],
  kanto: [2.1, .49, .94],
  "justb-ct100": [.6, .6, .36],
  nara: [.89, .78, .44]
};

const illustrativeDimensions = {
  sofa: [2.2, .92, .84],
  sectional: [2.8, 1.65, .82],
  armchair: [.88, .9, .92],
  storage: [1.8, .46, .82],
  wardrobe: [1.8, .62, 2.15],
  "bedroom-series": [1.8, 2.1, 1.05],
  bed: [1.8, 2.1, 1.05],
  "dining-table": [1.9, .95, .76],
  "coffee-table": [1.05, .7, .42],
  "small-furniture": [.72, .54, .5],
  "dining-chair": [.52, .58, .88],
  bathroom: [1.25, .52, .86],
  kitchen: [1.8, .62, .92],
  outdoor: [1.8, .86, .78],
  carpet: [2.4, 1.7, .018],
  lamp: [.48, .48, 1.65],
  "home-textile": [1.8, 1.3, .025]
};

const palette = {
  fabric: 0x8b7769,
  fabricLight: 0xa08c7c,
  fabricDark: 0x725f55,
  timber: 0x9b7650,
  timberDark: 0x7b5a3c,
  metal: 0x342f2b,
  mattress: 0xeee8df,
  cabinet: 0xa48668,
  cabinetLight: 0xb69878
};

const material = (color, roughness = .75, metalness = 0) => new THREE.MeshStandardMaterial({ color, roughness, metalness });
const tone = (color, lightness) => new THREE.Color(color).offsetHSL(0, 0, lightness).getHex();
const addBox = (group, name, dimensions, position, color, roughness = .75, metalness = 0) => {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...dimensions), material(color, roughness, metalness));
  mesh.name = name;
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
};
const addRoundedBox = (group, name, dimensions, position, color, radius = .06, roughness = .86) => {
  const [width, height, depth] = dimensions;
  const safeRadius = Math.min(radius, width * .22, height * .22, depth * .22);
  const mesh = new THREE.Mesh(new RoundedBoxGeometry(width, height, depth, 4, safeRadius), material(color, roughness, 0));
  mesh.name = name;
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
};
const addCylinder = (group, name, radius, height, position, color, metalness = .6) => {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, 16), material(color, .32, metalness));
  mesh.name = name;
  mesh.position.set(...position);
  mesh.castShadow = true;
  group.add(mesh);
  return mesh;
};

function seating(group, width, depth, height, sectional = false, chair = false, productColor = palette.fabric) {
  const seatHeight = height * .43;
  const baseColor = chair ? tone(productColor, .04) : productColor;
  const lightColor = tone(baseColor, .08);
  const darkColor = tone(baseColor, -.08);
  addRoundedBox(group, "seat-base", [width * .94, seatHeight, depth * .9], [0, seatHeight * .58, 0], baseColor, .07);
  const seatCount = chair ? 1 : width > 2.5 ? 3 : 2;
  const cushionWidth = width * .8 / seatCount;
  for (let index = 0; index < seatCount; index += 1) {
    const x = -width * .4 + cushionWidth * (index + .5);
    addRoundedBox(group, `seat-cushion-${index + 1}`, [cushionWidth - .025, seatHeight * .24, depth * .68], [x, seatHeight * 1.03, depth * .04], lightColor, .055, .92);
    const back = addRoundedBox(group, `back-cushion-${index + 1}`, [cushionWidth - .018, height * .5, depth * .2], [x, height * .72, -depth * .31], darkColor, .07, .92);
    back.rotation.x = .1;
  }
  addRoundedBox(group, "arm-left", [width * .09, height * .5, depth], [-width * .47, height * .48, 0], darkColor, .045, .9);
  addRoundedBox(group, "arm-right", [width * .09, height * .5, depth], [width * .47, height * .48, 0], darkColor, .045, .9);
  if (sectional) {
    addRoundedBox(group, "chaise-base", [width * .32, seatHeight, depth * 1.5], [width * .32, seatHeight * .58, depth * .32], baseColor, .07);
    addRoundedBox(group, "chaise-cushion", [width * .27, seatHeight * .24, depth], [width * .32, seatHeight * 1.03, depth * .5], lightColor, .06, .92);
  }
  addCylinder(group, "foot-left", .024, .09, [-width * .41, .045, depth * .27], palette.metal);
  addCylinder(group, "foot-right", .024, .09, [width * .41, .045, depth * .27], palette.metal);
}

function table(group, width, depth, height, coffee = false) {
  addBox(group, "table-top", [width, Math.min(.09, height * .2), depth], [0, height, 0], coffee ? palette.timberDark : palette.timber, .62, .02);
  for (const [index, [x, z]] of [[-.42, -.38], [.42, -.38], [-.42, .38], [.42, .38]].entries()) {
    addBox(group, `leg-${index + 1}`, [coffee ? .045 : .065, height, coffee ? .045 : .065], [x * width, height / 2, z * depth], palette.metal, .3, .7);
  }
}

function diningChair(group, width, depth, height) {
  addRoundedBox(group, "seat", [width, .1, depth * .82], [0, height * .48, 0], palette.fabricLight, .035, .9);
  const back = addRoundedBox(group, "back", [width * .9, height * .5, .1], [0, height * .74, -depth * .36], palette.fabric, .035, .92);
  back.rotation.x = .06;
  for (const [index, [x, z]] of [[-.4, -.32], [.4, -.32], [-.4, .32], [.4, .32]].entries()) addCylinder(group, `leg-${index + 1}`, .022, height * .48, [x * width, height * .24, z * depth], palette.metal);
}

function storage(group, width, depth, height, tall = false) {
  addBox(group, "cabinet", [width, height, depth], [0, height / 2 + .06, 0], tall ? 0xb6a28b : palette.cabinet, .7);
  const panels = tall ? 3 : Math.max(2, Math.min(4, Math.round(width / .65)));
  const panelWidth = width / panels;
  for (let index = 0; index < panels; index += 1) {
    addBox(group, `door-${index + 1}`, [panelWidth - .018, height * .92, .018], [-width / 2 + panelWidth * (index + .5), height / 2 + .06, -depth / 2 - .006], index % 2 ? palette.cabinetLight : palette.cabinet, .72);
    const handle = new THREE.Mesh(new THREE.SphereGeometry(.018, 10, 10), material(palette.metal, .3, .7));
    handle.position.set(-width / 2 + panelWidth * (index + .82), height / 2 + .06, -depth / 2 - .02);
    handle.name = `handle-${index + 1}`;
    group.add(handle);
  }
}

function bed(group, width, depth, height) {
  addRoundedBox(group, "bed-frame", [width, .34, depth], [0, .18, 0], 0x7d6e65, .065, .92);
  addRoundedBox(group, "mattress", [width * .92, .24, depth * .88], [0, .43, -.02], palette.mattress, .07, .97);
  addRoundedBox(group, "headboard", [width, height, .16], [0, height * .52, -depth * .47], 0x897970, .06, .92);
  addRoundedBox(group, "pillow-left", [width * .4, .13, depth * .27], [-width * .24, .62, -depth * .24], 0xf6f1ea, .05, 1);
  addRoundedBox(group, "pillow-right", [width * .4, .13, depth * .27], [width * .24, .62, -depth * .24], 0xf6f1ea, .05, 1);
}

function lamp(group, width, height) {
  const base = new THREE.Mesh(new THREE.CylinderGeometry(width * .42, width * .48, .08, 32), material(palette.metal, .3, .7));
  base.position.y = .04;
  base.name = "lamp-base";
  group.add(base);
  addCylinder(group, "lamp-stem", .026, height, [0, height * .5, 0], palette.metal);
  const shade = new THREE.Mesh(new THREE.ConeGeometry(width * .5, height * .35, 32, 1, true), material(0xd9c7ad, .86));
  shade.position.y = height * .88;
  shade.name = "lamp-shade";
  group.add(shade);
}

function buildModel(product) {
  const dimensions = verifiedDimensions[product.slug] ?? illustrativeDimensions[product.category] ?? [1.2, .8, .8];
  const [width, depth, height] = dimensions;
  const group = new THREE.Group();
  group.name = product.modelCode.replaceAll(" ", "_");
  group.userData = { productId: product.appProductId, slug: product.slug, modelCode: product.modelCode, dimensionalAccuracy: verifiedDimensions[product.slug] ? "verified-local-variant" : "illustrative" };
  const productColor = new THREE.Color(productColors[product.slug]?.hex ?? "#8b7769").getHex();
  if (["sofa", "sectional", "armchair", "outdoor"].includes(product.category)) seating(group, width, depth, height, product.category === "sectional", product.category === "armchair", productColor);
  else if (["dining-table", "coffee-table", "small-furniture"].includes(product.category)) table(group, width, depth, height, product.category !== "dining-table");
  else if (product.category === "dining-chair") diningChair(group, width, depth, height);
  else if (["bed", "bedroom-series"].includes(product.category)) bed(group, width, depth, height);
  else if (["storage", "wardrobe", "kitchen", "bathroom"].includes(product.category)) storage(group, width, depth, height, product.category === "wardrobe");
  else if (product.category === "lamp") lamp(group, width, height);
  else addBox(group, "product-volume", [width, height, depth], [0, height / 2, 0], product.category === "carpet" ? 0xb8aa95 : palette.cabinet, .9);
  return group;
}

const outputDirectory = path.resolve("public/room-planner-models");
await mkdir(outputDirectory, { recursive: true });
const exporter = new GLTFExporter();

for (const product of catalog.products) {
  const scene = new THREE.Scene();
  scene.add(buildModel(product));
  const binary = await exporter.parseAsync(scene, { binary: true, trs: true, onlyVisible: true });
  await writeFile(path.join(outputDirectory, `${product.slug}.glb`), Buffer.from(binary));
}

console.log(`Generated ${catalog.products.length} approximate room-planner GLB models in ${outputDirectory}`);
