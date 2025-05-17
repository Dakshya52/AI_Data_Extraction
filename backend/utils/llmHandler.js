const Groq = require('groq-sdk');
const { performSearch } = require('./searchHandler');

async function extractInformation(rowData, userPrompt) {
    const groq = new Groq();

    if (!rowData || !userPrompt) {
        throw new Error('Invalid row data or prompt');
    }

    try {
        // Get search results
        const searchResults = await performSearch(rowData, Object.keys(rowData)[0], userPrompt);
        
        // Format row data and search results
        const formattedRowData = Object.entries(rowData)
            .map(([key, value]) => `${key}: ${value}`)
            .join('\n');

        const formattedSearchResults = searchResults
            ? `Search Results:\n${JSON.stringify(searchResults, null, 2)}`
            : 'No search results available';

        // Enhanced system prompt with both data sources
        const systemPrompt = `
${formattedRowData}

${formattedSearchResults}

User Query: ${userPrompt}
`;

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                }
            ],
            model: "mistral-saba-24b",
            temperature: 0.5,
            max_tokens: 1024,
        });

        return {
            entity: rowData,
            searchResults: searchResults,
            info: completion.choices[0]?.message?.content || 'No response generated'
        };

    } catch (error) {
        console.error('Error in LLM processing:', error);
        throw error;
    }
}

module.exports = { extractInformation };