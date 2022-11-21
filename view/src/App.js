import React, { useState, useEffect } from 'react';
import './App.css';
import { getTodos, createTodo, removeTodo } from './util/index';

const App = () => {
  const [todo, setTodo] = useState({
    description: '',
  });
  const [todoList, setTodoList] = useState();
  const [error, setError] = useState();

// Create a fetchTodos() function to update the View from Model using getTodos() function from Controller
const fetchTodos = async () => {
  const res = await getTodos();
  if (res.error) {
    setError(res.error.name);
  }
  setTodoList(res.data);
};
// Create a handleDelete() function to remove to-do list with matching id
const handleDelete = async (id) => {
  try {
    await removeTodo(id);
    fetchTodos();
  }
  catch (err) {
    setError(err);
  }
};

// Create a handleSubmit() function to add new to-do list
const handleSubmit = async (e) => {
  e.preventDefault();
  setError();
  const data = new FormData(e.currentTarget);
  try {
    data.set('description', todo.description);
    data.set('created_at', `${new Date().toISOString()}`);
    const newTodo = await createTodo(data);
    if (newTodo.error) {
      setError(newTodo.error);
    }
    setTodo({ description: ''});
    fetchTodos();
  }  
  catch (err) {
    setError(err);
  }
}

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="App">
      <h1>To-Do List</h1>
      <form onSubmit={(e) => handleSubmit(e)}>
        <input
          type="text"
          value={todo.description}
          onChange={(event) =>
            setTodo({ ...todo, description: event.target.value })
          }
        ></input>
        <button type="submit">Add Todo</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ol>
        {todoList?.map((todoItem) => (
          <li
            key={todoItem.todo_id}
            onClick={() => {
              handleDelete(todoItem.todo_id);
            }}
          >
            {todoItem.description}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default App;
