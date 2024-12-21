require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs'); 
const { processFile } = require('./utils/fileHandler');
const { performSearch } = require('./utils/searchHandler');
const { extractInformation } = require('./utils/llmHandler');
const csv = require('csv-parser');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

let uploadedData = []; // Store the uploaded data temporarily

// Endpoint to upload files and process them
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const filePath = req.file.path;
        const rows = [];
        
        // Read all rows from CSV
        await new Promise((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (row) => rows.push(row))
                .on('end', () => {
                    const columns = Object.keys(rows[0] || {});
                    res.json({
                        columns: columns,
                        preview: rows // Send all rows instead of just preview
                    });
                    resolve();
                })
                .on('error', reject);
        });

        // Clean up uploaded file
        fs.unlinkSync(filePath);
    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).json({ error: 'Failed to process file' });
    }
});

// Endpoint to get unique values for a selected column
app.post('/get-unique-rows', (req, res) => {
    if (!uploadedData.length) {
        return res.status(400).json({ error: 'No data available' });
    }

    // Return all rows for selection
    res.json({ rows: uploadedData });
});

// Endpoint to perform search and extract data using LLM integration
app.post('/search', async (req, res) => {
    try {
        const { row, prompt } = req.body;
        
        if (!row || !prompt) {
            return res.status(400).json({ error: 'Missing row data or prompt' });
        }

        // Direct LLM processing without search
        const result = await extractInformation(row, prompt);
        
        res.json({ 
            results: [result]  // Wrap in array to maintain compatibility
        });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'Failed to process request' });
    }
});
// Start the Express server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
