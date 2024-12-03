import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const headerBackground = useTransform(
    scrollY,
    [0, 50],
    ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.8)"]
  );

  useEffect(() => {
    const unsubscribe = scrollY.onChange((latest) => {
      setIsScrolled(latest > 50);
    });
    return () => unsubscribe();
  }, [scrollY]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-100 to-secondary-100 text-gray-900">
      <motion.header
        style={{ background: headerBackground }}
        className={`fixed top-0 left-0 right-0 z-50 transition-shadow duration-300 ${
          isScrolled ? "shadow-md backdrop-blur-sm" : ""
        }`}
      >
        <nav className="container mx-auto px-6 py-4">
          <Link
            to="/"
            className="text-2xl font-bold text-primary-800 hover:text-primary-600 transition-colors duration-300 font-mono"
          >
            &lt;CodeSense/&gt;
          </Link>
        </nav>
      </motion.header>
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-6 py-24"
      >
        {children}
      </motion.main>
    </div>
  );
};

export default Layout;
