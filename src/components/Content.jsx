import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-10">
    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
  </div>
);

const Content = () => {
  const [quiz, setQuiz] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // 2. Initialize navigate

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${baseUrl}/api/quiz/getAll`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setQuiz(data);
      } catch (error) {
        console.error("Error fetching content:", error);
        setError("Failed to load quizzes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderContent = () => {
    if (loading) {
      return <LoadingSpinner />;
    }

    if (error) {
      return <p className="text-center text-red-500 p-4">{error}</p>;
    }

    if (quiz.length === 0) {
      return (
        <p className="text-center text-gray-500 p-4">
          No quizzes available at the moment.
        </p>
      );
    }

    return quiz.map((item, index) => (
      <div
        key={item.id || index}
        className="p-4 mb-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 flex items-center justify-between"
      >
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
          <p className="text-sm text-gray-500 mt-1">By: {item.author}</p>
        </div>
        {/* 3. Add onClick handler to the button */}
        <button
          onClick={() => navigate(`/viewquiz/${item.id}`)}
          className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform hover:scale-105 transition-transform duration-200"
        >
          Start Quiz
        </button>
      </div>
    ));
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 md:w-[40rem] lg:min-w-7xl">
        {/* Quiz Content */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">
            Available Quizzes
          </h2>
          <div className="spacey-y-4">{renderContent()}</div>
        </div>

        {/* Event-News Sidebar */}
        <div className="lg:col-span-1">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-xl">
            <h3 className="text-xl font-bold mb-4">Featured</h3>
            <div className="p-4 bg-white/20 rounded-lg">
              <p className="font-semibold">New History Quiz Added!</p>
              <p className="text-sm mt-2 opacity-90">
                Test your knowledge of ancient civilizations. Can you score
                100%?
              </p>
              <button className="mt-4 w-full px-4 py-2 text-sm font-bold bg-white text-blue-700 rounded-lg hover:bg-blue-100 transition-colors duration-300">
                Play Now
              </button>
            </div>
            <div className="mt-6">
              <h4 className="font-semibold">News & Updates</h4>
              <ul className="list-disc list-inside mt-2 space-y-2 text-sm opacity-90">
                <li>Leaderboards are now live.</li>
                <li>New science quizzes coming next week.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content;
