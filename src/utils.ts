import { Store } from "./store";

export const generatePayloadTypeChecker = <Actions>() => {
    return <K extends keyof Actions>(name: K, action: keyof Actions, payload?: Actions[keyof Actions]): payload is Actions[K] => {
        return action === name;
    };
}

export const retypeStore = <State, Actions>(store: Store<any, any>): Store<State, Actions> => store;
