import React from 'react';

export default function CheckoutSteps(props) {
  return (
    <div className="row checkout-steps">
{/* if steps are true then set class to active, otherwise nothing */}
      <div className={props.step1 ? 'active' : ''}>Sign-In</div>
      <div className={props.step2 ? 'active' : ''}>Shipping</div>
      <div className={props.step3 ? 'active' : ''}>Payment</div>
      <div className={props.step4 ? 'active' : ''}>Place Order</div>
    </div>
  );
}