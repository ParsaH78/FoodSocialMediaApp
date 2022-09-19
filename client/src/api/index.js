import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:8800/api' });

API.interceptors.request.use((req) => {
  if (localStorage.getItem('user')) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('user')).token}`;
  }

  return req;
});

export const getPost = (postId) => API.get(`/posts/${postId}`);
export const createPost = (newPost) => API.post('/posts', newPost);
export const likePost = (id) => API.put(`/posts/${id}/like`);
export const updatePost = (id, updatedPost) => API.put(`/posts/${id}`, updatedPost);
export const deletePost = (id) => API.delete(`/posts/${id}`);
export const getTimelinePost = () => API.post('/posts/timeline');
export const userPosts = (id) => API.get(`/posts/profile/${id}`);
export const ratePost = (id, rate) => API.put(`/posts/rate/${id}`, rate);
export const addComment = (id, commentData) => API.put(`/posts/comments/${id}`, commentData);
export const updateComment = (updateData) => API.post(`/posts/updatecomments`, updateData);
export const deleteComment = (id, commentId) => API.put(`/posts/delcomments/${id}`, commentId);
export const topPosts = () => API.get(`/posts/topItems`);
export const veganMenu = () => API.get(`/posts/veganMenu`);


export const updateUser = (updatedData) => API.put("/users", updatedData);
export const getUser = (userId) => API.post("/users", userId);
export const getMe = () => API.get("/users/me");
export const getFriends = (userId) => API.get(`/users/friends/${userId}`);
export const getFollowings = (userId) => API.get(`/users/followings/${userId}`);
export const followUser = (userId) => API.put("/users/follow", userId);
export const unfollowUser = (userId) => API.put("/users/unfollow", userId);
export const addToFavorite = (postId) => API.put("/users/favorite", postId);

export const search = (text) => API.get(`/users/search/?query=${text}`);

export const login = (formData) => API.post('/auth/login', formData);
export const register = (formData) => API.post('/auth/register', formData);


export const createConversation = (members) => API.post('/conversations', members);
export const getConversation = (id) => API.get(`/conversations/${id}`);
export const deleteConversation = (id) => API.delete(`/conversations/${id}`);
export const getUsersConversation = (firstId, secondId) => API.get(
  `/conversations/find/${firstId}/${secondId}`
  );


export const addMessage = (data) => API.post('/messages', data);
export const getMessage = (id) => API.get(`/messages/${id}`);
export const deleteMessage = (id) => API.delete(`/messages/${id}`);
export const editMessage = (message) => API.put("/messages", message);