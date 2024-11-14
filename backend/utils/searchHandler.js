const axios = require('axios');
const axiosRetry = require('axios-retry').default;

axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

const MAX_ITEMS = 6;
async function performSearch(value,column, prompt) {
    const apiKey = process.env.SERPAPI_API_KEY; // Load API key from environment variables
    if (!apiKey) {
        throw new Error('SERPAPI_API_KEY is not set in the environment variables');
    }

    // Limit the number of entities (adjust logic as needed)
    
    // console.log('Entity:', entity);
    console.log('API Key:', apiKey); // For debugging; remove this line after verification

    try {
        // Make a request to SerpAPI (Google search example)
        const response = await axios.get('https://serpapi.com/search', {
            params: {
                q: `${prompt} ${value} ${column}`, // Query combining prompt and entity
                api_key: apiKey, // Corrected parameter name for API key
                engine: 'google', // Specifies using Google's search engine
            },
        });
        console.log('Response:', response.data); // For debugging; remove this line after verification
        // Check if the response contains expected results
        if (response.data && response.data.organic_results) {
            // Process the response to extract relevant data
            const searchResults = response.data.organic_results.map((result) => ({
                entity: value,
                url: result.link,
                snippet: result.snippet || 'No snippet available',
            }));
            console.log('Search results:', searchResults);
            return searchResults;
        } else {
            // Handle the case where no results are returned
            console.warn('No search results found');
            return [{ value, url: '', snippet: 'No search results available' }];
        }
    } catch (error) {
        console.error('Error fetching search results:', error.message);
        return [{ value, url: '', snippet: 'Failed to fetch data' }];
    }
}

module.exports = { performSearch };
