import mongoose from "mongoose";


const PaymentSchema = new mongoose.Schema({
  user : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "User"
  },
  transactionId : {
    type : String,
    require : true,
  },
  amount : {
    type : Number,
    },
  paymentType : {
    type : String,
    require : true
  },
  currency : {
    type : String,
  },
  status : {
    type : String,
  }
  ,
  credits : {
    type : Number,
  }
},{
  timestamps : true
})


const Payment = new mongoose.model('Payment',PaymentSchema);

export default Payment;