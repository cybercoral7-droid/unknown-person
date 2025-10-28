import React from 'react';
import { Dish } from '../types';
import CopyButton from './CopyButton';

interface DishDetailsProps {
  dish: Dish;
}

const SectionCard: React.FC<{ title: string; children: React.ReactNode; contentToCopy: string; }> = ({ title, children, contentToCopy }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-4 border-b-2 border-rose-200 dark:border-gray-700 pb-2">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{title}</h3>
            <CopyButton textToCopy={contentToCopy} />
        </div>
        {children}
    </div>
);

const DishDetails: React.FC<DishDetailsProps> = ({ dish }) => {
    const ingredientsText = dish.ingredients.join('\n');
    const recipeText = dish.recipe.map((step, index) => `${index + 1}. ${step}`).join('\n');

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-2">{dish.name}</h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">{dish.description}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <SectionCard title="Ingredients" contentToCopy={ingredientsText}>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                        {dish.ingredients.map((ingredient, index) => (
                            <li key={index}>{ingredient}</li>
                        ))}
                    </ul>
                </SectionCard>

                <SectionCard title="Recipe" contentToCopy={recipeText}>
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
