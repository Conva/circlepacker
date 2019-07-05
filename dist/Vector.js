"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Vector = /** @class */ (function () {
    function Vector(x, y, locked) {
        if (locked === void 0) { locked = false; }
        this.locked = locked;
        this._x = x;
        this._y = y;
    }
    Object.defineProperty(Vector.prototype, "x", {
        get: function () {
            return this._x;
        },
        set: function (newX) {
            if (!this.locked) {
                this._x = newX;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector.prototype, "y", {
        get: function () {
            return this._y;
        },
        set: function (newY) {
            if (!this.locked) {
                this._y = newY;
            }
        },
        enumerable: true,
        configurable: true
    });
    Vector.prototype.cp = function () {
        return new Vector(this._x, this._y);
    };
    Vector.prototype.mul = function (factor) {
        this.x *= factor;
        this.y *= factor;
        return this;
    };
    Vector.prototype.normalize = function () {
        var l = this.length();
        this.x /= l;
        this.y /= l;
        return this;
    };
    Vector.prototype.length = function () {
        var length = Math.sqrt(this._x * this._x + this._y * this._y);
        if (length < 0.005 && length > -0.005) {
            return 0.000001;
        }
        return length;
    };
    Vector.prototype.distance = function (vec) {
        var deltaX = this._x - vec.x;
        var deltaY = this._y - vec.y;
        return Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));
    };
    Vector.prototype.distanceSquared = function (vec) {
        var deltaX = this._x - vec.x;
        var deltaY = this._y - vec.y;
        return (deltaX * deltaX) + (deltaY * deltaY);
    };
    return Vector;
}());
exports.default = Vector;
//# sourceMappingURL=Vector.js.map