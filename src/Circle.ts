import Shape from "./Shape";

export default class Circle extends Shape {
  readonly element: SVGCircleElement;

  private _x: number;
  private _y: number;

  constructor(
    root: SVGSVGElement,
    {
      x,
      y,
      radius,
      fill = "",
      stroke = "",
      strokeWidth = 1,
    }: {
      x: number;
      y: number;
      radius: number;
      fill?: string;
      stroke?: string;
      strokeWidth?: number;
    },
  ) {
    super();

    this.element = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle",
    );
    this._x = x;
    this._y = y;
    this.element.setAttribute("cx", this._x.toString());
    this.element.setAttribute("cy", this._y.toString());
    this.element.setAttribute("r", radius.toString());
    this.element.setAttribute("fill", fill);
    this.element.setAttribute("stroke", stroke);
    this.element.setAttribute("stroke-width", strokeWidth.toString());
    root.appendChild(this.element);
  }

  set x(value: number) {
    this._x = value;
    this.element.setAttribute("cx", this._x.toString());
  }
  get x() {
    return this._x;
  }

  set y(value: number) {
    this._y = value;
    this.element.setAttribute("cy", this._y.toString());
  }
  get y() {
    return this._y;
  }

  set radius(value: number) {
    this.element.setAttribute("r", value.toString());
  }

  /**
   * @param {string} value
   */
  set color(value) {
    this.element.setAttribute("fill", value);
  }
}
