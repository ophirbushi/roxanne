import { Store } from './store';

export type Effects<State, Actions> = (store: Store<State, Actions>) => void;
