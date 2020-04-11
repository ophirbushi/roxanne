export type ReducerFn<State, Actions> = (state: State, action: keyof Actions, payload: any) => State;
