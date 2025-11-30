const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
const outputPath = path.join(__dirname, 'env.js');

try {
    let envContent = '';
    if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf8');
    }

    // Parse .env simple key=value
    const envVars = {};
    envContent.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            envVars[key.trim()] = value.trim();
        }
    });

    const jsContent = `window.CONFIG = {
    GOOGLE_API_KEY: "${envVars.GOOGLE_DRIVE_API_KEY || envVars.VITE_GOOGLE_API_KEY || ''}"
};`;

    fs.writeFileSync(outputPath, jsContent);
    console.log('env.js generated successfully.');
} catch (error) {
    console.error('Error generating env.js:', error);
}
