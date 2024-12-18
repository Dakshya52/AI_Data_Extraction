const Groq = require('groq-sdk');

async function extractInformation(searchResults, prompt) {
    const groq = new Groq();

    // Validate the prompt input
    if (!prompt || typeof prompt !== 'string') {
        throw new Error('Invalid or missing prompt');
    }

    const results = [];
    for (const result of searchResults) {
        try {
            // Ensure result.snippet is defined, use fallback if necessary
            const snippet = result.snippet || 'No data available';
            const messages = [
                { role: 'user', content: prompt },
                { role: 'assistant', content: snippet }
            ];

            const chatCompletion = await groq.chat.completions.create({
                messages,
                model: 'gemma2-9b-it', // Replace with the correct model name
                temperature: 1,
                max_tokens: 1024,
                top_p: 1,
                stream: false // Ensure streaming is disabled if not supported
            });

            // Handle the response based on its actual structure
            let extractedData = '';
            if (chatCompletion && chatCompletion.choices && chatCompletion.choices.length > 0) {
                extractedData = chatCompletion.choices[0]?.delta?.content || chatCompletion.choices[0]?.message?.content || 'No data extracted';
            } else { 
                extractedData = 'No data extracted';
            }

            // Push only meaningful results
            if (extractedData !== 'No data extracted' && extractedData !== 'Failed to extract data') {
                results.push({
                    entity: result.entity || 'Unknown entity',
                    info: extractedData,
                });
            }
        } catch (error) {
            console.error(`Error extracting data for entity ${result.entity || 'undefined'}:`, error.response?.data || error.message);
        }
    }

    return results;
}

module.exports = { extractInformation };
