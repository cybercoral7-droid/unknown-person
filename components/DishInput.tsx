
import React, { useState } from 'react';

interface DishInputProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const DishInput: React.FC<DishInputProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex items-center bg-white dark:bg-gray-800 rounded-full shadow-lg overflow-hidden border-2 border-transparent focus-within:border-rose-500 transition-all duration-300">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., Spaghetti Carbonara"
          className="w-full py-4 px-6 text-gray-700 dark:text-gray-200 bg-transparent focus:outline-none placeholder-gray-400"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 px-8 rounded-full disabled:bg-rose-400 disabled:cursor-not-allowed transition-colors duration-300 m-1"
          disabled={isLoading}
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>
    </form>
  );
};

export default DishInput;
