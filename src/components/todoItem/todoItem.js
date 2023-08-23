/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { useComponentVisible } from '../../lib/hooks/useComponentVisible';
import './todoItem.styles.css';

export const DeleteSVG = ({ color, className, ...other }) => (
  <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect
      x="12.1218"
      y="3.63655"
      width="1.71429"
      height="12"
      rx="0.857143"
      transform="rotate(45 12.1218 3.63655)"
      fill={color}
      {...other}
    />
    <rect
      x="3.63654"
      y="4.84873"
      width="1.71429"
      height="12"
      rx="0.857143"
      transform="rotate(-45 3.63654 4.84873)"
      fill={color}
    />
  </svg>
);

export default function TodoItem(props) {
  const { task, isReadOnlyTask, className, onDragStart, onDragEnter, onChangeText, onDelete } = props || {};
  const [isEditMode, setIsEditMode] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isShowDeleteBtn, setIsShowDeleteBtn] = useState(false);
  const { ref, isComponentVisible } = useComponentVisible(true);

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
  const handleOnChange = (e) => {
    setIsChecked(e.target.checked);
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
          onChange={(e) => {
            onChangeText(e.target.value);
          }}
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
