'use client';

import React from 'react';
import { Breadcrumbs, BreadcrumbItem } from '@nextui-org/react';
import Link from 'next/link';
import { Dropdown, DropdownMenu, DropdownItem, DropdownTrigger, Button } from '@nextui-org/react';

interface BreadCrumbsListProps {
    category: string;
    slug: string;
    title: string;
}

const formatCategory = (category: string) => {
    return category.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
};

const BreadCrumbsList = ({ category, slug, title }: BreadCrumbsListProps) => {
    return (
        <div className="w-full overflow-x-auto whitespace-nowrap">
            <Breadcrumbs aria-label="breadcrumb" className="mb-10"
                maxItems={3}
                itemsBeforeCollapse={1}
                itemsAfterCollapse={1}
                renderEllipsis={({ items, ellipsisIcon, separator }) => (
                    <div className="flex items-center">
                        <Dropdown>
                            <DropdownTrigger>
                                <Button
                                    isIconOnly
                                    className="min-w-6 w-6 h-6"
                                    size="sm"
                                    variant="flat"
                                >
                                    {ellipsisIcon}
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Routes">
                                {items.map((item, index) => (
                                    <DropdownItem key={index} href={item.href}>
                                        {item.children}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        {separator}
                    </div>
                )}
            >
                <BreadcrumbItem>
                    <Link href="/help" className="truncate">
                        Help Center
                    </Link>
                </BreadcrumbItem>
                <BreadcrumbItem>
                    <Link href={`/help/${category}`} className="truncate">
                        {formatCategory(category)}
                    </Link>
                </BreadcrumbItem>
                {slug && (
                    <BreadcrumbItem isCurrent>
                        <Link href={`/help/${category}/${slug}`} className="truncate">
                            {title.length > 20 ? title.substring(0, 17) + '...' : title}
                        </Link>
                    </BreadcrumbItem>
                )}
            </Breadcrumbs>
        </div>
    );
};

export default BreadCrumbsList;
