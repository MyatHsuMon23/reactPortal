export enum ActionType {
    LOG_IN = 'LOG_IN',
    LOG_OUT = 'LOG_OUT',
}
export interface ILogin {
    type: ActionType.LOG_IN;
    payload: any;
}

export interface ILogOut {
    type: ActionType.LOG_OUT;
    payload: any;
}

export type Action =
    | ILogin
    | ILogOut;