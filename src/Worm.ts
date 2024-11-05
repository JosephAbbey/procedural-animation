import { Animal, Point as PolarPoint } from "../animal";
import Circle from "./Circle.ts";
import Path from "./Path.ts";
import Point from "./Point.ts";
import Shape from "./Shape.ts";

function repeat<T>(x: () => T, n: number) {
  const o: T[] = [];
  for (let i = 0; i < n; i++) {
    o.push(x());
  }
  return o;
}

export default class Worm {
  readonly body: Segment[];
  readonly path: Path;

  readonly g: SVGGElement;

  constructor(
    root: SVGSVGElement,
    private readonly animal: Animal,
    { x, y },
  ) {
    this.g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.g.style.filter = "blur(5px) contrast(100)";
    const bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    bg.setAttribute("width", "100%");
    bg.setAttribute("height", "100%");
    bg.setAttribute("fill", "black");
    this.g.appendChild(bg);
    this.path = new Path(this.g, {
      path: "",
      fill: animal.fill,
      stroke: animal.stroke,
      strokeWidth: animal["stroke-width"],
    });
    root.appendChild(this.g);

    this.body = [];

    let sx = x;
    for (const segment of animal.segments) {
      for (let i = 0; i < (segment.repeat ?? 1); i++) {
        this.body.push(
          new Segment(root, segment, {
            x: (sx -= segment.constraints.radius),
            y,
          }),
        );
      }
    }

    this.update();
  }

  move(x: number, y: number) {
    this.body[0].move(x, y);
    this.update();
  }
  moveBy(x: number, y: number) {
    this.body[0].moveBy(x, y);
    this.update();
  }
  get x() {
    return this.body[0].x;
  }
  get y() {
    return this.body[0].y;
  }

  get angle() {
    return this.body[0].angle;
  }

  update() {
    for (let i = 1; i < this.body.length; i++) {
      let x = this.body[i].x;
      let y = this.body[i].y;
      const deltaX = this.body[i - 1].x - x;
      const deltaY = this.body[i - 1].y - y;
      const delta = Math.sqrt(deltaX ** 2 + deltaY ** 2);
      if (delta > this.body[i - 1].segment.constraints.radius) {
        const desiredDeltaX =
          (deltaX / delta) * this.body[i - 1].segment.constraints.radius;
        const desiredDeltaY =
          (deltaY / delta) * this.body[i - 1].segment.constraints.radius;

        x = this.body[i - 1].x - desiredDeltaX;
        y = this.body[i - 1].y - desiredDeltaY;
      }
      if (i > 2) {
        const min_angle =
          (this.body[i - 1].segment.constraints.angle / 180) * Math.PI;
        const max_angle = Math.PI * 2 - min_angle;

        // const a = Math.sqrt(
        //   (this.body[i - 1].x - x) ** 2 + (this.body[i - 1].y - y) ** 2,
        // );
        // const b = Math.sqrt(
        //   (this.body[i - 1].x - this.body[i - 2].x) ** 2 +
        //     (this.body[i - 1].y - this.body[i - 2].y) ** 2,
        // );
        // const c = Math.sqrt(
        //   (x - this.body[i - 2].x) ** 2 + (y - this.body[i - 2].y) ** 2,
        // );
        // const angle = Math.acos((b ** 2 + a ** 2 - c ** 2) / (2 * a * b));

        const angle =
          Math.PI -
          Math.atan2(this.body[i - 1].y - y, this.body[i - 1].x - x) +
          Math.atan2(
            this.body[i - 2].y - this.body[i - 1].y,
            this.body[i - 2].x - this.body[i - 1].x,
          );

        const previous_bearing = Math.atan2(
          this.body[i - 2].y - this.body[i - 1].y,
          this.body[i - 2].x - this.body[i - 1].x,
        );
        if (angle < min_angle) {
          const desiredDeltaX =
            Math.cos(Math.PI - (min_angle - previous_bearing)) *
            this.body[i].segment.constraints.radius;
          const desiredDeltaY =
            Math.sin(Math.PI - (min_angle - previous_bearing)) *
            this.body[i].segment.constraints.radius;
          x = this.body[i - 1].x - desiredDeltaX;
          y = this.body[i - 1].y - desiredDeltaY;
        } else if (angle > max_angle) {
          const desiredDeltaX =
            Math.cos(Math.PI - (max_angle - previous_bearing)) *
            this.body[i].segment.constraints.radius;
          const desiredDeltaY =
            Math.sin(Math.PI - (max_angle - previous_bearing)) *
            this.body[i].segment.constraints.radius;
          x = this.body[i - 1].x - desiredDeltaX;
          y = this.body[i - 1].y - desiredDeltaY;
        }
      }
      this.body[i].move(x, y);
    }

    let path = "";
    for (let i = 0; i < this.body.length; i++) {
      for (
        let j = 0;
        j < (this.body[i].segment.anchors?.forward?.length ?? 0);
        j++
      ) {
        const anchor = this.body[i].segment.anchors!.forward![j];
        path += `L${this.body[i].anchorX(anchor)} ${this.body[i].anchorY(
          anchor,
        )}`;
      }
    }
    for (let i = this.body.length - 1; i >= 0; i--) {
      for (
        let j = 0;
        j < (this.body[i].segment.anchors?.backward?.length ?? 0);
        j++
      ) {
        const anchor = this.body[i].segment.anchors!.backward![j];
        path += `L${this.body[i].anchorX(anchor)} ${this.body[i].anchorY(
          anchor,
        )}`;
      }
    }
    path = "M" + path.slice(1);
    if (this.animal.close) {
      path += "Z";
    }

    // let path = `M${this.body[0].leftAnchorX} ${this.body[0].leftAnchorY}`;
    // for (var i = 1; i < this.body.length; i++) {
    //   path += `L${this.body[i].leftAnchorX} ${this.body[i].leftAnchorY}`;
    // }
    // path += `L${this.body[this.body.length - 1].backAnchorX} ${this.body[this.body.length - 1].backAnchorY}`;
    // for (var i = this.body.length - 1; i >= 0; i--) {
    //   path += `L${this.body[i].rightAnchorX} ${this.body[i].rightAnchorY}`;
    // }
    // path += `L${this.body[0].frontAnchorX} ${this.body[0].frontAnchorY}Z`;

    this.path.path = path;
  }

  destroy() {
    this.path.element.remove();
    this.g.remove();
    for (const segment of this.body) {
      segment.destroy();
    }
  }
}

export class Segment {
  private _x: number;
  private _y: number;
  angle: number = 0;
  shapes: Shape[] = [];

  constructor(
    root: SVGSVGElement,
    public readonly segment: Animal["segments"][number],
    { x, y },
  ) {
    // this.circle = new Circle(root, {
    //   x,
    //   y,
    //   radius,
    //   fill: "red",
    // });
    // this.lPoint = new Point(root, {
    //   x,
    //   y,
    // });
    // this.rPoint = new Point(root, {
    //   x,
    //   y,
    // });
    this._x = x;
    this._y = y;

    for (const draw of segment.draw ?? []) {
      if (draw.type == "circle") {
        this.shapes.push(
          new Circle(root, {
            x: draw.place ? this.anchorX(draw.place) : this._x,
            y: draw.place ? this.anchorY(draw.place) : this._y,
            radius: draw.radius,
            fill: draw.fill,
            stroke: draw.stroke,
            strokeWidth: draw["stroke-width"],
          }),
        );
      } else if (draw.type == "point") {
        this.shapes.push(
          new Point(root, {
            x: this.anchorX(draw.place),
            y: this.anchorY(draw.place),
          }),
        );
      }
    }
  }

  anchorX(anchor: PolarPoint) {
    return (
      this._x +
      Math.cos(this.angle + (anchor.angle / 180) * Math.PI) * anchor.radius
    );
  }
  anchorY(anchor: PolarPoint) {
    return (
      this._y +
      Math.sin(this.angle + (anchor.angle / 180) * Math.PI) * anchor.radius
    );
  }

  draw() {
    for (let i = 0; i < this.shapes.length; i++) {
      const draw = this.segment.draw![i];
      const shape = this.shapes[i];
      if (draw.type == "circle" && shape instanceof Circle) {
        shape.x = draw.place ? this.anchorX(draw.place) : this._x;
        shape.y = draw.place ? this.anchorY(draw.place) : this._y;
      } else if (draw.type == "point" && shape instanceof Point) {
        shape.x = this.anchorX(draw.place);
        shape.y = this.anchorY(draw.place);
      }
    }
  }

  move(x: number, y: number) {
    if (this._x != x || this._y != y)
      this.angle = Math.atan2(y - this._y, x - this._x);
    this._x = x;
    this._y = y;
    this.draw();
  }
  moveBy(x: number, y: number) {
    if (x != 0 || y != 0) this.angle = Math.atan2(y, x);
    this._x += x;
    this._y += y;
    this.draw();
  }
  get x() {
    return this._x;
  }
  get y() {
    return this._y;
  }

  destroy() {
    for (const shape of this.shapes) {
      shape.destroy();
    }
  }
}
