import { switchMap } from "rxjs/operators";
import { Store } from "../src";
import { NameStoreActions } from "./actions";
import { NameStore } from "./interfaces";
import { SET_NAME, SHORTEN_NAME, SET_SIZE, DATA } from "./constants";

export function registerEffects(store: Store<NameStore, NameStoreActions>) {
    store.actionOfType(SET_NAME)
        .subscribe(() => {
            store.dispatch(SHORTEN_NAME, 1);
        });
    store.actionOfType(SET_SIZE)
        .subscribe((payload) => {
            this.store.dispatch(SET_NAME, 'now we are ' + payload);
        });
    store.actionOfType(DATA.load)
        .subscribe((payload) => {
            this.store.dispatch(DATA.fetch, payload);
        });
    store.actionOfType(DATA.fetch)
        .pipe(switchMap((payload) => Promise.resolve([payload.length, payload.length + 1, 12])))
        .subscribe(payload => this.store.dispatch(DATA.success, payload));
}