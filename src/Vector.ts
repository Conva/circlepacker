// most of this code is taken from here:
// https://github.com/snorpey/CirclePackingJS/blob/master/js-module/web/js/lib/Vector.js
// by @onedayitwillmake / Mario Gonzalez with some changes by @snorpey
export type VectorType = {
	x: number
	y: number
}

export default class Vector {

	private _x: number;
	private _y: number;

	get x(): number {
		return this._x
	}

	get y(): number {
		return this._y
	}

	set x(newX: number) {
		if (!this.locked){
			this._x = newX;
		}
	}

	set y(newY: number) {
		if (!this.locked){
			this._y = newY
		}
	}


	constructor(x: number, y: number, private locked = false) {

		this._x = x;
		this._y = y;
	}

	cp() {
		return new Vector(this._x, this._y);
	}

	mul(factor: number) {
		this.x *= factor;
		this.y *= factor;
		return this;
	}

	normalize() {
		var l = this.length();
		this.x /= l;
		this.y /= l;
		return this;
	}

	length() {
		var length = Math.sqrt(this._x * this._x + this._y * this._y);

		if (length < 0.005 && length > -0.005) {
			return 0.000001;
		}

		return length;
	}

	distance(vec: VectorType) {
		var deltaX = this._x - vec.x;
		var deltaY = this._y - vec.y;
		return Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));
	}

	distanceSquared(vec: VectorType) {
		var deltaX = this._x - vec.x;
		var deltaY = this._y - vec.y;
		return (deltaX * deltaX) + (deltaY * deltaY);
	}
}