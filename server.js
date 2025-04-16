const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware to parse JSON data
app.use(express.json());

// Ensure the /studios directory exists
const studiosDir = path.join(__dirname, 'studios');
if (!fs.existsSync(studiosDir)) {
    fs.mkdirSync(studiosDir);
}

// Serve static files (if you have CSS/JS files in root)
app.use(express.static(__dirname));

// Serve index.html at the root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Add studio route - save studio data to a JSON file
app.post('/add-studio', (req, res) => {
    const studio = req.body;

    // Ensure studio data is received
    if (!studio || Object.keys(studio).length === 0) {
        return res.status(400).json({ message: 'Missing studio data.' });
    }

    const timestamp = Date.now();
    const safeName = `${studio.studioName.replace(/[^a-zA-Z0-9]/g, '_')}_${timestamp}.json`;

    const filePath = path.join(studiosDir, safeName);

    // Save the studio data into its own JSON file
    fs.writeFile(filePath, JSON.stringify(studio, null, 2), (err) => {
        if (err) {
            console.error('Error saving studio:', err);
            return res.status(500).json({ message: 'Failed to save studio.' });
        }

        res.status(200).json({ success: true, message: 'Studio saved successfully.' });
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
