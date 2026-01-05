import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/user.repository";

export class UserService {
  private repo = new UserRepository();

  // REGISTER USER
  async register(email: string, password: string, role: string = "user") {
    const existing = await this.repo.findByEmail(email);
    if (existing) throw new Error("Email already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    return this.repo.createUser({
      email,
      password: hashedPassword,
      role,
    });
  }

  // LOGIN USER
  async login(email: string, password: string) {
    const user = await this.repo.findByEmail(email);
    if (!user) throw new Error("Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    return { token };
  }
}
