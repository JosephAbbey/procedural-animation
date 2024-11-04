import Worm from "./src/Worm.ts";
import snake from "./animals/snake.animal.yaml";

const root = document.querySelector("#root");

if (!root || !(root instanceof SVGSVGElement)) throw "";

const worm = new Worm(root, snake, {
  x: 0,
  y: 0,
});

let mouseX = 0;
let mouseY = 0;
let targetX = root.clientWidth / 2;
let targetY = root.clientHeight / 2;
document.addEventListener("mousemove", (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;
  if (event.shiftKey) {
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

setInterval(() => {
  const deltaX = targetX - worm.x;
  const deltaY = targetY - worm.y;
  const delta = Math.sqrt(deltaX ** 2 + deltaY ** 2);
  if (delta > 30) {
    const delta2 = Math.sqrt(delta) * 5;
    const normX = deltaX / delta2;
    const normY = deltaY / delta2;
    worm.moveBy(normX, normY);
  }

  // worm.move(mouseX, mouseY);
}, 10);
