import { UserModel } from "../models/user.model";

export class UserRepository {
  // Find a user by email
  async findByEmail(email: string) {
    return UserModel.findOne({ email });
  }

  // Create a new user
  async createUser(data: { email: string; password: string; role?: string }) {
    return UserModel.create(data);
  }
}
