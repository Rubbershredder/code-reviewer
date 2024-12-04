import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

const Results = () => {
  const location = useLocation();
  const { code, apiResult } = location.state as {
    code: string;
    apiResult: {
      reviewResults: Record<string, string>;
      fileName: string;
      codeLength: number;
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold">Code Review Results</h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* File Details */}
        <section className="mb-6 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">File Details</h2>
          <div className="grid grid-cols-2 gap-4 text-gray-600">
            <p>
              <strong>File Name:</strong> {apiResult.fileName}
            </p>
            <p>
              <strong>Code Length:</strong> {apiResult.codeLength} characters
            </p>
          </div>
        </section>

        {/* Submitted Code */}
        <section className="mb-8 bg-gray-800 text-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Submitted Code</h2>
          <SyntaxHighlighter
            language="python"
            style={atomOneDark}
            className="rounded-lg"
            showLineNumbers
          >
            {code}
          </SyntaxHighlighter>
        </section>

        {/* Review Results */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Review Results</h2>
          <div className="grid gap-6">
            {Object.entries(apiResult.reviewResults).map(([key, value], index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                className="bg-white p-4 rounded-lg shadow-md"
              >
                <h3 className="text-lg font-medium text-blue-600">{key}</h3>
                <p className="text-gray-700 mt-2">{value}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4">
        <div className="text-center text-sm">
          &copy; {new Date().getFullYear()} Code Review Platform. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Results;
