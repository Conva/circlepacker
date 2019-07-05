import PackedCircle from "./PackedCircle";
import { Size, Bounds } from "./PackedCircleManager";
import { VectorType } from "./Vector";
export declare type IdObj = {
    id: string;
};
export declare type IdPosObj = IdObj & {
    position: VectorType;
};
export declare type CircleInputType = {
    id: string;
    radius: number;
    position: VectorType;
};
export declare type PackedCircleObject = {
    [id: string]: PackedCircle;
};
export declare type OnEvent = ((updatedCirclePositions: PackedCircleObject) => void) | null;
export declare type EventTypes = "movestart" | "move" | "moveend";
export default class CirclePacker {
    private onMoveStart;
    private onMove;
    private onMoveEnd;
    private isLooping;
    private areItemsMoving;
    private animationFrameId;
    private initialized;
    private isContinuousModeActive;
    private e;
    constructor(params: {
        onMoveStart?: OnEvent;
        onMove?: OnEvent;
        onMoveEnd?: OnEvent;
        centeringPasses?: number;
        collisionPasses: number;
        circles?: PackedCircle[];
        size?: Size;
        bounds?: Bounds;
        target?: VectorType;
        continuousMode?: boolean;
    });
    updateListeners(type: EventTypes, message?: PackedCircleObject): void;
    addCircles(circles: CircleInputType[]): void;
    addCircle(circle: CircleInputType): void;
    removeCircle(circle: PackedCircle): void;
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
    hasItemMoved(circleObj: PackedCircleObject): boolean;
    destroy(): void;
}
