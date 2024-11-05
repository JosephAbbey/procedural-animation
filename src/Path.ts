import Shape from "./Shape";

export default class Path extends Shape {
  readonly element: SVGPathElement;

  constructor(
    root: SVGElement,
    {
      path,
      fill = "",
      stroke = "",
      strokeWidth = 1,
    }: {
      path: string;
      fill?: string;
      stroke?: string;
      strokeWidth?: number;
    },
  ) {
    super();

    this.element = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path",
    );

    this.element.setAttribute("d", path);
    this.element.setAttribute("fill", fill);
    this.element.setAttribute("stroke", stroke);
    this.element.setAttribute("stroke-width", strokeWidth.toString());
    root.appendChild(this.element);
  }

  /**
   * @param {string} value
   */
  set path(value) {
    this.element.setAttribute("d", value);
  }

  destroy() {
    this.element.remove();
  }
}
