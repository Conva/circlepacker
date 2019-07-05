"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util");
var CirclePackWorker_1 = require("./CirclePackWorker");
// this class keeps track of the drawing loop in continuous drawing mode
// and passes messages to the worker
var CirclePacker = /** @class */ (function () {
    function CirclePacker(params) {
        var _this = this;
        this.isLooping = false;
        this.areItemsMoving = true;
        this.animationFrameId = NaN;
        this.initialized = true;
        this.e = CirclePackWorker_1.eventHandler(function (newPositions) {
            _this.areItemsMoving = _this.hasItemMoved(newPositions);
            _this.updateListeners("move", newPositions);
        }, params.padding);
        this.isContinuousModeActive =
            typeof params.continuousMode === "boolean" ? params.continuousMode : true;
        this.onMoveStart = params.onMoveStart || null;
        this.onMove = params.onMove || null;
        this.onMoveEnd = params.onMoveEnd || null;
        if (params.centeringPasses) {
            this.setCenteringPasses(params.centeringPasses);
        }
        if (params.collisionPasses) {
            this.setCollisionPasses(params.collisionPasses);
        }
        this.addCircles(params.circles || []);
        this.setSizeAndBounds(params.size || { width: 100, height: 100 }, params.bounds || { left: 0, right: 0, top: 0, bottom: 0 });
        this.setTarget(params.target || { x: 50, y: 50 });
        if (this.isContinuousModeActive) {
            this.startLoop();
        }
    }
    CirclePacker.prototype.updateListeners = function (type, message) {
        if (message) {
            if (type === "movestart" && typeof this.onMoveStart === "function") {
                this.onMoveStart(message);
            }
            if (type === "move" && typeof this.onMove === "function") {
                this.onMove(message);
            }
            if (type === "moveend" && typeof this.onMoveEnd === "function") {
                this.onMoveEnd(message);
            }
        }
    };
    CirclePacker.prototype.addCircles = function (circles) {
        if (Array.isArray(circles) && circles.length) {
            var circlesToAdd = circles.map(util_1.convertToPackedCircle);
            if (circlesToAdd.length) {
                this.e.addcircles(circlesToAdd);
            }
        }
        this.startLoop();
    };
    CirclePacker.prototype.addCircle = function (circle) {
        this.addCircles([circle]);
    };
    CirclePacker.prototype.removeCircle = function (circle) {
        if (circle) {
            if (circle.id) {
                this.e.removecircle(circle.id);
            }
            else {
                throw Error("No Id associated with circle");
            }
            this.startLoop();
        }
    };
    CirclePacker.prototype.setSizeAndBounds = function (size, bounds) {
        if (util_1.isSizeValid(size)) {
            this.e.bounds(bounds);
            this.e.size(size);
            this.startLoop();
        }
    };
    CirclePacker.prototype.setTarget = function (targetPos) {
        this.e.target(targetPos);
        this.startLoop();
    };
    CirclePacker.prototype.setCenteringPasses = function (numberOfCenteringPasses) {
        this.e.centeringpasses(numberOfCenteringPasses);
    };
    CirclePacker.prototype.setCollisionPasses = function (numberOfCollisionPasses) {
        this.e.collisionpasses(numberOfCollisionPasses);
    };
    CirclePacker.prototype.setDamping = function (damping) {
        this.e.damping(damping);
    };
    CirclePacker.prototype.update = function () {
        this.e.update();
    };
    CirclePacker.prototype.dragStart = function (id) {
        this.e.dragstart(id);
        this.startLoop();
    };
    CirclePacker.prototype.drag = function (id, position) {
        this.e.drag(position);
        this.startLoop();
    };
    CirclePacker.prototype.dragEnd = function (id) {
        this.e.dragend();
        this.startLoop();
    };
    CirclePacker.prototype.updateLoop = function () {
        this.update();
        if (this.isLooping) {
            if (this.areItemsMoving) {
                this.animationFrameId = requestAnimationFrame(this.updateLoop.bind(this));
            }
            else {
                this.stopLoop();
            }
        }
    };
    CirclePacker.prototype.startLoop = function () {
        if (!this.isLooping && this.initialized && this.isContinuousModeActive) {
            this.isLooping = true;
            // in case we just added another circle:
            // keep going, even if nothing has moved since the last message from the worker
            if (this.isContinuousModeActive) {
                this.areItemsMoving = true;
            }
            this.updateListeners("movestart");
            this.animationFrameId = requestAnimationFrame(this.updateLoop.bind(this));
        }
    };
    CirclePacker.prototype.stopLoop = function () {
        if (this.isLooping) {
            this.isLooping = false;
            this.updateListeners("moveend");
            cancelAnimationFrame(this.animationFrameId);
        }
    };
    CirclePacker.prototype.hasItemMoved = function (circleObj) {
        var result = false;
        for (var id in circleObj) {
            if (Math.abs(circleObj[id].delta.x) > 0.005 &&
                Math.abs(circleObj[id].delta.y) > 0.005) {
                result = true;
            }
        }
        return result;
    };
    CirclePacker.prototype.destroy = function () {
        this.stopLoop();
        this.onMove = null;
        this.onMoveStart = null;
        this.onMoveEnd = null;
    };
    return CirclePacker;
}());
exports.default = CirclePacker;
//# sourceMappingURL=CirclePacker.js.map