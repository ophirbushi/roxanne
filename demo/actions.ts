import { SET_NAME, SET_SIZE, DELETE_NAME, SHORTEN_NAME, DATA } from './constants';
import { StoreSize } from './interfaces';

export interface NameStoreActions {
    [SET_NAME]: string;
    [SET_SIZE]: StoreSize;
    [DELETE_NAME]: any;
    [SHORTEN_NAME]: number;
    [DATA.load]: string;
    [DATA.fetch]: string;
    [DATA.success]: number[];
    [DATA.error]: any;
}
