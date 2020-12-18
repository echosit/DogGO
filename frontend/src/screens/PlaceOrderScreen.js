import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { createOrder } from '../actions/orderActions';
import CheckoutSteps from '../components/CheckoutSteps';
import { ORDER_CREATE_RESET } from '../constants/orderConstants';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

export default function PlaceOrderScreen(props) {
  const cart = useSelector((state) => state.cart); //access cart from redux store
  //if user did not insert payment method, user is redirected to payment screen
	if (!cart.paymentMethod) {
    props.history.push('/payment');
  }
  //create order from redux store, get variables 
  const orderCreate = useSelector((state) => state.orderCreate);
  const { loading, success, error, order } = orderCreate;
	//to convert numbers to price
  const toPrice = (num) => Number(num.toFixed(2)); 
  cart.itemsPrice = toPrice(
    cart.cartItems.reduce((a, c) => a + c.qty * c.price, 0)
  );
	//to determine total shipping price
  cart.shippingPrice = cart.itemsPrice > 100 ? toPrice(0) : toPrice(10);
  cart.taxPrice = toPrice(0.15 * cart.itemsPrice);
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;
  const dispatch = useDispatch(); //define dispatch to use
  const placeOrderHandler = () => {
    dispatch(createOrder({ ...cart, orderItems: cart.cartItems })); //replace cart items with order items
  };
//order gets through, success! 
  useEffect(() => {
    if (success) {
      props.history.push(`/order/${order._id}`); //redirect user to order details screen
      dispatch({ type: ORDER_CREATE_RESET }); //reset order
    }
  }, [dispatch, order, props.history, success]);

  return (
    <div>
{/* CheckoutSteps */}
      <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
      <div className="row top">
        <div className="col-2">
          <ul>
            <li>
              <div className="card card-body">
{/* Shipping Address Info */}
                <h2>Shipping</h2>
                <p>
                  <strong>Name:</strong> {cart.shippingAddress.fullName} <br />
                  <strong>Address: </strong> {cart.shippingAddress.address},
                  {cart.shippingAddress.city}, {cart.shippingAddress.postalCode}
                  ,{cart.shippingAddress.country}
                </p>
              </div>
            </li>
            <li>
              <div className="card card-body">
{/* Payment Method */}
                <h2>Payment</h2>
                <p>
                  <strong>Method:</strong> {cart.paymentMethod}
                </p>
              </div>
            </li>
            <li>
{/* Order Item Info */}
              <div className="card card-body">
                <h2>Order Items</h2>
                <ul>
                  {cart.cartItems.map((item) => (
                    <li key={item.product}>
                      <div className="row">
                        <div>
                          <img
                            src={item.image} /* Image */
                            alt={item.name} 
                            className="small" 
                          ></img>
                        </div>
                        <div className="min-30">
                          <Link to={`/product/${item.product}`}> {/* Product Name */}
                            {item.name}
                          </Link>
                        </div>

                        <div>
                          ${item.qty * item.price} {/* image price  */}
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
{/* Order Summary */}
                <h2>Order Summary</h2>
              </li>
              <li>
                <div className="row">
{/* Items Price */}
                  <div>Items</div>
                  <div>${cart.itemsPrice.toFixed(2)}</div> {/* Adds two digits after the decimal place */}
                </div>
              </li>
              <li>
                <div className="row">
{/* Shipping Cost */}
                  <div>Shipping</div>
                  <div>${cart.shippingPrice.toFixed(2)}</div>
                </div>
              </li>
              <li>
                <div className="row">
{/* Tax Cost */}
                  <div>Tax</div>
                  <div>${cart.taxPrice.toFixed(2)}</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>
{/* Order Total */}
                    <strong> Order Total</strong>
                  </div>
                  <div>
                    <strong>${cart.totalPrice.toFixed(2)}</strong>
                  </div>
                </div>
              </li>
              <li>
{/* Place Order Button */}
                <button
                  type="button"
                  onClick={placeOrderHandler}
                  className="primary block"
                  disabled={cart.cartItems.length === 0} /* disable button if there are no orders in cart */
                >
                  PLACE ORDER
                </button>
              </li>
              {loading && <LoadingBox></LoadingBox>} {/* if loading is true, render loading box component */}
              {error && <MessageBox variant="danger">{error}</MessageBox>} {/* if error exists, render messagebox component */}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}