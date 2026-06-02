const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cookieParser = require("cookie-parser");
const http = require("http");
const cors = require("cors");

const { connectToDB } = require("./connect.js");
const userRoutes = require("./routes/user");
const chatRoutes = require("./routes/chat");
const mailerRoutes = require("./routes/mailer");

const app = express();
const httpServer = http.createServer(app);

const allowedOrigins = [
  "http://localhost:5173",
  "https://placedesk.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        return callback(
          new Error("CORS Policy: This origin is not allowed"),
          false,
        );
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (_req, res) => {
  res.send("Placement Desk is Online");
});

app.use("/users", userRoutes);
app.use("/chat", chatRoutes);
app.use("/api/mailer", mailerRoutes);

const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MONGO_URI is not set.");
  process.exit(1);
}

connectToDB(MONGO_URI)
  .then(() => {
    console.log("Connected to Production Database");
    httpServer.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });

module.exports = app;
