import mongoose from "mongoose";
import { connectDB } from "../database/mongodb";

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await mongoose.connection.close();
});