import React, { useState, useEffect } from 'react';
import axios from '../services/apiService';

function QueryForm({ columns, setResults }) {
  const [selectedColumn, setSelectedColumn] = useState(columns[0] || '');
  const [uniqueValues, setUniqueValues] = useState([]);
  const [selectedValue, setSelectedValue] = useState('');
  const [prompt, setPrompt] = useState('');

  // Fetch unique values when a column is selected
  useEffect(() => {
    if (selectedColumn) {
      const fetchUniqueValues = async () => {
        try {
          const response = await axios.post('/get-unique-values', { column: selectedColumn });
          setUniqueValues(response.data.values || []);
          setSelectedValue(''); // Reset selected value when column changes
        } catch (error) {
          console.error('Error fetching unique values:', error);
        }
      };
      fetchUniqueValues();
    }
  }, [selectedColumn]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedColumn || !selectedValue || !prompt) {
      alert('Please select a column, a value, and enter a prompt.');
      return;
    }

    try {
      // Send selected column, value, and prompt to the backend
      const response = await axios.post('/search', { column: selectedColumn, value: selectedValue, prompt });
      setResults(response.data.results || []);
    } catch (error) {
      console.error('Error performing search:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="query-form p-6 bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg rounded-lg space-y-6">
      <label className="block">
        <span className="text-xl font-semibold text-white">Select Column:</span>
        <select value={selectedColumn} onChange={(e) => setSelectedColumn(e.target.value)} className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-black">
          {columns.map((col) => (
            <option key={col} value={col}>{col}</option>
          ))}
        </select>
      </label>
      {uniqueValues.length > 0 && (
        <label className="block">
          <span className="text-xl font-semibold text-white">Select Value:</span>
          <select value={selectedValue} onChange={(e) => setSelectedValue(e.target.value)} className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-black">
            <option value="">--Select a value--</option>
            {uniqueValues.map((value, index) => (
              <option key={index} value={value}>{value}</option>
            ))}
          </select>
        </label>
      )}
      <label className="block">
        <span className="text-xl font-semibold text-white">Enter your prompt:</span>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your custom prompt"
          className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-black"
        />
      </label>
      <button type="submit" className="w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ease-in-out transform hover:scale-105">Submit</button>
    </form>
  );
}

export default QueryForm;