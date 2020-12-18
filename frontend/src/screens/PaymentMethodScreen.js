import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { savePaymentMethod } from '../actions/cartActions';
import CheckoutSteps from '../components/CheckoutSteps';

export default function PaymentMethodScreen(props) {
	/* Get shipping address from cart */
	const cart = useSelector((state) => state.cart);
	const { shippingAddress } = cart;
	/* if shipping address is null. redirect user to shipping page */
  if (!shippingAddress.address) {
    props.history.push('/shipping');
  }
  const [paymentMethod, setPaymentMethod] = useState('PayPal');
  const dispatch = useDispatch();
  const submitHandler = (e) => {
    e.preventDefault();
/* Dispatch savePaymentMethod */
    dispatch(savePaymentMethod(paymentMethod));
/* redirect user to place order */
    props.history.push('/placeorder');
  };
  return (
    <div>
{/* CheckoutSteps */}
      <CheckoutSteps step1 step2 step3></CheckoutSteps>
{/* Payment Form */}
			<form className="form" onSubmit={submitHandler}>
        <div>
          <div class="title">Payment Method</div>
        </div>
        <div>
          <div>
{/* Make Paypal an option, selected item */}
            <input
              type="radio"
              id="paypal"
              value="PayPal"
              name="paymentMethod"
              required
              checked 
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></input>
            <label htmlFor="paypal">PayPal</label>
          </div>
        </div>
        <div>
          <div>
{/* Make Stripe an option */}
            <input
              type="radio"
              id="stripe"
              value="Stripe"
              name="paymentMethod"
              required
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></input>
            <label htmlFor="stripe">Stripe</label>
          </div>
        </div>
        <div>
          <label />
          <button className="primary" type="submit">
            CONTINUE
          </button>
        </div>
      </form>
    </div>
  );
}