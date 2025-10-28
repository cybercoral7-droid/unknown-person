
import React, { useState, useCallback, useEffect } from 'react';
import { Dish } from './types';
import { fetchDishDetails, fetchDishImages } from './services/geminiService';
import { translations } from './translations';
import DishInput from './components/DishInput';
import DishDetails from './components/DishDetails';
import ImageGallery from './components/ImageGallery';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import LanguageSelector from './components/LanguageSelector';

const App: React.FC = () => {
  const [dishQuery, setDishQuery] = useState<string>('');
  const [dishDetails, setDishDetails] = useState<Dish | null>(null);
  const [dishImages, setDishImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<keyof typeof translations>('en');

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ur' ? 'rtl' : 'ltr';
  }, [language]);

  const t = translations[language];

  const handleSearch = useCallback(async (query: string) => {
    setIsLoading(true);
    setError(null);
    setDishDetails(null);
    setDishImages([]);
    setDishQuery(query);

    try {
      // Image prompt can remain in English for better results
      const [details, images] = await Promise.all([
        fetchDishDetails(query, language),
        fetchDishImages(query)
      ]);
      
      setDishDetails(details);
      setDishImages(images);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [language]);

  const WelcomeMessage = () => (
    <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{t.welcomeTitle}</h2>
      <p className="text-lg text-gray-600 dark:text-gray-300">{t.welcomeSubtitle}</p>
      <p className="mt-4 text-gray-500 dark:text-gray-400">{t.welcomePrompt}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6 md:p-8 transition-colors duration-300">
      <div className="container mx-auto max-w-7xl">
        
        <div className="absolute top-4 right-4">
            {/* FIX: The `setLanguage` state setter from `useState` is not directly assignable to the `onLangChange` prop because `setLanguage`
                is a `Dispatch` type that can also accept a function updater. Wrapping it in an arrow function resolves the type mismatch. */}
            <LanguageSelector currentLang={language} onLangChange={(lang) => setLanguage(lang)} />
        </div>

        <header className="text-center my-8 md:my-12">
          <h1 className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-pink-500 pb-2">
            {t.title}
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">{t.subtitle}</p>
        </header>

        <main className="space-y-12">
          <DishInput 
            onSearch={handleSearch} 
            isLoading={isLoading}
            placeholder={t.searchPlaceholder}
            buttonText={t.searchButton}
            loadingText={t.searchingButton}
          />
          
          <div className="mt-12">
            {isLoading && <LoadingSpinner message={t.loadingMessage} />}
            {error && <ErrorMessage message={error} title={t.errorTitle} />}
            {!isLoading && !error && dishDetails && dishImages.length > 0 && (
              <div className="space-y-12 animate-fade-in">
                <ImageGallery images={dishImages} dishName={dishDetails.name} />
                <DishDetails dish={dishDetails} translations={{
                    ingredients: t.ingredients,
                    recipe: t.recipe,
                    copy: t.copy,
                    copied: t.copied,
                }} />
              </div>
            )}
            {!isLoading && !error && !dishDetails && (
              <WelcomeMessage />
            )}
          </div>
        </main>

        <footer className="text-center text-gray-400 dark:text-gray-500 mt-16 py-6 border-t border-gray-200 dark:border-gray-700">
            <p>{t.footer}</p>
        </footer>
      </div>
       <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
