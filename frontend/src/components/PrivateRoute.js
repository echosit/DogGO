//so unauthenticated users can't see profile screen
import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';

export default function PrivateRoute({ component: Component, ...rest }) {
  const userSignin = useSelector((state) => state.userSignin); 
  const { userInfo } = userSignin; // get user info
  return (
    <Route
      {...rest}
      render={(props) =>
        userInfo ? ( /* if user info exists, render component */
          <Component {...props}></Component>
        ) : ( /* otherwise redirect to signin */
          <Redirect to="/signin" />
        )
      }
    ></Route>
  );
}