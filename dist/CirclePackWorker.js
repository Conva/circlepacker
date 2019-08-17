"use strict";
// this code is mostly for message passing between the
// PackedCircleManager and CirclePacker classes
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var PackedCircleManager_1 = __importDefault(require("./PackedCircleManager"));
var Vector_1 = __importDefault(require("./Vector"));
exports.eventHandler = function (moveCallback, padding) {
    var circleManager = new PackedCircleManager_1.default(padding);
    var bounds = function (message) {
        circleManager.setBounds(message);
    };
    var size = function (message) {
        circleManager.setSize(message);
    };
    var target = function (message) {
        setTarget(message);
    };
    var addcircles = function (message) {
        addCircles(message);
    };
    var removecircle = function (message) {
        circleManager.removeCircle(message);
    };
    var dragstart = function (message) {
        circleManager.dragStart(message);
    };
    var drag = function (message) {
        circleManager.drag(message);
    };
    var dragend = function () {
        circleManager.dragEnd();
    };
    var centeringpasses = function (message) {
        if (typeof message === "number" && message > 0) {
            circleManager.numberOfCenteringPasses = message;
        }
    };
    var collisionpasses = function (message) {
        if (typeof message === "number" && message > 0) {
            circleManager.numberOfCollisionPasses = message;
        }
    };
    var damping = function (message) {
        if (typeof message === "number" && message > 0) {
            circleManager.damping = message;
        }
    };
    var addCircles = function (circles) {
        if (Array.isArray(circles) && circles.length) {
            circles.forEach(circleManager.addCircle.bind(circleManager));
        }
    };
    var setTarget = function (target) {
        if (target &&
            typeof target.x === "number" &&
            typeof target.y === "number") {
            circleManager.setTarget(new Vector_1.default(target.x, target.y));
        }
    };
    var update = function () {
        circleManager.updatePositions();
        sendPositions();
    };
    var sendPositions = function () {
        var positions = circleManager.allCircles.reduce(function (result, circle) {
            result[circle.id] = circle;
            return result;
        }, {});
        moveCallback(positions);
    };
    return {
        bounds: bounds,
        update: update,
        target: target,
        addcircles: addcircles,
        removecircle: removecircle,
        dragstart: dragstart,
        drag: drag,
        dragend: dragend,
        centeringpasses: centeringpasses,
        collisionpasses: collisionpasses,
        damping: damping,
        size: size
    };
};
//# sourceMappingURL=CirclePackWorker.js.map