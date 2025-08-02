import { useState } from 'react';

export default function ThemeToggle() {
  const [text, setText] = useState<'Switch to Dark' | 'Switch to Light'>('Switch to Dark');

  const toggleText = () => {
    setText(prev => (prev === 'Switch to Dark' ? 'Switch to Light' : 'Switch to Dark'));
  };

  return (
    <button
      onClick={toggleText}
      className="p-2 text-sm rounded border dark:text-white dark:border-white border-gray-800"
    >
      {text}
    </button>
  );
}
