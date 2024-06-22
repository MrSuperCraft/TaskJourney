// Import necessary modules/components
import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { ThemeProviderWithAttribute } from '../../contexts/ThemeContext';
import client from '../../lib/contentful';
import { Avatar } from '@nextui-org/react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import './helpArticle.css';

export const dynamicParams = false;

export async function generateStaticParams() {
    const articles = await client.getEntries({
        content_type: 'helpPageContent'
    });

    return articles.items.map((article) => ({
        slug: article.fields.slug,
    }));
}

const fetchArticle = async (slug) => {
    const articles = await client.getEntries({
        content_type: 'helpPageContent',
        'fields.slug': slug,
    });

    return articles.items[0];
};

const HelpArticle = async ({ params: { slug } }) => {

    const article = await fetchArticle(slug);

    if (!article) {
        return <div>Error: Article content not found</div>;
    }

    const { title, content, heroImage, updatedAt } = article.fields;
    const heroImageUrl = heroImage?.fields?.file?.url;

    return (
        <ThemeProviderWithAttribute>
            <div className="min-h-screen flex flex-col h-screen bg-cover bg-center">
                <Navbar />
                <div className="container mx-auto flex flex-col items-center justify-center flex-1 py-10 mt-20">
                    <main className="w-full lg:w-3/4 bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-4xl font-bold border-b-4 border-primary-brand-600 pb-2">
                                {title || 'Nothing to see here'}
                            </h1>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                            <div className='flex flex-row items-center'>
                                <Avatar radius='md' className='shadow-lg bg-white' size="lg" src='/android-chrome-192x192.png' />
                                <div className='ml-2'>
                                    <p className='font-bold'>The TaskJourney Team</p>
                                    <p>Last updated on {new Date(updatedAt).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                    </p>
                                </div>
                            </div>
                        </div>
                        {heroImageUrl && (
                            <div className="mb-8">
                                <img
                                    src={heroImageUrl}
                                    alt="Hero Image"
                                    width={1200}
                                    height={400}
                                    className="rounded-lg shadow-md"
                                />
                            </div>
                        )}
                        <article className="mx-auto prose">
                            {documentToReactComponents(content)}
                        </article>
                    </main>
                </div>
                <Footer />
            </div>
        </ThemeProviderWithAttribute>
    );
};

export default HelpArticle;
