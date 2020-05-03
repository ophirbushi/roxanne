export const generatePayloadTypeChecker = <Actions>() => {
    return <K extends keyof Actions>(
        name: K,
        action: keyof Actions,
        payload?: Actions[keyof Actions]
    ): payload is Actions[K] => {
        return action === name;
    };
};
