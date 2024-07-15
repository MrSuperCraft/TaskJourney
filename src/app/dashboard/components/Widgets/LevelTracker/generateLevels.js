const fs = require('fs');

const generateLevels = (numLevels) => {
    const levels = [];
    const baseExp = 100; // Base EXP required for level 1

    const singleColorGradients = [
        'linear-gradient(to right, #bbf7d0, #34d399)',
        'linear-gradient(to right, #34d399, #059669)',
        'linear-gradient(to right, #059669, #047857)',
        'linear-gradient(to right, #bfdbfe, #3b82f6)',
        'linear-gradient(to right, #3b82f6, #2563eb)',
        'linear-gradient(to right, #2563eb, #1d4ed8)',
        'linear-gradient(to right, #ddd6fe, #8b5cf6)',
        'linear-gradient(to right, #8b5cf6, #7c3aed)',
        'linear-gradient(to right, #7c3aed, #6d28d9)',
        'linear-gradient(to right, #fecaca, #f87171)',
        'linear-gradient(to right, #f87171, #ef4444)',
        'linear-gradient(to right, #ef4444, #dc2626)',
        'linear-gradient(to right, #fed7aa, #fb923c)',
        'linear-gradient(to right, #fb923c, #f97316)',
        'linear-gradient(to right, #f97316, #ea580c)',
        'linear-gradient(to right, #fde68a, #facc15)',
        'linear-gradient(to right, #facc15, #eab308)',
        'linear-gradient(to right, #eab308, #ca8a04)',
        'linear-gradient(to right, #fbcfe8, #ec4899)',
        'linear-gradient(to right, #ec4899, #db2777)',
        'linear-gradient(to right, #db2777, #be185d)',
        'linear-gradient(to right, #e5e7eb, #6b7280)',
        'linear-gradient(to right, #6b7280, #4b5563)',
        'linear-gradient(to right, #4b5563, #374151)',
        'linear-gradient(to right, #99f6e4, #14b8a6)',
        'linear-gradient(to right, #14b8a6, #0d9488)',
        'linear-gradient(to right, #0d9488, #0f766e)',
        'linear-gradient(to right, #c7d2fe, #6366f1)',
        'linear-gradient(to right, #6366f1, #4f46e5)',
        'linear-gradient(to right, #4f46e5, #4338ca)',
        'linear-gradient(to right, #d9f99d, #84cc16)',
        'linear-gradient(to right, #84cc16, #65a30d)',
        'linear-gradient(to right, #65a30d, #4d7c0f)',
        // Add more single-color gradients as needed
    ];

    const multiColorGradients = [
        'linear-gradient(to right, #bbf7d0, #facc15, #ef4444)',
        'linear-gradient(to right, #bfdbfe, #ddd6fe, #fbcfe8)',
        'linear-gradient(to right, #fecaca, #fed7aa, #fde68a)',
        'linear-gradient(to right, #99f6e4, #bfdbfe, #c7d2fe)',
        'linear-gradient(to right, #ddd6fe, #fbcfe8, #fecaca)',
        'linear-gradient(to right, #fde68a, #facc15, #ef4444)',
        'linear-gradient(to right, #e5e7eb, #99f6e4, #bbf7d0)',
        'linear-gradient(to right, #fbcfe8, #ddd6fe, #c7d2fe)',
        'linear-gradient(to right, #c7d2fe, #bfdbfe, #99f6e4)',
        'linear-gradient(to right, #d9f99d, #fde68a, #fb923c)',
        'linear-gradient(to right, #fecaca, #fbcfe8, #ddd6fe)',
        'linear-gradient(to right, #bfdbfe, #99f6e4, #bbf7d0)',
        'linear-gradient(to right, #ddd6fe, #c7d2fe, #bfdbfe)',
        'linear-gradient(to right, #fde68a, #d9f99d, #bbf7d0)',
        'linear-gradient(to right, #99f6e4, #67e8f9, #bfdbfe)',
        'linear-gradient(to right, #fed7aa, #fecaca, #fbcfe8)',
        'linear-gradient(to right, #e5e7eb, #6b7280, #4b5563)',
        'linear-gradient(to right, #bbf7d0, #99f6e4, #bfdbfe)',
        'linear-gradient(to right, #c7d2fe, #ddd6fe, #fbcfe8)',
        'linear-gradient(to right, #fbcfe8, #fecaca, #fed7aa)',
        'linear-gradient(to right, #d9f99d, #99f6e4, #bfdbfe)',
        'linear-gradient(to right, #67e8f9, #99f6e4, #c7d2fe)',
        'linear-gradient(to right, #fecaca, #fed7aa, #fde68a)',
        'linear-gradient(to right, #ddd6fe, #bfdbfe, #99f6e4)',
        // Add more multi-color gradients as needed
    ];

    const descriptions = [
        'You are making great progress!',
        'Keep going, you are doing amazing!',
        'Your hard work is paying off!',
        'You are halfway to mastery!',
        'You are becoming a true expert!',
        'Your skills are growing rapidly!',
        'You are on the path to greatness!',
        'Your dedication is inspiring!',
        'You are unstoppable!',
        'Congratulations on reaching this level!',
        'You are on the threshold of a new era!',
        'You are truly remarkable!',
        'Your achievements are a testament to your determination!',
        'You are a beacon of hope and inspiration!',
        'Congratulations on reaching this milestone!',
        'Keep up the great work!',
        'You are shining bright!',
        'Your journey is inspiring others!',
        'You are a role model!',
        'You are making waves!',
        'Keep pushing forward!',
        'You are climbing the ladder of success!',
        'You are an example of excellence!',
        'Your journey is admirable!',
        'You are setting new standards!',
        // Add more unique descriptions if needed
    ];

    for (let i = 0; i < numLevels; i++) {
        const level = i + 1;
        let expForNextLevel;

        if (level <= 10) {
            expForNextLevel = baseExp + level * 100; // Linear growth for first 10 levels
        } else if (level <= 50) {
            expForNextLevel = baseExp + Math.floor(50 * Math.pow(1.4, level - 10)); // Moderate exponential growth for levels 11-50
        } else {
            expForNextLevel = baseExp + Math.floor(100 * Math.pow(1.75, level - 30)); // Steeper exponential growth for levels 51-100
        }

        const color = level <= 50 ? singleColorGradients[i % singleColorGradients.length] : multiColorGradients[i % multiColorGradients.length];
        const rewards = [`Badge ${level}`, `Bonus Points ${level * 100}`];
        const description = i === 0 ? 'You have started your journey!' : descriptions[(i - 1) % descriptions.length];

        levels.push({
            level,
            expForNextLevel,
            color,
            rewards,
            description,
            progress: 0,
        });
    }

    return levels;
};

// Generate levels
const levels = generateLevels(100);

// Save to a JSON file
const jsonString = JSON.stringify({ levels }, null, 2);
fs.writeFileSync('levelData.json', jsonString);

console.log('Levels generated and saved to levelData.json');
