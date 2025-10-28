
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
import ImageGallerySkeleton from './components/ImageGallerySkeleton';
import ThemeSwitcher from './components/ThemeSwitcher';

type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [dishQuery, setDishQuery] = useState<string>('');
  const [dishDetails, setDishDetails] = useState<Dish | null>(null);
  const [dishImages, setDishImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isImagesLoading, setIsImagesLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<keyof typeof translations>('en');
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ur' ? 'rtl' : 'ltr';
  }, [language]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleThemeToggle = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const t = translations[language];

  const handleSearch = useCallback(async (query: string) => {
    setIsLoading(true);
    setIsImagesLoading(false);
    setError(null);
    setDishDetails(null);
    setDishImages([]);
    setDishQuery(query);

    try {
      // Fetch details first and display them immediately.
      const details = await fetchDishDetails(query, language);
      setDishDetails(details);
      setIsLoading(false);

      // Then fetch images in the background, using the detailed description for accuracy.
      setIsImagesLoading(true);
      const images = await fetchDishImages(details.name, details.description);
      setDishImages(images);
      setIsImagesLoading(false);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setIsLoading(false);
      setIsImagesLoading(false);
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
        
        <div className="absolute top-4 right-4 flex items-center space-x-2">
            <ThemeSwitcher theme={theme} onToggle={handleThemeToggle} />
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
            
            {!isLoading && !error && dishDetails && (
              <div className="space-y-12 animate-fade-in">
                {isImagesLoading && <ImageGallerySkeleton />}
                {dishImages.length > 0 && <ImageGallery images={dishImages} dishName={dishDetails.name} />}
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