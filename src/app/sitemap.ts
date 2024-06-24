import { MetadataRoute } from "next";
import client from "./lib/contentful";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const res = await client.getEntries({ content_type: "helpPageContent" });

    // Get all of the pages
    const pages = res.items.map((item) =>
    (
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/help/${item.fields.slug}`,
            lastModified: new Date()
        }
    )
    );

    return [
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
            lastModified: new Date(),
        },
        // Add /about , /login /signup and some other relevant pages in the website.
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/about`,
            lastModified: new Date(),
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/login`,
            lastModified: new Date(),
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/signup`,
            lastModified: new Date(),
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/help`,
            lastModified: new Date(),
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/privacy-policy`,
            lastModified: new Date(),
        },


        // Add all pages

        ...pages,

    ];
}