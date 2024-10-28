import mongoose from "./index.js";

const validateEmail = (email) => {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailPattern.test(email);
};
const BusinessUserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: [true, "Full Name is required"] },
    userName: { type: String, required: [true, "User Name is required"] },
    email: {
      type: String,
      required: [true, "Email is required"],
      validate: validateEmail,
    },
    password: { type: String, required: [true, "Password is required"] },
    role: { type: String, default: "BusinessUser" },
  },
  {
    Collection: "BusinessUsers",
    versionKey: false,
  }
);

const BusinessUserModel = mongoose.model("BusinessUser", BusinessUserSchema);

export default BusinessUserModel;
