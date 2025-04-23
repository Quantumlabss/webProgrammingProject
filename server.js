//------------------------------ Server Setup ------------------------------//
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

//------------------------------ Middleware ------------------------------//
app.use(express.json());
app.use(express.static(__dirname));

//------------------------------ Directory Setup ------------------------------//
const usersDir = path.join(__dirname, 'users');
const studiosDir = path.join(__dirname, 'studios');

if (!fs.existsSync(usersDir)) fs.mkdirSync(usersDir);
if (!fs.existsSync(studiosDir)) fs.mkdirSync(studiosDir);

//------------------------------ Root Route ------------------------------//
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

//------------------------------ Save User Data on Signup ------------------------------//
app.post('/signup', (req, res) => {
  const { name, phone, email, userType } = req.body;

  if (!name || !phone || !email || !userType) {
    return res.status(400).json({ message: 'Missing user data.' });
  }

  const safeEmail = email.replace(/[^a-zA-Z0-9]/g, '_');
  const filePath = path.join(usersDir, `${safeEmail}.json`);

  if (fs.existsSync(filePath)) {
    return res.status(409).json({ message: 'User already exists.' });
  }

  fs.writeFile(filePath, JSON.stringify(req.body, null, 2), (err) => {
    if (err) {
      console.error('Error saving user data:', err);
      return res.status(500).json({ message: 'Failed to save user.' });
    }

    res.status(200).json({ success: true, message: 'User saved successfully.' });
  });
});

//------------------------------ Get User Data ------------------------------//

app.get('/users/:email', (req, res) => {
  const safeEmail = req.params.email.replace(/[^a-zA-Z0-9]/g, '_');
  const filePath = path.join(usersDir, `${safeEmail}.json`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'User not found.' });
  }

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading user data:', err);
      return res.status(500).json({ message: 'Failed to read user data.' });
    }

    res.status(200).json(JSON.parse(data));
  });
});




//------------------------------ Save Studio Data ------------------------------//
app.post('/add-studio', (req, res) => {
  const studio = req.body;

  if (!studio || !studio.studioName || !studio.email) {
    return res.status(400).json({ message: 'Incomplete studio data.' });
  }

  const safeEmail = studio.email.replace(/[^a-zA-Z0-9]/g, '_');
  const userStudioDir = path.join(studiosDir, safeEmail);

  if (!fs.existsSync(userStudioDir)) fs.mkdirSync(userStudioDir);

  const timestamp = Date.now();
  studio.timestamp = timestamp;
  const safeName = `${studio.studioName.replace(/[^a-zA-Z0-9]/g, '_')}_${timestamp}.json`;
  const filePath = path.join(userStudioDir, safeName);

  fs.writeFile(filePath, JSON.stringify(studio, null, 2), (err) => {
    if (err) {
      console.error('Error saving studio:', err);
      return res.status(500).json({ message: 'Failed to save studio.' });
    }

    res.status(200).json({ success: true, message: 'Studio saved successfully.' });
  });
});

//------------------------------ Get Studios for User ------------------------------//
app.get('/studios/:email', (req, res) => {
  const safeEmail = req.params.email.replace(/[^a-zA-Z0-9]/g, '_');
  const userStudioDir = path.join(studiosDir, safeEmail);

  if (!fs.existsSync(userStudioDir)) {
    return res.status(200).json([]);
  }

  try {
    const files = fs.readdirSync(userStudioDir);
    const studios = files
      .filter(f => f.endsWith('.json'))
      .map(f => fs.readFileSync(path.join(userStudioDir, f), 'utf8'))
      .map(content => JSON.parse(content));

    res.status(200).json(studios);
  } catch (err) {
    console.error("Error loading studios:", err);
    res.status(500).json({ message: 'Failed to load studios.' });
  }
});

//------------------------------ Update Studio Data ------------------------------//
app.put('/update-studio/:email/:filename', (req, res) => {
  const { email, filename } = req.params;
  const safeEmail = email.replace(/[^a-zA-Z0-9]/g, '_');
  const safeFilename = filename.replace(/[^a-zA-Z0-9_]/g, '');
  const filePath = path.join(studiosDir, safeEmail, `${safeFilename}.json`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'Studio file not found.' });
  }

  const updatedData = req.body;

  fs.writeFile(filePath, JSON.stringify(updatedData, null, 2), (err) => {
    if (err) {
      console.error("Error updating studio:", err);
      return res.status(500).json({ message: 'Failed to update studio.' });
    }

    res.status(200).json({ success: true, message: 'Studio updated successfully.' });
  });
});

//-----edit studio-----
// PUT to update studio
app.put('/edit-studio', (req, res) => {
    const { filename, name, address } = req.body;
    const filePath = path.join(__dirname, 'studios', filename);

    fs.readFile(filePath, 'utf8', (err, jsonData) => {
        if (err) return res.status(500).json({ message: 'Read error' });

        const studioData = JSON.parse(jsonData);
        studioData.name = name;
        studioData.address = address;

        fs.writeFile(filePath, JSON.stringify(studioData, null, 2), (err) => {
            if (err) return res.status(500).json({ message: 'Write error' });
            res.json({ message: 'Studio updated successfully' });
        });
    });
});

// DELETE to delete studio
app.delete('/delete-studio/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'studios', req.params.filename);

    fs.unlink(filePath, (err) => {
        if (err) return res.status(500).json({ message: 'Delete failed' });
        res.json({ message: 'Studio deleted successfully' });
    });
});

//------------------------------ Start Server ------------------------------//
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

