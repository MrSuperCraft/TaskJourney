// Function to assign color based on tag content
const assignTagColor = (tag: string): string => {
    const tagColors: { [key: string]: string } = {
        technology: '#2196F3',   // Blue
        programming: '#4CAF50',  // Green
        coding: '#FF5722',       // Deep Orange
        development: '#795548',  // Brown
        software: '#FFC107',     // Amber
        web: '#607D8B',          // Blue Grey
        frontend: '#E91E63',     // Pink
        backend: '#8BC34A',      // Light Green
        database: '#FF9800',     // Orange
        cloud: '#9C27B0',        // Purple
        security: '#009688',     // Teal
        networking: '#9E9E9E',   // Grey
        iot: '#3F51B5',          // Indigo
        ai: '#e0cd00',           // Yellow
        'machine learning': '#CDDC39', // Lime
        blockchain: '#03A9F4',  // Light Blue
        crypto: '#673AB7',       // Deep Purple
        mobile: '#FF9800',       // Orange
        app: '#4CAF50',          // Green
        design: '#FF5722',       // Deep Orange
        ux: '#FFC107',           // Amber
        ui: '#E91E63',           // Pink
        'graphic design': '#2196F3', // Blue
        animation: '#8BC34A',    // Light Green
        music: '#FFEB3B',        // Yellow
        art: '#9C27B0',          // Purple
        photography: '#607D8B',  // Blue Grey
        video: '#3F51B5',        // Indigo
        film: '#FF9800',         // Orange
        writing: '#FF5722',      // Deep Orange
        blogging: '#795548',     // Brown
        'social media': '#FFC107', // Amber
        marketing: '#E91E63',    // Pink
        business: '#4CAF50',     // Green
        entrepreneurship: '#FFEB3B', // Yellow
        startup: '#CDDC39',      // Lime
        finance: '#009688',      // Teal
        investment: '#9E9E9E',   // Grey
        economics: '#673AB7',    // Deep Purple
        health: '#FF9800',       // Orange
        fitness: '#8BC34A',      // Light Green
        nutrition: '#FF5722',    // Deep Orange
        diet: '#2196F3',         // Blue
        wellness: '#FFC107',     // Amber
        'mental health': '#607D8B', // Blue Grey
        yoga: '#3F51B5',         // Indigo
        meditation: '#FFEB3B',   // Yellow
        spirituality: '#E91E63', // Pink
        travel: '#9C27B0',       // Purple
        adventure: '#FF9800',    // Orange
        exploration: '#4CAF50',  // Green
        nature: '#FF5722',       // Deep Orange
        environment: '#795548',  // Brown
        climate: '#CDDC39',      // Lime
        conservation: '#009688', // Teal
        science: '#673AB7',      // Deep Purple
        research: '#2196F3',     // Blue
        education: '#FFC107',    // Amber
        learning: '#E91E63',     // Pink
        teaching: '#FFEB3B',     // Yellow
        academics: '#4CAF50',    // Green
        school: '#795548',       // Brown
        university: '#FF5722',   // Deep Orange
        student: '#3F51B5',      // Indigo
        college: '#607D8B',      // Blue Grey
        history: '#9C27B0',      // Purple
        culture: '#FF9800',      // Orange
        language: '#8BC34A',     // Light Green
        literature: '#CDDC39',   // Lime
        reading: '#673AB7',      // Deep Purple
        fiction: '#E91E63',      // Pink
        'non-fiction': '#2196F3', // Blue
        philosophy: '#FFEB3B',   // Yellow
        psychology: '#795548',   // Brown
        mindfulness: '#009688',  // Teal
        'self-improvement': '#4CAF50', // Green
        motivation: '#FF9800',   // Orange
        inspiration: '#FF5722',  // Deep Orange
        creativity: '#3F51B5',   // Indigo
        innovation: '#607D8B',   // Blue Grey
        leadership: '#9E9E9E',   // Grey
        management: '#CDDC39',   // Lime
        strategy: '#2196F3',     // Blue
    };

    const normalizedTag = tag.toLowerCase().trim();
    return tagColors[normalizedTag] || '#9E9E9E'; // Default color if tag not found};
}

export default assignTagColor;
