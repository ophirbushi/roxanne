import { switchMap } from 'rxjs/operators';
import { Store, Effects, Reducer } from '../src';

class DATA {
    static load: 'DATA load' = 'DATA load';
    static fetch: 'DATA fetch' = 'DATA fetch';
    static success: 'DATA success' = 'DATA success';
    static error: 'DATA error' = 'DATA error';
}

type StoreSize = 'small' | 'medium' | 'big';
interface NameStore { name: string, size: StoreSize, data: number[] }

const SET_NAME = 'setName';
const SET_SIZE = 'setSize';
const DELETE_NAME = 'deleteName';
const SHORTEN_NAME = 'shortenName';

interface NameStoreActions {
    [SET_NAME]: string;
    [SET_SIZE]: StoreSize;
    [DELETE_NAME]: any;
    [SHORTEN_NAME]: number;

    [DATA.load]: string;
    [DATA.fetch]: string;
    [DATA.success]: number[];
    [DATA.error]: any;
}

const reducer = new Reducer<NameStore, NameStoreActions>(
    function (state, action, payload) {
        if (this.is(SET_NAME, action, payload)) {
            return { ...state, name: payload };
        }
        if (this.is(DELETE_NAME, action)) {
            return { ...state, name: null };
        }
        if (this.is(SHORTEN_NAME, action, payload)) {
            return { ...state, name: state.name.substring(0, state.name.length - payload) };
        }
        if (this.is(SET_SIZE, action, payload)) {
            return { ...state, size: payload };
        }
        if (this.is(DATA.success, action, payload)) {
            return { ...state, data: payload };
        }
        return state;
    }
);


const effects = new Effects<NameStore, NameStoreActions>(
    function () {
        this.ofType(SET_NAME)
            .subscribe((payload) => {
                store.dispatch(SHORTEN_NAME, 1);
            });
        this.ofType(SET_SIZE)
            .subscribe((payload) => {
                this.store.dispatch(SET_NAME, 'now we are ' + payload);
            });
        this.ofType(DATA.load)
            .subscribe((payload) => {
                this.store.dispatch(DATA.fetch, payload);
            });
        this.ofType(DATA.fetch)
            .pipe(switchMap((payload) => Promise.resolve([payload.length, payload.length + 1, 12])))
            .subscribe(payload => this.store.dispatch(DATA.success, payload));
    }
);

const store = new Store<NameStore, NameStoreActions>({ name: null, size: null, data: null }, reducer, [effects]);

store.subscribe(console.log)

store.actions$.subscribe(console.log);

const size$ = store.select('size');
size$.subscribe(console.log);

store.dispatch(SET_NAME, 'Marketplace');
store.dispatch(SET_SIZE, 'big');
store.dispatch(SHORTEN_NAME, 3);
store.dispatch(DATA.load, 'abc');
