const express = require("express");
const {
  createTask,
  getTasksByProject,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

router.post("/task/add", authMiddleware, createTask);
router.get("/tasks/:projectId", authMiddleware, getTasksByProject);
router.put("/task/edit/:id", authMiddleware, updateTask);
router.delete("/task/remove/:id", authMiddleware, deleteTask);

module.exports = router;
