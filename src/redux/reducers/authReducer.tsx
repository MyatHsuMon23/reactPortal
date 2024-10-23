import { Reducer } from 'redux';
import { Action, ActionType } from '../actionTypes/authActionTypes';
import { cleanStorage, removeToken } from '../../utils/auth';


export interface IAuthState {
    auth: {
        accessToken: string,
        name: string,
        LoginId: string,
        Role: string,
        branchCode: string
    }
}

const initialState = {
    auth: {
        accessToken: "",
        name: "",
        LoginId: "",
        Role: "",
        AllowAll: false,
        branchCode: ""
    },
}


export const AuthReducer: Reducer<IAuthState, Action> = (
    state = initialState,
    action
) => {
    switch (action.type) {
        case ActionType.LOG_IN:
            return {
                ...state,
                auth:  action.payload.auth
            };

        case ActionType.LOG_OUT:
            cleanStorage();
            return {
                ...initialState,
                loading: false
            };

        default:
            return state;
    }
};