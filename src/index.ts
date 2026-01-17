import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/user.route';
import { connectDB } from './database/mongodb';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);

app.get('/', (_, res) => {
  res.send('API running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);


  app.post("/test", (req, res) => {
  res.json({ message: "Test route working" });
});

});

