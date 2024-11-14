const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

async function processFile(filePath) {
    return new Promise((resolve, reject) => {
        const columns = [];
        const preview = [];
        let isFirstRow = true;

        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                if (isFirstRow) {
                    isFirstRow = false;
                    columns.push(...Object.keys(row));
                }
                if (preview.length < 5) {
                    preview.push(row);
                }
            })
            .on('end', () => {
                resolve({ columns, preview });
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}

module.exports = { processFile };
