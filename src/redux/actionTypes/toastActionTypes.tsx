export enum ActionType {
    OPEN_TOAST_ALERT = 'OPEN_TOAST_ALERT',
    CLOSE_TOAST_ALERT = 'CLOSE_TOAST_ALERT'
}

export interface IToastAlertOpen {
    type: ActionType.OPEN_TOAST_ALERT;
    payload: any;
}

export interface IToastAlertClose {
    type: ActionType.CLOSE_TOAST_ALERT;
    payload: any;
}

export type Action =
    | IToastAlertOpen
    | IToastAlertClose