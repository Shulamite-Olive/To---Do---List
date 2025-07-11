const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Register route
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    let users = [];

    if (fs.existsSync('users.json')) {
        users = JSON.parse(fs.readFileSync('users.json'));
    }

    if (users.find(user => user.username === username)) {
        return res.json({ success: false, message: "Username already exists." });
    }

    users.push({ username, password });
    fs.writeFileSync('users.json', JSON.stringify(users));
    res.json({ success: true, message: "Registration successful." });
});

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!fs.existsSync('users.json')) {
        return res.json({ success: false, message: "No users registered." });
    }

    let users = JSON.parse(fs.readFileSync('users.json'));
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        res.json({ success: true, message: "Login successful." });
    } else {
        res.json({ success: false, message: "Invalid credentials." });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
