import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveShippingAddress } from '../actions/cartActions';
import CheckoutSteps from '../components/CheckoutSteps';

export default function ShippingAddressScreen(props) {
//remove user from shipping screen if they are not signed in
	const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
//get shipping address from cart
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart; 
//if not signed in, user to pushed to signin page
	if (!userInfo) {
    props.history.push('/signin');
  }
// Define submit handler and full name hook *
//use shipping address to fill in info
  const [fullName, setFullName] = useState(shippingAddress.fullName);
  const [address, setAddress] = useState(shippingAddress.address);
  const [city, setCity] = useState(shippingAddress.city);
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);
  const [country, setCountry] = useState(shippingAddress.country);
  const dispatch = useDispatch(); //define dispatch to use
  const submitHandler = (e) => {
    e.preventDefault();
    /* Dispatch save shipping address action */
		dispatch(
      saveShippingAddress({ fullName, address, city, postalCode, country })
    );
    props.history.push('/payment'); //redirect users to payment screen
  };
  return (
    <div>
			{/* CheckoutSteps */}
      <CheckoutSteps step1 step2></CheckoutSteps>
			{/* Shipping Form */}
      <form className="form" onSubmit={submitHandler}>
        <div>
          <div className="title">Shipping Address</div>
        </div>
        <div>
			{/* Full Name */}
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            placeholder="Enter Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          ></input>
        </div>
        <div>
		   {/* Address */}
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            placeholder="Enter Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          ></input>
        </div>
        <div>
				{/* City */}
          <label htmlFor="city">City</label>
          <input
            type="text"
            id="city"
            placeholder="Enter City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          ></input>
        </div>
        <div>
				{/* Postal Code */}
          <label htmlFor="postalCode">Postal Code</label>
          <input
            type="text"
            id="postalCode"
            placeholder="Enter Postal Code"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            required
          ></input>
        </div>
        <div>
				{/* Country */}
          <label htmlFor="country">Country</label>
          <input
            type="text"
            id="country"
            placeholder="Enter Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          ></input>
        </div>
        <div>
				{/* Continue Button */}
          <label />
          <button className="primary" type="submit">
            CONTINUE
          </button>
        </div>
      </form>
    </div>
  );
}