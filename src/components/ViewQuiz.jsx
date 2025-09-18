import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";


const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-20">
    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-600"></div>
    <p className="ml-4 text-xl text-gray-300">Loading Quiz...</p>
  </div>
);

const FeedbackIcon = ({ isCorrect }) =>
  isCorrect ? (
    <svg
      className="w-6 h-6 text-green-500"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      ></path>
    </svg>
  ) : (
    <svg
      className="w-6 h-6 text-red-500"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
      ></path>
    </svg>
  );

const ViewQuiz = () => {
  const { id } = useParams();
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizFinished, setQuizFinished] = useState(false);
  const [score, setScore] = useState(0);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchQuizData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${baseUrl}/api/quiz/get/${id}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setQuizData(data);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
        setError(
          "Could not load the quiz. It might not exist or there's a network issue."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [id]);

  const handleAnswerSelect = (questionId, answer) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  const handleSubmitQuiz = async () => {
    // 1. Calculate the score
    let currentScore = 0;
    quizData.questions.forEach((question) => {
      if (selectedAnswers[question.id] === question.answer) {
        currentScore++;
      }
    });

    // 2. Prepare the data to be sent to the backend
    const scoreData = {
      // TODO: Replace with actual logged-in user ID from context or local storage
      email: localStorage.getItem("useremail"),
      score: currentScore,
    };

    // 3. Send the score to the backend API
    try {
      const response = await fetch(`${baseUrl}/api/user/postscore`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(scoreData),
      });

      if (!response.ok) {
        throw new Error(`API error! Status: ${response.status}`);
      }

      const result = await response.json();
    } catch (error) {
      console.error("Failed to save score:", error);
      // You could optionally show a small, non-blocking notification to the user here
    }

    // 4. Update the UI to show the results page
    setScore(currentScore);
    setQuizFinished(true);
  };

  const handleTryAgain = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setScore(0);
    setQuizFinished(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#19213a] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#19213a] flex flex-col items-center justify-center text-red-500">
        <p className="text-2xl">{error}</p>
        <Link
          to="/"
          className="mt-4 px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Go Back
        </Link>
      </div>
    );
  }

  if (!quizData) {
    return (
      <div className="min-h-screen bg-[#19213a] flex items-center justify-center text-xl text-gray-300">
        Quiz not found.
      </div>
    );
  }

  if (quizFinished) {
    return (
      <div className="min-h-screen bg-[#19213a] py-8 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800">
            Quiz Results
          </h2>
          <p className="text-lg text-center text-gray-600 mt-2">
            For {quizData.title} Quiz
          </p>

          <div className="my-8 text-center">
            <p className="text-xl text-gray-700">You Scored</p>
            <p className="text-6xl font-bold text-blue-600">
              {score} / {quizData.questions.length}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold border-b pb-2">
              Review Your Answers
            </h3>
            {quizData.questions.map((question, index) => {
              const userAnswer = selectedAnswers[question.id];
              const isCorrect = userAnswer === question.answer;
              return (
                <div
                  key={question.id}
                  className={`p-4 rounded-lg border ${
                    isCorrect
                      ? "border-green-300 bg-green-50"
                      : "border-red-300 bg-red-50"
                  }`}
                >
                  <p className="font-semibold text-gray-800">
                    {index + 1}. {question.qtn}
                  </p>
                  <div className="mt-2 flex items-center">
                    <FeedbackIcon isCorrect={isCorrect} />
                    <p className="ml-2">
                      Your answer:{" "}
                      <span className="font-medium">
                        {userAnswer || "Not answered"}
                      </span>
                    </p>
                  </div>
                  {!isCorrect && (
                    <p className="mt-1 ml-8 text-green-700">
                      Correct answer:{" "}
                      <span className="font-medium">{question.answer}</span>
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex justify-center space-x-4">
            <button
              onClick={handleTryAgain}
              className="px-8 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <Link
              to="/Hero"
              className="px-8 py-3 font-semibold text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
            >
              Back to Quizzes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = quizData.questions[currentQuestionIndex];
  const options = [
    currentQuestion.option1,
    currentQuestion.option2,
    currentQuestion.option3,
    currentQuestion.option4,
  ];

  return (
    <div className="min-h-screen bg-[#19213a] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 transition-all duration-500">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-bold text-blue-900">
              {quizData.title} Quiz
            </h2>
            <p className="text-gray-600 font-semibold">
              Question {currentQuestionIndex + 1}{" "}
              <span className="text-gray-400">
                / {quizData.questions.length}
              </span>
            </p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{
                width: `${
                  ((currentQuestionIndex + 1) / quizData.questions.length) * 100
                }%`,
              }}
            ></div>
          </div>
        </div>

        <div className="mb-8">
          <p className="text-xl font-medium text-gray-800">
            {currentQuestion.qtn}
          </p>
        </div>

        <div className="space-y-4">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(currentQuestion.id, option)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 font-medium ${
                selectedAnswers[currentQuestion.id] === option
                  ? "bg-blue-500 border-blue-600 text-white shadow-lg"
                  : "bg-white border-gray-300 hover:bg-blue-50 hover:border-blue-400"
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleNextQuestion}
            disabled={!selectedAnswers[currentQuestion.id]}
            className="px-8 py-3 font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none transform hover:scale-105 transition-all duration-200"
          >
            {currentQuestionIndex < quizData.questions.length - 1
              ? "Next Question"
              : "Submit Quiz"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewQuiz;
