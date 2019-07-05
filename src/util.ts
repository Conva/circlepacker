import { Size } from "./PackedCircleManager";
import PackedCircle from "./PackedCircle";
import { CircleInputType } from "./CirclePacker";

export function random(min: number, max: number) {
  if (typeof min !== "number" && typeof max !== "number") {
    min = 0;
    max = 1;
  }

  if (typeof max !== "number") {
    max = min;
    min = 0;
  }

  let result = min + Math.random() * (max - min);

  return result;
}


export function convertToPackedCircle(circle: CircleInputType) {
  return (
   new PackedCircle(circle.id,circle.radius,circle.position.x,circle.position.y)
  );
}

export function isSizeValid(size: Size) {
  return (
    size && typeof size.width === "number" && typeof size.height === "number"
  );
}
