import React, { useState, useEffect } from "react";
import { 
  Home, 
  BookOpen, 
  Award, 
  Sparkles, 
  User, 
  Wifi, 
  Battery, 
  Bell, 
  Menu,
  ChevronRight,
  School,
  Smartphone,
  Maximize2,
  Minimize2,
  Users
} from "lucide-react";
import { StudentProfile } from "../types";
import { User as FirebaseUser } from "firebase/auth";

interface AppShellProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  streak: number;
  profile: StudentProfile;
  user: FirebaseUser | null;
}

export default function AppShell({ children, activeTab, setActiveTab, streak, profile, user }: AppShellProps) {
  const [deviceTime, setDeviceTime] = useState("");
  const [isFullscreenMode, setIsFullscreenMode] = useState(false);
  const [showNotificationAlert, setShowNotificationAlert] = useState(true);

  // Update mock status bar time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      setDeviceTime(`${hours}:${minutes} ${ampm}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const tabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "courses", label: "P2P Rooms", icon: Users },
    { id: "practice", label: "Mock Tests", icon: Award },
    { id: "ai", label: "Guru AI", icon: Sparkles, highlight: true },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col items-center justify-center p-0 md:p-6 transition-colors duration-500 font-sans relative">
      
      {/* Platform Instructions Banner for Visual Quality Preview - Only shows on desktop/tablet */}
      <div className="hidden md:flex w-full max-w-md items-center justify-between mb-4 px-4 py-2 bg-slate-900 text-white rounded-2xl shadow-sm text-xs border border-slate-800">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-primary-500 animate-pulse"></span>
          <span className="font-semibold text-slate-200">OdiaLab Sleek App Preview</span>
        </div>
        <button 
          onClick={() => setIsFullscreenMode(!isFullscreenMode)}
          className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-primary-500 active:bg-slate-950 rounded-xl text-slate-200 transition-all font-semibold cursor-pointer"
        >
          {isFullscreenMode ? (
            <>
              <Minimize2 size={12} />
              <span>Mobile View</span>
            </>
          ) : (
            <>
              <Maximize2 size={12} />
              <span>Full Screen</span>
            </>
          )}
        </button>
      </div>

      {/* Side-by-side Layout Grid split: Smartphone Left, Sleek Info desk Right */}
      <div className="flex flex-row items-center justify-center max-w-5xl w-full gap-12 z-10">
        
        {/* Main Smartphone Container - Sleek border frame structure */}
        <div 
          className={`bg-white text-slate-900 transition-all duration-300 relative ${
            isFullscreenMode 
              ? "w-full max-w-4xl h-[100dvh] md:h-[92vh] rounded-none md:rounded-[36px] md:ring-12 md:ring-slate-900 shadow-2xl" 
              : "w-full md:w-[375px] h-[100dvh] md:h-[720px] rounded-none md:rounded-[40px] md:border-[8px] md:border-slate-900 shadow-2xl"
          } flex flex-col overflow-hidden`}
        >
          
          {/* Top Notch Area on Simulated Smartphone Frame */}
          {!isFullscreenMode && (
            <>
              <div className="hidden md:block absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-slate-950 rounded-b-2xl z-50">
                <div className="absolute top-1.5 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-slate-800 rounded-full"></div>
                <div className="absolute top-1 right-8 w-2 h-2 bg-slate-900 rounded-full border border-slate-800"></div>
              </div>
              
              {/* Button Accents */}
              <div className="hidden md:block absolute left-[-10px] top-28 w-[2px] h-12 bg-slate-900 rounded-l-md"></div>
              <div className="hidden md:block absolute left-[-10px] top-44 w-[2px] h-16 bg-slate-900 rounded-l-md"></div>
              <div className="hidden md:block absolute right-[-10px] top-32 w-[2px] h-20 bg-slate-900 rounded-r-md"></div>
            </>
          )}

          {/* 1. Sleek Status Bar */}
          <div className="flex justify-between items-center px-8 pt-6 pb-2 select-none text-slate-900 shrink-0 z-40 bg-white">
            <span className="text-xs font-bold font-mono text-slate-950">{deviceTime ? deviceTime.split(" ")[0] : "9:41"}</span>
            <div className="flex items-center space-x-1.5">
              <span className="text-[9px] font-bold bg-accent-100 text-amber-900 px-2 py-0.5 rounded-full font-sans tracking-wide border border-accent-500/20">
                🔥 {streak} Days
              </span>
              <div className="w-4 h-4 rounded-full border border-slate-350 flex items-center justify-center">
                <Wifi size={9} className="text-slate-800" />
              </div>
              <div className="w-4 h-4 rounded-full border border-slate-350 flex items-center justify-center">
                <Battery size={9} className="text-slate-800" />
              </div>
            </div>
          </div>

          {/* 2. Sleek Branding Header */}
          <header className="px-6 py-4 bg-white border-b border-slate-100 shrink-0 z-35 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight font-display flex items-center gap-1.5">
                OdiaLab
                <span className="text-[9px] uppercase tracking-widest font-mono font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-md">
                  HUB
                </span>
              </h1>
              <p className="text-xs text-slate-500 font-semibold tracking-wide mt-0.5">Global Learning Hub</p>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowNotificationAlert(!showNotificationAlert)}
                className="relative p-2 rounded-full hover:bg-slate-55 border border-slate-150 transition-colors text-slate-800 cursor-pointer"
              >
                <Bell size={16} />
                {showNotificationAlert && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-bounce"></span>
                )}
              </button>

              <div 
                onClick={() => setActiveTab("profile")}
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-xs border-2 border-primary-50 hover:scale-102 transition-all cursor-pointer overflow-hidden bg-primary-600 hover:bg-primary-700 text-white"
              >
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Avatar" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                ) : (
                  <span>
                    {profile.name ? profile.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() : "G"}
                  </span>
                )}
              </div>
            </div>
          </header>

          {/* Floating Broadcast System - Notifications Box */}
          {showNotificationAlert && (
            <div className="bg-amber-50 border-b border-amber-100 py-2.5 px-6 text-xs text-amber-900 flex items-center justify-between animate-fade-in z-20 shrink-0 select-none">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="bg-amber-500/20 text-amber-900 font-bold px-1.5 py-0.5 rounded text-[9px]">LIVE NOW</span>
                <p className="truncate font-semibold">✨ Target OPSC OAS Exam master mock sessions highlight live!</p>
              </div>
              <button 
                onClick={() => setShowNotificationAlert(false)}
                className="text-amber-600 hover:text-amber-950 font-bold text-xs ml-2 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* 3. Screen Scrollable Content Body */}
          <main className="flex-1 overflow-y-auto bg-slate-50 relative flex flex-col pb-safe">
            {children}
          </main>

          {/* 4. Elegant Glassmorphic Bottom Navigation Tabs */}
          <nav className="fixed md:absolute bottom-0 left-0 right-0 w-full bg-white border-t border-slate-150 px-6 py-4 flex justify-between items-center z-40 select-none">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex flex-col items-center justify-center cursor-pointer transition-all focus:outline-hidden"
                >
                  <div className={`p-1.5 rounded-xl transition-all ${
                    isSelected ? "bg-primary-50 text-primary-600" : "text-slate-400 hover:text-slate-600"
                  }`}>
                    <Icon size={20} className={isSelected ? "stroke-[2.5px]" : "stroke-[2px]"} />
                  </div>
                  <span className={`text-[10px] font-bold mt-1 tracking-tight ${
                    isSelected ? "text-primary-600" : "text-slate-400"
                  }`}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Bottom simulated Home Indicator pill */}
          {!isFullscreenMode && (
            <div className="hidden md:block absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-slate-900 rounded-full opacity-20 pointer-events-none z-50"></div>
          )}
        </div>

        {/* Companion App Details Side-Panel Context for Desktop Visual Quality */}
        {!isFullscreenMode && (
          <div className="ml-4 max-w-sm hidden lg:block animate-fade-in self-center">
            <h2 className="text-4xl font-black text-slate-900 leading-tight tracking-tight">
              Online Education for the Global Odia Community.
            </h2>
            <p className="text-slate-500 mt-4 leading-relaxed text-sm font-medium">
              OdiaLab provides specialized academic coaching, live mentoring interactive desks, Odia grammar archives, and digital test preparation tools optimized for academic excellence.
            </p>
            <div className="flex mt-8 space-x-4">
              <div className="flex-1 bg-white p-5 rounded-2xl shadow-xs border border-slate-150">
                <span className="block text-3xl font-black text-primary-600">25k+</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mt-1">Active Students</span>
              </div>
              <div className="flex-1 bg-white p-5 rounded-2xl shadow-xs border border-slate-150">
                <span className="block text-3xl font-black text-primary-600">150+</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mt-1">Expert Mentors</span>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
