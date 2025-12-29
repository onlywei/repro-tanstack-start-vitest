import { useState } from 'react';

export interface ButtonProps {
  label?: string;
  onClick?: () => void;
}

export function Button({ label = 'Click me', onClick }: ButtonProps) {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
    onClick?.();
  };

  return (
    <button onClick={handleClick}>
      {label} (clicked {count} times)
    </button>
  );
}

