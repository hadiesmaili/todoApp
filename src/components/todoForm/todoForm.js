import React, { useRef, useState } from 'react';
import TodoItem from '../todoItem/todoItem';
import './todoForm.styles.css';

const colorPollet = [
  { backgroundColor: ' todo-col ', titleColor: 'todo-col-title' },
  { backgroundColor: ' doing-col ', titleColor: 'doing-col-title' },
  { backgroundColor: ' done-col ', titleColor: 'done-col-title' },
];

function TodoForm() {
  const item = useRef();
  const data = localStorage.getItem('todoList') ? JSON.parse(localStorage.getItem('todoList')) : [];
  const [state, setState] = useState({
    list: data,
    dragging: false,
    dragEnter: false,
  });

  function handleDragStart(e, params) {
    item.current = params;
    setState((prev) => ({ ...prev, dragging: true }));
    e.target.addEventListener('dragend', () => handleDragEnd());
  }

  function handleDragEnter(params) {
    const draged = item.current;
    var newList = state.list;
    newList[params.catId].tasks.splice(params.taskId, 0, newList[draged.catId].tasks.splice(draged.taskId, 1));
    item.current = params;
    setState((prev) => ({ ...prev, dragEnter: true }));
  }
  function handleDragEnd() {
    item.current = null;
    setState((prev) => ({ ...prev, dragging: false, dragEnter: false }));
  }
  function handleOnChangeText(catId, taskId, text) {
    const newList = state.list;
    const task = newList.find((i) => i.id === catId);
    if (task) {
      task.tasks[taskId] = text;
    }
    setState((prev) => ({ ...prev, list: [...newList] }));
    localStorage.setItem('todoList', JSON.stringify([...newList]));
  }

  function handleStyle(params) {
    const draged = item.current;
    if (draged.catId === params.catId && draged.taskId === params.taskId) {
      return 'drag-bg tasks';
    } else {
      return 'tasks';
    }
  }
  var { dragging, dragEnter, list = [] } = state;

  return (
    <div className="board-wrap mt-46">
      {list.map((cat, catId) => {
        return (
          <div key={catId} onDragEnter={!cat.tasks.length ? () => handleDragEnter({ catId, taskId: 0 }) : null}>
            <div className="category">
              <div className={`category-card-wrap ${colorPollet[catId].backgroundColor}`}>
                <div className={`category-card-title ${colorPollet[catId].titleColor}`}>{cat.title}</div>
                <div className="tasks-wrap">
                  {cat.tasks.map((task, taskId) => (
                    <TodoItem
                      key={taskId}
                      className={dragging && dragEnter ? handleStyle({ catId, taskId }) : 'tasks'}
                      onDragStart={(e) => handleDragStart(e, { catId, taskId })}
                      onDragEnter={() => handleDragEnter({ catId, taskId })}
                      task={task}
                      onChangeText={(text) => handleOnChangeText(cat.id, taskId, text)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
export default TodoForm;
