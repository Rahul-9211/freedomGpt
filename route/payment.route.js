import express from "express";
import paypal from "paypal-rest-sdk";
import { InitiatePayment,SuccessPayment,CancelPayment } from "../controller/payment.controller.js";
import { verifyJWT } from "../utils/verifyJWT.js";
const PaymentRouter = express.Router();

console.log(process.env.PAYPAL_CLIENT);
paypal.configure({
  'mode': 'live',  // live
  'client_id': process.env.PAYPAL_CLIENT,
  'client_secret': process.env.PAYPAL_SECRET
});

PaymentRouter.post('/v1/pay',verifyJWT,InitiatePayment);
PaymentRouter.get('/v1/success',SuccessPayment);
PaymentRouter.get('/v1/cancel',CancelPayment);




export default PaymentRouter;