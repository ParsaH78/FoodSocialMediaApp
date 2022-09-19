import { POST_DETAILS, USER_POST, TIMELINE_POST, CREATE,
     UPDATE, DELETE, LIKE, RATE_POST, ADD_COMMENT,
      DELETE_COMMENT, TOP_POSTS, VEGAN_MENU } from '../constants/actionTypes';

export default (postState = {
    posts: [],
    userPosts: [],
    topPosts: [],
    veganPosts: [],
    postDetails: null
}, action) => {
  switch (action.type) {
    case POST_DETAILS:
        return {...postState, postDetails: action.payload};
    case LIKE:
    case UPDATE:
    case RATE_POST:
    case ADD_COMMENT:
    case DELETE_COMMENT:
        const index = postState.posts.findIndex(post => post._id === action.payload._id);
        const newArray = [...postState.posts];
        newArray[index] = action.payload;
        return { ...postState, posts: newArray }
    case CREATE:
        return {...postState, posts: [...postState.posts, action.payload] };
    case DELETE:
        return {...postState, posts: postState.posts.filter((post) => post._id !== action.payload)};
    case USER_POST:
        return {...postState, userPosts: action.payload}
    case TIMELINE_POST:
        return {...postState, posts: action.payload}
    case TOP_POSTS:
        return {...postState, topPosts: action.payload}
    case VEGAN_MENU:
        return {...postState, veganPosts: action.payload}
    default:
      return postState;
  }
};

