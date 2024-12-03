import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  const [code, setCode] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/results', { state: { code } });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target) {
          setCode(event.target.result as string);
        }
      };
      reader.readAsText(e.target.files[0]);
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
            className="px-8 py-3 bg-gradient-to-r from-blue-100 to-purple-100 text-primary-800 rounded-md hover:from-blue-200 hover:to-purple-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-300 text-base font-sans border border-primary-400 shadow-lg mt-8"
          >
            <span className="mr-2 text-primary-800"></span>
            Review Code
            <span className="ml-2 text-primary-800"></span>
          </motion.button>
        </div>
      </motion.form>
    </div>
  );
  
};

export default Home;

