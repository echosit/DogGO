import express from 'express'; //to use express.Router function
import expressAsyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import { isAdmin, isAuth } from '../utils.js';

const orderRouter = express.Router();

orderRouter.get(
    '/',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
      const orders = await Order.find({}).populate('user', 'name');
      res.send(orders);
    })
  );

orderRouter.get(
    '/mine',
    isAuth,
    expressAsyncHandler(async (req, res) => {
      const orders = await Order.find({ user: req.user._id }); //get orders from order model
      res.send(orders); //return orders of current user 
    })
  );

//create API
orderRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
/* to see if there are items or not, error message */
    if (req.body.orderItems.length === 0) {
      res.status(400).send({ message: 'Cart is empty' });
    } else {
/* if order is there, create a new object */
      const order = new Order({
        orderItems: req.body.orderItems,
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod,
        itemsPrice: req.body.itemsPrice,
        shippingPrice: req.body.shippingPrice,
        taxPrice: req.body.taxPrice,
        totalPrice: req.body.totalPrice,
        user: req.user._id, /* user id */
      });
//create order in database
      const createdOrder = await order.save();
      res
        .status(201)
        .send({ message: 'New Order Created', order: createdOrder }); //pass order to frontend
    }
  })
);

//define order details api
orderRouter.get(
    '/:id',
    isAuth, /* only authenticated users can see order details */ 
  /* catch error */
      expressAsyncHandler(async (req, res) => {
  /* get order from database, import order model */ 
      const order = await Order.findById(req.params.id);
  /* if order exists, send it */ 
      if (order) {
        res.send(order);
  /* otherwise, send error message */ 
      } else {
        res.status(404).send({ message: 'Order Not Found' });
      }
    })
  );

//add new route for payment and update status of order based on payment
orderRouter.put(
    '/:id/pay',
    isAuth, /* only logined-in users can make payment */
    expressAsyncHandler(async (req, res) => {
  /* get order info */
      const order = await Order.findById(req.params.id);
  /* if order exists, update! */
      if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
          id: req.body.id,
          status: req.body.status,
          update_time: req.body.update_time,
          email_address: req.body.email_address,
        };
  /* save value of order */
        const updatedOrder = await order.save();
   /* send message */
        res.send({ message: 'Order Paid', order: updatedOrder });
  /* otherwise send error */
      } else {
        res.status(404).send({ message: 'Order Not Found' });
      }
    })
  );

  orderRouter.delete(
    '/:id',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
      const order = await Order.findById(req.params.id);
      if (order) {
        const deleteOrder = await order.remove();
        res.send({ message: 'Order Deleted', order: deleteOrder });
      } else {
        res.status(404).send({ message: 'Order Not Found' });
      }
    })
  );

  orderRouter.put(
    '/:id/deliver',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
      const order = await Order.findById(req.params.id);
      if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
  
        const updatedOrder = await order.save();
        res.send({ message: 'Order Delivered', order: updatedOrder });
      } else {
        res.status(404).send({ message: 'Order Not Found' });
      }
    })
  );
  

export default orderRouter;