'use client'

import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { ThemeProviderWithAttribute } from '../../contexts/ThemeContext';
import Loading from '@/app/Loading';
import client from '../../lib/contentful';
import Image from 'next/image';
import { Avatar } from '@nextui-org/react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import './helpArticle.css';

const HelpArticle = ({ params }) => {
    const { slug } = params;
    const [article, setArticle] = useState({
        title: '',
        content: '',
        heroImage: '',
        updatedAt: '',
    });
    const [loading, setLoading] = useState(true);
    const [relatedArticles, setRelatedArticles] = useState([]);

    useEffect(() => {
        const fetchArticleData = async () => {
            try {
                const response = await client.getEntries({
                    content_type: 'helpPageContent',
                    'fields.slug': slug,
                });
                if (response.items.length > 0) {
                    const data = response.items[0].fields;
                    setArticle({
                        title: data.title,
                        content: data.content,
                        heroImage: data.heroImage?.fields?.file?.url || '',
                        updatedAt: response.items[0].sys.updatedAt,
                    });

                    // Fetch related articles
                    const relatedResponse = await client.getEntries({
                        content_type: 'helpPageContent',
                        limit: 3, // Fetch 3 related articles
                    });
                    setRelatedArticles(relatedResponse.items);
                }
            } catch (error) {
                console.error('Error fetching article data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchArticleData();
    }, [slug]);

    if (loading) {
        return <Loading />;
    }

    if (!article || !article.content) {
        return <div>Error: Article content not found</div>;
    }

    const renderRelatedArticles = () => (
        <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4">Related Articles</h2>
            <ul>
                {relatedArticles.map((relatedArticle) => (
                    <li key={relatedArticle.sys.id}>
                        <a
                            href={`/help/${relatedArticle.fields.slug}`}
                            className="text-blue-600 hover:underline"
                        >
                            {relatedArticle.fields.title}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );

    return (
        <ThemeProviderWithAttribute>
            <div
                className="min-h-screen flex flex-col h-screen bg-cover bg-center"
            >
                <Navbar />
                <div className="container mx-auto flex flex-col items-center justify-center flex-1 py-10 mt-20">
                    <main className="w-full lg:w-3/4 bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-4xl font-bold border-b-4 border-primary-brand-600 pb-2">
                                {article.title}
                            </h1>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                            <div className='flex flex-row items-center'>
                                <Avatar radius='md' className='shadow-lg bg-white' text="AU" textColor="white" size="lg" src='/android-chrome-192x192.png' />
                                <div className='ml-2'>
                                    <p className='font-bold'>The TaskJourney Team</p>
                                    <p>Last updated on {new Date(article.updatedAt).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                    </p>
                                </div>
                            </div>

                        </div>
                        {article.heroImage && (
                            <div className="mb-8">
                                <Image
                                    src={article.heroImage}
                                    alt="Hero Image"
                                    width={1200}
                                    height={400}
                                    className="rounded-lg shadow-md"
                                    layout="responsive"
                                />
                            </div>
                        )}
                        <article className="mx-auto prose">
                            {documentToReactComponents(article.content)}
                        </article>
                        {renderRelatedArticles()}
                    </main>
                </div>
                <Footer />
            </div>
        </ThemeProviderWithAttribute>
    );
};

export default HelpArticle;
