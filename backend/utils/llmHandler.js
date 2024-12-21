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
        const systemPrompt = `Analyze the following laptop data and search results to respond to the user's query.

Laptop Data:
${formattedRowData}

${formattedSearchResults}

User Query: ${userPrompt}

Please provide a comprehensive analysis incorporating both the laptop specifications and relevant search findings.`;

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                }
            ],
            model: "mixtral-8x7b-32768",
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