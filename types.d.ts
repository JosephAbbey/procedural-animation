declare module "*.animal.yaml" {
  const content: Readonly<import("./animal").Animal>;
  export default content;
}

declare module "*.yaml" {
  const content: unknown;
  export default content;
}
