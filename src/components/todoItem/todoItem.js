/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { useComponentVisible } from '../../lib/hooks/useComponentVisible';
import { DeleteSVG } from '../../assets/icons/icons';
import { useStore } from '../../contexts/StoreContext';
import { generateRandomNumber } from '../../lib/util/Generator';
import './todoItem.styles.css';

export default function TodoItem(props) {
  const { task, catId, className, onDragStart, onDragEnter, onChangeText, onDelete, onDone } = props || {};
  const [isEditMode, setIsEditMode] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isShowDeleteBtn, setIsShowDeleteBtn] = useState(false);
  const { ref, isComponentVisible } = useComponentVisible(true);
  const { addTodo } = useStore();
  const isReadOnlyTask = catId === 3;

  useEffect(() => {
    setIsEditMode(false);
  }, [isComponentVisible]);

  useEffect(() => {
    setIsChecked(isReadOnlyTask);
  }, [isReadOnlyTask]);

  const handleEnterKey = (event) => {
    if (event.keyCode == 13) {
      setIsEditMode(false);
    }
  };
  /**
   * Handles the change event of the input element.
   * @param {Event} e - The event object.
   */
  const handleOnChange = (e) => {
    // If the task is read-only, return early
    if (isReadOnlyTask) return;

    // Update the state with the checked value of the input
    setIsChecked(e.target.checked);

    // Delay the execution of onDone function by 500 milliseconds
    setTimeout(() => {
      // task is done staticly
      onDone();
    }, 500);
  };
  const handleOnChangeText = (e) => {
    let { value } = e.target;
    const lines = value.split('\n');
    if (lines.length > 1) {
      lines.map((line) => {
        addTodo(catId, { id: generateRandomNumber(999), text: line });
      });
    } else {
      onChangeText(value);
    }
  };

  return (
    <div
      className={className}
      onDragStart={onDragStart}
      onDragEnter={onDragEnter}
      onMouseEnter={() => setIsShowDeleteBtn(true)}
      onMouseLeave={() => setIsShowDeleteBtn(false)}
      draggable
    >
      <input type="checkbox" className="checkbox" onChange={handleOnChange} checked={isChecked} />
      {isEditMode ? (
        <input
          className="input-task"
          type="text"
          value={task.text}
          onChange={handleOnChangeText}
          ref={ref}
          onKeyDown={handleEnterKey}
        />
      ) : (
        <div
          className={`${isChecked && 'checked'}`}
          onClick={() => setIsEditMode(true)}
          // onDoubleClick={() => setIsEditMode(true)}
          style={{ width: '100%' }}
        >
          {task.text}
        </div>
      )}
      {isShowDeleteBtn && (
        <div onClick={onDelete} className=" pointer delete-icon ">
          <DeleteSVG color="#F4C5CB" />
        </div>
      )}
    </div>
  );
}
