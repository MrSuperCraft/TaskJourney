'use client';

import React from 'react';

interface HeroImageProps {
    src: string;
    alt: string;
    ariaLabel: string;
    className: string;
    style?: React.CSSProperties;
}

const HeroImage: React.FC<HeroImageProps> = ({ src, alt, ariaLabel, className, style }) => {
    return (
        <img
            src={src}
            alt={alt}
            aria-label={ariaLabel}
            className={className}
            style={style}
        />
    );
};

export default HeroImage;