// controllers/taskController.js
const Task = require('../models/Task');

const createTask = async (req, res) => {
  try {
    const task = await Task.create({ ...req.body, user: req.user._id });
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: 'Task creation failed' });
  }
};

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id });
    res.json(tasks);
  } catch (error) {
    res.status(400).json({ message: 'Fetching tasks failed' });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: 'Task update failed' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    await task.remove();
    res.json({ message: 'Task removed' });
  } catch (error) {
    res.status(400).json({ message: 'Task deletion failed' });
  }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };
