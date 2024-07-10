// File: pages/help/[category].jsx
import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { ThemeProviderWithAttribute } from '../../contexts/ThemeContext';
import client from '../../lib/contentful';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';
import './categoryStyles.css';
import BreadCrumbsList from './[slug]/BreadCrumbsList';

// Import icons for categories
import { FiSettings, FiUser, FiGrid, FiHelpCircle, FiArrowRight } from 'react-icons/fi';
import { FaHandsHelping } from "react-icons/fa";

const categoryIcons = {
    'getting-started': <FiArrowRight className='text-xl' />,
    'account-management': <FiUser className='text-xl' />,
    'settings-preferences': <FiSettings className='text-xl' />,
    'dashboard-features': <FiGrid className='text-xl' />,
    'troubleshooting': <FiHelpCircle className='text-xl' />,
    'contact-support': <FaHandsHelping className='text-xl' />
};
export const dynamicParams = false;

export async function generateStaticParams() {
    const categories = await client.getEntries({
        content_type: 'helpPageContent'
    });

    return categories.items.map((category) => ({
        category: category.fields.category
    }));
}


const fetchCategory = async (category) => {
    const categories = await client.getEntries({
        content_type: 'helpPageContent',
        'fields.category': category,
    });

    // Return all of the articles in the category
    return categories.items;
};


const formatCategory = (category) => {
    return category.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
};

// A function to render the article list
const ArticleList = ({ articleList }) => {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-4">
            <div className="flex items-center mb-6">
                {categoryIcons[articleList[0].fields.category] && (
                    <div className="mr-2 text-xl">
                        {categoryIcons[articleList[0].fields.category]}
                    </div>
                )}
                <h1 className="text-3xl font-bold">{formatCategory(articleList[0].fields.category)}</h1>
            </div>            {articleList.map((article) => (
                <div key={article.fields.slug} className="mb-4">
                    <Link href={`/help/${article.fields.category}/${article.fields.slug}`}>
                        <div className="block rounded-lg border border-solid border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition duration-300 ease-in-out cursor-pointer">
                            <div className="flex items-center justify-between p-4">
                                <div className="flex flex-col">
                                    <span className="text-lg font-semibold text-primary-brand">{article.fields.title}</span>
                                    <p className="mt-2 text-gray-600 dark:text-gray-400">{article.fields.description}</p>
                                </div>
                                <FaArrowRight className="h-4 w-4 text-gray-500" />
                            </div>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    );
};




const HelpCategoryPage = async ({ params: { category } }) => {


    const foundCategory = await fetchCategory(category);

    if (!foundCategory) {
        return <div>Error: No articles found</div>;
    }




    return (
        <ThemeProviderWithAttribute>
            <div className="min-h-screen w-full flex flex-col">
                <Navbar />
                <div className="container mx-auto flex flex-col items-center justify-center flex-1 py-10 mt-20">
                    <main className="w-full lg:w-3/4 p-8 rounded-lg shadow-md bg-white dark:bg-gray-900">
                        <BreadCrumbsList category={category} />
                        <ArticleList articleList={foundCategory} />
                    </main>
                </div>
                <Footer />
            </div>
        </ThemeProviderWithAttribute>
    );
};


export default HelpCategoryPage;
