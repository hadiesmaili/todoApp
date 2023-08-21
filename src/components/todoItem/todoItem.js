import React, { useEffect, useState } from 'react';
import { useComponentVisible } from '../../lib/hooks/useComponentVisible';
import './todoItem.styles.css';

export default function TodoItem(props) {
  const { task, className, onDragStart, onDragEnter, onChangeText } = props || {};
  const [isEditMode, setIsEditMode] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const { ref, isComponentVisible } = useComponentVisible(true);

  useEffect(() => {
    setIsEditMode(false);
  }, [isComponentVisible]);

  const handleEnterKey = (event) => {
    if (event.keyCode == 13) {
      setIsEditMode(false);
    }
  };
  const handleOnChange = (e) => {
    setIsChecked(e.target.checked);
  };
  return (
    <div className={className} onDragStart={onDragStart} onDragEnter={onDragEnter} draggable>
      <input type="checkbox" className="checkbox" onChange={handleOnChange} checked={isChecked} />
      {isEditMode ? (
        <input
          className="input-task"
          type="text"
          value={task}
          onChange={(e) => {
            onChangeText(e.target.value);
          }}
          style={{ width: '100%' }}
          ref={ref}
          onKeyDown={handleEnterKey}
        />
      ) : (
        <div
          className={`task ${isChecked && 'checked'}`}
          onDoubleClick={() => setIsEditMode(true)}
          style={{ width: '100%' }}
        >
          {task}
        </div>
      )}
    </div>
  );
}
