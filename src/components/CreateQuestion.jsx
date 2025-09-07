import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import { FaLayerGroup, FaQuestionCircle, FaCheckCircle, FaTachometerAlt } from 'react-icons/fa'; // Added FaTachometerAlt
import { motion } from 'framer-motion';
import RoboMsg from "../components/RoboMsg";

const CreateQuestion = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [category, setCategory] = useState('');
  const [qtn, setQtn] = useState('');
  const [options, setOptions] = useState({
    option1: '',
    option2: '',
    option3: '',
    option4: '',
  });
  const [correctAnswerKey, setCorrectAnswerKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleOptionChange = (e) => {
    const { name, value } = e.target;
    setOptions(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const questionData = {
      category,
      qtn,
      option1: options.option1,
      option2: options.option2,
      option3: options.option3,
      option4: options.option4,
      answer: options[correctAnswerKey],
      author: localStorage.getItem("username") || "anonymous",
    };

    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/api/question/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(questionData),
      });

      if (!response.ok) throw new Error("Failed to save question");

      setSuccessMsg("✅ Question saved! Keep going 💡");
      setCategory('');
      setQtn('');
      setOptions({ option1: '', option2: '', option3: '', option4: '' });
      setCorrectAnswerKey('');
    } catch (err) {
      console.error("Submit error:", err);
      alert("Something went wrong while saving the question.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-hide RoboMsg after 5 seconds
  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  return (
    <div className="relative bg-slate-900 min-h-screen font-poppins text-white p-4 sm:p-6 md:p-8 flex items-center justify-center overflow-hidden">
      {/* Aurora Background */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl animate-pulse opacity-50"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full filter blur-3xl animate-pulse opacity-50" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Dashboard Navigation Button */}
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="absolute top-6 left-6 z-20"
      >
        <Link
          to="/hero"
          className="flex items-center gap-2 px-4 py-2 bg-[#1e293b]/50 backdrop-blur-lg border border-white/10 rounded-full text-white hover:bg-blue-500/50 transition-colors duration-300 shadow-lg"
        >
          <FaTachometerAlt />
          <span>Dashboard</span>
        </Link>
      </motion.div>

      {/* RoboMsg */}
      {successMsg && (
        <div className="z-20 absolute bottom-[4vh] right-10 md:right-20 lg:bottom-0">
          <RoboMsg msg={successMsg} type="happy" delay={0.2} />
        </div>
      )}

      {/* Main Form Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="relative z-10 w-full max-w-2xl bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/10"
      >
        <header className="text-center mb-8 pt-12 md:pt-0">
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-400">
            Add a New Question
          </h1>
          <p className="text-gray-400 mt-2">Fill in the details below to expand your question bank.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Input */}
          <div className="relative">
            <FaLayerGroup className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="category"
              placeholder="Question Category (e.g., 'JavaScript', 'History')"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full bg-slate-900/50 border border-white/20 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            />
          </div>

          {/* Question Input */}
          <div className="relative">
            <FaQuestionCircle className="absolute top-5 left-4 text-gray-400" />
            <textarea
              name="qtn"
              placeholder="Type your question here..."
              value={qtn}
              onChange={(e) => setQtn(e.target.value)}
              required
              rows="4"
              className="w-full bg-slate-900/50 border border-white/20 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            />
          </div>

          {/* Options Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.keys(options).map((key, index) => (
              <div key={key} className="relative flex items-center">
                <input
                  type="text"
                  name={key}
                  placeholder={`Option ${index + 1}`}
                  value={options[key]}
                  onChange={handleOptionChange}
                  required
                  className="w-full bg-slate-900/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setCorrectAnswerKey(key)}
                  title="Mark as correct answer"
                  className={`absolute right-2 text-xl transition-all duration-300 ${correctAnswerKey === key ? 'text-green-400 scale-110' : 'text-gray-500 hover:text-green-500'}`}
                >
                  <FaCheckCircle />
                </button>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 pt-4">
            <button
              type="button"
              className="px-8 py-3 rounded-lg bg-gray-600/50 text-gray-300 hover:bg-gray-600/80 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!correctAnswerKey || loading}
              className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save Question'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateQuestion;
