import { Observable } from 'rxjs/Observable';
import { filter, map } from 'rxjs/operators';

import { Store } from './store';

export class Effects<T, A>{
    store: Store<T, A>;

    constructor(public registerEffects: (this: Effects<T, A>) => void = () => { }) { }

    ofType<K extends keyof A>(action: K): Observable<A[K]> {
        return this.store.actions$
            .pipe(filter(couple => couple.action === action))
            .pipe(map(couple => <any>couple.payload));
    }
}
