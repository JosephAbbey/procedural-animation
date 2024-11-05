import Worm from "./src/Worm.ts";
import snake from "./animals/snake.animal.yaml";

const root = document.querySelector("#root");

if (!root || !(root instanceof SVGSVGElement)) throw "";

const isTouchScreen = window.matchMedia("(pointer: coarse)").matches;
let mouseX = 0;
let mouseY = 0;
let targetX = root.clientWidth / 2;
let targetY = root.clientHeight / 2;
document.addEventListener("mousemove", (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;
  if (event.shiftKey || isTouchScreen) {
    targetX = mouseX;
    targetY = mouseY;
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key == "Shift") {
    targetX = mouseX;
    targetY = mouseY;
  }
});

const worm = new Worm(root, snake, {
  x: targetX,
  y: targetY,
});

setInterval(() => {
  const deltaX = targetX - worm.x;
  const deltaY = targetY - worm.y;
  const delta = Math.sqrt(deltaX ** 2 + deltaY ** 2);
  if (delta > 30) {
    // const delta2 = Math.sqrt(delta) * 5;
    // const normX = deltaX / delta2;
    // const normY = deltaY / delta2;
    // worm.moveBy(normX, normY);

    const delta2 = Math.sqrt(delta - 30) / 10;
    let deltaAngle = (Math.atan2(deltaY, deltaX) - worm.angle) % (2 * Math.PI);
    if (deltaAngle > Math.PI) deltaAngle -= 2 * Math.PI;
    if (deltaAngle < -Math.PI) deltaAngle += 2 * Math.PI;
    const maxAngle =
      (worm.body[0].segment.constraints.angle * Math.PI) / 180 / 100;
    // const maxAngle = Math.PI;
    const normAngle =
      Math.max(-maxAngle, Math.min(maxAngle, deltaAngle)) + worm.angle;
    worm.moveBy(Math.cos(normAngle) * delta2, Math.sin(normAngle) * delta2);
  }

  // worm.move(mouseX, mouseY);
}, 10);
