import React, { useEffect } from 'react';
import Header from '../components/Header';
import TodoForm from '../components/todoForm/todoForm';
import { TODO_LIST_MOCK } from '../lib/mockData/mock';

const App = () => {
  // todo: save mock data to local storage
  useEffect(() => {
    if (localStorage.getItem('todoList') === null) {
      localStorage.setItem('todoList', JSON.stringify([...TODO_LIST_MOCK]));
    }
  }, []);

  return (
    <div className="container">
      <Header />
      <TodoForm />
    </div>
  );
};

export default App;
