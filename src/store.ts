import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';

import { Reducer } from './reducer';
import { Effects } from './effects';

export class Store<State, Actions> extends BehaviorSubject<State> {
    private _actions$ = new Subject<{ action: keyof Actions, payload: Actions[keyof Actions] }>();
    get actions$(): Observable<{ action: keyof Actions, payload: Actions[keyof Actions] }> {
        return this._actions$.asObservable();
    }

    constructor(
        initialState: State,
        private reducer: Reducer<State, Actions>,
        effects?: Effects<State, Actions>[]
    ) {
        super(initialState);

        if (effects) {
            effects.forEach(effect => {
                effect.store = this;
                effect.registerEffects();
            });
        }
    }

    dispatch<ActionType extends keyof Actions>(action: ActionType, payload: Actions[ActionType]) {
        this.next(this.reducer.reduce(this.value, action, payload));
        this._actions$.next({ action, payload });
    }

    select<K extends keyof State>(key: K): Observable<State[K]>
    select<K extends keyof State>(mapFunction: (value: State) => State[K]): Observable<State[K]>
    select<K extends keyof State>(keyOrMapFn: (K) | ((value: State) => State[K])): Observable<State[K]> {
        const mapFn: any = typeof keyOrMapFn === 'string' ? value => value[keyOrMapFn] : keyOrMapFn;
        return this.asObservable()
            .pipe(
                map((mapFn) as () => any),
                distinctUntilChanged()
            );
    }
}
