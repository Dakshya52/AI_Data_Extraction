import React from 'react';
import axios from '../services/apiService';

function FileUploader({ setColumns }) {
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return; // Prevent proceeding if no file is selected

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setColumns(response.data.columns || []);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div className="file-uploader p-6 bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg rounded-lg">
      <label htmlFor="fileInput" className="block text-xl font-semibold text-white mb-4">Upload a CSV file:</label>
      <input 
        type="file" 
        id="fileInput" 
        accept=".csv" 
        onChange={handleFileChange} 
        className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition duration-200 ease-in-out transform hover:scale-105"
      />
    </div>
  );
}

export default FileUploader;