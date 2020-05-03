export interface ActionEvent<State, Actions> {
    action: keyof Actions;
    payload: Actions[keyof Actions];
    oldState: State;
    newState: State;
}
