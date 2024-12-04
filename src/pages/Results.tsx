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
  const { code, apiResult } = location.state as { 
    code: string, 
    apiResult: { 
      reviewResults: Record<string, string>,
      fileName: string,
      codeLength: number 
    } 
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
      
      <div className="mb-6 bg-gray-100 p-4 rounded-md">
        <h2 className="text-lg font-semibold mb-2">File Details</h2>
        <p>File Name: {apiResult.fileName}</p>
        <p>Code Length: {apiResult.codeLength} characters</p>
      </div>

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

      {Object.entries(apiResult.reviewResults).map(([key, value], index) => (
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