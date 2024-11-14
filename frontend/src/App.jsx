import React, { useState } from 'react';
import FileUploader from './components/FileUploader';
import QueryForm from './components/QueryForm';
import ResultTable from './components/ResultTable';
import './index.css';

function App() {
  const [columns, setColumns] = useState([]);
  const [results, setResults] = useState(null);

  return (
    <div className="app-container min-h-screen text-white p-8 flex flex-col items-center">
      <h1 className="text-5xl font-bold text-center mb-8">AI Data Extraction Dashboard</h1>
      <div className="max-w-4xl w-full space-y-8">
        <FileUploader setColumns={setColumns} />
        {columns.length > 0 && <QueryForm columns={columns} setResults={setResults} />}
        {results && <ResultTable results={results} />}
      </div>
    </div>
  );
}

export default App;