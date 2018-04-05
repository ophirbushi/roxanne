import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { map, distinctUntilChanged } from 'rxjs/operators';

import { Reducer } from './reducer';
import { Effects } from './effects';

export class Store<State, Actions> extends BehaviorSubject<State> {
    private actionDispatched = new Subject<{ action: keyof Actions, payload: Actions[keyof Actions] }>();
    actions$: Observable<{ action: keyof Actions, payload: Actions[keyof Actions] }> = this.actionDispatched.asObservable();

    constructor(
        initialValue: State,
        private reducer: Reducer<State, Actions>,
        private effects?: Effects<State, Actions>
    ) {
        super(initialValue);

        if (this.effects) {
            this.effects.store = this;
            this.effects.registerEffects();
        }
    }

    dispatch<ActionType extends keyof Actions>(action: ActionType, payload: Actions[ActionType]) {
        this.next(this.reducer.reduce(this.value, action, payload));
        this.actionDispatched.next({ action, payload });
    }

    select<K extends keyof State>(key: K): Observable<State[K]>
    select<K extends keyof State>(mapFunction: (value: State) => State[K]): Observable<State[K]>
    select<K extends keyof State>(keyOrMapFn: (K) | ((value: State) => State[K])): Observable<State[K]> {
        const mapFn: (value: State) => State[K] = typeof keyOrMapFn === 'string' ? value => value[keyOrMapFn] : keyOrMapFn;
        return this.asObservable()
            .pipe(map(mapFn))
            .pipe(distinctUntilChanged());
    }
}
