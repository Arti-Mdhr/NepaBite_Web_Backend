import UserModel from "../models/user.model"; // your mongoose User model
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret"; // put in .env

export class UserService {
  // REGISTER USER
  async register(email: string, password: string) {
    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      const error: any = new Error("User already exists");
      error.statusCode = 400;
      throw error;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await UserModel.create({
      email,
      password: hashedPassword,
      role: "user", // default role
    });

    // Return user data without password
    const { _id, role } = newUser;
    return { _id, email, role };
  }

  // LOGIN USER
  async login(email: string, password: string) {
    // Find user
    const user = await UserModel.findOne({ email });
    if (!user) {
      const error: any = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error: any = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Return user data and token
    const { _id, role } = user;
    return {
      user: { _id, email: user.email, role },
      token,
    };
  }
}
