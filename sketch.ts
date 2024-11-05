import Worm from "./src/Worm.ts";
import snake from "./animals/snake.animal.yaml";
import lizard from "./animals/lizard.animal.yaml";

const root = document.querySelector("#root");

if (!root || !(root instanceof SVGSVGElement)) throw "";

let mouseX = 0;
let mouseY = 0;
let mouseDown = false;
let targetX = root.clientWidth / 2;
let targetY = root.clientHeight / 2;
document.addEventListener("mousemove", (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;
  if (mouseDown) {
    targetX = mouseX;
    targetY = mouseY;
  }
});
document.addEventListener("touchmove", (event) => {
  mouseX = event.touches[0].clientX;
  mouseY = event.touches[0].clientY;
  targetX = mouseX;
  targetY = mouseY;
});
document.addEventListener("mousedown", () => {
  mouseDown = true;
  targetX = mouseX;
  targetY = mouseY;
});
document.addEventListener("mouseup", () => {
  mouseDown = false;
});

console.log(snake);
console.log(lizard);
let animalToggle = false;
let worm = new Worm(root, snake, {
  x: targetX,
  y: targetY,
});

document.addEventListener("keydown", (event) => {
  if (event.key === " ") {
    worm.destroy();
    if (animalToggle)
      worm = new Worm(root, snake, {
        x: targetX,
        y: targetY,
      });
    else
      worm = new Worm(root, lizard, {
        x: targetX,
        y: targetY,
      });
    animalToggle = !animalToggle;
  }
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
