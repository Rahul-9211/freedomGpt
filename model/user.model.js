import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
  firstname : {
    type: String,
    required: true
  }
  ,
  lastname : {
    type : String,
    required: true
  }
  ,
  email : {
    type : String,
    required : true,
    validate : function (){
      return validator.isEmail(this.email);
    },
    unique : true
  }
  ,
  password : {
    type : String,
    required : true
  }
  ,
  activeStatus : {
    type : Boolean,
    default : false
  }
  ,
  credit : {
    type : Number,
    default : 0
  }
  ,
  username : {
    type : String,
    required : true,
    unique : true
  }
  ,
  deletedAt : {
    type : Date
  }
  ,
  ModificationTimeline: [
    {
      date: {
        type: Date,
        default: Date.now,
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      action: {
        type: String,
        enum: ["deleted", "updated", "created"], // Possible actions
        required: true,
      },
    },
  ],
},
{
  timestamps : true
})

const User = new mongoose.model("User",UserSchema);

UserSchema.pre('save',async (next)=>{
 const hash = await bcrypt.hash(this.password,10);
 this.password=hash;
 next();
})

UserSchema.methods.isPasswordCorrect = async function(password){
  return await bcrypt.compare(password, this.password)
}

export default User;