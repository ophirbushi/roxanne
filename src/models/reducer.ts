export type Reducer<State = any, Actions = any> = (
    state: State,
    action: keyof Actions,
    payload: Actions[keyof Actions]
) => State;
