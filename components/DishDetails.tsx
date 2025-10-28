import React from 'react';
import { Dish } from '../types';
import CopyButton from './CopyButton';
import YouTubeLogo from './YouTubeLogo';

interface DishDetailsProps {
  dish: Dish;
  translations: {
    ingredients: string;
    recipe: string;
    copy: string;
    copied: string;
  }
}

const SectionCard: React.FC<{ title: string; children: React.ReactNode; contentToCopy: string; translations: { copy: string; copied: string; } }> = ({ title, children, contentToCopy, translations }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-4 border-b-2 border-rose-200 dark:border-gray-700 pb-2">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{title}</h3>
            <CopyButton textToCopy={contentToCopy} copyText={translations.copy} copiedText={translations.copied} />
        </div>
        {children}
    </div>
);

const DishDetails: React.FC<DishDetailsProps> = ({ dish, translations }) => {
    const ingredientsText = dish.ingredients.join('\n');
    const recipeText = dish.recipe.map((step, index) => `${index + 1}. ${step}`).join('\n');
    const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(dish.name + ' recipe')}`;

    return (
        <div className="space-y-8">
            <div className="text-center">
                <div className="flex justify-center items-center gap-3 mb-2 flex-wrap">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">{dish.name}</h2>
                    <a
                        href={youtubeSearchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`Search for "${dish.name}" on YouTube`}
                        aria-label={`Search for "${dish.name}" on YouTube`}
                        className="flex-shrink-0"
                    >
                        <YouTubeLogo />
                    </a>
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">{dish.description}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <SectionCard title={translations.ingredients} contentToCopy={ingredientsText} translations={translations}>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                        {dish.ingredients.map((ingredient, index) => (
                            <li key={index}>{ingredient}</li>
                        ))}
                    </ul>
                </SectionCard>

                <SectionCard title={translations.recipe} contentToCopy={recipeText} translations={translations}>
                    <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
                        {dish.recipe.map((step, index) => (
                            <li key={index} className="pl-2">{step}</li>
                        ))}
                    </ol>
                </SectionCard>
            </div>
        </div>
    );
}

export default DishDetails;