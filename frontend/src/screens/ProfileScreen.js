import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { detailsUser, updateUserProfile } from '../actions/userActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants';

export default function ProfileScreen() {
//define name, email, password, confirmPassword state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const userDetails = useSelector((state) => state.userDetails); //get user details from redux store
  const { loading, error, user } = userDetails;
  const userUpdateProfile = useSelector((state) => state.userUpdateProfile); //get userUpdateProfile info from redux store
  const {
    success: successUpdate,
    error: errorUpdate,
    loading: loadingUpdate,
  } = userUpdateProfile; //define variables
  const dispatch = useDispatch();
  useEffect(() => {
 // if user is null, then run details user action
 if (!user) {
    dispatch({ type: USER_UPDATE_PROFILE_RESET });
    dispatch(detailsUser(userInfo._id));
//otherwise fill name and email from backend
  } else {
    setName(user.name);
    setEmail(user.email);
  }
}, [dispatch, userInfo._id, user]);
  const submitHandler = (e) => {
    e.preventDefault();
    // dispatch update profile
    //if password and confirmPassword do not equal, then send alert
    if (password !== confirmPassword) {
        alert('Password and Confirm Password Are Not Matched');
  //otherwise update user profile
      } else {
        dispatch(updateUserProfile({ userId: user._id, name, email, password }));
      }
  };
  return (
    <div>
      <form className="form" onSubmit={submitHandler}>
        <div>
          <div className="title">User Profile</div>
        </div>
{/* if loading, show loadingbox */}
        {loading ? (
          <LoadingBox></LoadingBox>
/* if error, show messagebox */
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
/* otherwise, show form */
          <>
          {/* if loading, show loading box */}
            {loadingUpdate && <LoadingBox></LoadingBox>}
{/* if error, show message box */}
            {errorUpdate && (
              <MessageBox variant="danger">{errorUpdate}</MessageBox>
            )}
{/* else, show success message box */}
            {successUpdate && (
              <MessageBox variant="success">
                Profile Updated Successfully
              </MessageBox>
            )}
            <div>
{/* Name */}
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)} /* to change value of name */
              ></input>
            </div>
{/* Email */}
            <div>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></input>
            </div>
{/* Password */}
            <div>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter Password"
                onChange={(e) => setPassword(e.target.value)}
              ></input>
            </div>
{/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Enter Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              ></input>
            </div>
{/* Update Button */}
            <div>
              <label />
              <button className="primary" type="submit">
                UPDATE
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}