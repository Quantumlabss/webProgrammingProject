const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public')); // to serve your html, css, js files

const usersFilePath = path.join(__dirname, 'users.json');

// Helper to read users
function readUsers() {
    if (!fs.existsSync(usersFilePath)) {
        return [];
    }
    const data = fs.readFileSync(usersFilePath, 'utf-8');
    return data ? JSON.parse(data) : [];
}

// Helper to write users
function writeUsers(users) {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

// Signup endpoint
app.post('/signup', (req, res) => {
    const { name, phone, email, userType } = req.body;
    if (!name || !phone || !email || !userType) {
        return res.json({ success: false, message: "Missing fields." });
    }

    const users = readUsers();
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return res.json({ success: false, message: "User already exists." });
    }

    users.push({ name, phone, email, userType });
    writeUsers(users);

    res.json({ success: true });
});

// Login endpoint
app.post('/login', (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.json({ success: false, message: "Email is required." });
    }

    const users = readUsers();
    const user = users.find(u => u.email === email);
    if (user) {
        res.json({ success: true, user });
    } else {
        res.json({ success: false, message: "User not found." });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
