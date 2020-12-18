import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { signin } from '../actions/userActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

export default function SigninScreen(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  //redirect to history
  const redirect = props.location.search //check for props
    ? props.location.search.split('=')[1] //if exists, check second value
    : '/'; //if there is no second item, return to home screen

//to get user info from redux store
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo, loading, error } = userSignin;

  const dispatch = useDispatch(); //define dispatch to use
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(signin(email, password));
  };
  useEffect(() => {
    if (userInfo) { //if userInfo contains value
      props.history.push(redirect); //redirect user to redirect variable
    }
  }, [props.history, redirect, userInfo]); //dependencies
  return (
    <div>
      <form className="form" onSubmit={submitHandler}>
        <div class="title">
          Sign In
        </div>
		{loading && <LoadingBox></LoadingBox>} {/* if loading is true, show loading box */}
        {error && <MessageBox variant="danger">{error}</MessageBox>} {/* if error is true, show error message box */}
        <div>
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            placeholder="Enter Email"
            required
            onChange={(e) => setEmail(e.target.value)}
          ></input>
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter Password"
            required
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </div>
        <div>
          <label />
          <button className="primary" type="submit">
            SIGN IN
          </button>
        </div>
        <div>
          <label />
          <div className="center">
            New Hooman User?{''} {/* redirect to last screen */}
            <Link className="orange" to={`/register?redirect=${redirect}`}>
            Create Your Account Here!
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}