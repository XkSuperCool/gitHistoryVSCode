import { handleActions } from 'redux-actions';
import * as Actions from '../constants/actions';
import { ActionedUser } from '../definitions';

const initialState: ActionedUser = {
    name: '',
    email: '',
};

export default handleActions<ActionedUser, any>(
    {
        [Actions.FETCHED_LOCAL_AUTHOR]: (state, action: ReduxActions.Action<ActionedUser>) => {
            return { ...action.payload };
        },
    },
    initialState,
);
