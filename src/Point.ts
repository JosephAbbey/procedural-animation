import Circle from "./Circle.ts";

export default class Point extends Circle {
  constructor(
    root: SVGElement,
    params: Partial<ConstructorParameters<typeof Circle>[1]> & {
      x: number;
      y: number;
    },
  ) {
    super(root, {
      radius: 5,
      strokeWidth: 2,
      stroke: "white",
      fill: "black",
      ...params,
    });
  }
}
