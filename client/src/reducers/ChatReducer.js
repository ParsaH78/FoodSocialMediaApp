import { ADD_CONVERSATION, ADD_MESSAGE, GET_CONVERSATION,
DELETE_CONVERSATION, GET_MESSAGE, DELETE_MESSAGE, EDIT_MESSAGE } from '../constants/actionTypes';

export default (state = {
    conversations: [],
    messages: [],
}, action) => {
 switch (action.type) {
    case ADD_CONVERSATION:
        return {...state, conversations: [...state.conversations, action.payload]};
    case GET_CONVERSATION:
        return {...state, conversations: action.payload};
    case DELETE_CONVERSATION:
        return {...state, conversations: state.conversations.filter(conv => conv._id !== action.payload._id)};
    case ADD_MESSAGE:
        return {...state, messages: [...state.messages, action.payload]};
    case GET_MESSAGE:
        return {...state, messages: action.payload};
    case DELETE_MESSAGE:
        return {...state, messages: state.messages.filter(message => message._id !== action.payload)};
    case EDIT_MESSAGE:
        const index = state.messages.findIndex(message => message._id === action.payload._id);
        const newArray = [...state.messages];
        newArray[index] = action.payload;
        return { ...state, messages: newArray };
   default:
     return state;
 }
};

