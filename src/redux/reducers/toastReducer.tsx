import { Reducer } from 'redux';
import { Action, ActionType } from '../actionTypes/toastActionTypes';


export interface IToastState {
    isOpen: boolean
    description?: string
    message: string
    status: 'success' | 'info' | 'warning' | 'error'
}

const initialState : IToastState = {
    isOpen: false,
    description: "",
    message: "",
    status: 'success'
};

export const ToastReducer: Reducer<IToastState, Action> = (
    state = initialState,
    action
) => {
    switch (action.type) {
        case ActionType.OPEN_TOAST_ALERT:
            return {
                ...state,
                isOpen: action.payload.isOpen,
                message: action.payload.message,
                description: action.payload.description,
                status: action.payload.status
            };
        case ActionType.CLOSE_TOAST_ALERT:
            return {
                ...state,
                isOpen: action.payload.isOpen,
            };
        default:
            return state;
    }
};


