"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var PackedCircle_1 = __importDefault(require("./PackedCircle"));
function random(min, max) {
    if (typeof min !== "number" && typeof max !== "number") {
        min = 0;
        max = 1;
    }
    if (typeof max !== "number") {
        max = min;
        min = 0;
    }
    var result = min + Math.random() * (max - min);
    return result;
}
exports.random = random;
function convertToPackedCircle(circle) {
    return (new PackedCircle_1.default(circle.id, circle.radius, circle.position.x, circle.position.y));
}
exports.convertToPackedCircle = convertToPackedCircle;
function isSizeValid(size) {
    return (size && typeof size.width === "number" && typeof size.height === "number");
}
exports.isSizeValid = isSizeValid;
//# sourceMappingURL=util.js.map