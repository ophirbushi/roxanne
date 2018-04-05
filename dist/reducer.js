"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Reducer = /** @class */ (function () {
    function Reducer(reduce) {
        this.reduce = reduce;
    }
    Reducer.prototype.is = function (name, action, payload) {
        return action === name;
    };
    return Reducer;
}());
exports.Reducer = Reducer;
