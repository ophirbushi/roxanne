import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Store } from './store';

export class Effects<State, Actions>{
    store: Store<State, Actions>;

    constructor(public registerEffects: (this: Effects<State, Actions>) => void = () => { }) { }

    ofType<K extends keyof Actions>(action: K): Observable<Actions[K]> {
        return this.store.actions$
            .pipe(
                filter(couple => couple.action === action),
                map(couple => <Actions[K]>couple.payload)
            );
    }
}
