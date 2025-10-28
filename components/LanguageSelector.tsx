
import React from 'react';

// FIX: Use `as const` to infer a narrow, specific type for language codes ('en' | 'hi' | 'ur')
// instead of a general `string`. This enables stricter type checking.
const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'ur', name: 'اردو' },
] as const;

// Define a type for the language codes based on the `languages` array for strong typing.
type LanguageCode = typeof languages[number]['code'];

interface LanguageSelectorProps {
  // Update props to use the specific LanguageCode type. This improves type safety
  // and helps resolve type mismatches in parent components.
  currentLang: LanguageCode;
  onLangChange: (lang: LanguageCode) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ currentLang, onLangChange }) => {
  return (
    <div className="flex space-x-2 bg-white dark:bg-gray-800 p-1 rounded-full shadow-md">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => onLangChange(lang.code)}
          className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors duration-300 ${
            currentLang === lang.code
              ? 'bg-rose-600 text-white'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          {lang.name}
        </button>
      ))}
    </div>
  );
};

export default LanguageSelector;
