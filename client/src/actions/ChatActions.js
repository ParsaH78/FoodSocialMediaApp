import * as api from '../api/index.js';
import { ADD_CONVERSATION, ADD_MESSAGE, GET_CONVERSATION,
    DELETE_CONVERSATION, GET_MESSAGE, DELETE_MESSAGE, EDIT_MESSAGE } from '../constants/actionTypes';

export const createConversation =  (members) => async (dispatch) => {
    try {
        const { data } =  await api.createConversation(members);

        dispatch({type: ADD_CONVERSATION, payload: data});
    } catch (error) {
        console.log("Error in creating conversation : ",  error.response.data.message);
    }
}

export const getConversation =  (userId) => async (dispatch) => {
    try {

        const { data } = await api.getConversation(userId);

        dispatch({type: GET_CONVERSATION, payload: data});
    } catch (error) {
        console.log("Error in getting conversation : ",  error.response.data.message);
    }
}

export const addMessage =  (message) => async (dispatch) => {
    try {
        const { data } = await api.addMessage(message);

        dispatch({type: ADD_MESSAGE, payload: data});
    } catch (error) {
        console.log("Error in adding message : ",  error.response.data.message);
    }
}

export const getMessage =  (id) => async (dispatch) => {
    try {
        const { data } = await api.getMessage(id);

        dispatch({type: GET_MESSAGE, payload: data});
    } catch (error) {
        console.log("Error in getting message : ",  error.response.data.message);
    }
}

export const deleteMessage =  (id) => async (dispatch) => {
    try {
        const { data } = await api.deleteMessage(id);

        dispatch({type: DELETE_MESSAGE, payload: data});
    } catch (error) {
        console.log("Error in deleting message : ",  error.response.data.message);
    }
}

export const deleteConversation = (id) => async (dispatch) => {
    try {
        const { data } = await api.deleteConversation(id);

        dispatch({type: DELETE_CONVERSATION, payload: data});
    } catch (error) {
        console.log("Error in deleting conversation : ",  error.response.data.message);
    }
}

export const editMessage = (message) => async (dispatch) => {
    try {
        const { data } = await api.editMessage(message);


        dispatch({type: EDIT_MESSAGE, payload: data});
    } catch (error) {
        console.log("Error in deleting message : ",  error.response.data.message);
    }
}