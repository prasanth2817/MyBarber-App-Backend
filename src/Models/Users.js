import mongoose from "./index.js";

const validateEmail = (email) => {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailPattern.test(email);
};
const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: [true, "Full Name is required"] },
    userName: { type: String, required: [true, "Last Name is required"] },
    email: {
      type: String,
      required: [true, "Email is required"],
      validate: validateEmail,
    },
    password: { type: String, required: [true, "Password is required"] },
    role: { type: String, default: "user" },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Store' }]
  },
  {
    Collection: "Users",
    versionKey: false,
  }
);

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
