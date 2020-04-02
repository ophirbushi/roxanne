import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { map, distinctUntilChanged, filter } from 'rxjs/operators';
import { ReducerFn } from './reducer';

export class Store<State, Actions> extends BehaviorSubject<State> {
    private reducers: Array<ReducerFn<State, Actions>>;
    private readonly _actions$ = new Subject<{ action: keyof Actions, payload: Actions[keyof Actions] }>();
    readonly actions$: Observable<{ action: keyof Actions, payload: Actions[keyof Actions] }> =
        this._actions$.asObservable();

    constructor(initialState: State, reducer: ReducerFn<State, Actions>)
    constructor(initialState: State, reducers: Array<ReducerFn<State, Actions>>)
    constructor(
        initialState: State,
        reducerOrReducers: ReducerFn<State, Actions> | Array<ReducerFn<State, Actions>>
    ) {
        super(initialState);
        this.reducers = typeof reducerOrReducers === 'function' ? [reducerOrReducers] : reducerOrReducers;
    }

    dispatch<ActionType extends keyof Actions>(action: ActionType, payload: Actions[ActionType]) {
        this.next(
            this.reducers.reduce((updatedState, reducer) => reducer(updatedState, action, payload), this.value)
        );
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
        return this._actions$
            .pipe(
                filter(actionPayloadPair => actionPayloadPair.action === action),
                map(actionPayloadPair => <Actions[K]>actionPayloadPair.payload)
            );
    }

    mountChildState(
        propertyKey: string,
        initialState: any,
        reducerOrReducers: ReducerFn | Array<ReducerFn>,
    ) {
        this.reducers = this.reducers.concat(reducerOrReducers);
        this.next({ ...this.value, [propertyKey]: initialState });
    }
}
