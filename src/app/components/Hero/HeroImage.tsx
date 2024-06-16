'use client';

import React from 'react';
import Image from 'next/image';

interface HeroImageProps {
    src: string;
    alt: string;
    ariaLabel: string;
    className: string;
    style?: React.CSSProperties;
}

const HeroImage: React.FC<HeroImageProps> = ({ src, alt, ariaLabel, className, style }) => {
    return (
        <Image
            src={src}
            alt={alt}
            aria-label={ariaLabel}
            className={className}
            style={style}
            width={200}
            height={200}
        />
    );
};

export default HeroImage;
