// Import necessary modules/components
import React from 'react';
import Navbar from '../../../components/Navbar/Navbar';
import Footer from '../../../components/Footer/Footer';
import { ThemeProviderWithAttribute } from '../../../contexts/ThemeContext';
import client from '../../../lib/contentful';
import { Avatar } from '@nextui-org/react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS } from '@contentful/rich-text-types';
import './helpArticle.css';
import BreadCrumbsList from './BreadCrumbsList';
import ShareButtons from './ShareButtons';
import TableOfContents from './TableOfContents';
import ClientAnchor from './HeadingLink'; // Adjusted import for HeadingLink

export const dynamicParams = false;

// Create a dynamic metadata for every page
export const generateMetadata = async ({ params: { slug, category } }) => {
    const article = await fetchArticle(slug, category);
    if (!article) {
        return {
            title: 'Article not found',
        };
    }
    return {
        title: article.fields.title,
        description: article.fields.description,
        openGraph: {
            title: article.fields.title,
            description: article.fields.description
        },
    };
};

export async function generateStaticParams() {
    const articles = await client.getEntries({
        content_type: 'helpPageContent'
    });

    return articles.items.map((article) => ({
        slug: article.fields.slug,
        category: article.fields.category
    }));
}

const fetchArticle = async (slug, category) => {
    const articles = await client.getEntries({
        content_type: 'helpPageContent',
        'fields.slug': slug,
        'fields.category': category
    });

    return articles.items[0];
};

const extractHeadings = (content) => {
    const headings = [];

    content.content.forEach((node) => {
        if (node.nodeType === BLOCKS.HEADING_2 || node.nodeType === BLOCKS.HEADING_3) {
            const headingId = node.content[0].value.replace(/\s+/g, '-').toLowerCase();
            headings.push({ id: headingId, text: node.content[0].value });
            node.content[0].id = headingId; // Set the id for the heading node
        }
    });

    return headings;
};

const renderOptions = {
    renderNode: {
        [BLOCKS.HEADING_2]: (node, children) => (
            <h2 id={node.content[0].id} className="heading-2 flex items-center">
                {children}
                <ClientAnchor id={node.content[0].id} />
            </h2>
        ),
        [BLOCKS.HEADING_3]: (node, children) => (
            <h3 id={node.content[0].id} className="heading-3 flex items-center">
                {children}
                <ClientAnchor id={node.content[0].id} />
            </h3>
        ),
    },
};


const HelpArticle = async ({ params: { slug, category } }) => {
    const article = await fetchArticle(slug, category);

    if (!article) {
        return <div>Error: Article content not found</div>;
    }

    const { title, content, heroImage } = article.fields;
    const updatedAt = article.sys.updatedAt;
    const heroImageUrl = heroImage?.fields?.file?.url;
    const headings = extractHeadings(content);

    return (
        <ThemeProviderWithAttribute>
            <div className="min-h-screen flex flex-col h-screen bg-cover bg-center">
                <Navbar />
                <div className="container mx-auto flex flex-col items-center justify-center flex-1 py-10 mt-20">
                    <main className="w-full lg:w-3/4 bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md">
                        <BreadCrumbsList category={category} title={title} slug={slug} />
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
                                        year: 'numeric',
                                        month: 'numeric',
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
                        <div className="flex">
                            <article className="mx-auto prose prose-sm md:prose-lg w-full lg:w-3/4">
                                {documentToReactComponents(content, renderOptions)}
                            </article>
                            <div className="w-1/4 max-sm:hidden sm:block">
                                <TableOfContents headings={headings} />
                            </div>
                        </div>
                        <ShareButtons />
                    </main>
                </div>
                <Footer />
            </div>
        </ThemeProviderWithAttribute>
    );
};

export default HelpArticle;
