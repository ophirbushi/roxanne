import { Store } from '../store';

export const retypeStore = <State, Actions>(store: Store<any, any>): Store<State, Actions> => store;
