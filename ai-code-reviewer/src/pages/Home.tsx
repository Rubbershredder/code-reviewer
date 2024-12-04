import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  const [code, setCode] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Create JSON payload
    const jsonPayload = {
      code,
      fileName: file ? file.name : 'Untitled',
    };

    try {
      // Send to API 
      const response = await fetch('http://localhost:5000/api/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonPayload),
      });

      // Handle API response
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Network response was not ok');
      }

      const result = await response.json();

      // Navigate to results page with API response
      navigate('/results', { 
        state: { 
          code: code,
          apiResult: result 
        } 
      });

    } catch (error) {
      console.error('Error processing code:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCode(event.target.result as string);
        }
      };
      reader.readAsText(selectedFile);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold mb-12 text-center text-primary-800"
      >
        Smart. Fast. Flawless - AI powered code reviews at your fingertips.
      </motion.h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          {error}
        </div>
      )}
      <motion.form
        onSubmit={handleSubmit}
        className="space-y-6 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="mt-8">
          <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
            Paste your code here:
          </label>
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}  
          >
            <textarea
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-64 p-4 border border-gray-300 rounded-md font-mono bg-gray-900 text-green-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
              placeholder="// Paste your code here"
            />
          </motion.div>
        </div>
        <div>
          <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
            Or upload a file:
          </label>
          <input
            type="file"
            id="file"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-primary-50 file:text-primary-700
              hover:file:bg-primary-100 transition-colors duration-300"
          />
        </div>
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isLoading}
            className={`px-8 py-3 rounded-md transition-all duration-300 text-base font-sans border shadow-lg mt-8 ${
              isLoading 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-100 to-purple-100 text-primary-800 hover:from-blue-200 hover:to-purple-200'
            }`}
          >
            {isLoading ? 'Reviewing...' : 'Review Code'}
          </motion.button>
        </div>
      </motion.form>
    </div>
  );
};

export default Home;