// import { payment } from "paypal-rest-sdk";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import paypal from "paypal-rest-sdk";
import Payment from "../model/payment.model.js";
// import asyncHandler from 'express-async-handler';

const createPayPalPayment = (createPaymentJson) => {
  return new Promise((resolve, reject) => {
    paypal.payment.create(createPaymentJson, function (error, payment) {
      if (error) {
        return reject(error);
      }
      return resolve(payment);
    });
  });
};

export const InitiatePayment = asyncHandler(async (req, res) => {
  const { currency, amount, packageName } = req.body;

  if (!currency || !amount) {
    return res.status(400).json({ error: "Currency and amount are required" });
  }

  const createPaymentJson = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: "http://localhost:3000/v1/success",
      cancel_url: "http://localhost:3000/v1/cancel",
    },
    transactions: [
      {
        amount: {
          currency: currency,
          total: amount,
        },
        description: packageName,
      },
    ],
  };

  try {
    const payment = await createPayPalPayment(createPaymentJson);
    // console.log(payment);
    console.log(req.user);

    const userPayment = await Payment.create({
      user: req.user._id,
      transactionId: payment.id,
      amount: amount,
      currency: currency,
      paymentType: "paypal",
    });

    return res.status(200).json(new ApiResponse(200, payment, "Payment"));
  } catch (error) {
    console.log(error);
    return res.status(500).json(new ApiError(500, error.message));
  }
});

export const SuccessPayment = asyncHandler(async (req, res) => {
  console.log(req.query);
  const payerID = req.query.payerID;
  const paymentId = req.query.paymentId;
  const payment = await PayPal.find({
    transactionId: paymentId,
  });
  const express_checkout_json = {
    payer_id: payerID,
    transactions: [
      {
        amount: {
          currency: payment.currency,
          total: payment.amount,
        },
      },
    ],
  };
  paypal.payment.execute(
    paymentId,
    express_checkout_json,
    async function (error, payment) {
      if (error) {
        return res.redirect("http://localhost:3000/v1/cancel");
      } else {
        const response = JSON.stringify(payment);
        const ParsedResponse = JSON.parse(response);
        payment.status = "Success";
        await payment.save();
        const user = await User.findById(req.user._id);
        user.credit += 50;
        await user.save();

        return res.send("Success");
      }
    }
  );
});

export const CancelPayment = asyncHandler(async (req, res) => {
  return res.send("payment failed");
});
