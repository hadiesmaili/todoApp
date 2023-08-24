import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useStore } from '../../contexts/StoreContext';
import { colorPollet } from './todoForm.types';
import TodoItem from '../todoItem/todoItem';
import { generateRandomNumber } from '../../lib/util/Generator';
import { Storage } from '../../lib/util';
import { PlusSVG } from '../../assets/icons/icons';
import './todoForm.styles.css';

/**
 * Renders a form for managing todo items.
 */
function TodoForm() {
  // Ref to the currently dragged item
  const item = useRef();
  // Get todos and related functions from the store
  const { todos, addTodo, deleteTodo, updateTodo, doneTodo } = useStore();
  // State for the list of todos
  const [list, setList] = useState([]);

  // State for dragging and saving to local storage
  const [state, setState] = useState({
    dragging: false,
    dragEnter: false,
    isSaveingToLocalStorage: false,
  });
  /**
   * Update the list of todos and save to local storage when todos changes.
   */
  useEffect(() => {
    if (todos.length === 0) return;
    setList(todos);
    setState((prev) => ({ ...prev, isSaveingToLocalStorage: false }));
    Storage.set('todoList', [...todos]);
  }, [todos, state.isSaveingToLocalStorage]);

  /**
   * Handle the drag start event and set the current dragged item.
   */
  const handleDragStart = useCallback((e, params) => {
    item.current = params;
    setState((prev) => ({ ...prev, dragging: true }));
    e.target.addEventListener('dragend', handleDragEnd);
  }, []);

  /**
   * Handle the drag enter event and update the list of todos accordingly.
   */
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

  /**
   * Handle the drag end event and reset the dragging state.
   */
  const handleDragEnd = () => {
    item.current = undefined;
    setState({ dragging: false, dragEnter: false, isSaveingToLocalStorage: true });
  };

  /**
   * Get the appropriate style for the current dragged item.
   */
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
              key={`cat-id-${cat.id}-${catIndex}`}
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
                      if (!task) return <></>;

                      return (
                        <TodoItem
                          key={`task-id-${task.id}-${taskIndex}`}
                          className={
                            dragging && dragEnter ? handleStyle({ catId: catIndex, taskId: taskIndex }) : ' tasks '
                          }
                          onDragStart={(e) => handleDragStart(e, { catId: catIndex, taskId: taskIndex })}
                          onDragEnter={() => handleDragEnter({ catId: catIndex, taskId: taskIndex })}
                          onChangeText={(text) => updateTodo(cat.id, task.id, text)}
                          onDelete={() => deleteTodo(cat.id, task.id)}
                          task={task}
                          isReadOnlyTask={cat.id === 3}
                          onDone={() => doneTodo(cat.id, task.id)}
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
