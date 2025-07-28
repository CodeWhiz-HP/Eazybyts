require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");


const app = express();
app.use(cors());
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const contactRoutes = require("./routes/contact");
const blogRoutes = require("./routes/blogs");
const achievementRoutes = require("./routes/achievements");
const projectRoutes = require("./routes/projects");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const aboutRoutes = require("./routes/about");

app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/users", userRoutes);
app.use("/api/about" , aboutRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
