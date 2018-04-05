import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Reducer } from './reducer';
import { Effects } from './effects';
export declare class Store<T, A> extends BehaviorSubject<T> {
    private reducer;
    private effects;
    private actionDispatched;
    actions$: Observable<{
        action: keyof A;
        payload: A[keyof A];
    }>;
    constructor(initialValue: T, reducer: Reducer<T, A>, effects?: Effects<T, A>);
    dispatch<ActionType extends keyof A>(action: ActionType, payload: A[ActionType]): void;
    select<K extends keyof T>(key: K): Observable<T[K]>;
    select<K extends keyof T>(mapFunction: (value: T) => T[K]): Observable<T[K]>;
}
