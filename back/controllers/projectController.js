const Project = require("../models/projectModel");

exports.createProject = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const project = await Project.create({
      title,
      description,
      status,
      user: req.user.id,
    });
    res.status(201).json({ message: "Project created", project });
  } catch (err) {
    res.status(500).json({ message: "Error creating project", error: err });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const { search } = req.query;

    const query = { user: req.user.id };

    if (search) {
      query.title = { $regex: search, $options: "i" }; 
    }

    const projects = await Project.find(query);
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ message: "Error fetching projects", error: err });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { title, description, status },
      { new: true }
    );
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.status(200).json({ message: "Project updated", project });
  } catch (err) {
    res.status(500).json({ message: "Error updating project", error: err });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.status(200).json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting project", error: err });
  }
};

