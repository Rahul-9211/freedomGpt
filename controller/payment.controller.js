export const InitiatePayment = asyncHandler(async (req, res) => {
  const { currency, amount, packageName } = req.body;

  if (!currency || !amount || !packageName) {
    return res.status(400).json({ error: "Currency, amount, and package name are required" });
  }

  // Determine the number of credits based on the selected package
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
      return_url: "https://freedomgpt-xn47.onrender.com/v1/success",
      cancel_url: "https://freedomgpt-xn47.onrender.com/v1/cancel",
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

    const userPayment = await Payment.create({
      user: req.user._id,
      transactionId: payment.id,
      amount: amount,
      currency: currency,
      paymentType: "paypal",
      credits: credits, // Store the credits as part of the payment
    });

    return res.status(200).json(new ApiResponse(200, payment, "Payment"));
  } catch (error) {
    console.log(error);
    return res.status(500).json(new ApiError(500, error.message));
  }
});

export const SuccessPayment = asyncHandler(async (req, res) => {
  const payerID = req.query.payerID;
  const paymentId = req.query.paymentId;
  const payment = await Payment.findOne({ transactionId: paymentId });

  if (!payment) {
    return res.redirect("https://freedomgpt-xn47.onrender.com/v1/cancel");
  }

  const executePaymentJson = {
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

  paypal.payment.execute(paymentId, executePaymentJson, async function (error, paymentData) {
    if (error) {
      return res.redirect("https://freedomgpt-xn47.onrender.com/v1/cancel");
    } else {
      payment.status = "Success";
      await payment.save();

      const user = await User.findById(req.user._id);
      user.credit += payment.credits; // Add the credits to the user's account
      await user.save();

      return res.send("Payment Successful. Credits Added.");
    }
  });
});
