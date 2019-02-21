export function generatePayloadTypeChecker<Actions>() {
    return function <K extends keyof Actions>(name: K, action: keyof Actions, payload?: Actions[keyof Actions]): payload is Actions[K] {
        return action === name;
    };
}
