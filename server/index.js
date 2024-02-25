const express = require('express');
const app = express();
const PORT = 4000;

// Serve static files from the "public" directory
app.use(express.static('../client/public'));
app.use(express.json());

// Define a route to handle client requests
app.get('/api/message', (req, res) => {
    // Respond with a JSON object
    res.json({ message: 'Hello from the server!' });
});

// POST route for the specified URL
app.post('/document/v1/mynamespace/my_content/docid/example-document-id', (req, res) => {
    // Log the received data
    console.log('Received POST request with data:', req.body);

    // Respond with a success message
    res.status(200).json({ message: 'POST request received successfully' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});