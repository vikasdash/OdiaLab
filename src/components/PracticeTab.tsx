import React, { useState, useEffect } from "react";
import { 
  Award, 
  BookOpen, 
  Plus, 
  HelpCircle, 
  Trophy, 
  X, 
  Play, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  Clock,
  Sparkles,
  RotateCcw
} from "lucide-react";
import { QuizQuestion, StudentProfile, QuizResult } from "../types";
import { MOCK_QUESTIONS } from "../data";

interface PracticeTabProps {
  profile: StudentProfile;
  setProfile: React.Dispatch<React.SetStateAction<StudentProfile>>;
}

export default function PracticeTab({ profile, setProfile }: PracticeTabProps) {
  
  const [quizState, setQuizState] = useState<"idle" | "running" | "ended">("idle");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  
  // Custom generated quiz questions
  const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userSelections, setUserSelections] = useState<Record<number, number>>({}); // { questionIdx: optionIdx }
  
  // Scoring parameters
  const [finalScore, setFinalScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(60); // 60 seconds

  // Categories of mock tests available
  const categories = ["All", "Odisha GK & Culture", "Odia Grammar (ଓଡ଼ିଆ)", "Computer Awareness", "Quantitative Aptitude"];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (quizState === "running" && timeRemaining > 0) {
      timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (quizState === "running" && timeRemaining === 0) {
      handleCompleteQuiz();
    }
    return () => clearTimeout(timer);
  }, [quizState, timeRemaining]);

  const handleStartQuiz = (category: string) => {
    let baseQs = MOCK_QUESTIONS;
    if (category !== "All") {
      baseQs = MOCK_QUESTIONS.filter(q => q.category === category);
    }
    
    if (baseQs.length === 0) {
      alert("No questions configured for this category yet! Starting the standard Mixed Mock Quiz instead.");
      baseQs = MOCK_QUESTIONS;
    }

    // Pick at most 5 random questions
    const shuffled = [...baseQs].sort(() => 0.5 - Math.random()).slice(0, 5);
    setActiveQuestions(shuffled);
    setCurrentQuestionIndex(0);
    setUserSelections({});
    setTimeRemaining(90); // 90 seconds
    setQuizState("running");
  };

  const handleSelectOption = (optionIndex: number) => {
    if (userSelections[currentQuestionIndex] !== undefined) return; // Locked on selection
    
    setUserSelections(prev => ({
      ...prev,
      [currentQuestionIndex]: optionIndex
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < activeQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleCompleteQuiz();
    }
  };

  const handleCompleteQuiz = () => {
    // Calculate correct ratio
    let correctCount = 0;
    activeQuestions.forEach((q, idx) => {
      const selection = userSelections[idx];
      if (selection === q.correctOption) {
        correctCount++;
      }
    });

    setFinalScore(correctCount);
    setQuizState("ended");

    // Update Student Profile stats
    setProfile(prev => ({
      ...prev,
      solvedCount: prev.solvedCount + 1,
      studyMinutes: prev.studyMinutes + (correctCount * 10) + 10 // score bonus minutes
    }));
  };

  const getAccuracyEmoji = (score: number, total: number) => {
    const ratio = score / total;
    if (ratio === 1) return "🥇 Outstanding! Absolute Rank 1 Material!";
    if (ratio >= 0.7) return "🥈 Excellent! Highly Competitive Score!";
    return "🥉 Good attempt! Ask Guru AI to explain the grammar rules.";
  };

  return (
    <div className="flex flex-col gap-4 p-4 pb-8 animate-fade-in">
      
      {/* Tab Banner Detail */}
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-display font-bold text-slate-950 flex items-center gap-1.5">
          <Award className="text-primary-500" size={18} />
          GK & Grammar Mock Desk
        </h3>
        <p className="text-xs text-slate-500">Practice high-yield state paper questions with timers.</p>
      </div>

      {/* QUIZ STATE: IDLE (Selection) */}
      {quizState === "idle" && (
        <div className="flex flex-col gap-4">
          
          {/* Quick instructions indicator */}
          <div className="bg-gradient-to-r from-primary-50 to-primary-100/30 border border-primary-100 p-4 rounded-2xl">
            <h4 className="text-xs font-bold text-primary-950 uppercase tracking-widest flex items-center gap-1.5">
              <Trophy size={14} className="text-amber-500" />
              State Assessment Rules
            </h4>
            <ul className="text-[11px] text-slate-650 mt-2 list-disc list-inside space-y-1 font-medium leading-relaxed">
              <li>Each mock set consists of 5 highly curated objective questions.</li>
              <li>You have 90 seconds to submit the complete form.</li>
              <li>Answering correctly rewards study bonus credits on your global leaderboard.</li>
            </ul>
          </div>

          <div className="flex flex-col gap-2.5">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Choose Mock Category</h4>
            
            <div className="grid grid-cols-1 gap-2.5">
              {categories.map((cat) => {
                const countOfQs = cat === "All" 
                  ? MOCK_QUESTIONS.length 
                  : MOCK_QUESTIONS.filter(q => q.category === cat).length;
                
                return (
                  <div 
                    key={cat}
                    className="bg-white border border-slate-200 hover:border-primary-300 p-3.5 rounded-xl flex items-center justify-between shadow-xs transition-all duration-200"
                  >
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 leading-snug">{cat === "All" ? "Combined Syllabus Mock Test" : cat}</h5>
                      <span className="text-[10px] text-slate-400 font-mono font-bold">{countOfQs} High-Yield questions ready</span>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedCategory(cat);
                        handleStartQuiz(cat);
                      }}
                      className="bg-primary-500 hover:bg-primary-600 text-white font-bold text-[10px] py-1.5 px-3 rounded-lg duration-200 flex items-center gap-1 cursor-pointer"
                    >
                      <Play size={10} className="fill-white" />
                      <span>Start</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* QUIZ STATE: ACTIVE EXAM (Running) */}
      {quizState === "running" && activeQuestions.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-4 shadow-sm">
          
          {/* Top Timer and Progress tracking info */}
          <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-100 font-bold">
            <span className="text-primary-500 uppercase font-mono tracking-widest">
              Question {currentQuestionIndex + 1} of {activeQuestions.length}
            </span>
            <div className={`flex items-center gap-1 font-mono px-2.5 py-1 rounded-full ${
              timeRemaining < 20 ? "bg-red-50 text-red-600 animate-pulse border border-red-100" : "bg-slate-100 text-slate-600"
            }`}>
              <Clock size={12} />
              <span>{timeRemaining} Seconds</span>
            </div>
          </div>

          {/* Progress bar visualizer */}
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary-500 transition-all duration-300 rounded-full"
              style={{ width: `${((currentQuestionIndex + 1) / activeQuestions.length) * 100}%` }}
            />
          </div>

          {/* Main Question context */}
          <div className="py-2">
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
              {activeQuestions[currentQuestionIndex].category}
            </span>
            <h4 className="text-sm font-bold text-slate-900 mt-2 font-display leading-snug">
              {activeQuestions[currentQuestionIndex].question}
            </h4>
          </div>

          {/* Selection options wrapper */}
          <div className="flex flex-col gap-2.5">
            {activeQuestions[currentQuestionIndex].options.map((option, idx) => {
              const currentSelection = userSelections[currentQuestionIndex];
              const isOptionSelected = currentSelection === idx;
              const isCorrectOption = idx === activeQuestions[currentQuestionIndex].correctOption;
              const hasSelectedAny = currentSelection !== undefined;

              let borderClass = "border-slate-200/85 hover:border-slate-300 bg-slate-50/50";
              let badgeText = String.fromCharCode(65 + idx); // A, B, C, D
              let badgeColor = "bg-slate-200 text-slate-700";

              if (hasSelectedAny) {
                if (isOptionSelected) {
                  if (isCorrectOption) {
                    borderClass = "border-primary-500 bg-primary-50 text-primary-950";
                    badgeColor = "bg-primary-500 text-white";
                  } else {
                    borderClass = "border-rose-500 bg-rose-50 text-rose-950";
                    badgeColor = "bg-rose-500 text-white";
                  }
                } else if (isCorrectOption) {
                  // Reveal correct answer immediately to enhance pedagogy
                  borderClass = "border-primary-300 bg-primary-50/30 text-primary-900";
                  badgeColor = "bg-primary-500/80 text-white";
                } else {
                  borderClass = "border-slate-100 bg-white/50 text-slate-400";
                  badgeColor = "bg-slate-100 text-slate-400";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={hasSelectedAny}
                  className={`w-full p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${borderClass} cursor-pointer`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold leading-none shrink-0 ${badgeColor}`}>
                    {badgeText}
                  </span>
                  <span className="text-xs font-semibold leading-relaxed">{option}</span>
                </button>
              );
            })}
          </div>

          {/* Direct feedback explanation block if answered */}
          {userSelections[currentQuestionIndex] !== undefined && (
            <div className="bg-slate-50 rounded-xl p-3 text-[11px] border border-slate-150 animate-fade-in leading-relaxed">
              <span className="font-bold text-slate-800 block mb-0.5">💡 Explanation Brief:</span>
              <p className="text-slate-600 font-medium">
                {activeQuestions[currentQuestionIndex].explanation}
              </p>
            </div>
          )}

          {/* Nav Controls */}
          <div className="pt-2 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleNextQuestion}
              disabled={userSelections[currentQuestionIndex] === undefined}
              className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                userSelections[currentQuestionIndex] !== undefined
                  ? "bg-primary-500 text-white shadow-xs"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
              }`}
            >
              <span>{currentQuestionIndex === activeQuestions.length - 1 ? "Submit Paper" : "Next Question"}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* QUIZ STATE: SUMMARY REPORT CARD (Ended) */}
      {quizState === "ended" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-4 text-center shadow-sm relative overflow-hidden">
          
          <div className="text-4xl animate-bounce pt-2">⭐</div>
          
          <div>
            <span className="text-[10px] font-bold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Assessment Completed
            </span>
            <h4 className="text-base font-display font-black text-slate-900 mt-2.5">
              OdiaLab Mock Score Card
            </h4>
            <div className="my-4 py-3 bg-slate-50 rounded-2xl max-w-[150px] mx-auto border border-slate-100">
              <span className="block text-3xl font-mono font-black text-primary-500">{finalScore} / {activeQuestions.length}</span>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest block mt-0.5">CORRECT RESPONSES</span>
            </div>
          </div>

          <p className="text-xs font-bold text-slate-700 leading-normal max-w-[280px] mx-auto">
            {getAccuracyEmoji(finalScore, activeQuestions.length)}
          </p>

          <p className="text-[11px] text-slate-450 leading-relaxed max-w-[250px] mx-auto">
            You processed {activeQuestions.length} modules, earning <strong className="text-primary-600 font-extrabold">+{(finalScore * 10) + 10} study minutes</strong> on your personalized progress dashboard.
          </p>

          <div className="pt-4 border-t border-slate-100 flex gap-2">
            <button
              onClick={() => setQuizState("idle")}
              className="flex-1 py-2 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <RotateCcw size={12} />
              <span>Retry Session</span>
            </button>
            <button
              onClick={() => handleStartQuiz(selectedCategory)}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
            >
              Restart This Set
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
