import React from 'react';

function ResultTable({ results }) {
  return (
    <div className="result-table p-6 bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg rounded-lg">
      <h2 className="text-4xl font-bold text-white mb-6">Awesome Results</h2>
      {results.length === 0 ? (
        <p className="text-gray-300">No results found.</p>
      ) : (
        results.map((result, index) => (
          <div key={index} className="mb-6 p-4 bg-gray-700 rounded-md shadow-sm">
            <h3 className="text-2xl font-bold text-white mb-2">{result.entity}</h3>
            <div className="text-gray-300 whitespace-pre-wrap">
              {/* Assume result.info is a structured string with section headings and bullet points */}
              {formatText(result.info)}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// Function to format result.info content
function formatText(text) {
  if (!text) return null;

  // Split sections based on headings and bullet points
  const sections = text.split(/(?=\*\*[^*]+\*\*:)/g).map((section, index) => (
    <div key={index} className="mb-4">
      {/* Extract and highlight section titles */}
      <p className="font-semibold text-white mb-1">
        {section.match(/^\*\*[^*]+\*\*:/) ? section.match(/^\*\*[^*]+\*\*:/)[0] : ''}
      </p>
      {/* Remove title from the rest of the text */}
      <p className="ml-4">
        {section.replace(/^\*\*[^*]+\*\*:/, '').split('* ').map((line, i) => (
          line.trim() ? (
            <li key={i} className="list-disc list-inside text-black">
              {line}
            </li>
          ) : null
        ))}
      </p>
    </div>
  ));

  return <>{sections}</>;
}

export default ResultTable;