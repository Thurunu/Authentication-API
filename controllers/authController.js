import bcrypt from "bcryptjs"; // Library for hashing passwords securely
import jwt from "jsonwebtoken"; // Library for generating JSON Web Tokens
import userModel from "../models/userModel.js"; // Importing the user model for database operations
import transporter from "../config/nodemailer.js";

// Function to handle user registration
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  // Check if all fields are provided
  if (!name || !email || !password) {
    return res.json({ success: false, message: "All fields are required" });
  }

  try {
    // Check if a user with the given email already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    } else {
      // Hash the password using bcrypt for secure storage
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user document with the provided and hashed data
      const user = new userModel({
        name,
        email,
        password: hashedPassword,
      });
      await user.save(); // Save the user in the database

      // Generate a JSON Web Token (JWT) for the user
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d", // Token validity: 1 day
      });

      // Set the token as a cookie for authentication
      res.cookie("token", token, {
        httpOnly: true, // Prevent client-side JavaScript access
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // Cross-site settings
        maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie validity: 7 days
      });

      // Sending a welcome email to the user
      const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: "Welcome to Mern Auth App",
        tex: `Hello ${name},\n\nWelcome to Mern Auth App! You have successfully registered on our platform.\n\nBest regards,\nMern Auth App Team`,
      };
      await transporter.sendMail(mailOptions);

      // Send a success response
      return res.json({
        success: true,
        message: "User registered successfully",
      });
    }
  } catch (error) {
    console.log(error); // Log any errors for debugging
    res.json({ success: false, message: error.message });
  }
};

// Function to handle user login
export const Login = async (req, res) => {
  const { email, password } = req.body;

  // Check if all fields are provided
  if (!email || !password) {
    return res.json({ success: false, message: "All fields are required" });
  }

  try {
    // Check if the user exists in the database
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    } else {
      // Compare the provided password with the hashed password in the database
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.json({ success: false, message: "Password is incorrect" });
      } else {
        // Generate a new JWT token for the authenticated user
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "1d", // Token validity: 1 day
        });

        // Set the token as a cookie for authentication
        res.cookie("token", token, {
          httpOnly: true, // Prevent client-side JavaScript access
          secure: process.env.NODE_ENV === "production", // Use secure cookies in production
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // Cross-site settings
          maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie validity: 7 days
        });

        // Send a success response
        return res.json({ success: true, message: "Login successful" });
      }
    }
  } catch (error) {
    console.log(error); // Log any errors for debugging
    res.json({ success: false, message: error.message });
  }
};

// Function to handle user logout
export const logout = async (req, res) => {
  try {
    // Clear the authentication token cookie
    res.clearCookie("token", {
      httpOnly: true, // Prevent client-side JavaScript access
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // Cross-site settings
    });

    // Send a success response
    return res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.log(error); // Log any errors for debugging
    res.json({ success: false, message: error.message });
  }
};

// Function for send verfication email
// Function to send an OTP for email verification
export const sendVerifyOtp = async (req, res) => {
  try {
    const { userId } = req.body; // Extract userId from the request body

    // Fetch the user by ID
    const user = await userModel.findById(userId);

    // Check if the user's account is already verified
    if (user.isAccountVerified) {
      return res.status(400).json({
        success: false,
        message: "User account is already verified",
      });
    } else {
      // Generate a 6-digit OTP
      const otp = String(Math.floor(Math.random() * 900000 + 100000));

      // Store the OTP and its expiration time in the database
      user.verifyOtp = otp;
      user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; // OTP valid for 24 hours

      // Save the updated user details
      await user.save();

      // Send the OTP to the user's email address
      const mailOptions = {
        from: process.env.SMTP_USER,
        to: user.email,
        subject: "Verification OTP",
        text: `Your OTP for account verification is ${otp}. It will expire in 24 hours.`,
      };
      await transporter.sendMail(mailOptions);

      // Respond with a success message
      res.status(200).json({ success: true, message: "OTP sent successfully" });
    }
  } catch (error) {
    console.error("Error in sendVerifyOtp:", error); // Log the error for debugging
    res.status(500).json({ success: false, message: error.message }); // Return a server error response
  }
};

// Function to verify the email using the OTP
export const verifyEmail = async (req, res) => {
  const { userId, otp } = req.body; // Extract userId and otp from the request body

  // Check if all required fields are provided
  if (!userId || !otp) {
    return res.status(400).json({ success: false, message: "Missing details" });
  }

  try {
    // Fetch the user by ID
    const user = await userModel.findById(userId);

    // Check if the user exists in the database
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Validate the OTP
    if (!user.verifyOtp || user.verifyOtp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // Check if the OTP has expired
    if (user.verifyOtpExpireAt < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    // Mark the account as verified and clear OTP-related fields
    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = null;

    // Save the updated user details
    await user.save();

    // Respond with a success message
    return res.status(200).json({
      success: true,
      message: "Account verified successfully",
    });
  } catch (error) {
    console.error("Error in verifyEmail:", error); // Log the error for debugging
    res.status(500).json({ success: false, message: error.message }); // Return a server error response
  }
};


/*
Summary of Steps:
Registration:

Validate input fields (name, email, password).
Check if the user already exists in the database using their email.
Hash the password using bcrypt for secure storage.
Save the new user in the database.
Generate a JWT token and set it as an HTTP-only cookie.
Login:

Validate input fields (email, password).
Find the user in the database using their email.
Compare the provided password with the stored hashed password using bcrypt.
If successful, generate a JWT token and set it as an HTTP-only cookie.
Logout:

Clear the authentication token cookie using res.clearCookie.
*/
