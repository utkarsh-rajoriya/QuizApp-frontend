import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaPlus, FaTrash, FaTachometerAlt } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import RoboMsg from "../components/RoboMsg";
import StarBorder from "../stylings/StarBorder";

const CreateQuiz = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [title, setTitle] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [showAiGenerate, setShowAiGenerate] = useState(false);
  const [aiTitle, setAiTitle] = useState("");
  const [aiCategory, setAiCategory] = useState("");
  const [aiNumQs, setAiNumQs] = useState(0);
  const [aiAuthor, setAiAuthor] = useState(
    localStorage.getItem("username") || "anonymous"
  );

  // Fetch questions with debounce
  useEffect(() => {
    const controller = new AbortController();

    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const endpoint = searchTerm.trim()
          ? `${baseUrl}/api/question/search/${encodeURIComponent(searchTerm)}`
          : `${baseUrl}/api/question/getAll`;

        const response = await fetch(endpoint, { signal: controller.signal });
        if (!response.ok) throw new Error("Failed to fetch questions.");

        const data = await response.json();
        setQuestions(data);
      } catch (err) {
        if (err.name !== "AbortError") console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(fetchQuestions, 400);
    return () => {
      clearTimeout(delayDebounce);
      controller.abort();
    };
  }, [searchTerm]);

  // Success message timeout
  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  const handleAddQuestion = (question) => {
    if (!selectedQuestions.some((q) => q.id === question.id)) {
      setSelectedQuestions([...selectedQuestions, question]);
    }
  };

  const handleRemoveQuestion = (questionId) => {
    setSelectedQuestions(selectedQuestions.filter((q) => q.id !== questionId));
  };

  const handleCreateQuiz = async () => {
    if (!title.trim()) {
      alert("Quiz title is required.");
      return;
    }
    if (selectedQuestions.length === 0) {
      alert("Please select at least one question.");
      return;
    }

    const quizPayload = {
      title,
      qids: selectedQuestions.map((q) => q.id),
      author: localStorage.getItem("username") || "anonymous",
    };

    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/api/quiz/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quizPayload),
      });

      if (!response.ok) throw new Error("Failed to create quiz.");

      const data = await response.json();
      console.log(data);

      if (data.message === "created") {
        setSuccessMsg("✅ Quiz created successfully! 🧠🎉");
        setTitle("");
        setSelectedQuestions([]);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const generateByAi = async () => {
    if (!aiTitle.trim() || !aiCategory.trim()) {
      alert("Please fill in title and category for AI generation.");
      return;
    }

    if (!aiNumQs || aiNumQs < 1 || aiNumQs > 5) {
      alert("Number of questions must be between 1 and 5.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${baseUrl}/api/quiz/createByAi`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: aiTitle,
          category: aiCategory,
          numQs: aiNumQs,
          author: aiAuthor || "anonymous",
        }),
      });

      if (!response.ok) throw new Error("Failed to generate quiz.");

      const data = await response.json();

      if (data.message === "created") {
        setSuccessMsg("✅ AI Quiz generated successfully! 🧠✨");
        setAiTitle("");
        setAiCategory("");
        setAiAuthor("");
        setAiNumQs(1);
        setShowAiGenerate(false);

        // Optionally, update your questions list
        if (data.quiz?.questions) {
          setQuestions((prev) => [...data.quiz.questions, ...prev]);
        }
      } else {
        alert("AI generation failed. Try again.");
      }
    } catch (err) {
      console.error(err);
      alert("AI generation failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-[#0f172a] min-h-screen font-poppins text-white p-4 sm:p-6 md:p-8 overflow-hidden">
      {/* Aurora Background */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl animate-pulse opacity-50"></div>
        <div
          className="absolute -bottom-20 -right-10 w-96 h-96 bg-pink-500/20 rounded-full filter blur-3xl animate-pulse opacity-50"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* AI Generate Modal */}
      {showAiGenerate && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6"
        >
          <div className="bg-[#1e293b] rounded-2xl p-6 w-full max-w-md border border-white/10 shadow-xl space-y-6">
            <h2 className="text-2xl font-bold text-center text-gradient bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Generate Quiz with AI
            </h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter quiz title..."
                value={aiTitle}
                onChange={(e) => setAiTitle(e.target.value)}
                className="w-full bg-[#0f172a]/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              />
              <input
                type="text"
                placeholder="Enter category..."
                value={aiCategory}
                onChange={(e) => setAiCategory(e.target.value)}
                className="w-full bg-[#0f172a]/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              />
              <input
                type="number"
                placeholder="Number of questions..."
                value={aiNumQs}
                onChange={(e) => {
                  const value = Math.min(Number(e.target.value), 5);
                  setAiNumQs(value);
                }}
                min={1}
                max={5}
                className="w-full bg-[#0f172a]/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              />

              <input
                type="text"
                placeholder="Author name..."
                value={aiAuthor}
                onChange={(e) => setAiAuthor(e.target.value)}
                className="w-full bg-[#0f172a]/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              />
            </div>

            <div className="flex justify-between gap-4">
              <button
                onClick={() => setShowAiGenerate(false)}
                className="w-1/2 px-6 py-3 rounded-lg bg-gray-600/50 text-gray-300 hover:bg-gray-600/80 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={generateByAi}
                disabled={loading}
                className="w-1/2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? "Generating..." : "Generate"}
              </button>
            </div>
          </div>
        </motion.div>
      )}

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

      {/* Generate with AI Button */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="absolute top-6 right-6 z-20"
      >
        <button
          onClick={() => setShowAiGenerate(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#1e293b]/50 backdrop-blur-lg border border-white/10 rounded-full hover:bg-purple-500/50 transition-colors duration-300 shadow-lg"
        >
          <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent font-semibold">
            Generate with AI
          </span>
        </button>
      </motion.div>

      {/* RoboMsg success message */}
      {successMsg && (
        <div className="z-20 absolute bottom-[4vh] right-10 md:right-20 lg:bottom-0">
          <RoboMsg msg={successMsg} type="celebrate" delay={0.2} />
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <header className="text-center mb-10 pt-16 md:pt-0">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-400">
            Create a New Quiz
          </h1>
          <p className="text-gray-400 mt-2">
            Build your quiz by giving it a title and choosing questions.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3 bg-[#1e293b]/50 backdrop-blur-lg rounded-2xl p-6 border border-white/10 space-y-8"
          >
            <div>
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <span className="bg-blue-500 text-white rounded-full h-8 w-8 flex items-center justify-center mr-3">
                  1
                </span>
                Give your quiz a title
              </h2>
              <input
                type="text"
                placeholder="Enter Quiz Title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#0f172a]/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              />
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <span className="bg-blue-500 text-white rounded-full h-8 w-8 flex items-center justify-center mr-3">
                  2
                </span>
                Your questions ({selectedQuestions.length})
              </h2>
              <div className="space-y-3 max-h-96 min-h-[10rem] overflow-y-auto pr-2 rounded-lg border border-[#0f172a]/50 p-4">
                <AnimatePresence>
                  {/* Selected Questions List */}
                  {selectedQuestions.length > 0 ? (
                    selectedQuestions.map((q, idx) => (
                      <motion.div
                        key={q.id || q._id || idx} // ✅ unique key
                        layout
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{
                          opacity: 0,
                          x: -20,
                          transition: { duration: 0.2 },
                        }}
                        className="flex items-center justify-between bg-[#0f172a]/70 p-3 rounded-lg"
                      >
                        <p className="flex-1 mr-4 text-gray-200">
                          {q.qtn || q.text}
                        </p>
                        <button
                          aria-label="Remove question"
                          onClick={() => handleRemoveQuestion(q.id || q._id)}
                          className="text-red-500 hover:text-red-400 transition-colors p-2 rounded-full hover:bg-red-500/10"
                        >
                          <FaTrash />
                        </button>
                      </motion.div>
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-center">
                      <p>Add questions from the bank on the right.</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2 bg-[#1e293b]/50 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
          >
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <span className="bg-blue-500 text-white rounded-full h-8 w-8 flex items-center justify-center mr-3">
                3
              </span>
              Question Bank
            </h2>
            <div className="relative mb-4">
              <FaSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#0f172a]/50 border border-white/20 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              />
            </div>
            <div className="space-y-3 max-h-[34rem] lg:max-h-[28rem] overflow-y-auto pr-2">
              {/* Question Bank */}
              {questions.length > 0 ? (
                questions.map((q, idx) => (
                  <div
                    key={q.id || q._id || idx} // ✅ unique key
                    className="flex items-center justify-between bg-[#0f172a]/70 p-3 rounded-lg hover:bg-[#0f172a] transition-colors"
                  >
                    <p className="flex-1 mr-4 text-gray-300">{q.qtn}</p>
                    <button
                      aria-label="Add question"
                      onClick={() => handleAddQuestion(q)}
                      disabled={selectedQuestions.some(
                        (sq) => sq.id === q.id || sq._id === q._id
                      )}
                      className="text-green-500 p-2 rounded-full hover:bg-green-500/10 transition-all disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                    >
                      <FaPlus />
                    </button>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-40 text-gray-400 text-center">
                  <p>No questions match your search.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-center gap-4 mt-10"
        >
          <button className="px-8 py-3 rounded-lg bg-gray-600/50 text-gray-300 hover:bg-gray-600/80 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleCreateQuiz}
            disabled={loading}
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Quiz"}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateQuiz;
