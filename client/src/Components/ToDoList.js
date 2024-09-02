import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ToDoListImg from './ToDoList/check-list.png';
import { MdDelete, MdEdit } from 'react-icons/md';

const ToDoList = () => {
  const [taskList, setTaskList] = useState([]);
  const [task, setTask] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState('');

  // Fetch tasks from the server
  useEffect(() => {
    axios.get('http://localhost:8080/api/tasks')
      .then(response => setTaskList(response.data))
      .catch(error => console.error('Error fetching tasks:', error));
  }, []);

  // Add a new task
  const inputHandler = () => {
    if (task.trim() !== '') {
      axios.post('http://localhost:8080/api/tasks', { title: task.trim() })
        .then(response => {
          setTaskList([...taskList, response.data]);
          setTask('');
        })
        .catch(error => console.error('Error adding task:', error));
    }
  };

  // Handle Enter key press
  const enterPressHandler = (e, method) => {
    if (e.keyCode === 13) {
      if (method === 'add') {
        inputHandler();
      } else if(method === 'update') {
        updateTask();
      }
    }
  };

  // Delete a task
  const deleteListItem = (id) => {
    axios.delete(`http://localhost:8080/api/tasks/${id}`)
      .then(() => {
        setTaskList(taskList.filter(task => task._id !== id));
      })
      .catch(error => console.error('Error deleting task:', error));
  };

  // Toggle task completion
  const crossOutHandler = (e, id) => {
  // Find the task to update
  const taskToUpdate = taskList.find(task => task._id === id);

  if (taskToUpdate) {
    // Toggle the completed status in the database
    axios.put(`http://localhost:8080/api/tasks/${id}`, { completed: !taskToUpdate.completed })
      .then(response => {
        // Update the task list with the new completed status
        setTaskList(taskList.map(task => task._id === id ? response.data : task));

        // Update the visual appearance (toggle "checked" class based on new status)
        if (!taskToUpdate.completed) {
          e.target.classList.add("checked");
        } else {
          e.target.classList.remove("checked");
        }
      })
      .catch(error => console.error('Error updating task:', error));
  } else {
    console.error('Task not found.');
  }
};


  // Edit a task
  const startEdit = (id, text) => {
    setEditIndex(id);
    setEditText(text);
  };

  const updateTask = () => {
    if (editText.trim() !== '') {
      axios.put(`http://localhost:8080/api/tasks/${editIndex}`, { title: editText })
        .then(response => {
          setTaskList(taskList.map(task => task._id === editIndex ? response.data : task));
          setEditIndex(null);
          setEditText('');
        })
        .catch(error => console.error('Error updating task:', error));
    }
  };

  return (
    <div class="app">
        <div class="todo-app">
            <h2> To Do List <img src={ToDoListImg} alt='To Do List Icon'/></h2>
            <div class="row">
                <input type="text" onChange={(e) => {setTask(e.target.value)}} value={task} onKeyDown={(e) => enterPressHandler(e, 'add')} placeholder="Add your task"/>
                <button type='button' onClick={inputHandler}>Add</button>
            </div>
            {editIndex !== null && (
              <div className="edit-container">
                <input
                  className='editInputField'
                  type="text"
                  value={editText}  
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => enterPressHandler(e, 'update')}
                  placeholder="Edit task"
                />
                <button className='editableBtn' style={{marginRight: '10px'}} onClick={updateTask}>Update</button>
                <button className='editableBtn' onClick={() => setEditIndex(null)}>Cancel</button>
              </div>
            )}
            <ul id="list-container">
                {taskList.map((item) => 
                    <li>
                        <p onClick={(e) => crossOutHandler(e, item._id)} className={item.completed ? 'checked' : ''}
      >{item.title}</p>
                        <span>
                            <MdEdit className='editBtn' onClick={() => startEdit(item._id, item.title)} />
                            <MdDelete className='deleteBtn' onClick={() => deleteListItem(item._id)}></MdDelete>
                        </span>
                    </li>
                )}
            </ul>
        </div>
    </div>
  )
}

export default ToDoList
