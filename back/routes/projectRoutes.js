const express = require("express");
const {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

router.post("/project/add", authMiddleware, createProject);
router.get("/projects", authMiddleware, getProjects);
router.put("/project/edit/:id", authMiddleware, updateProject);
router.delete("/project/remove/:id", authMiddleware, deleteProject);

module.exports = router;
