const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Invalid file type"));
  }
});

// Create uploads directory if it doesn't exist
const fs = require("fs");
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

// In-memory task storage
let tasks = [];

// File upload endpoint
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.json({ 
    url: `http://localhost:4000/uploads/${req.file.filename}`,
    name: req.file.originalname,
    size: req.file.size
  });
});

// WebSocket events
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Send all tasks to newly connected client
  socket.emit("sync:tasks", tasks);

  // Create new task
  socket.on("task:create", (task) => {
    const newTask = {
      id: task.id || Date.now(),
      title: task.title || "New Task",
      description: task.description || "",
      status: task.status || "todo",
      priority: task.priority || "Medium",
      category: task.category || "Feature",
      attachments: task.attachments || [],
      createdAt: new Date().toISOString()
    };
    tasks.push(newTask);
    io.emit("sync:tasks", tasks);
    console.log("Task created:", newTask.id);
  });

  // Update task
  socket.on("task:update", (updatedTask) => {
    tasks = tasks.map(t =>
      t.id === updatedTask.id ? { ...t, ...updatedTask } : t
    );
    io.emit("sync:tasks", tasks);
    console.log("Task updated:", updatedTask.id);
  });

  // Move task between columns
  socket.on("task:move", ({ taskId, newStatus }) => {
    tasks = tasks.map(t =>
      t.id === taskId ? { ...t, status: newStatus } : t
    );
    io.emit("sync:tasks", tasks);
    console.log("Task moved:", taskId, "to", newStatus);
  });

  // Delete task
  socket.on("task:delete", (id) => {
    tasks = tasks.filter(t => t.id !== id);
    io.emit("sync:tasks", tasks);
    console.log("Task deleted:", id);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

server.listen(4000, () => {
  console.log("Backend running on http://localhost:4000");
});
