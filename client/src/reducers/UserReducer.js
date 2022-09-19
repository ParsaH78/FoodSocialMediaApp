import { GET_ME, UPDATE, GET_FOLLOWERS, GET_FOLLOWINGS, FOLLOW, UNFOLLOW, FAVORITE } from '../constants/actionTypes';

const me = JSON.parse(localStorage.getItem('user'));

export default (userState = {
  currentUser: me ? {...me, followings: [], followers: []} : null,
  followersData: [],
  followingsData: []
}, action) => {
  switch (action.type) {
    case UPDATE:
      return {...userState, currentUser: action.payload};
    case GET_ME:
      return {...userState, currentUser: action.payload};
    case GET_FOLLOWERS:
      return {...userState, followersData: action.payload};
    case GET_FOLLOWINGS:
      return {...userState, followingsData: action.payload};
    case FOLLOW:
      return {...userState, currentUser: 
        {...userState.currentUser, followings: 
          [...userState.currentUser.followings, action.payload]}}
    case UNFOLLOW:
      return {...userState, currentUser: 
        {...userState.currentUser, followings: 
          userState.currentUser.followings.filter((following) => following !== action.payload)}}
    case FAVORITE:
      return {...userState, currentUser: {...userState.currentUser, favorites: action.payload}} 
    default:
      return userState;
  }
};
