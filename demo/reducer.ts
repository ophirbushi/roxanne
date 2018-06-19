import { Reducer } from '../src/reducer';
import { NameStore } from './interfaces';
import { SET_NAME, DELETE_NAME, SHORTEN_NAME, SET_SIZE, DATA } from './constants';
import { NameStoreActions } from './actions';

export const reducer = new Reducer<NameStore, NameStoreActions>(
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
