import React, { useState } from 'react';
import axios from '../services/apiService';

function QueryForm({ rows, setResults }) {
    const [selectedRow, setSelectedRow] = useState('');
    const [prompt, setPrompt] = useState('');

    const formatRowDisplay = (row) => {
        return Object.entries(row)
            .map(([key, value]) => `${key}: ${value}`)
            .join(' | ');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (!selectedRow || !prompt) {
            alert('Please select a row and enter a prompt');
            return;
        }

        try {
            const response = await axios.post('/search', {
                row: JSON.parse(selectedRow),
                prompt: prompt
            });
            setResults(response.data.results);
        } catch (error) {
            console.error('Error performing search:', error);
            alert('Error performing search. Please try again.',error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="query-form p-6 bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg rounded-lg space-y-6">
            <div className="mb-4">
                <label className="block">
                    <span className="text-xl font-semibold text-white">Select Row:</span>
                    <select 
                        value={selectedRow} 
                        onChange={(e) => setSelectedRow(e.target.value)}
                        className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-black p-2"
                    >
                        <option value="">--Select a row--</option>
                        {rows.map((row, index) => (
                            <option key={index} value={JSON.stringify(row)}>
                                {formatRowDisplay(row)}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <div className="mb-4">
                <label className="block">
                    <span className="text-xl font-semibold text-white">Enter your prompt:</span>
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Enter your custom prompt"
                        className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-black p-2"
                    />
                </label>
            </div>

            <button 
                type="submit" 
                className="w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ease-in-out transform hover:scale-105"
            >
                Submit
            </button>
        </form>
    );
}

export default QueryForm;