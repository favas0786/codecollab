const express = require('express');
const { piston } = require('piston-client'); 
const router = express.Router();

const client = piston({ server: 'https://emkc.org' });

router.post('/', async (req, res) => {
    try {
        const { language = 'javascript', code } = req.body;
        if (!code) {
            return res.status(400).json({ error: 'Code is required.' });
        }

        const result = await client.execute(language, code);
        
        // The result object from piston-client has a 'run' property
        // which contains stdout and stderr
        res.json(result.run); 
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while executing the code.' });
    }
});

module.exports = router;