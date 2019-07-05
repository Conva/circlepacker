import { Bounds, Size } from "./PackedCircleManager";
import { VectorType } from "./Vector";
import PackedCircle from "./PackedCircle";
import { PackedCircleObject } from "./CirclePacker";
export declare type EventHandlerTypes = {
    bounds: (message: Bounds) => void;
    target: (message: VectorType) => void;
    addcircles: (message: PackedCircle[]) => void;
    removecircle: (message: string) => void;
    dragstart: (message: string) => void;
    drag: (message: VectorType) => void;
    dragend: () => void;
    centeringpasses: (message: number) => void;
    collisionpasses: (message: number) => void;
    damping: (message: number) => void;
    update: () => void;
    size: (message: Size) => void;
};
export declare const eventHandler: (moveCallback: (position: PackedCircleObject) => void) => EventHandlerTypes;
