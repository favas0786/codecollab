// server/routes/execute.js

const express = require('express');
const axios = require('axios'); // Use axios
const router = express.Router();

const PISTON_API_URL = 'https://emkc.org/api/v2/piston/execute';

router.post('/', async (req, res) => {
    try {
        const { language = 'javascript', code } = req.body;
        if (!code) {
            return res.status(400).json({ error: 'Code is required.' });
        }

        // The payload format required by the Piston API
        const payload = {
            language: language,
            version: '18.15.0', // A stable Node.js/JS version
            files: [
                {
                    content: code,
                },
            ],
        };

        // Make the API call using axios
        const response = await axios.post(PISTON_API_URL, payload);

        // Send the 'run' part of the response back to our frontend
        res.json(response.data.run);

    } catch (err) {
        // Log the detailed error from axios if it exists
        if (err.response) {
            console.error('Error from Piston API:', err.response.data);
        } else {
            console.error('Error executing code:', err.message);
        }
        res.status(500).json({ error: 'An error occurred while executing the code.' });
    }
});

module.exports = router;