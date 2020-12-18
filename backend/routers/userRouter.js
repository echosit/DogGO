import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import data from '../data.js';
import User from '../models/userModel.js';
import { generateToken, isAuth } from '../utils.js';

const userRouter = express.Router();

userRouter.get(
  '/seed',
  expressAsyncHandler(async (req, res) => {
    // await User.remove({});
    const createdUsers = await User.insertMany(data.users);
    res.send({ createdUsers });
  })
);

userRouter.post(
    '/signin',
    expressAsyncHandler(async (req, res) => {
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          res.send({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user),
          });
          return;
        }
      }
      res.status(401).send({ message: 'Invalid email or password' });
    })
  );

{/* Create API to register user */}
userRouter.post(
    '/register', 
    expressAsyncHandler(async (req, res) => {
  {/* Create new user */}
      const user = new User({ 
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8 ), 
      });
  
      const createdUser = await user.save(); {/* Create new user and saved to createdUser */}
      {/* Data to send back to frontend */}
      res.send({ 
        _id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        isAdmin: createdUser.isAdmin,
        token: generateToken(createdUser),
      });
    })
  );

  //router for user details
userRouter.get(
    '/:id',
    expressAsyncHandler(async (req, res) => {
      const user = await User.findById(req.params.id); //get user from user model
      if (user) {
        res.send(user);
      } else {
        res.status(404).send({ message: 'User Not Found' }); //error
      }
    })
  );
  
  userRouter.put(
    '/profile',
    isAuth,
    expressAsyncHandler(async (req, res) => {
      const user = await User.findById(req.user._id); //get user from database
  //if user exists update user info
      if (user) {
        user.name = req.body.name || user.name; //if user enter empty name, then it will just name from database
        user.email = req.body.email || user.email;
  //if user password is changed, encrypt password
        if (req.body.password) {
          user.password = bcrypt.hashSync(req.body.password, 8);
        }
        const updatedUser = await user.save(); //save updated user
  //send user info to frontend
        res.send({
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          isAdmin: updatedUser.isAdmin,
          token: generateToken(updatedUser),
        });
      }
    })
  );
export default userRouter;