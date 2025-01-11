import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type: String, required:true, unique:true},
    email: {type: String, required:true, unique:true},
    password: {type: String, required:true},
    verifyOtp: {type: String, default: ''},
    verifyOtpExpireAt: {type: Number, default: 0},
    isAccountVerified: {type: Boolean, default: false},
    resetOtp: {type: String, default: ''},
    resetOtpExpireAt: {type: Number, default: 0},


});

// Above we declare the user schema which will be used to create a new user model. that mean we are creating a new collection in the database.

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

// Above we create a new user model if it doesn't exist. If it exists, we use the existing model.

//now let's export the userModel

export default userModel;