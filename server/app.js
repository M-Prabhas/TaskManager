const express = require("express");
const mongoose = require("mongoose");
const app=express();

mongoose.connect('mongodb://localhost:27017/TaskDB');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const TaskSchema = new mongoose.Schema({
    title: String,
    description: String,
    dueDate: Date,
    completed: Boolean
  });
  
const Task = mongoose.model('Task', TaskSchema);

  app.get('/api/tasks', async (req, res) => {
    try {
      const tasks = await Task.find();
      res.json(tasks);
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve tasks' });
    }
  });
  
  // Create a new task
  app.post('/api/tasks', async (req, res) => {
    try {
      const task = new Task(req.body);
      const savedTask = await task.save();
      res.json(savedTask);
    } catch (err) {
      res.status(500).json({ error: 'Failed to create task' });
    }
  });
//updates a task based on deadline
  app.put('/api/tasks/:id', async (req, res) => {
    try {
      const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(task);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update task' });
    }
  });
  
  // Delete a task
  app.delete('/api/tasks/:id', async (req, res) => {
    try {
      await Task.findByIdAndRemove(req.params.id);
      res.sendStatus(204);
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete task' });
    }
  });


app.listen(5000, function() {
    console.log("Server started on port 5000");
  });