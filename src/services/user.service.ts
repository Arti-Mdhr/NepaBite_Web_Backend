
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto";

import { RegisterUserDTO, EditUserDTO } from "../dtos/user.dto";
import { IUser, UserModel } from "../models/user.model";
import {
  UserRepository,
  UserRepositoryInterface,
} from "../repositories/user.repository";

import mongoose from "mongoose";
import { sendResetEmail } from "../utils/email";

const userRepository: UserRepositoryInterface = new UserRepository();
dotenv.config();

export class UserService {

  // 🔒 Remove password + __v before sending user to frontend
  private sanitizeUser(user: IUser) {
    const userObj = user.toObject();
    const { password, __v, ...safeUser } = userObj;
    return safeUser;
  }

  // ==============================
  // REGISTER USER
  // ==============================
  async createUser(data: RegisterUserDTO) {
    const existingUser = await userRepository.getUserByEmail(data.email);

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const userToCreate = {
      fullName: data.fullName,
      email: data.email.toLowerCase(),
      password: hashedPassword,
      phoneNumber: data.phoneNumber,
      address: data.address,
    };

    const user = await userRepository.createUser(userToCreate);
    return this.sanitizeUser(user);
  }

  // ==============================
  // LOGIN USER
  // ==============================
  async loginUser(email: string, password: string) {

    const user = await userRepository.getUserByEmail(email);

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const userWithPassword = await userRepository.getUserWithPassword(
      user._id.toString()
    );

    if (!userWithPassword) {
      throw new Error("Authentication failed");
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      userWithPassword.password
    );

    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
      {
        id: user._id.toString(),
        role: user.role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    const safeUser = this.sanitizeUser(user);

    return { token, user: safeUser };
  }

  // ==============================
  // FORGOT PASSWORD
  // ==============================
  async forgotPassword(email: string) {

    const user = await UserModel.findOne({ email });

    if (!user) {
      throw new Error("User not found");
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    await user.save();

    const resetLink =
      `${process.env.FRONTEND_URL}/reset-password/${token}`;

    await sendResetEmail(user.email, resetLink);

    return { message: "Reset email sent" };
  }

  // ==============================
  // UPDATE USER
  // ==============================
  async updateUser(userId: string, data: EditUserDTO) {

    const user = await userRepository.getUserById(userId);

    if (!user) throw new Error("User not found");

    if (data.email) {
      const existingUser = await userRepository.getUserByEmail(data.email);

      if (existingUser && existingUser._id.toString() !== userId) {
        throw new Error("Email already in use");
      }
    }

    const updatedUser = await userRepository.updateUser(userId, data);

    if (!updatedUser) throw new Error("Failed to update user");

    return this.sanitizeUser(updatedUser);
  }

  // ==============================
  // GET USERS
  // ==============================
  async getAllUsers(page: number = 1, limit: number = 10) {

    const skip = (page - 1) * limit;

    const users = await userRepository.getAllUsers(skip, limit);

    return users.map((user) => this.sanitizeUser(user));
  }

  async getUserById(userId: string) {

    const user = await userRepository.getUserById(userId);

    if (!user) throw new Error("User not found");

    return this.sanitizeUser(user);
  }

  // ==============================
  // DELETE USER
  // ==============================
  async deleteUser(userId: string) {

    const user = await userRepository.getUserById(userId);

    if (!user) throw new Error("User not found");

    await userRepository.deleteUser(userId);

    return { message: "User deleted successfully" };
  }

  // ==============================
  // ADMIN CREATE USER
  // ==============================
  async adminCreateUser(data: any) {

    const existing = await userRepository.getUserByEmail(data.email);

    if (existing) throw new Error("Email already exists");

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await userRepository.createUser({
      fullName: data.name || data.fullName,
      email: data.email,
      password: hashedPassword,
      role: data.role || "user",
      image: data.image,
    });

    return this.sanitizeUser(user);
  }

  // ====================================================
  // SAVED RECIPES SECTION
  // ====================================================

  async saveRecipeToUser(userId: string, recipeId: string) {

    if (!mongoose.Types.ObjectId.isValid(recipeId)) {
      throw new Error("Invalid recipe id");
    }

    await UserModel.findByIdAndUpdate(
      userId,
      { $addToSet: { savedRecipes: new mongoose.Types.ObjectId(recipeId) } },
      { new: true }
    );

    return this.getSavedRecipes(userId);
  }

  async removeSavedRecipe(userId: string, recipeId: string) {

    if (!mongoose.Types.ObjectId.isValid(recipeId)) {
      throw new Error("Invalid recipe id");
    }

    await UserModel.findByIdAndUpdate(
      userId,
      { $pull: { savedRecipes: new mongoose.Types.ObjectId(recipeId) } },
      { new: true }
    );

    return this.getSavedRecipes(userId);
  }

  async getSavedRecipes(userId: string) {

    const user = await UserModel.findById(userId).populate({
      path: "savedRecipes",
      model: "Recipe",
    });

    if (!user) throw new Error("User not found");

    return user.savedRecipes;
  }


  async resetPassword(token: string, newPassword: string) {

  const user = await UserModel.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: new Date() }
  });

  if (!user) {
    throw new Error("Invalid or expired token");
  }

  const hashed = await bcrypt.hash(newPassword, 10);

  user.password = hashed;
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;

  await user.save();

  return { message: "Password updated successfully" };
}

}