import Axios from 'axios';
import { PayPalButton } from 'react-paypal-button-v2';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { deliverOrder, detailsOrder, payOrder } from '../actions/orderActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import {
    ORDER_DELIVER_RESET,
    ORDER_PAY_RESET,
  } from '../constants/orderConstants';

export default function OrderScreen(props) {
  const orderId = props.match.params.id; //to get userid from URL
  const [sdkReady, setSdkReady] = useState(false); //define hook for getting status of paypal sdk
  const orderDetails = useSelector((state) => state.orderDetails); //get order details, state from redux store
  const { order, loading, error } = orderDetails; //get variables from orderDetails
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  
  const orderPay = useSelector((state) => state.orderPay); //get orderPay from redux
  const {
    loading: loadingPay,
    error: errorPay,
    success: successPay,
  } = orderPay; // get variables
  const orderDeliver = useSelector((state) => state.orderDeliver);
  const {
    loading: loadingDeliver,
    error: errorDeliver,
    success: successDeliver,
  } = orderDeliver;
  const dispatch = useDispatch();
  
//dispatch order details
  useEffect(() => {
    const addPayPalScript = async () => {
        const { data } = await Axios.get('/api/config/paypal'); //data contains client id
        const script = document.createElement('script'); //create script element and set source to paypal sdk
        script.type = 'text/javascript'; //to create script using javascript
        script.src = `https://www.paypal.com/sdk/js?client-id=${data}`;
        script.async = true;
  //sdk ready
        script.onload = () => {
          setSdkReady(true);
        };
        document.body.appendChild(script); //add script as last element to html document
      };
//if order is not found or pay is successful or if order exists, but order does not equal to the order id, order update
if (
    !order ||
    successPay ||
    successDeliver ||
    (order && order._id !== orderId)
  ) {        
        dispatch({ type: ORDER_PAY_RESET }); //reset order pay
        dispatch({ type: ORDER_DELIVER_RESET }); 
        dispatch(detailsOrder(orderId)); // load order from backend
      } else {
  //otherwise, if order is not paid, check if paypal is loaded
        if (!order.isPaid) {
          if (!window.paypal) {
            addPayPalScript();
          } else {
            setSdkReady(true);
          }
        }
      }
    }, [dispatch, order, orderId, sdkReady, successPay, successDeliver]);  
//dispatch payorder, paymentResult: result of payment from paypal
const successPaymentHandler = (paymentResult) => {
    dispatch(payOrder(order, paymentResult));
    };
    const deliverHandler = () => {
        dispatch(deliverOrder(order._id));
      };

  return loading ? ( /* when loading show loading box */
    <LoadingBox></LoadingBox>
  ) : error ? ( /* if error, show message box */
    <MessageBox variant="danger">{error}</MessageBox>
  ) : ( /* if no loading or error show.. */
    <div>
{/* Order Information */}
      <h1>Order {order._id}</h1>
      <div className="row top">
        <div className="col-2">
          <ul>
            <li>
              <div className="card card-body">
                <h2>Shipping</h2>
                <p>
                  <strong>Name:</strong> {order.shippingAddress.fullName} <br />
                  <strong>Address: </strong> {order.shippingAddress.address},
                  {order.shippingAddress.city},{' '}
                  {order.shippingAddress.postalCode},
                  {order.shippingAddress.country}
                </p>
{/* if order is delivered show a success messagebox*/}
                {order.isDelivered ? (
                  <MessageBox variant="success">
                    Delivered at {order.deliveredAt}
                  </MessageBox>
/* else if order is not delivered show a danger messagebox*/
                ) : (
                  <MessageBox variant="danger">Not Delivered</MessageBox>
                )}
              </div>
            </li>
            <li>
              <div className="card card-body">
                <h2>Payment</h2>
                <p>
                  <strong>Method:</strong> {order.paymentMethod}
                </p>
{/* if paid, show success messagebox */}
                {order.isPaid ? (
                  <MessageBox variant="success">
                    Paid at {order.paidAt}
                  </MessageBox>
                ) : (
/* if not paid, show not paid messagebox */
                  <MessageBox variant="danger">Not Paid</MessageBox>
                )}
              </div>
            </li>
            <li>
              <div className="card card-body">
                <h2>Order Items</h2>
                <ul>
                  {order.orderItems.map((item) => (
                    <li key={item.product}>
                      <div className="row">
                        <div>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="small"
                          ></img>
                        </div>
                        <div className="min-30">
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </div>

                        <div>
                          ${item.qty * item.price}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          </ul>
        </div>
        <div className="col-1">
          <div className="card card-body">
            <ul>
              <li>
                <h2>Order Summary</h2>
              </li>
              <li>
                <div className="row">
                  <div>Items</div>
                  <div>${order.itemsPrice.toFixed(2)}</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>Shipping</div>
                  <div>${order.shippingPrice.toFixed(2)}</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>Tax</div>
                  <div>${order.taxPrice.toFixed(2)}</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>
                    <strong> Order Total</strong>
                  </div>
                  <div>
                    <strong>${order.totalPrice.toFixed(2)}</strong>
                  </div>
                </div>
              </li>
{/* if order is not paid, check if sdkReady is false; it means it is still loading paypal */}
              {!order.isPaid && (
                <li>
                  {!sdkReady ? (
                    <LoadingBox></LoadingBox>
                  ) : (
                    <>
{/* if pay error is true, show messagebox */}
                      {errorPay && (
                        <MessageBox variant="danger">{errorPay}</MessageBox>
                      )}
{/* if loadingPay is true, show loadingbox */}
                      {loadingPay && <LoadingBox></LoadingBox>}

                      <PayPalButton
                        amount={order.totalPrice}
                        onSuccess={successPaymentHandler}
                      ></PayPalButton>
                    </>
                  )}
                </li>
              )}
              {userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                <li>
                  {loadingDeliver && <LoadingBox></LoadingBox>}
                  {errorDeliver && (
                    <MessageBox variant="danger">{errorDeliver}</MessageBox>
                  )}
                  <button
                    type="button"
                    className="primary block"
                    onClick={deliverHandler}
                  >
                    Deliver Order
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}