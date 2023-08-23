/* eslint-disable react/prop-types */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Storage } from '../lib/util';
import { TODO_LIST_MOCK } from '../lib/mockData/mock';

const StoreContext = createContext();
const StoreProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    // Get the data from localStorage on page load
    const data = Storage.get('todoList');
    if (data) {
      setTodos(data);
    } else {
      setTodos([...TODO_LIST_MOCK]);
      Storage.set('todoList', [...TODO_LIST_MOCK]);
    }
  }, []);
  // delete todo item
  const deleteTodo = (catId, taskId) => {
    // first find the category item and then find the task item and then delete
    const newTodos = todos.map((category) => {
      if (category.id === catId) {
        return {
          ...category,
          tasks: category.tasks.filter((task) => task.id !== taskId),
        };
      }
      return category;
    });
    setTodos(newTodos);
    Storage.set('todoList', newTodos);
  };
  // add todo item
  const addTodo = (catId, newTask) => {
    // first find the category item and add to first list
    const newTodos = todos.map((category) => {
      if (category.id === catId) {
        return {
          ...category,
          tasks: [...category.tasks, newTask],
        };
      }
      return category;
    });
    setTodos(newTodos);
    Storage.set('todoList', newTodos);
  };
  // update todo item
  const updateTodo = (catId, taskId, text) => {
    // first find the category item and then find the task item and then update
    const newTodos = todos.map((category) => {
      if (category.id === catId) {
        return {
          ...category,
          tasks: category.tasks.map((task) => {
            if (task.id === taskId) {
              return {
                ...task,
                text: text,
              };
            }
            return task;
          }),
        };
      }
      return category;
    });
    setTodos(newTodos);
    Storage.set('todoList', newTodos);
  };
  return (
    <StoreContext.Provider
      value={{
        todos,
        addTodo,
        deleteTodo,
        updateTodo,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
export default StoreProvider;
