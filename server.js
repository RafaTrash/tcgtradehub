import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcrypt";

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB using the MONGO_URI environment variable
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String, // In production, hash passwords!
});

const User = mongoose.model("User", userSchema);

// Registration endpoint
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "User registered!" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login endpoint
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    // Optionally, generate a JWT here for authentication
    res.json({ message: "Login successful", user: { name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Profile update endpoint
app.put("/api/profile", async (req, res) => {
  try {
    const { email, name, avatar } = req.body;
    // Find user by email and update (add authentication in production!)
    const user = await User.findOneAndUpdate(
      { email },
      { name, avatar },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "Profile updated", user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// New: Cards schema
const cardSchema = new mongoose.Schema({
  title: String,
  description: String,
  imageUrl: String,
});

const Card = mongoose.model("Card", cardSchema);

// New: Get cards endpoint
app.get("/api/cards", async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = { name: { $regex: search, $options: "i" } };
    }
    const cards = await Card.find(query);
    res.json(cards);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar cartas" });
  }
});

app.listen(4000, () => {
  console.log("Backend running on http://localhost:4000");
});