"use strict";
// most of this code is taken from here:
// https://github.com/snorpey/CirclePackingJS/blob/master/js-module/web/js/PackedCircleManager.js
// by @onedayitwillmake / Mario Gonzalez with some changes by @snorpey
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Vector_1 = __importDefault(require("./Vector"));
var PackedCircleManager = /** @class */ (function () {
    function PackedCircleManager(padding) {
        if (padding === void 0) { padding = 1.08; }
        this.padding = padding;
        this.draggedCircle = null;
        this._damping = 0.025;
        this.bounds = { left: 0, top: 0, right: 0, bottom: 0 };
        this.allCircles = [];
        this.desiredTarget = new Vector_1.default(0, 0);
        // Number of passes for the centering and collision
        // algorithms - it's (O)logN^2 so use increase at your own risk!
        // Play with these numbers - see what works best for your project
        this._numberOfCenteringPasses = 1;
        this._numberOfCollisionPasses = 3;
    }
    Object.defineProperty(PackedCircleManager.prototype, "numberOfCenteringPasses", {
        get: function () {
            return this._numberOfCenteringPasses;
        },
        set: function (newNumberOfCenteringPasses) {
            this._numberOfCenteringPasses = newNumberOfCenteringPasses;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PackedCircleManager.prototype, "numberOfCollisionPasses", {
        get: function () {
            return this._numberOfCollisionPasses;
        },
        set: function (newNumberOfCollisionPasses) {
            this._numberOfCollisionPasses = newNumberOfCollisionPasses;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PackedCircleManager.prototype, "damping", {
        set: function (newDamping) {
            this._damping = newDamping;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Set the boundary rectangle for the circle packing.
     * This is used to locate the 'center'
     * @param aBoundaryObject
     */
    PackedCircleManager.prototype.setBounds = function (bounds) {
        if (typeof bounds.left === "number") {
            this.bounds.left = bounds.left;
        }
        if (typeof bounds.right === "number") {
            this.bounds.right = bounds.right;
        }
        if (typeof bounds.top === "number") {
            this.bounds.top = bounds.top;
        }
        if (typeof bounds.bottom === "number") {
            this.bounds.bottom = bounds.bottom;
        }
    };
    PackedCircleManager.prototype.setSize = function (size) {
        if (typeof size.width === "number") {
            this.bounds.right = this.bounds.left + size.width;
        }
        if (typeof size.height === "number") {
            this.bounds.bottom = this.bounds.top + size.height;
        }
    };
    /**
     * Add a circle
     * @param aCircle A Circle to add, should already be created.
     */
    PackedCircleManager.prototype.addCircle = function (aCircle) {
        this.allCircles.push(aCircle);
        aCircle.targetPosition = this.desiredTarget.cp();
    };
    /**
     * Remove a circle
     * @param circleToRemoveId Id of the circle to remove
     */
    PackedCircleManager.prototype.removeCircle = function (circleToRemoveId) {
        var indicesToRemove = this.allCircles.reduce(function (indices, circle, index) {
            if (circle.id === circleToRemoveId) {
                indices.push(index);
            }
            return indices;
        }, []);
        for (var n = indicesToRemove.length - 1; n >= 0; n--) {
            this.allCircles.splice(indicesToRemove[n], 1);
        }
    };
    /**
     * Recalculate all circle positions
     */
    PackedCircleManager.prototype.updatePositions = function () {
        var circleList = this.allCircles;
        var circleCount = circleList.length;
        // store information about the previous position
        for (var i = 0; i < circleCount; ++i) {
            var circle = circleList[i];
            circle.previousPosition = circle.position.cp();
        }
        if (this.desiredTarget) {
            // Push all the circles to the target - in my case the center of the bounds
            this.pushAllCirclesTowardTarget(this.desiredTarget);
        }
        // Make the circles collide and adjust positions to move away from each other
        this.handleCollisions();
        // store information about the previous position
        for (var i = 0; i < circleCount; ++i) {
            var circle = circleList[i];
            this.handleBoundaryForCircle(circle);
        }
    };
    PackedCircleManager.prototype.pushAllCirclesTowardTarget = function (aTarget) {
        var v = new Vector_1.default(0, 0);
        var dragCircle = this.draggedCircle;
        var circleList = this.allCircles;
        var circleCount = circleList.length;
        for (var n = 0; n < this._numberOfCenteringPasses; n++) {
            for (var i = 0; i < circleCount; i++) {
                var circle = circleList[i];
                if (circle === dragCircle) {
                    continue;
                }
                v.x = circle.position.x - aTarget.x;
                v.y = circle.position.y - aTarget.y;
                v.mul(this._damping);
                circle.position.x -= v.x;
                circle.position.y -= v.y;
            }
        }
    };
    /**
     * Packs the circles towards the center of the bounds.
     * Each circle will have it's own 'targetPosition' later on
     */
    PackedCircleManager.prototype.handleCollisions = function () {
        var v = new Vector_1.default(0, 0);
        var dragCircle = this.draggedCircle;
        var circleList = this.allCircles;
        var circleCount = circleList.length;
        // Collide circles
        for (var n = 0; n < this._numberOfCollisionPasses; n++) {
            for (var i = 0; i < circleCount; i++) {
                var circleA = circleList[i];
                for (var j = i + 1; j < circleCount; j++) {
                    var circleB = circleList[j];
                    if (circleA === circleB) {
                        continue; // It's us!
                    }
                    var dx = circleB.position.x - circleA.position.x;
                    var dy = circleB.position.y - circleA.position.y;
                    // The distance between the two circles radii,
                    // but we're also gonna pad it a tiny bit
                    var r = (circleA.radius + circleB.radius) * this.padding;
                    var d = circleA.position.distanceSquared(circleB.position);
                    if (d < r * r - 0.02) {
                        v.x = dx;
                        v.y = dy;
                        v.normalize();
                        var inverseForce = (r - Math.sqrt(d)) * 0.5;
                        v.mul(inverseForce);
                        if (circleB !== dragCircle) {
                            if (circleA === dragCircle) {
                                // Double inverse force to make up
                                // for the fact that the other object is fixed
                                v.mul(2.2);
                            }
                            circleB.position.x += v.x;
                            circleB.position.y += v.y;
                        }
                        if (circleA !== dragCircle) {
                            if (circleB === dragCircle) {
                                // Double inverse force to make up
                                // for the fact that the other object is fixed
                                v.mul(2.2);
                            }
                            circleA.position.x -= v.x;
                            circleA.position.y -= v.y;
                        }
                    }
                }
            }
        }
    };
    PackedCircleManager.prototype.handleBoundaryForCircle = function (aCircle) {
        var x = aCircle.position.x;
        var y = aCircle.position.y;
        var radius = aCircle.radius;
        var overEdge = false;
        if (x + radius >= this.bounds.right) {
            aCircle.position.x = this.bounds.right - radius;
            overEdge = true;
        }
        else if (x - radius < this.bounds.left) {
            aCircle.position.x = this.bounds.left + radius;
            overEdge = true;
        }
        if (y + radius > this.bounds.bottom) {
            aCircle.position.y = this.bounds.bottom - radius;
            overEdge = true;
        }
        else if (y - radius < this.bounds.top) {
            aCircle.position.y = this.bounds.top + radius;
            overEdge = true;
        }
        // end dragging if user dragged over edge
        if (overEdge && aCircle === this.draggedCircle) {
            this.draggedCircle = null;
        }
    };
    /**
     * Force a certain circle to be the 'draggedCircle'.
     * Can be used to undrag a circle by calling setDraggedCircle(null)
     * @param aCircle  Circle to start dragging. It's assumed to be part of our list. No checks in place currently.
     */
    PackedCircleManager.prototype.setDraggedCircle = function (aCircle) {
        // Setting to null, and we had a circle before.
        // Restore the radius of the circle as it was previously
        if (this.draggedCircle && this.draggedCircle !== aCircle) {
            this.draggedCircle.radius = this.draggedCircle.originalRadius;
        }
        this.draggedCircle = aCircle;
    };
    PackedCircleManager.prototype.dragStart = function (id) {
        var draggedCircle = this.allCircles.filter(function (c) {
            return c.id === id;
        })[0];
        this.setDraggedCircle(draggedCircle);
    };
    PackedCircleManager.prototype.dragEnd = function () {
        if (this.draggedCircle) {
            this.setDraggedCircle(null);
        }
    };
    PackedCircleManager.prototype.drag = function (position) {
        if (this.draggedCircle && position) {
            this.draggedCircle.position.x = position.x;
            this.draggedCircle.position.y = position.y;
        }
    };
    /**
     * Sets the target position where the circles want to be
     * @param aPosition
     */
    PackedCircleManager.prototype.setTarget = function (aPosition) {
        this.desiredTarget = aPosition;
    };
    return PackedCircleManager;
}());
exports.default = PackedCircleManager;
//# sourceMappingURL=PackedCircleManager.js.map