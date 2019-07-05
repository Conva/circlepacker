export declare type VectorType = {
    x: number;
    y: number;
};
export default class Vector {
    private locked;
    private _x;
    private _y;
    x: number;
    y: number;
    constructor(x: number, y: number, locked?: boolean);
    cp(): Vector;
    mul(factor: number): this;
    normalize(): this;
    length(): number;
    distance(vec: VectorType): number;
    distanceSquared(vec: VectorType): number;
}
