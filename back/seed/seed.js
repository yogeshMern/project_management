const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const User = require("../models/userModel");
const Project = require("../models/projectModel");
const Task = require("../models/taskModel");

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI || "");

  await User.deleteMany({});
  await Project.deleteMany({});
  await Task.deleteMany({});

  const hashedPassword = await bcrypt.hash("Test@123", 10);

  const user = await User.create({
    name: "Test User",
    email: "test@example.com",
    password: hashedPassword,
  });

  const projects = await Project.insertMany([
    {
      title: "Project 1",
      description: "Desc 1",
      status: "active",
      user: user._id,
    },
    {
      title: "Project 2",
      description: "Desc 2",
      status: "completed",
      user: user._id,
    },
  ]);

  for (const project of projects) {
    await Task.insertMany([
      {
        title: "Task 1",
        description: "Task 1 Desc",
        status: "todo",
        dueDate: new Date(),
        project: project._id,
        user: user._id,
      },
      {
        title: "Task 2",
        description: "Task 2 Desc",
        status: "in-progress",
        dueDate: new Date(),
        project: project._id,
        user: user._id, 
      },
      {
        title: "Task 3",
        description: "Task 3 Desc",
        status: "done",
        dueDate: new Date(),
        project: project._id,
        user: user._id, 
      },
    ]);
  }

  console.log("✅ Seed data inserted successfully.");
  process.exit();
};

seed().catch((err) => {
  console.error("❌ Seed error:", err);
  process.exit(1);
});
