
const authReducer = (state = { 
  authData: null, 
  isLoading: false, 
  error: false, 
  message: '' }, action) => {
  switch (action.type) {
    case "REGISTER_START":
    case "LOGIN_START":
      return { ...state, isLoading: true };
    case "REGISTER_SUCCESS":
    case "LOGIN_SUCCESS":
      return { ...state, authData: action.payload };
    case "REGISTER_FAILURE":
    case "LOGIN_FAILURE":
      return { ...state, isLoading: false, error: true, message: action.payload };
    case "LOGOUT":
      return { ...state, authData: null };
    case "RESET":
      return {...state, isLoading: false, error: false, message: ''}
    default:
      return state;
  }
};

export default authReducer;
