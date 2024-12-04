import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

interface ResultSection {
  title: string;
  content: string;
}

const ResultSection: React.FC<ResultSection> = ({ title, content }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="mb-6"
  >
    <h2 className="text-xl font-semibold mb-2 text-primary-800">{title}</h2>
    <div className="bg-white p-4 rounded-md shadow-md">
      <p className="text-gray-700">{content}</p>
    </div>
  </motion.div>
);

const Results = () => {
  const location = useLocation();
  const { code } = location.state as { code: string };

  const analysisResults = {
    summary: "This is a sample Python code that defines a function to calculate the factorial of a number.",
    bugs: "No major bugs detected.",
    codeStyle: "The code follows PEP 8 style guidelines.",
    codeStructure: "The code has a clear and simple structure with a single function definition.",
    performance: "The current implementation is recursive, which may cause stack overflow for large numbers. Consider using an iterative approach for better performance.",
    security: "No security issues detected in this simple function.",
    scalability: "The function is self-contained and can be easily reused in larger projects.",
    readability: "The code is easy to read and understand. Consider adding a docstring to explain the function's purpose and parameters.",
    conclusion: "Overall, this is a good implementation of a factorial function. Consider the performance suggestion for handling larger numbers."
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold mb-8 text-center text-primary-800"
      >
        Code Review Results
      </motion.h1>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-semibold mb-4 text-primary-700">Submitted Code</h2>
        <SyntaxHighlighter
          language="python"
          style={atomOneDark}
          className="rounded-md shadow-md"
          showLineNumbers
        >
          {code}
        </SyntaxHighlighter>
      </motion.div>
      {Object.entries(analysisResults).map(([key, value], index) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * index, duration: 0.5 }}
        >
          <ResultSection
            title={key.charAt(0).toUpperCase() + key.slice(1)}
            content={value}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default Results;

