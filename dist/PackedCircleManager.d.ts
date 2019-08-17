import PackedCircle from "./PackedCircle";
import Vector, { VectorType } from "./Vector";
export declare type Size = {
    width: number;
    height: number;
};
export declare type Bounds = {
    left: number;
    top: number;
    right: number;
    bottom: number;
};
export default class PackedCircleManager<T> {
    private padding;
    private draggedCircle;
    private _damping;
    private bounds;
    readonly allCircles: PackedCircle<T>[];
    private desiredTarget;
    constructor(padding?: number);
    private _numberOfCenteringPasses;
    private _numberOfCollisionPasses;
    numberOfCenteringPasses: number;
    numberOfCollisionPasses: number;
    damping: number;
    /**
     * Set the boundary rectangle for the circle packing.
     * This is used to locate the 'center'
     * @param aBoundaryObject
     */
    setBounds(bounds: Bounds): void;
    setSize(size: Size): void;
    /**
     * Add a circle
     * @param aCircle A Circle to add, should already be created.
     */
    addCircle(aCircle: PackedCircle<T>): void;
    /**
     * Remove a circle
     * @param circleToRemoveId Id of the circle to remove
     */
    removeCircle(circleToRemoveId: string): void;
    /**
     * Recalculate all circle positions
     */
    updatePositions(): void;
    pushAllCirclesTowardTarget(aTarget: VectorType): void;
    /**
     * Packs the circles towards the center of the bounds.
     * Each circle will have it's own 'targetPosition' later on
     */
    handleCollisions(): void;
    handleBoundaryForCircle(aCircle: PackedCircle<T>): void;
    /**
     * Force a certain circle to be the 'draggedCircle'.
     * Can be used to undrag a circle by calling setDraggedCircle(null)
     * @param aCircle  Circle to start dragging. It's assumed to be part of our list. No checks in place currently.
     */
    setDraggedCircle(aCircle: PackedCircle<T> | null): void;
    dragStart(id: string): void;
    dragEnd(): void;
    drag(position: VectorType): void;
    /**
     * Sets the target position where the circles want to be
     * @param aPosition
     */
    setTarget(aPosition: Vector): void;
}
