export type ReducerFn<State, Actions> = (state: State, action: keyof Actions, payload: Actions[keyof Actions]) => State;
