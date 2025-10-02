import React, { useState } from 'react';
import './ToggleVisibility.css'; // optional styling

const ToggleVisibility = ({ children, label = ['Hide', 'Show'], defaultVisible = true }) => {
  const [visible, setVisible] = useState(defaultVisible);

  return (
    <div>
      <button
        className={`toggle-switch ${visible ? 'on' : 'off'}`}
        onClick={() => setVisible(!visible)}
      >
        {visible ? label[0] : label[1]}
      </button>

      {visible && <div className="toggle-content">{children}</div>}
    </div>
  );
};

export default ToggleVisibility;