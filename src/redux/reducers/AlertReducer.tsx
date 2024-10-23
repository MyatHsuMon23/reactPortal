import { Reducer } from 'redux';
import { Action, ActionType } from '../actionTypes/alertActionTypes';


export interface IAlertState {
    isModalOpen: boolean,
    message: any,
}

const initialState = {
    isModalOpen: false,
    message: {
      title: '',
      content: ''
    },
  };

export const AlertReducer: Reducer<IAlertState, Action> = (
    state = initialState,
    action
) => {
    switch (action.type) {
        case ActionType.OPEN_ALERT_MODAL:
            return {
              ...state,
              message: action.payload,
              isModalOpen: !state.isModalOpen
            };
          case ActionType.TOGGLE_ALERT_MODAL:
            return {
              ...state,
              isModalOpen: !state.isModalOpen
            };
          default:
            return state;
    }
};


