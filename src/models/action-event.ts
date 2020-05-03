export interface ActionEvent<State, Actions> {
    action: keyof Actions;
    payload: Actions[keyof Actions];
    oldValue: State;
    newValue: State;
}
