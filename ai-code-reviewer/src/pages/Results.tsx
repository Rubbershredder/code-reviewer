import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FileDetails {
  fileName: string;
  codeLength: number;
  reviewResults: { [key: string]: unknown };
}

const Results: React.FC = () => {
  const location = useLocation();
  const [fileDetails, setFileDetails] = useState<FileDetails>({
    fileName: 'Unknown',
    codeLength: 0,
    reviewResults: {},
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const { code, apiResult } = location.state || {};
    const { fileName, codeLength, reviewResults } = apiResult || {};

    setFileDetails({
      fileName: fileName || 'Unknown',
      codeLength: codeLength || 0,
      reviewResults: reviewResults || {},
    });

    if (reviewResults?.error) {
      setErrorMessage(reviewResults.error);
    }
  }, [location.state]);

  const toggleSection = (key: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const renderValue = (value: unknown): React.ReactNode => {
    if (typeof value === 'object' && value !== null) {
      return (
        <div className="pl-4 border-l-2 border-blue-200">
          {Object.entries(value).map(([subKey, subValue]) => (
            <div key={subKey} className="mb-2">
              <strong className="text-blue-600">{subKey}: </strong>
              {renderValue(subValue)}
            </div>
          ))}
        </div>
      );
    }
    return <span className="text-gray-700">{String(value)}</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100">
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold">Comprehensive Code Review</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* File Details */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">File Details</h2>
          <div className="grid grid-cols-2 gap-4 text-gray-600">
            <p>
              <strong>File Name:</strong> {fileDetails.fileName}
            </p>
            <p>
              <strong>Code Length:</strong> {fileDetails.codeLength} characters
            </p>
          </div>
        </section>

        {/* Error Handling */}
        {errorMessage && (
          <section className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{errorMessage}</span>
          </section>
        )}

        {/* Submitted Code */}
        <section className="bg-gray-800 text-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Submitted Code</h2>
          <SyntaxHighlighter
            language="python"
            style={atomOneDark}
            className="rounded-lg"
            showLineNumbers
          >
            {location.state?.code || 'No code submitted'}
          </SyntaxHighlighter>
        </section>

        {/* Comprehensive Review Results */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Review Analysis</h2>
          
          {Object.keys(fileDetails.reviewResults).length === 0 ? (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative">
              <strong className="font-bold">No Review Results</strong>
              <p>The code review did not generate any results. This could be due to an API error or empty response.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(fileDetails.reviewResults).map(([key, value], index) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div 
                    onClick={() => toggleSection(key)}
                    className="flex justify-between items-center p-4 bg-blue-50 cursor-pointer hover:bg-blue-100 transition"
                  >
                    <h3 className="text-lg font-semibold text-blue-700 capitalize">
                      {key.replace(/_/g, ' ')}
                    </h3>
                    {expandedSections[key] ? <ChevronUp /> : <ChevronDown />}
                  </div>
                  
                  {expandedSections[key] && (
                    <div className="p-4 bg-white">
                      {renderValue(value)}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-4">
        <div className="text-center text-sm">
          &copy; {new Date().getFullYear()} Advanced Code Review Platform
        </div>
      </footer>
    </div>
  );
};

export default Results;