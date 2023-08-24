import React from 'react';

export const PlusSVG = ({ color, ...other }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none" {...other}>
    <rect x="5.14282" width="1.71429" height="12" rx="0.857143" fill={color} />
    <rect y="6.85714" width="1.71429" height="12" rx="0.857143" transform="rotate(-90 0 6.85714)" fill={color} />
  </svg>
);

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
