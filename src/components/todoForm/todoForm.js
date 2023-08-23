import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useStore } from '../../contexts/StoreContext';
import { colorPollet } from './todoForm.types';
import TodoItem from '../todoItem/todoItem';
import './todoForm.styles.css';
import { generateRandomNumber } from '../../lib/util/Generator';
import { Storage } from '../../lib/util';

//todo: move to icons folder in assets
export const PlusSVG = ({ color, ...other }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none" {...other}>
    <rect x="5.14282" width="1.71429" height="12" rx="0.857143" fill={color} />
    <rect y="6.85714" width="1.71429" height="12" rx="0.857143" transform="rotate(-90 0 6.85714)" fill={color} />
  </svg>
);
function TodoForm() {
  const item = useRef();
  const { todos, addTodo, deleteTodo, updateTodo } = useStore();
  const [list, setList] = useState([]);

  const [state, setState] = useState({
    dragging: false,
    dragEnter: false,
    isSaveingToLocalStorage: false,
  });

  useEffect(() => {
    if(todos.length === 0) return;
    setList(todos);
    setState((prev) => ({ ...prev, isSaveingToLocalStorage: false }));
    Storage.set('todoList', [...todos]);
  }, [todos, state.isSaveingToLocalStorage]);

  // function handleDragStart(e, params) {
  const handleDragStart = useCallback((e, params) => {
    item.current = params;
    setState((prev) => ({ ...prev, dragging: true }));
    e.target.addEventListener('dragend', handleDragEnd);
  }, []);

  const handleDragEnter = useCallback(
    (params) => {
      const draged = item.current;
      const newList = [...list];
      const replaceItem = newList[draged.catId].tasks.splice(draged.taskId, 1);
      newList[params.catId].tasks.splice(params.taskId, 0, ...replaceItem);
      item.current = params;
      setState((prev) => ({ ...prev, dragEnter: true }));
    },
    [list]
  );

  const handleDragEnd = () => {
    item.current = undefined;
    setState({ dragging: false, dragEnter: false, isSaveingToLocalStorage: true });
  };

  const handleStyle = useCallback((params) => {
    const draged = item.current;
    return draged.catId === params.catId && draged.taskId === params.taskId ? ' drag-bg tasks ' : ' tasks ';
  }, []);

  const { dragging, dragEnter } = state;

  return (
    <div className="board-wrap mt-46">
      {Array.isArray(list) ? (
        list.map((cat, catIndex) => {
          return (
            <div
              key={`cat-id-${catIndex}`}
              onDragEnter={!cat.tasks.length ? () => handleDragEnter({ catId: catIndex, taskId: 0 }) : null}
            >
              <div className="category">
                <div className={`category-card-wrap ${colorPollet[catIndex].backgroundColor}`}>
                  <div className={`category-card-title flex justify-between items-center`}>
                    <div className={colorPollet[catIndex].titleColor}>{cat.title}</div>
                    <div className={colorPollet[catIndex].countColor}>task {cat.tasks.length}</div>
                  </div>
                  <div className="tasks-wrap">
                    {cat.tasks.map((task, taskIndex) => {
                      return (
                        <TodoItem
                          key={`task-id-${taskIndex}`}
                          className={
                            dragging && dragEnter ? handleStyle({ catId: catIndex, taskId: taskIndex }) : ' tasks '
                          }
                          onDragStart={(e) => handleDragStart(e, { catId: catIndex, taskId: taskIndex })}
                          onDragEnter={() => handleDragEnter({ catId: catIndex, taskId: taskIndex })}
                          onChangeText={(text) => updateTodo(cat.id, task.id, text)}
                          onDelete={() => deleteTodo(cat.id, task.id)}
                          task={task}
                          isReadOnlyTask={cat.id === 3}
                        />
                      );
                    })}
                  </div>
                  {cat.id !== 3 ? (
                    <div
                      className="add-task"
                      onClick={() => addTodo(cat.id, { id: generateRandomNumber(999), text: 'new task' })}
                    >
                      <PlusSVG color={colorPollet[catIndex].newBtnColor} />
                      <div style={{ color: colorPollet[catIndex].newBtnColor, marginLeft: '8px' }}>New</div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div></div>
      )}
    </div>
  );
}
export default TodoForm;
