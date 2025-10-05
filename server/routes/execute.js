

const express = require('express');
const router = express.Router();



router.post('/', async (req, res) => {
    try {
        // We dynamically import the package INSIDE the async function
        const { piston } = await import('piston-client');
        const client = piston({ server: 'https://emkc.org' });

        const { language = 'javascript', code } = req.body;
        if (!code) {
            return res.status(400).json({ error: 'Code is required.' });
        }

        const result = await client.execute(language, code);
        
        res.json(result.run); 
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while executing the code.' });
    }
});

module.exports = router;