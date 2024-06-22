import mongoose from "mongoose";

const TokenSchema = new mongoose.Schema({
  refreshtoken : String,
  loginType : ['GoogleAuth','SimpleLogin'],
  expireAt : Date,
  User : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})



const Token = new mongoose.model('Token',TokenSchema);

export default Token;