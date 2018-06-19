import { Store } from '../src';
import { SET_NAME, SET_SIZE, SHORTEN_NAME, DATA } from './constants';
import { NameStore } from './interfaces';
import { NameStoreActions } from './actions';
import { reducer } from './reducer';
import { registerEffects } from './effects';

const store = new Store<NameStore, NameStoreActions>({ name: null, size: null, data: null }, reducer);

registerEffects(store);

const size$ = store.select('size');
size$.subscribe(console.log);

store.dispatch(SET_NAME, 'Marketplace');
store.dispatch(SET_SIZE, 'big');
store.dispatch(SHORTEN_NAME, 3);
store.dispatch(DATA.load, 'abc');
