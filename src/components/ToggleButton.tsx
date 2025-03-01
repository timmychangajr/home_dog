import React, { useState } from 'react';

interface ToggleButtonProps {
  onToggle: (isAscending: boolean) => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ onToggle }) => {
  const [isAscending, setIsAscending] = useState(true);

  const handleToggle = () => {
    setIsAscending(!isAscending);
    onToggle(!isAscending);
  };

  return (
    <button onClick={handleToggle}>
      {isAscending ? 'Ascending' : 'Descending'}
    </button>
  );
};

export default ToggleButton;
