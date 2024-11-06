import UserModel from "../Models/Users.js";
import Auth from "../Common/Auth.js";

const addToFavorites = async (req, res) => {
  const userId = req.params.id;
  const { storeId } = req.body;

  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Check if the store is already in favorites
    if (user.favorites.includes(storeId)) {
      return res.status(400).send({ message: "Store is already in favorites" });
    }

    // Add storeId to favorites array
    user.favorites.push(storeId);
    await user.save();

    res
      .status(200)
      .send({
        message: "Store added to favorites successfully",
        favorites: user.favorites,
      });
  } catch (error) {
    console.error("Error adding to favorites:", error);
    res
      .status(500)
      .send({ message: "Error adding to favorites", error: error.message });
  }
};

const removeFromFavorites = async (req, res) => {
  const userId = req.params.id;
  const { storeId } = req.body;

  try {
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { $pull: { favorites: storeId } }, // Removes the storeId from favorites
      { new: true }
    );

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    res.status(200).send({
      message: "Store removed from favorites successfully",
      favorites: user.favorites,
    });
  } catch (error) {
    console.error("Error removing from favorites:", error);
    res.status(500).send({
      message: "Error removing from favorites",
      error: error.message,
    });
  }
};

const getUserFavorites = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await UserModel.findById(userId).populate("favorites");

    if (!user || user.favorites.length === 0) {
      return res.status(404).send({ message: "No favorites found" });
    }

    res.status(200).send({
      message: "Favorites fetched successfully",
      favorites: user.favorites,
    });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).send({
      message: "Error fetching favorites",
      error: error.message,
    });
  }
};

const createUser = async (req, res) => {
  try {
    const { email, password, userName, fullName } = req.body;
    const existingUser = await UserModel.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).send({ message: `User ${email} already exists` });
    }

    // Create the new user if not found
    const hashedPassword = await Auth.hashPassword(password);
    const newUser = await UserModel.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      userName,
      fullName,
      favorites: [],
    });

    res.status(201).send({ message: "Account created successfully", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res
      .status(500)
      .send({ message: "Internal server error", error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { userName, fullName, password } = req.body;
    const updates = { userName, fullName };

    // Hash password if it's updated
    if (password) {
      updates.password = await Auth.hashPassword(password);
    }

    const updatedUser = await UserModel.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedUser) {
      return res.status(404).send({ message: "User not found" });
    }

    res.status(200).send({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send({ message: "Internal server error", error: error.message });
  }
};


const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await UserModel.findOne({ email: email.toLowerCase() });
    if (user) {
      let hashCompare = await Auth.hashCompare(password, user.password);
      if (hashCompare) {
        let token = await Auth.createToken({
          id: user._id,
          fullName: user.fullName,
          userName: user.userName,
          email: user.email,
          role: user.role,
        });
        res.status(200).send({ message: "Login successfull", token });
      } else {
        res.status(400).send({ message: "Invalid Password" });
      }
    } else
      res.status(400).send({ message: `user ${req.body.email} Not Exists` });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Internal Server error", error: error.message });
  }
};

const Logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const user = await UserModel.findOne(
      { email: req.body.email },
      { password: 0 }
    );
    if (user) {
      const token = await Auth.createToken({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        id: user._id,
      });
      const resetUrl = `https://localhost:8000/reset-password/${token}`;
      const emailContent = {
        to: user.email,
        subject: "Reset Password Request",
        text: `Dear ${user.firstName},\n\nWe received a request to reset your password. Click the link below to reset your password:\n\n${resetUrl}`,
        html: `<p>Dear ${user.firstName},</p><p>We received a request to reset your password. Click the link below to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
      };
      await emailService.sendMail(emailContent);

      res.status(200).send({
        message: "The password reset link has been sent to your email.",
      });
    } else {
      res.status(400).send({
        message: "User not found. Please enter a registered email address.",
      });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "Internal Server error", error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    let token = req.headers.authorization?.split(" ")[1];
    let data = await Auth.decodeToken(token);
    if (req.body.newpassword === req.body.confirmpassword) {
      let user = await UserModel.findOne({ email: data.email });
      user.password = await Auth.hashPassword(req.body.newpassword);
      await user.save();

      res.status(200).send({
        message: "Password Updated Successfully",
      });
    } else {
      res.status(400).send({
        message: "Password Does Not match",
      });
    }
  } catch (error) {
    res.status(401).send({
      message: "Invalid or expired token",
    });
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export default {
  createUser,
  Login,
  Logout,
  addToFavorites,
  removeFromFavorites,
  getUserFavorites,
  forgotPassword,
  resetPassword,
  updateUser,
};
