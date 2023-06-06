import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';


function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '' });
  const [update,setupdate]=useState(false); 

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('https://taskmanagement-nsgp.onrender.com/api/tasks',{ withCredentials: true });
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    }
  };

  const addTask = async () => {
    try {
      const response = await axios.post('https://taskmanagement-nsgp.onrender.com/api/tasks', newTask,{ withCredentials: true });
      setTasks([...tasks, response.data]);
      setNewTask({ title: '', description: '', dueDate: '' });
    } catch (error) {
      console.error('Failed to add task', error);
    }
  };

  const updateTask = async (taskId, updatedTask) => {
    setupdate(true);
    setTimeout(() => {
      setupdate(false);
    }, "1000");
    try {
      const response = await axios.put(`https://taskmanagement-nsgp.onrender.com/api/tasks/${taskId}`, updatedTask,{ withCredentials: true });
      const updatedTasks = tasks.map(task => {
        if (task._id === taskId) {
          return response.data;
        }
        return task;
      });
      setTasks(updatedTasks);
      
    } catch (error) {
      console.error('Failed to update task', error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`https://taskmanagement-nsgp.onrender.com/api/tasks/${taskId}`,{ withCredentials: true });
      const updatedTasks = tasks.filter(task => task._id !== taskId);
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Failed to delete task', error);
    }
  };

  return (
    <div className="container">
      <h1>Task Manager</h1>

      <form className="task-form">
        <input
          type="text"
          placeholder="Title"
          value={newTask.title}
          onChange={e => setNewTask({ ...newTask, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={newTask.description}
          onChange={e => setNewTask({ ...newTask, description: e.target.value })}
        />
        <input
          type="date"
          placeholder="Due Date"
          value={newTask.dueDate}
          onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })}
        />
        <button type="button" onClick={addTask}>Add Task</button>
      </form>
      <ul className="task-list">
        {tasks.map(task => (
          <li key={task._id} className="task-item">
            <div className="task-details">
              <div className="title">{task.title}</div>
              <div className="description">{task.description}</div>
              <div className="due-date">Due: {task.dueDate}</div>
            </div>
            <div className="task-actions">
              {!task.completed && (
                <button onClick={() => updateTask(task._id, { ...task, completed: true })}>{update?"completed":"pending"}</button>
              )}
              <button onClick={() => deleteTask(task._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
