const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const pagesDir = path.join(__dirname, 'public', 'pages');

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    // Read the directory to find all uploaded HTML files
    fs.readdir(pagesDir, (err, files) => {
        if (err) {
            console.error("Error reading pages directory:", err);
            // If the folder doesn't exist, just show an empty list instead of crashing
            files = [];
        } 
        
        // Filter to keep only HTML files
        const htmlFiles = (files || []).filter(file => file.endsWith('.html'));
        
        // Sort files in reverse chronological order (assuming names have dates, or just alphabetical reverse)
        htmlFiles.sort().reverse();
        
        // Generate list items for the homepage
        let listItems = htmlFiles.map(file => {
            const name = file.replace('.html', '');
            return `<li><a href="/pages/${file}">${name}</a></li>`;
        }).join('\n');
        
        const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>My HTML Pages</title>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 900px; margin: 0 auto; padding: 20px; background-color: #f0f2f5; color: #1c1e21; }
                h1 { color: #1877f2; text-align: center; margin-bottom: 30px; font-size: 2.5rem; }
                ul { list-style-type: none; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
                li a { display: block; padding: 20px; background: white; border-radius: 12px; text-decoration: none; color: #1c1e21; font-weight: bold; text-align: center; font-size: 1.2rem; box-shadow: 0 4px 12px rgba(0,0,0,0.05); transition: all 0.3s ease; border: 1px solid #e4e6eb; }
                li a:hover { transform: translateY(-5px); background: #1877f2; color: white; box-shadow: 0 8px 16px rgba(24, 119, 242, 0.2); }
                .empty { text-align: center; color: #65676b; grid-column: 1 / -1; font-size: 1.2rem; }
            </style>
        </head>
        <body>
            <h1>Uploaded HTML Pages</h1>
            <ul>
                ${listItems.length > 0 ? listItems : '<li class="empty">No HTML pages uploaded yet in public/pages/</li>'}
            </ul>
        </body>
        </html>
        `;
        
        res.send(html);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
