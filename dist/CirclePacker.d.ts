import PackedCircle from "./PackedCircle";
import { Bounds, Size } from "./PackedCircleManager";
import { VectorType } from "./Vector";
export declare type IdObj = {
    id: string;
};
export declare type IdPosObj = IdObj & {
    position: VectorType;
};
export declare type CircleInputType<T> = {
    additional?: T;
    id: string;
    radius: number;
    position: VectorType;
    locked: boolean;
};
export declare type PackedCircleObject<T> = {
    [id: string]: PackedCircle<T>;
};
export declare type OnEvent<T> = ((updatedCirclePositions: PackedCircleObject<T>) => void) | null;
export declare type EventTypes = "movestart" | "move" | "moveend";
export interface CirclePackerProps<T> {
    onMoveStart?: OnEvent<T>;
    onMove?: OnEvent<T>;
    onMoveEnd?: OnEvent<T>;
    centeringPasses?: number;
    collisionPasses: number;
    circles?: CircleInputType<T>[];
    padding?: number;
    size?: Size;
    bounds?: Bounds;
    target?: VectorType;
    continuousMode?: boolean;
}
export default class CirclePacker<T> {
    private onMoveStart;
    private onMove;
    private onMoveEnd;
    private isLooping;
    private areItemsMoving;
    private animationFrameId;
    private initialized;
    private isContinuousModeActive;
    private e;
    constructor(params: CirclePackerProps<T>);
    updateListeners(type: EventTypes, message?: PackedCircleObject<T>): void;
    addCircles(circles: CircleInputType<T>[]): void;
    addCircle(circle: CircleInputType<T>): void;
    removeCircle(circle: PackedCircle<T>): void;
    setSizeAndBounds(size: Size, bounds: Bounds): void;
    setTarget(targetPos: VectorType): void;
    setCenteringPasses(numberOfCenteringPasses: number): void;
    setCollisionPasses(numberOfCollisionPasses: number): void;
    setDamping(damping: number): void;
    update(): void;
    dragStart(id: string): void;
    drag(id: string, position: VectorType): void;
    dragEnd(id: string): void;
    updateLoop(): void;
    startLoop(): void;
    stopLoop(): void;
    hasItemMoved(circleObj: PackedCircleObject<T>): boolean;
    destroy(): void;
}
