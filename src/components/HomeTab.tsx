import React, { useState } from "react";
import { BookOpen, Calendar, HelpCircle, Trophy, UserCheck, Video, CheckCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { StudentProfile, StudyPlannerItem } from "../types";

interface HomeTabProps {
  profile: StudentProfile;
  setProfile: React.Dispatch<React.SetStateAction<StudentProfile>>;
  planner: StudyPlannerItem[];
  setPlanner: React.Dispatch<React.SetStateAction<StudyPlannerItem[]>>;
  setActiveTab: (tab: string) => void;
  setStreak: React.Dispatch<React.SetStateAction<number>>;
  setGoalSelectedCategory: (cat: string) => void;
  user: any;
}

export default function HomeTab({ 
  profile, 
  setProfile, 
  planner, 
  setPlanner, 
  setActiveTab,
  setStreak,
  setGoalSelectedCategory,
  user
}: HomeTabProps) {
  
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Need an OSSC Peer Study Buddy? 🔴",
      subtitle: "Match with active aspirants 1-on-1 to practice mock question papers",
      badge: "Partners Online",
      tag: "ossc-peer-room",
      color: "from-indigo-600 via-indigo-700 to-indigo-800",
    },
    {
      title: "State OPSC OAS Pair Rooms 🏛️",
      subtitle: "Brainstorm Mains essay answers & state history GK with verified peer experts",
      badge: "Serious Aspirants",
      tag: "opsc-peer-room",
      color: "from-slate-900 to-indigo-950",
    },
    {
      title: "Odia Guru AI Doubts Assistant ✨",
      subtitle: "Get explanations on grammar rules & math shortcuts in native Odia 24/7",
      badge: "AI Grounded",
      tag: "ai",
      color: "from-indigo-900 via-indigo-950 to-slate-900",
    }
  ];

  const handleTogglePlanner = (id: string, currentlyCompleted: boolean) => {
    // Toggle completed status
    setPlanner(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, completed: !item.completed };
      }
      return item;
    }));

    // If completing an item, add 20 study minutes and award streak
    if (!currentlyCompleted) {
      setProfile(prev => ({
        ...prev,
        studyMinutes: prev.studyMinutes + 20
      }));
    } else {
      setProfile(prev => ({
        ...prev,
        studyMinutes: Math.max(0, prev.studyMinutes - 20)
      }));
    }
  };

  const handleSlideAction = (tag: string) => {
    if (tag === "ai") {
      setActiveTab("ai");
    } else {
      setGoalSelectedCategory(tag === "ossc-peer-room" ? "OSSC Exams" : "OPSC Civil Services");
      setActiveTab("courses");
    }
  };

  const quotes = [
    { text: "“ମନୁଷ୍ୟ ଜୀବନ କେବଳ ବର୍ଷ ମାସ ଦିନର ନୁହେଁ, କର୍ମ ହିଁ ତାହାର ମାପକାଠି ।”", author: "ଉତ୍କଳମଣି ଗୋପବନ୍ଧୁ ଦାସ (Legendary State Reformer)" },
    { text: "“Education is the strongest weapon which you can use to change the world.”", author: "Dr. A.P.J. Abdul Kalam" }
  ];

  return (
    <div className="flex flex-col gap-4 p-4 pb-8 animate-fade-in">
      
      {/* 1. Welcome Card & Quick Stats */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">Student Workspace</span>
          {user ? (
            <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded flex items-center gap-1">
              <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              Profile Verified
            </span>
          ) : (
            <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2  py-0.5 rounded flex items-center gap-1">
              <span className="h-1.5 w-1.5 bg-amber-500 rounded-full"></span>
              Guest Mode
            </span>
          )}
         </div>
        <h2 className="text-xl font-display font-bold text-slate-950">
          Namaskar, <span className="text-primary-500">{profile.name}</span> 👋
        </h2>
        <p className="text-xs text-slate-550 line-clamp-1">Track: {profile.goal}</p>
      </div>

      {/* 2. Interactive Sliding Banner */}
      <div className="relative overflow-hidden rounded-2xl shadow-md border border-slate-100 bg-white">
        <div className={`p-5 text-white bg-gradient-to-r ${slides[currentSlide].color} transition-all duration-500 min-h-[160px] flex flex-col justify-between`}>
          <div>
            <div className="flex justify-between items-start">
              <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-sm">
                {slides[currentSlide].badge}
              </span>
              <div className="flex gap-1.5">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                      currentSlide === idx ? "bg-white w-4" : "bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </div>
            <h3 className="text-base font-display font-bold mt-2.5 leading-snug">
              {slides[currentSlide].title}
            </h3>
            <p className="text-xs text-white/85 mt-1 font-sans">
              {slides[currentSlide].subtitle}
            </p>
          </div>

          <div className="flex justify-between items-center mt-4 pt-2 border-t border-white/10">
            <span className="text-[10px] text-white/70 font-mono">OdiaLab 1-on-1 Peer Match</span>
            <button
              onClick={() => handleSlideAction(slides[currentSlide].tag)}
              className="bg-white text-slate-900 border-none font-bold text-xs px-3 py-1.5 rounded-lg shadow-sm hover:bg-amber-100 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>Explore</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Core Indicators (Bento Style metrics) */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-white p-3 rounded-xl border border-slate-100 text-center shadow-xs">
          <span className="block text-xl font-bold font-mono text-primary-500">{profile.streak}d</span>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Active Streak</span>
        </div>
        <div className="bg-white p-3 rounded-xl border border-slate-100 text-center shadow-xs">
          <span className="block text-xl font-bold font-mono text-primary-500">{profile.studyMinutes}m</span>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Study Goal</span>
        </div>
        <div className="bg-white p-3 rounded-xl border border-slate-100 text-center shadow-xs">
          <span className="block text-xl font-bold font-mono text-primary-500">{profile.solvedCount}</span>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Mock Solved</span>
        </div>
      </div>



      {/* 4. Active Peer-to-Peer Booking Match Alert */}
      <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-emerald-100 rounded-2xl p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <UserCheck className="text-emerald-600 animate-pulse" size={18} />
            <div>
              <h5 className="font-display font-bold text-xs text-emerald-950">1-on-1 Study Match Available</h5>
              <p className="text-[10px] text-emerald-600 font-medium">Peer: Rashmi Ranjan (OSSC CGL Aspirant)</p>
            </div>
          </div>
          <span className="bg-emerald-500 text-white font-bold text-[9px] px-2 py-0.5 rounded-full animate-bounce">ONLINE</span>
        </div>
        
        <div className="bg-white/80 p-3 rounded-xl border border-emerald-100/30">
          <p className="text-xs font-bold text-slate-950">📍 Topics: ଓଡ଼ିଆ ବ୍ୟାକରଣ (ସମାସ ରୁଲ୍ସ) & State History Quiz</p>
          <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100 text-[10px] text-slate-500 font-medium">
            <span>🔴 1-to-1 Instant Private Matching slot</span>
            <button 
              onClick={() => {
                setProfile(p => ({ ...p, studyMinutes: p.studyMinutes + 35 }));
                alert("🔊 Connecting to Rashmi Ranjan in private 1-on-1 audio/video peer session! You received +35 study goal mins.");
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1 px-2.5 rounded-lg active:scale-95 transition-transform cursor-pointer"
            >
              Match 1-on-1
            </button>
          </div>
        </div>
      </div>

      {/* 5. Motivational Words of Legend */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 relative overflow-hidden shadow-xs border border-primary-700/50">
        <div className="absolute right-[-10px] bottom-[-10px] text-7xl font-mono text-white/5 font-black uppercase opacity-20 pointer-events-none select-none">
          ODIA
        </div>
        <span className="text-[9px] bg-accent-500 font-bold px-1.5 py-0.5 rounded text-white tracking-widest block w-fit mb-2">UTKALA INSPIRED</span>
        <blockquote className="text-xs italic text-slate-100 font-medium leading-relaxed">
          {quotes[0].text}
        </blockquote>
        <p className="text-[10px] text-amber-400 font-semibold font-sans mt-2 ml-1">— {quotes[0].author}</p>
      </div>

      {/* 6. Success Stories (Global Proof Desk) */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h4 className="font-display font-bold text-sm text-slate-950 flex items-center gap-1">
            <Trophy className="text-amber-500" size={15} />
            Odisha Success Spotlights
          </h4>
          <span className="text-[10px] text-slate-400 font-medium">OdiaLab Pride</span>
        </div>

        <div className="bg-white border border-slate-150 rounded-xl p-3 flex gap-3 items-center">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-lg shadow-inner shrink-0 ring-2 ring-primary-100">
            🏅
          </div>
          <div>
            <h5 className="text-xs font-bold text-slate-950">Subhashree Priyadarshini (Rank 22 OAS)</h5>
            <p className="text-[10px] text-slate-500 font-medium leading-relaxed mt-0.5">
              "OdiaLab's mocks and the special grammar guidelines made general papers incredibly scoring for me. Highly recommended!"
            </p>
          </div>
        </div>
      </div>

      {/* Safety Compliance Statement */}
      <div className="flex items-center gap-1.5 justify-center py-2 text-[10px] text-slate-400 font-medium">
        <ShieldCheck size={12} className="text-slate-300" />
        <span>In compliance with global and state secure educational standards.</span>
      </div>

    </div>
  );
}
