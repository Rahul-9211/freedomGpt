// import { payment } from "paypal-rest-sdk";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import paypal from "paypal-rest-sdk";
import Payment from "../model/payment.model.js";
import User from "../model/user.model.js"
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
  let credits = 0;
  switch (packageName) {
    case "Plan 5":
      if (amount === "5") credits = 500;
      break;
    case "Plan 10":
      if (amount === "10") credits = 1000;
      break;
    case "Plan 30":
      if (amount === "30") credits = 5000;
      break;
    default:
      return res.status(400).json({ error: "Invalid package name" });
  }


  const createPaymentJson = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: "https://free.1stgpt.ai/v1/success",
      cancel_url: "https://free.1stgpt.ai/v1/cancel",
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
    // console.log(req.user);
    // console.log(payment.id);
    // console.log("68");
    const userPayment = await Payment.create({
      user: req.user._id,
      transactionId: payment.id,
      amount: amount,
      currency: currency,
      paymentType: "paypal",
      credits: credits
    });
    // console.log(userPayment);
    return res.status(200).json(new ApiResponse(200, payment, "Payment"));
  } catch (error) {
    console.log(error);
    return res.status(500).json(new ApiError(500, error.message));
  }
});

export const SuccessPayment = asyncHandler(async (req, res) => {
  // console.log(req.query,85);
  // console.log(req.query);
  const payerID = req.query.PayerID;
  const paymentId = req.query.paymentId;
  // console.log(paymentId);
  // console.log(payerID);
  const payment = await Payment.findOne({
    transactionId: paymentId,
  });
  // console.log(payment)
  // console.log("working");
  // console.log(payment);
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
  // https://free.1stgpt.ai/v1/cancel
  paypal.payment.execute(
    paymentId,
    express_checkout_json,
    async function (error, payment) {
      // console.log(paymentId);
      console.log(payment);
      if (error) {
        console.log(error);
        return res.redirect("https://free.1stgpt.ai/v1/cancel");
      } else {
        const response = JSON.stringify(payment);
        console.log("working11");
        const ParsedResponse = JSON.parse(response);
        const payment1 = await Payment.findOne({
          transactionId: payment.id,
        });
        payment1.status = "Success";
        await payment1.save();
        // req.user._id = "66dff0a798ccdf10394c3a61";
        // const userId = mongoose.Types.ObjectId(req.user._id);
        const user = await User.findById(payment1.user);
        console.log(user);
        
        user.credit += payment1.credits;
        await user.save();

        return res.send("Success");
      }
    }
  );
});

export const CancelPayment = asyncHandler(async (req, res) => {
  return res.send("payment failed");
});
