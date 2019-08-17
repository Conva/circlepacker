"use strict";
// most of this code is taken from here:
// https://github.com/snorpey/CirclePackingJS/blob/master/js-module/web/js/PackedCircle.js
// by @onedayitwillmake / Mario Gonzalez with some changes by @snorpey
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Vector_1 = __importDefault(require("./Vector"));
var PackedCircle = /** @class */ (function () {
    function PackedCircle(_a) {
        var id = _a.id, radius = _a.radius, position = _a.position, locked = _a.locked, additional = _a.additional;
        this._targetPosition = new Vector_1.default(0, 0);
        this._radius = 0;
        this._originalRadius = 0;
        this.radiusSquared = 0;
        var x = position.x, y = position.y;
        this._id = id;
        this._locked = locked;
        if (additional) {
            this._additional = additional;
        }
        this._position = new Vector_1.default(x, y, locked);
        this._previousPosition = new Vector_1.default(x, y, locked);
        // For the div stuff  - to avoid superflous movement calls
        this._positionWithOffset = new Vector_1.default(x, y);
        this._previousPositionWithOffset = new Vector_1.default(x, y, locked);
        // Stored because transform3D is relative
        this.initializeRadius(radius);
    }
    Object.defineProperty(PackedCircle.prototype, "previousPosition", {
        get: function () {
            return this._previousPosition;
        },
        set: function (newPosition) {
            if (!this.locked) {
                this._previousPosition = newPosition;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PackedCircle.prototype, "originalRadius", {
        get: function () {
            return this._originalRadius;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PackedCircle.prototype, "positionWithOffset", {
        get: function () {
            return this._positionWithOffset;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PackedCircle.prototype, "previousPositionWithOffset", {
        get: function () {
            return this._previousPositionWithOffset;
        },
        enumerable: true,
        configurable: true
    });
    PackedCircle.prototype.initializeRadius = function (aRadius) {
        this._radius = aRadius;
        this.radiusSquared = aRadius * aRadius;
        this._originalRadius = aRadius;
    };
    Object.defineProperty(PackedCircle.prototype, "targetPosition", {
        get: function () {
            return this._targetPosition;
        },
        set: function (newTargetPos) {
            if (!this.locked) {
                this._targetPosition = newTargetPos;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PackedCircle.prototype, "position", {
        get: function () {
            return this._position;
        },
        set: function (newPosition) {
            if (!this.locked) {
                this._position = newPosition;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PackedCircle.prototype, "radius", {
        get: function () {
            return this._radius;
        },
        set: function (newRadius) {
            this._radius = newRadius;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PackedCircle.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PackedCircle.prototype, "locked", {
        get: function () {
            return this._locked;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PackedCircle.prototype, "additional", {
        get: function () {
            return this._additional;
        },
        enumerable: true,
        configurable: true
    });
    PackedCircle.prototype.setPosition = function (aPosition) {
        this.previousPosition = this._position;
        this.position = aPosition.cp();
    };
    PackedCircle.prototype.distanceSquaredFromTargetPosition = function () {
        var distanceSquared = this._position.distanceSquared(this._targetPosition);
        // if it's shorter than either radi, we intersect
        return distanceSquared < this.radiusSquared;
    };
    Object.defineProperty(PackedCircle.prototype, "delta", {
        get: function () {
            return new Vector_1.default(this._position.x - this._previousPosition.x, this._position.y - this._previousPosition.y, this.locked);
        },
        enumerable: true,
        configurable: true
    });
    return PackedCircle;
}());
exports.default = PackedCircle;
//# sourceMappingURL=PackedCircle.js.map