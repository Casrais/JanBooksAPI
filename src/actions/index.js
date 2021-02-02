export const appRefresh = (RefreshBoolean) => {
return {
    type: "REFRESH_APP",
    Payload: RefreshBoolean
};
}

export const appState = (state) => {
    return {
        type: "APP_STATE",
        Payload: state
    };
    }