import { combineReducers } from 'redux';

import { AlertReducer, IAlertState as AlertState } from './alertReducer';
import { AuthReducer, IAuthState as AuthState } from './authReducer';
import { ToastReducer, IToastState as ToastState } from './toastReducer';
    
interface RootStateType {
    readonly alert: AlertState;
    readonly auth: AuthState;
    readonly toast: ToastState;
}

const rootReducer = combineReducers<RootStateType>({
    alert: AlertReducer,
    auth: AuthReducer,
    toast: ToastReducer
});

export default rootReducer;