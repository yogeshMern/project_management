const Task = require("../models/taskModel");

exports.createTask = async (req, res) => {
  try {
    const { title, description, status, dueDate, project } = req.body;

    const task = await Task.create({
      title,
      description,
      status,
      dueDate,
      project,
      user: req.user.id,
    });

    res.status(201).json({ message: "Task created", task });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating task", error: err.message });
  }
};

exports.getTasksByProject = async (req, res) => {
  const { projectId } = req.params;

  try {
    const tasks = await Task.find({ project: projectId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};


exports.updateTask = async (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body;

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { title, description, status, dueDate },
      { new: true }
    );

    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ message: "Task updated", task });
  } catch (err) {
    res.status(500).json({ message: "Error updating task", error: err });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting task", error: err });
  }
};
