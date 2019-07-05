import { Size } from "./PackedCircleManager";
import PackedCircle from "./PackedCircle";
import { CircleInputType } from "./CirclePacker";
export declare function random(min: number, max: number): number;
export declare function convertToPackedCircle(circle: CircleInputType): PackedCircle;
export declare function isSizeValid(size: Size): boolean;
