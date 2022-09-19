import { POST_DETAILS, USER_POST, TIMELINE_POST, CREATE,
   UPDATE, DELETE, LIKE, RATE_POST, ADD_COMMENT
   , DELETE_COMMENT, TOP_POSTS, VEGAN_MENU } from '../constants/actionTypes';
import * as api from '../api/index.js';

export const postDetails = (id) => async (dispatch) => {
  try {
    const { data } = await api.getPost(id);

    dispatch({ type: POST_DETAILS, payload: data });
  } catch (error) {
    console.log("Error in getting Post : ", error);
  }
};

export const createPost = (post, navigate, userId) => async (dispatch) => {
  try {
    const { data } = await api.createPost(post);

    dispatch({ type: CREATE, payload: data });

    navigate(`/profile/${userId}`);

  } catch (error) {
    console.log("Error in create post : ", error);
  }
};

export const updatePost = (id, post) => async (dispatch) => {
  try {
    const { data } = await api.updatePost(id, post);

    dispatch({ type: UPDATE, payload: data });

    window.location.reload();

  } catch (error) {
    console.log("Error in update post : ", error);
  }
};

export const likePost = (id) => async (dispatch) => {
  try {
    
    const { data } = await api.likePost(id);

    dispatch({ type: LIKE, payload: data });
  } catch (error) {
    console.log("Error in like/dislike post : ", error);
  }
};

export const deletePost = (id, navigate, userId) => async (dispatch) => {
  try {
    await api.deletePost(id);

    dispatch({ type: DELETE, payload: id });

    navigate(`/profile/${userId}`);

  } catch (error) {
    console.log("Error in delete post : ", error);
  }
};

export const userPosts = (id) => async (dispatch) => {
    try {
        const { data } = await api.userPosts(id);

        dispatch({type: USER_POST, payload: data});
    } catch (error) {
        console.log("Error in getting user posts : ",  error.response.data.message);
    }
}

export const timelinePosts = () => async (dispatch) => {
    try {
        const { data } = await api.getTimelinePost();

        dispatch({type: TIMELINE_POST, payload: data});

    } catch (error) {
        console.log("Error in getting timeline posts : ",  error.response.data.message);
    }
}

export const ratePost = (id, rate) => async (dispatch) => {
    try {
        const { data } = await api.ratePost(id, rate);

        dispatch({type: RATE_POST, payload: data});
    } catch (error) {
        console.log("Error in rate post : ",  error.response.data.message);
    }
}

export const addComment = (id, commentData) => async (dispatch) => {
    try {
        const { data } = await api.addComment(id, commentData);

        dispatch({type: ADD_COMMENT, payload: data});
    } catch (error) {
        console.log("Error in add comment : ",  error.response.data.message);
    }
}

export const deleteComment = (id, commentId) => async (dispatch) => {
    try {
        const { data } = await api.deleteComment(id, commentId);

        dispatch({type: DELETE_COMMENT, payload: data});
    } catch (error) {
        console.log("Error in delete comment : ",  error.response.data.message);
    }
}

export const getTopPosts = () => async (dispatch) => {
  try {
    const { data } = await api.topPosts();

    dispatch({type: TOP_POSTS, payload: data});
    
  } catch (error) {
    console.log("Error in getting top posts : ",  error.response.data.message);
  }
}

export const veganMenu = () => async (dispatch) => {
  try {
    const { data } = await api.veganMenu();

    dispatch({type: VEGAN_MENU, payload: data});
    
  } catch (error) {
    console.log("Error in getting top posts : ",  error.response.data.message);
  }
}