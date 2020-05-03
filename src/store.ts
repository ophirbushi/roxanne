import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { map, distinctUntilChanged, filter } from 'rxjs/operators';
import { Reducer } from './models/reducer';
import { ActionEvent } from './models/action-event';

export class Store<State, Actions> extends BehaviorSubject<State> {
    private reducers: Array<Reducer<State, Actions>>;
    private readonly _actions$ = new Subject<ActionEvent<State, Actions>>();
    readonly actions$: Observable<ActionEvent<State, Actions>> = this._actions$.asObservable();

    constructor(initialState: State, reducer: Reducer<State, Actions>)
    constructor(initialState: State, reducers: Array<Reducer<State, Actions>>)
    constructor(
        initialState: State,
        reducerOrReducers: Reducer<State, Actions> | Array<Reducer<State, Actions>>
    ) {
        super(initialState);
        this.reducers = typeof reducerOrReducers === 'function' ? [reducerOrReducers] : reducerOrReducers;
    }

    dispatch<ActionType extends keyof Actions>(action: ActionType, payload: Actions[ActionType]) {
        const oldValue = this.value;
        const newValue = this.reducers.reduce((updatedState, reducer) => {
            return reducer(updatedState, action, payload);
        }, oldValue);

        this.next(newValue);
        this._actions$.next({ action, payload, oldValue, newValue });
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

    actionOfType<K extends keyof Actions>(action: K): Observable<ActionEvent<State, Actions>> {
        return this._actions$.pipe(filter(actionEvent => actionEvent.action === action));
    }

    mountChildState(
        propertyKey: string,
        initialState: any,
        reducerOrReducers: Reducer | Array<Reducer>,
    ) {
        this.reducers = this.reducers.concat(reducerOrReducers);
        this.next({ ...this.value, [propertyKey]: initialState });
    }
}
