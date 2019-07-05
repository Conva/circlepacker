import Vector from "./Vector";
export default class PackedCircle {
    id: string;
    private locked;
    private _previousPosition;
    private _targetPosition;
    private _position;
    private _positionWithOffset;
    private _previousPositionWithOffset;
    private _radius;
    private _originalRadius;
    private radiusSquared;
    previousPosition: Vector;
    readonly originalRadius: number;
    readonly positionWithOffset: Vector;
    readonly previousPositionWithOffset: Vector;
    private initializeRadius;
    targetPosition: Vector;
    position: Vector;
    radius: number;
    constructor(id: string, radius: number, x?: number, y?: number, delta?: number, locked?: boolean);
    setPosition(aPosition: Vector): void;
    distanceSquaredFromTargetPosition(): boolean;
    readonly delta: Vector;
}
