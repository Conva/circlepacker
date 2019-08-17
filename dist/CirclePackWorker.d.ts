import { PackedCircleObject } from "./CirclePacker";
import PackedCircle from "./PackedCircle";
import { Bounds, Size } from "./PackedCircleManager";
import { VectorType } from "./Vector";
export declare type EventHandlerTypes<T> = {
    bounds: (message: Bounds) => void;
    target: (message: VectorType) => void;
    addcircles: (message: PackedCircle<T>[]) => void;
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
export declare const eventHandler: <T>(moveCallback: (position: PackedCircleObject<T>) => void, padding?: number | undefined) => EventHandlerTypes<T>;
