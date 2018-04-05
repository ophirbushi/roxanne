export class Reducer<State, Actions> {
    constructor(public reduce: (this: Reducer<State, Actions>, state: State, action: keyof Actions, payload: Actions[keyof Actions]) => State) { }

    public is<K extends keyof Actions>(name: K, action: keyof Actions, payload?: Actions[keyof Actions]): payload is Actions[K] {
        return action === name;
    }
}
