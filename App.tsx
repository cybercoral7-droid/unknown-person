
import React, { useState, useCallback } from 'react';
import { Dish } from './types';
import { fetchDishDetails, fetchDishImages } from './services/geminiService';
import DishInput from './components/DishInput';
import DishDetails from './components/DishDetails';
import ImageGallery from './components/ImageGallery';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';

const App: React.FC = () => {
  const [dishQuery, setDishQuery] = useState<string>('');
  const [dishDetails, setDishDetails] = useState<Dish | null>(null);
  const [dishImages, setDishImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async (query: string) => {
    setIsLoading(true);
    setError(null);
    setDishDetails(null);
    setDishImages([]);
    setDishQuery(query);

    try {
      const [details, images] = await Promise.all([
        fetchDishDetails(query),
        fetchDishImages(query)
      ]);
      
      setDishDetails(details);
      setDishImages(images);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const WelcomeMessage = () => (
    <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Welcome to Rescort!</h2>
      <p className="text-lg text-gray-600 dark:text-gray-300">Discover delicious recipes from around the world.</p>
      <p className="mt-4 text-gray-500 dark:text-gray-400">Enter a dish name above to get started.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6 md:p-8 transition-colors duration-300">
      <div className="container mx-auto max-w-7xl">
        <header className="text-center my-8 md:my-12">
          <h1 className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-pink-500 pb-2">
            Rescort
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">Your AI Culinary Companion</p>
        </header>

        <main className="space-y-12">
          <DishInput onSearch={handleSearch} isLoading={isLoading} />
          
          <div className="mt-12">
            {isLoading && <LoadingSpinner />}
            {error && <ErrorMessage message={error} />}
            {!isLoading && !error && dishDetails && dishImages.length > 0 && (
              <div className="space-y-12 animate-fade-in">
                <ImageGallery images={dishImages} dishName={dishDetails.name} />
                <DishDetails dish={dishDetails} />
              </div>
            )}
            {!isLoading && !error && !dishDetails && (
              <WelcomeMessage />
            )}
          </div>
        </main>

        <footer className="text-center text-gray-400 dark:text-gray-500 mt-16 py-6 border-t border-gray-200 dark:border-gray-700">
            <p>Powered by Google Gemini. Created for you.</p>
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
