"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var Subject_1 = require("rxjs/Subject");
var operators_1 = require("rxjs/operators");
var Store = /** @class */ (function (_super) {
    __extends(Store, _super);
    function Store(initialValue, reducer, effects) {
        var _this = _super.call(this, initialValue) || this;
        _this.reducer = reducer;
        _this.effects = effects;
        _this.actionDispatched = new Subject_1.Subject();
        _this.actions$ = _this.actionDispatched.asObservable();
        if (_this.effects) {
            _this.effects.actions$ = _this.actions$;
            _this.effects.dispatch = _this.dispatch.bind(_this);
            _this.effects.registerEffects(_this);
        }
        return _this;
    }
    Store.prototype.dispatch = function (action, payload) {
        this.next(this.reducer.reduce(this.value, action, payload));
        this.actionDispatched.next({ action: action, payload: payload });
    };
    Store.prototype.select = function (keyOrMapFn) {
        var mapFn = typeof keyOrMapFn === 'string' ? function (value) { return value[keyOrMapFn]; } : keyOrMapFn;
        return this.asObservable()
            .pipe(operators_1.map(mapFn))
            .pipe(operators_1.distinctUntilChanged());
    };
    return Store;
}(BehaviorSubject_1.BehaviorSubject));
exports.Store = Store;
