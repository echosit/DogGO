import Axios from 'axios';
import { CART_EMPTY } from '../constants/cartConstants';
import {
  ORDER_CREATE_FAIL,
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_DETAILS_FAIL,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_PAY_REQUEST,
  ORDER_PAY_FAIL,
  ORDER_PAY_SUCCESS,
  ORDER_MINE_LIST_REQUEST,
  ORDER_MINE_LIST_FAIL,
  ORDER_MINE_LIST_SUCCESS,
  ORDER_LIST_REQUEST,
  ORDER_LIST_SUCCESS,
  ORDER_LIST_FAIL,
  ORDER_DELETE_REQUEST,
  ORDER_DELETE_SUCCESS,
  ORDER_DELETE_FAIL,
  ORDER_DELIVER_REQUEST,
  ORDER_DELIVER_SUCCESS,
  ORDER_DELIVER_FAIL,
} from '../constants/orderConstants';

//define order action, save order in database
export const createOrder = (order) => async (dispatch, getState) => {
  dispatch({ type: ORDER_CREATE_REQUEST, payload: order });
  try {
//get user info from redux store
    const {
      userSignin: { userInfo },
    } = getState(); //returns whole redux store
//send order request
    const { data /* contains message and order */ } = await Axios.post('/api/orders', order, {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    });
//create order
    dispatch({ type: ORDER_CREATE_SUCCESS, payload: data.order });
//remove all items from shopping cart
    dispatch({ type: CART_EMPTY }); //clear local storage
    localStorage.removeItem('cartItems');
/* if there is error, show error message */
  } catch (error) {  
    dispatch({
      type: ORDER_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

//action to get order details from backend
export const detailsOrder = (orderId) => async (dispatch, getState /* to get token of current user */) => {
    dispatch({ type: ORDER_DETAILS_REQUEST, payload: orderId });
  /* get user info from getState */
    const {
      userSignin: { userInfo },
    } = getState();
    try {
  /* get data from request */
      const { data } = await Axios.get(`/api/orders/${orderId}`, {
  /* define header */ 
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
  /* after getting data, need to dispatch data to use on frontend */ 
      dispatch({ type: ORDER_DETAILS_SUCCESS, payload: data });
    } catch (error) { /* error message */
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch({ type: ORDER_DETAILS_FAIL, payload: message });
    }
  };

  export const payOrder = (order, paymentResult) => async (
    dispatch,
    getState
  ) => {
  /* dispatch order pay request */
    dispatch({ type: ORDER_PAY_REQUEST, payload: { order, paymentResult } });
  /* get user info from getState */
    const {
      userSignin: { userInfo },
    } = getState();
    try {
  /* get data */
      const { data } = Axios.put(`/api/orders/${order._id}/pay`, paymentResult, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      dispatch({ type: ORDER_PAY_SUCCESS, payload: data }); //dispatch successful payment
    } catch (error) { /* error message */
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch({ type: ORDER_PAY_FAIL, payload: message });
    }
  };

  export const listOrderMine = () => async (dispatch, getState) => {
    dispatch({ type: ORDER_MINE_LIST_REQUEST });
    const {
      userSignin: { userInfo },
    } = getState(); //get user info from userSignin
    try {
      const { data } = await Axios.get('/api/orders/mine', {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({ type: ORDER_MINE_LIST_SUCCESS, payload: data });
    } catch (error) {  /* error message */
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch({ type: ORDER_MINE_LIST_FAIL, payload: message });
    }
  };

  export const listOrders = () => async (dispatch, getState) => {
    dispatch({ type: ORDER_LIST_REQUEST });
    const {
      userSignin: { userInfo },
    } = getState();
    try {
      const { data } = await Axios.get('/api/orders', {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      console.log(data);
      dispatch({ type: ORDER_LIST_SUCCESS, payload: data });
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch({ type: ORDER_LIST_FAIL, payload: message });
    }
  };

  export const deleteOrder = (orderId) => async (dispatch, getState) => {
    dispatch({ type: ORDER_DELETE_REQUEST, payload: orderId });
    const {
      userSignin: { userInfo },
    } = getState();
    try {
      const { data } = Axios.delete(`/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      dispatch({ type: ORDER_DELETE_SUCCESS, payload: data });
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch({ type: ORDER_DELETE_FAIL, payload: message });
    }
  };

  export const deliverOrder = (orderId) => async (dispatch, getState) => {
    dispatch({ type: ORDER_DELIVER_REQUEST, payload: orderId });
    const {
      userSignin: { userInfo },
    } = getState();
    try {
      const { data } = Axios.put(
        `/api/orders/${orderId}/deliver`,
        {},
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: ORDER_DELIVER_SUCCESS, payload: data });
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch({ type: ORDER_DELIVER_FAIL, payload: message });
    }
  };