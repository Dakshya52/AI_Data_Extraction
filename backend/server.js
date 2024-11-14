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
        const data = await processFile(filePath);

        // Load data into memory for subsequent operations
        uploadedData = [];
        const rows = [];
        const fileStream = await fs.createReadStream(filePath).pipe(csv());

        fileStream.on('data', (row) => rows.push(row));
        fileStream.on('end', () => {
            uploadedData = rows;
            res.json({ columns: data.columns, preview: data.preview });
        });
        fileStream.on('error', (error) => {
            console.error('Error reading file:', error);
            res.status(500).json({ error: 'Failed to process file' });
        });
    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).json({ error: 'Failed to process file' });
    }
});

// Endpoint to get unique values for a selected column
app.post('/get-unique-values', (req, res) => {
    const { column } = req.body;
    if (!uploadedData.length) {
        return res.status(400).json({ error: 'No data available' });
    }
    if (!column) {
        return res.status(400).json({ error: 'Column is required' });
    }

    // Extract unique values for the selected column
    const uniqueValues = [...new Set(uploadedData.map(row => row[column]))];
    res.json({ values: uniqueValues });
});

// Endpoint to perform search and extract data using LLM integration
app.post('/search', async (req, res) => {
    try {
        const { column, value, prompt } = req.body;

        // Filter data for the selected value in the specified column
        // const filteredData = uploadedData.filter(row => row[column] === value);
        // console.log('Filtered data:', filteredData);
        // Perform a search using the filtered data
        console.log('Performing search for:', value, 'in column:', column)
        const searchResults = await performSearch(value,column, prompt);

        // Process and extract information using the LLM handler
        const extractedData = await extractInformation(searchResults, prompt);

        res.json({ results: extractedData });
    } catch (error) {
        console.error('Error performing search or extracting data:', error);
        res.status(500).json({ error: 'Failed to process search or data extraction' });
    }
});

// Start the Express server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
