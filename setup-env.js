const fs = require('fs');
const path = require('path');

// Try to load .env file if it exists (local dev)
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.trim();
        }
    });
}

// Output to public/env.js
const outputPath = path.join(__dirname, 'public', 'env.js');

try {
    // Get API Key from process.env (works for both local .env and Vercel env vars)
    const apiKey = process.env.GOOGLE_DRIVE_API_KEY || process.env.VITE_GOOGLE_DRIVE_API_KEY || '';

    const jsContent = `window.CONFIG = {
    GOOGLE_DRIVE_API_KEY: "${apiKey}"
};`;

    // Ensure public directory exists
    if (!fs.existsSync(path.join(__dirname, 'public'))) {
        fs.mkdirSync(path.join(__dirname, 'public'));
    }

    fs.writeFileSync(outputPath, jsContent);
    console.log('public/env.js generated successfully.');
    console.log('API Key found:', apiKey ? 'Yes' : 'No');
} catch (error) {
    console.error('Error generating env.js:', error);
    process.exit(1);
}