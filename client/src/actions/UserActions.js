import { GET_ME, UPDATE, GET_FOLLOWERS, 
  GET_FOLLOWINGS, FOLLOW, UNFOLLOW, FAVORITE } from '../constants/actionTypes';
import * as api from '../api/index.js';

export const getMe = () => async (dispatch) => {
  try {
    const { data } = await api.getMe();

    dispatch({ type: GET_ME, payload: data });
  } catch (error) {
    console.log("Error in getting CurrentUser : ",  error.response.data.message);
  }
};

export const updateUser = (userData) => async (dispatch) => {
  try {
    const { data } = await api.updateUser(userData);

    dispatch({ type: UPDATE, payload: data });
  } catch (error) {
    console.log("Error in updating user : ",  error.response.data.message);
  }
};

export const getFollowers = (id) => async (dispatch) => {
  try {

    const { data } = await api.getFriends(id);

    dispatch({ type: GET_FOLLOWERS, payload: data });

  } catch (error) {
    console.log("Error in getting followers : ",  error.response.data.message);
  }
}

export const getFollowings = (id) => async (dispatch) => {
  try {
    const { data } = await api.getFollowings(id);

    dispatch({ type: GET_FOLLOWINGS, payload: data });

  } catch (error) {
    console.log("Error in getting followings : ",  error.response.data.message);
  }
}

export const followUser = (id) => async (dispatch) => {
  try {

    const { data } = await api.followUser(id);

    dispatch({ type: FOLLOW, payload: data });
  } catch (error) {
    console.log("Error in follow user : ",  error.response.data.message);
  }
}

export const unfollowUser = (id) => async (dispatch) => {
  try {
    const { data } = await api.unfollowUser(id);

    dispatch({ type: UNFOLLOW, payload: data });
  } catch (error) {
    console.log("Error in unfollow user : ",  error.response.data.message);
  }
}

export const addToFavorite = (postId) => async (dispatch) => {
  try {
    console.log(postId);
    const { data } = await api.addToFavorite(postId);

    dispatch({ type: FAVORITE, payload: data });

  } catch (error) {
    console.log("Error in Add To Favorite : ",  error.response.data.message);
  }
}