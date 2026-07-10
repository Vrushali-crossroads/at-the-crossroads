const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'At The Crossroads - Landing Page (standalone).html');
const content = fs.readFileSync(filePath, 'utf8');

// Find the template script tag
const match = content.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/);
if (match) {
    const templateJson = match[1].trim();
    try {
        const templateHtml = JSON.parse(templateJson);
        fs.writeFileSync(path.join(__dirname, 'template_extracted.html'), templateHtml, 'utf8');
        console.log('Template extracted successfully to template_extracted.html');
    } catch (e) {
        console.error('Failed to parse template JSON:', e);
    }
} else {
    console.log('Template script tag not found');
}
