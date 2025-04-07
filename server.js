const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware to parse JSON data
app.use(express.json());

// Ensure the /users directory exists
const usersDir = path.join(__dirname, 'users');
if (!fs.existsSync(usersDir)) {
    fs.mkdirSync(usersDir);
}

// Serve static files (if you have CSS/JS files in root)
app.use(express.static(__dirname));

// Serve index.html at the root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Signup route - save user data to a JSON file
app.post('/signup', (req, res) => {
    const { name, phone, email, userType } = req.body;

    if (!name || !phone || !email || !userType) {
        return res.status(400).json({ message: 'Missing required fields.' });
    }

    const safeFileName = email + '.json'; // Using email as filename
    const filePath = path.join(usersDir, safeFileName);

    const userData = {
        name,
        phone,
        email,
        userType,
        createdAt: new Date().toISOString()
    };

    fs.writeFile(filePath, JSON.stringify(userData, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error saving user data.' });
        }
        res.json({ message: `Signup successful for: ${name}` });
    });
});

// Check if the user exists (GET request)
app.get('/users/:email', (req, res) => {
    const { email } = req.params;
    const filePath = path.join(usersDir, `${email}.json`);

    fs.readFile(filePath, (err, data) => {
        if (err) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json(JSON.parse(data));
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
