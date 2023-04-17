const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, 'env.json') });


const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static assets from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Define the login route
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Check the login credentials
  if (email === 'user@example.com' && password === 'password') {
    // Generate a session token and redirect to the dashboard
    const sessionToken = uuid.v4();
    res.cookie('sessionToken', sessionToken);
    res.redirect('/dashboard');
  } else {
    // Display an error message
    res.render('login', { error: 'Invalid email or password' });
  }
});

// Define the dashboard route
app.get('/dashboard', (req, res) => {
  const { sessionToken } = req.cookies;

  // Check if the user is authenticated
  if (!sessionToken) {
    res.redirect('/login');
  } else {
    res.render('dashboard');
  }
});

// Define the logout route
app.get('/logout', (req, res) => {
  // Clear the session token and redirect to the login page
  res.clearCookie('sessionToken');
  res.redirect('/login');
});

// Define the login page route
app.get('/login', (req, res) => {
  res.render('login');
});

// Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = app;
