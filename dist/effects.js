"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var operators_1 = require("rxjs/operators");
var Effects = /** @class */ (function () {
    function Effects(registerEffects) {
        if (registerEffects === void 0) { registerEffects = function (store) { }; }
        this.registerEffects = registerEffects;
    }
    Effects.prototype.actionOfType = function (action) {
        return this.actions$
            .pipe(operators_1.filter(function (couple) { return couple.action === action; }))
            .pipe(operators_1.map(function (couple) { return couple.payload; }));
    };
    return Effects;
}());
exports.Effects = Effects;
