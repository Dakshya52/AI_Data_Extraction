import React from 'react';

function ResultTable({ results }) {
  const formatObjectData = (data) => {
      if (!data) return 'No data available';
      if (typeof data === 'string') return data;
      if (typeof data === 'object') {
          return Object.entries(data)
              .map(([key, value]) => `${key}: ${value}`)
              .join('\n');
      }
      return String(data);
  };

  return (
      <div className="result-table p-6 bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg rounded-lg">
          <h2 className="text-4xl font-bold text-white mb-6">Results</h2>
          {!results || results.length === 0 ? (
              <p className="text-gray-300">No results found.</p>
          ) : (
              results.map((result, index) => (
                  <div key={index} className="mb-6 p-4 bg-gray-700 rounded-md shadow-sm">
                      <h3 className="text-2xl font-bold text-white mb-2">Selected Row Data:</h3>
                      <pre className="text-gray-300 whitespace-pre-wrap mb-4">
                          {formatObjectData(result.entity)}
                      </pre>
                      <h4 className="text-xl font-bold text-white mb-2">Analysis:</h4>
                      <div className="text-gray-300 whitespace-pre-wrap">
                          {result.info}
                      </div>
                  </div>
              ))
          )}
      </div>
  );
}

export default ResultTable;