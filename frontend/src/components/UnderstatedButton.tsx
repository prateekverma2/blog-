import React from 'react'

interface ButtonProps {
  label: string;
  onClick?: () => void;
}

const UnderstatedButton: React.FC<ButtonProps> = ({ label, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded transition duration-200 hover:underline hover:underline-offset-4 focus:outline-none text-gray-800 dark:text-gray-100"
    >
      {label}
    </button>
  )
}

export default UnderstatedButton
