import { combineReducers } from 'redux';

import auth from './AuthReducer';
import user from './UserReducer';
import post from './PostReducer';
import chat from './ChatReducer';


export const reducers = combineReducers({ auth, user, post, chat });
