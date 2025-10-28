import React from 'react';

interface ErrorMessageProps {
  message: string;
  title: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, title }) => (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md" role="alert">
        <p className="font-bold">{title}</p>
        <p>{message}</p>
    </div>
);

export default ErrorMessage;