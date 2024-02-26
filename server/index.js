const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 4000;

// Serve static files from the "public" directory
app.use(express.static('../client/public'));
app.use(express.json());
app.use(cors());

// Define a route to handle client requests
app.get('/api/message', (req, res) => {
    // Respond with a JSON object
    res.json({ message: 'Hello from the server!' });
});

// POST route for the specified URL
app.post('/document/v1/mynamespace/my_content/docid/example-document-id', (req, res) => {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Log the received data
    console.log('Received POST request with data:', req.body);

    // Respond with a success message
    res.status(200).json({ message: 'POST request received successfully' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});