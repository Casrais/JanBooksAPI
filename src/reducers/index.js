import { combineReducers } from 'redux';


export const appRefresherReducer = (appRefresher=false, action) => {
    if (action.type === 'REFRESH_APP') {return action.payload}

    return appRefresher;
}

export const selectedStateReducer = (selectedState=null, action) => {
    if (action.type === 'STATE_SELECTED') { return action.payload }

    return selectedState;

}

export default combineReducers({
appRefresh: appRefresherReducer,
selectedState: selectedStateReducer

})