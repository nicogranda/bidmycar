// Tooltip.jsx
import React from 'react';
import './ToolTip.css';

const ToolTip = ({ text, children }) => (
  <div className="tooltip-container">
    {children}
    <span className="tooltip-text">{text}</span>
  </div>
);

export default ToolTip;
