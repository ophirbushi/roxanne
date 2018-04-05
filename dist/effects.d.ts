import { Observable } from 'rxjs/Observable';
import { Store } from './store';
export declare class Effects<T, A> {
    registerEffects: (this: Effects<T, A>, store: Store<T, A>) => void;
    actions$: Observable<{
        action: keyof A;
        payload: A[keyof A];
    }>;
    dispatch: <K extends keyof A>(action: K, payload: A[K]) => void;
    constructor(registerEffects?: (this: Effects<T, A>, store: Store<T, A>) => void);
    actionOfType<K extends keyof A>(action: K): Observable<A[K]>;
}
