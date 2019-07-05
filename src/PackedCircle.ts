// most of this code is taken from here:
// https://github.com/snorpey/CirclePackingJS/blob/master/js-module/web/js/PackedCircle.js
// by @onedayitwillmake / Mario Gonzalez with some changes by @snorpey

import Vector, { VectorType } from "./Vector";

export default class PackedCircle {
  private _previousPosition: Vector;
  private _targetPosition = new Vector(0, 0);
  private _position: Vector;
  private _positionWithOffset: Vector;
  private _previousPositionWithOffset: Vector;
  private _radius: number = 0;
  private _originalRadius: number = 0;

  private radiusSquared: number = 0;


  get previousPosition():Vector {
    return this._previousPosition;
  }

  set previousPosition(newPosition: Vector) {
    if (!this.locked){
      this._previousPosition = newPosition;
    }
  }

  get originalRadius(): number {
    return this._originalRadius;
  }

  get positionWithOffset(): Vector {
    return this._positionWithOffset;
  }

  get previousPositionWithOffset(): Vector {
    return this._previousPositionWithOffset;
  }

  private initializeRadius(aRadius: number) {
    this._radius = aRadius;
    this.radiusSquared = aRadius * aRadius;
    this._originalRadius = aRadius;
  }

  get targetPosition(): Vector {
    return this._targetPosition;
  }
  set targetPosition(newTargetPos: Vector) {
    if (!this.locked){
      this._targetPosition = newTargetPos;
    }
  }

  get position(): Vector {
    return this._position;
  }


  set position(newPosition : Vector) {
    if (!this.locked){
      this._position = newPosition
    }

  }

  get radius(): number {
    return this._radius;
  }
  set radius(newRadius: number) {
    this._radius = newRadius;
  }

  constructor(public id: string, radius: number, x = 0, y = 0, delta = 0, private locked = false) {
    // Where we really are
    this._position = new Vector(x, y,locked);
    this._previousPosition = new Vector(x, y,locked);

    // For the div stuff  - to avoid superflous movement calls
    this._positionWithOffset = new Vector(x, y);
    this._previousPositionWithOffset = new Vector(x, y, locked);

    // Stored because transform3D is relative
    this.initializeRadius(radius);
  }

  setPosition(aPosition: Vector) {
      this.previousPosition = this._position;
      this.position = aPosition.cp();
  }

  distanceSquaredFromTargetPosition() {
    var distanceSquared = this._position.distanceSquared(this._targetPosition)
    // if it's shorter than either radi, we intersect
    return distanceSquared < this.radiusSquared;
  }

  get delta() {
    return new Vector(
      this._position.x - this._previousPosition.x,
      this._position.y - this._previousPosition.y,
      this.locked
    );
  }
}
