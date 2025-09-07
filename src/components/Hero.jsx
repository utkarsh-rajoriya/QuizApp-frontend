import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Content from "./Content";
import { FaTrophy, FaMedal, FaStar } from "react-icons/fa";
import { motion } from "framer-motion";

const Hero = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [performance, setPerformance] = useState({ score: 0, played: 0 });

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const userEmail = localStorage.getItem("useremail");
        if (!userEmail) {
          console.warn("User email not found in localStorage.");
          setPerformance({ score: 75, played: 100 });
          return;
        }

        const response = await fetch(
          `${baseUrl}/api/user/getscore/${userEmail}`
        );
        if (!response.ok) throw new Error("Failed to fetch score");

        const data = await response.json();
        setPerformance({
          score: data.score || 0,
          played: data.played || 0,
        });
      } catch (error) {
        console.error("Error fetching score:", error);
        setPerformance({ score: 75, played: 100 }); // fallback score
      }
    };

    fetchScore();
  }, []);

  const scorePercentage =
    performance.played > 0 ? (performance.score / performance.played) * 25 : 0;

  return (
    <div className="relative bg-[#19213a] min-h-screen w-full font-poppins overflow-hidden">
      {/* Background Aurora */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 md:w-[500px] md:h-[500px] bg-blue-500/20 rounded-full filter blur-3xl animate-pulse opacity-50"></div>
        <div
          className="absolute -bottom-40 -right-40 w-96 h-96 md:w-[500px] md:h-[500px] bg-pink-500/20 rounded-full filter blur-3xl animate-pulse opacity-50"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <div className="relative z-10">
        <Navbar />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="p-4 md:p-8"
        >
          <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Top Players */}
            <div className="relative bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-white/10 overflow-hidden">
              <div className="flex items-center gap-4 mb-6">
                <FaTrophy className="text-3xl text-yellow-400" />
                <h2 className="text-2xl font-bold text-white">Top Players</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center bg-slate-900/50 p-3 rounded-lg">
                  <FaMedal className="text-4xl text-yellow-400 mr-4" />
                  <span className="text-lg font-semibold text-gray-200">
                    Utkarsh
                  </span>
                </div>
                <div className="flex items-center bg-slate-900/50 p-3 rounded-lg">
                  <FaMedal className="text-4xl text-gray-300 mr-4" />
                  <span className="text-lg font-semibold text-gray-200">
                    Arpita
                  </span>
                </div>
                <div className="flex items-center bg-slate-900/50 p-3 rounded-lg">
                  <FaMedal className="text-4xl text-amber-600 mr-4" />
                  <span className="text-lg font-semibold text-gray-200">
                    Anonymous
                  </span>
                </div>
              </div>
            </div>

            {/* Score Progress */}
            <div className="relative bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-white/10 flex flex-col items-center justify-center">
              <div className="relative w-48 h-48 md:w-56 md:h-56">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    className="text-slate-700"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                    r="45"
                    cx="50"
                    cy="50"
                  />
                  <motion.circle
                    r="45"
                    cx="50"
                    cy="50"
                    stroke="currentColor"
                    strokeWidth="10"
                    fill="transparent"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: scorePercentage / 100 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="text-blue-500"
                    style={{
                      transform: "rotate(-90deg)",
                      transformOrigin: "center",
                    }}
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <FaStar className="text-4xl text-yellow-400 mb-2" />
                  <p className="font-bold text-white text-4xl tracking-wide">
                    {performance.score}
                    <span className="text-2xl text-gray-400">
                      /{performance.played}
                    </span>
                  </p>
                  <p className="text-sm text-gray-400">Total Score</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <Content />
      </div>
    </div>
  );
};

export default Hero;
