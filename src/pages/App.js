import React from 'react';
import Header from '../components/Header';
import TodoForm from '../components/todoForm/todoForm';

const App = () => {
  return (
    <div className="container">
      <Header />
      <TodoForm />
    </div>
  );
};

export default App;
