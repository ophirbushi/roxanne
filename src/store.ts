import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { map, distinctUntilChanged, filter } from 'rxjs/operators';

import { Reducer } from './reducer';

export class Store<State, Actions> extends BehaviorSubject<State> {
    private _actions$ = new Subject<{ action: keyof Actions, payload: Actions[keyof Actions] }>();
    get actions$(): Observable<{ action: keyof Actions, payload: Actions[keyof Actions] }> {
        return this._actions$.asObservable();
    }

    constructor(
        initialState: State,
        private reducer: Reducer<State, Actions>
    ) {
        super(initialState);
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

    actionOfType<K extends keyof Actions>(action: K): Observable<Actions[K]> {
        return this.actions$
            .pipe(
                filter(couple => couple.action === action),
                map(couple => <Actions[K]>couple.payload)
            );
    }
}
