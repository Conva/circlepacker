"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
function isSizeValid(size) {
    return (size && typeof size.width === "number" && typeof size.height === "number");
}
exports.isSizeValid = isSizeValid;
//# sourceMappingURL=util.js.map