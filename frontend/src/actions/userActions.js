//user actions for sign in and sign out
import Axios from 'axios';
import {
  USER_DETAILS_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_REGISTER_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_SIGNIN_FAIL,
  USER_SIGNIN_REQUEST,
  USER_SIGNIN_SUCCESS,
  USER_SIGNOUT,
  USER_UPDATE_PROFILE_FAIL,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_SUCCESS,
} from '../constants/userConstants';

/* Similar to UserSignIn, action to register a user */
export const register = (name, email, password) => async (dispatch) => {
    /* data to send back */
    dispatch({ type: USER_REGISTER_REQUEST, payload: { email, password } });
    try {
      const { data } = await Axios.post('/api/users/register', {
        name,
        email,
        password,
      });
      dispatch({ type: USER_REGISTER_SUCCESS, payload: data });
      dispatch({ type: USER_SIGNIN_SUCCESS, payload: data }); /* Update Redux Store on user sign in */
      localStorage.setItem('userInfo', JSON.stringify(data));
    } catch (error) {
      dispatch({
        type: USER_REGISTER_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

// access email and password to dispatch user signin request 
export const signin = (email, password) => async (dispatch) => {
  dispatch({ type: USER_SIGNIN_REQUEST, payload: { email, password } });
  try {
    const { data } = await Axios.post('/api/users/signin', { email, password }); //fetch data from await Axios
		dispatch({ type: USER_SIGNIN_SUCCESS, payload: data }); //user signin success 
    localStorage.setItem('userInfo', JSON.stringify(data)); //save user data in localStorage
 // if there is an error getting data from backend..
} catch (error) {
    dispatch({
      type: USER_SIGNIN_FAIL,
      payload:
//check if response and message exists, then return message, 
//otherwise, error message shows
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
//when signout, remove user info and cartitems
export const signout = () => (dispatch) => {
  localStorage.removeItem('userInfo');
  localStorage.removeItem('cartItems');
  localStorage.removeItem('shippingAddress'); //if user is signed out redirect to sign in
  dispatch({ type: USER_SIGNOUT });
};
export const detailsUser = (userId) => async (dispatch, getState) => {
    dispatch({ type: USER_DETAILS_REQUEST, payload: userId });
    const {
      userSignin: { userInfo },
    } = getState(); //get token from getState
    try {
      const { data } = await /* to get real data */ Axios.get(`/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      dispatch({ type: USER_DETAILS_SUCCESS, payload: data }); //dispatch success action
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch({ type: USER_DETAILS_FAIL, payload: message });
    }
  };

  export const updateUserProfile = (user) => async (dispatch, getState) => {
    dispatch({ type: USER_UPDATE_PROFILE_REQUEST, payload: user });
    const {
      userSignin: { userInfo },
    } = getState(); //get user info from getState
    try {
      const { data } = await Axios.put(`/api/users/profile`, user, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      }); //update user profile
      dispatch({ type: USER_UPDATE_PROFILE_SUCCESS, payload: data });
      dispatch({ type: USER_SIGNIN_SUCCESS, payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data)); //update storage
    } catch (error) { /* error */
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch({ type: USER_UPDATE_PROFILE_FAIL, payload: message });
    }
  };