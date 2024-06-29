const fs = require('fs');

const generateLevels = (numLevels) => {
    const levels = [];
    const baseExp = 100; // Base EXP required for level 1

    const singleColorGradients = [
        'bg-gradient-to-r from-green-200 to-green-400',
        'bg-gradient-to-r from-green-400 to-green-600',
        'bg-gradient-to-r from-green-600 to-green-800',
        'bg-gradient-to-r from-blue-200 to-blue-400',
        'bg-gradient-to-r from-blue-400 to-blue-600',
        'bg-gradient-to-r from-blue-600 to-blue-800',
        'bg-gradient-to-r from-purple-200 to-purple-400',
        'bg-gradient-to-r from-purple-400 to-purple-600',
        'bg-gradient-to-r from-purple-600 to-purple-800',
        'bg-gradient-to-r from-red-200 to-red-400',
        'bg-gradient-to-r from-red-400 to-red-600',
        'bg-gradient-to-r from-red-600 to-red-800',
        'bg-gradient-to-r from-orange-200 to-orange-400',
        'bg-gradient-to-r from-orange-400 to-orange-600',
        'bg-gradient-to-r from-orange-600 to-orange-800',
        'bg-gradient-to-r from-yellow-200 to-yellow-400',
        'bg-gradient-to-r from-yellow-400 to-yellow-600',
        'bg-gradient-to-r from-yellow-600 to-yellow-800',
        'bg-gradient-to-r from-pink-200 to-pink-400',
        'bg-gradient-to-r from-pink-400 to-pink-600',
        'bg-gradient-to-r from-pink-600 to-pink-800',
        'bg-gradient-to-r from-gray-200 to-gray-400',
        'bg-gradient-to-r from-gray-400 to-gray-600',
        'bg-gradient-to-r from-gray-600 to-gray-800',
        'bg-gradient-to-r from-teal-200 to-teal-400',
        'bg-gradient-to-r from-teal-400 to-teal-600',
        'bg-gradient-to-r from-teal-600 to-teal-800',
        'bg-gradient-to-r from-indigo-200 to-indigo-400',
        'bg-gradient-to-r from-indigo-400 to-indigo-600',
        'bg-gradient-to-r from-indigo-600 to-indigo-800',
        'bg-gradient-to-r from-lime-200 to-lime-400',
        'bg-gradient-to-r from-lime-400 to-lime-600',
        'bg-gradient-to-r from-lime-600 to-lime-800',
        // Add more single-color gradients as needed
    ];

    const multiColorGradients = [
        'bg-gradient-to-r from-green-200 via-yellow-300 to-red-400',
        'bg-gradient-to-r from-blue-200 via-purple-300 to-pink-400',
        'bg-gradient-to-r from-red-200 via-orange-300 to-yellow-400',
        'bg-gradient-to-r from-teal-200 via-blue-300 to-indigo-400',
        'bg-gradient-to-r from-purple-200 via-pink-300 to-red-400',
        'bg-gradient-to-r from-yellow-200 via-orange-300 to-red-400',
        'bg-gradient-to-r from-gray-200 via-teal-300 to-green-400',
        'bg-gradient-to-r from-pink-200 via-purple-300 to-indigo-400',
        'bg-gradient-to-r from-indigo-200 via-blue-300 to-teal-400',
        'bg-gradient-to-r from-lime-200 via-yellow-300 to-orange-400',
        'bg-gradient-to-r from-red-200 via-pink-300 to-purple-400',
        'bg-gradient-to-r from-blue-200 via-green-300 to-teal-400',
        'bg-gradient-to-r from-purple-200 via-indigo-300 to-blue-400',
        'bg-gradient-to-r from-yellow-200 via-lime-300 to-green-400',
        'bg-gradient-to-r from-teal-200 via-cyan-300 to-blue-400',
        'bg-gradient-to-r from-orange-200 via-red-300 to-pink-400',
        'bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600',
        'bg-gradient-to-r from-green-200 via-teal-300 to-blue-400',
        'bg-gradient-to-r from-indigo-200 via-purple-300 to-pink-400',
        'bg-gradient-to-r from-pink-200 via-red-300 to-orange-400',
        'bg-gradient-to-r from-lime-200 via-green-300 to-blue-400',
        'bg-gradient-to-r from-cyan-200 via-teal-300 to-indigo-400',
        'bg-gradient-to-r from-orange-200 via-yellow-300 to-red-400',
        'bg-gradient-to-r from-purple-200 via-blue-300 to-green-400',
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
            expForNextLevel = baseExp + level * 50; // Linear growth for first 10 levels
        } else if (level <= 50) {
            expForNextLevel = baseExp + Math.floor(50 * Math.pow(1.5, level - 10)); // Moderate exponential growth for levels 11-50
        } else {
            expForNextLevel = baseExp + Math.floor(100 * Math.pow(2, level - 50)); // Steeper exponential growth for levels 51-100
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
