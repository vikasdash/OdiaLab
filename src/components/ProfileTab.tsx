import React, { useState } from "react";
import { 
  User as LucideUser, 
  MapPin, 
  CheckSquare, 
  Plus, 
  Trash2, 
  BookMarked, 
  ChevronRight, 
  GraduationCap, 
  Clock, 
  TrendingUp, 
  Check, 
  Sparkles,
  Edit2
} from "lucide-react";
import { StudentProfile, StudyPlannerItem } from "../types";
import { User as FirebaseUser } from "firebase/auth";

interface ProfileTabProps {
  profile: StudentProfile;
  setProfile: React.Dispatch<React.SetStateAction<StudentProfile>>;
  planner: StudyPlannerItem[];
  setPlanner: React.Dispatch<React.SetStateAction<StudyPlannerItem[]>>;
  enrolledCoursesCount: number;
  user: FirebaseUser | null;
  onLoginWithGoogle: () => Promise<void>;
  onLogout: () => Promise<void>;
  isLoggingIn: boolean;
}

export default function ProfileTab({ 
  profile, 
  setProfile, 
  planner, 
  setPlanner,
  enrolledCoursesCount,
  user,
  onLoginWithGoogle,
  onLogout,
  isLoggingIn
}: ProfileTabProps) {
  
  const [newPlannerTitle, setNewPlannerTitle] = useState("");
  const [newPlannerTime, setNewPlannerTime] = useState("09:00 AM");
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [usernameInput, setUsernameInput] = useState(profile.name);

  // SVG Chart Mock Data - Study hours comparison
  const weeklyStudyHours = [
    { day: "Mon", hr: 2.5 },
    { day: "Tue", hr: 3.8 },
    { day: "Wed", hr: 4.2 },
    { day: "Thu", hr: 5.0 },
    { day: "Fri", hr: profile.studyMinutes / 60 }, // Calculated dynamically
    { day: "Sat", hr: 6.5 },
    { day: "Sun", hr: 3.0 }
  ];

  const chartMaxHour = Math.max(...weeklyStudyHours.map(d => d.hr));

  const handleCreatePlannerItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlannerTitle.trim()) return;

    const newItem: StudyPlannerItem = {
      id: `plan-${Date.now()}`,
      title: newPlannerTitle.trim(),
      time: newPlannerTime,
      completed: false
    };

    setPlanner(prev => [...prev, newItem]);
    setNewPlannerTitle("");
    setNewPlannerTime("09:00 AM");
  };

  const handleRemovePlannerItem = (id: string) => {
    setPlanner(prev => prev.filter(item => item.id !== id));
  };

  const handleRemoveSavedNote = (idx: number) => {
    setProfile(prev => ({
      ...prev,
      savedNotes: prev.savedNotes.filter((_, i) => i !== idx)
    }));
  };

  const handleSaveUsername = () => {
    if (!usernameInput.trim()) return;
    setProfile(prev => ({ ...prev, name: usernameInput.trim() }));
    setIsEditingUsername(false);
  };

  return (
    <div className="flex flex-col gap-4 p-4 pb-8 animate-fade-in select-none">
      
      {/* Google Authentication Integration Panel */}
      <div className="bg-white rounded-2xl border border-slate-150 p-4 shadow-xs flex flex-col gap-3">
        {user ? (
          <div className="flex flex-col gap-2.5">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-1.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="text-[9px] font-bold text-emerald-800 font-mono tracking-wide">CLOUD SYNC ENTIRELY ACTIVE</p>
            </div>
            <div className="flex items-center gap-3">
              {user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt="Profile Avatar" 
                  referrerPolicy="no-referrer"
                  className="w-11 h-11 rounded-full border-2 border-emerald-100"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-700 text-sm">
                  {user.displayName ? user.displayName.slice(0, 2).toUpperCase() : "G"}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-black text-slate-900 leading-tight block truncate">
                  {user.displayName || "Odia Candidate"}
                </h4>
                <p className="text-[9px] text-slate-500 font-mono font-bold block truncate mt-0.5">
                  {user.email}
                </p>
              </div>
            </div>
            
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-1.5 bg-rose-50 text-rose-700 font-bold hover:bg-rose-100 active:bg-rose-200 py-2.5 px-4 rounded-xl border border-rose-150 text-xxs tracking-wider uppercase cursor-pointer transition-all"
            >
              Sign Out Account
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2 mr-0.5">
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-1.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              <p className="text-[9px] font-bold text-amber-800 font-mono tracking-wide">STUDYING IN GUEST MODE</p>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
              Unlock cloud progress synchronization. Log in with your verified Google/Gmail account to persist mock tracker ratings, completed bookmarks, and daily stats safely.
            </p>
            
            <button 
              onClick={onLoginWithGoogle}
              disabled={isLoggingIn}
              className="w-full flex items-center justify-center gap-2.5 bg-white text-slate-755 hover:text-slate-900 font-bold hover:bg-slate-50 active:bg-slate-100 border border-slate-200 py-2.5 px-4 rounded-xl shadow-xs cursor-pointer transition-all disabled:opacity-50 text-xs"
            >
              {isLoggingIn ? (
                <span className="w-4 h-4 border-2 border-slate-500 border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fillRule="evenodd" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              )}
              <span>{isLoggingIn ? "Logging in..." : "Google Sign In"}</span>
            </button>
          </div>
        )}
      </div>

      {/* 1. Student Identity Header */}
      <div className="bg-white rounded-2xl border border-slate-150 p-4 flex gap-4 shadow-xs relative">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary-600 to-primary-500 text-white flex items-center justify-center text-3xl font-bold shadow-md ring-4 ring-primary-50 font-display shrink-0">
          🎓
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            {isEditingUsername ? (
              <div className="flex gap-1 items-center w-full">
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="bg-slate-100 text-xs font-bold p-1 rounded border border-slate-300 w-28 text-slate-800"
                />
                <button 
                  onClick={handleSaveUsername}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold p-1 text-[10px] rounded cursor-pointer"
                >
                  Save
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-base font-bold font-display text-slate-900 truncate leading-snug">{profile.name}</h3>
                <button 
                  onClick={() => setIsEditingUsername(true)}
                  className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  title="Rename User"
                >
                  <Edit2 size={12} />
                </button>
              </>
            )}
            
            <span className="bg-amber-100 text-amber-800 font-mono font-bold text-[8px] tracking-wider px-1.5 py-0.5 rounded ml-auto">
              LVL 4
            </span>
          </div>
          
          <p className="text-[10px] text-slate-400 font-mono font-bold mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis leading-tight">
            Email: {profile.email}
          </p>
          
          <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium mt-1">
            <MapPin size={10} className="text-rose-500" />
            <span>HQ Bhubaneswar • Odisha, India</span>
          </div>
        </div>
      </div>

      {/* 2. Visual Metric scorecard grid */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-white rounded-xl border border-slate-150 p-3 flex gap-2.5 items-center">
          <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center shrink-0">
            <Clock size={16} />
          </div>
          <div>
            <span className="block text-xs font-mono font-black text-slate-900">{profile.studyMinutes} mins</span>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none">Classroom Time</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-150 p-3 flex gap-2.5 items-center">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <GraduationCap size={16} />
          </div>
          <div>
            <span className="block text-xs font-mono font-black text-slate-900">{enrolledCoursesCount} Matches</span>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none">Peer Rooms</span>
          </div>
        </div>
      </div>

      {/* 3. Pure React SVG Study Track bar chart */}
      <div className="bg-white border border-slate-150 rounded-2xl p-4 shadow-xs">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest font-mono flex items-center gap-1">
          <TrendingUp className="text-primary-500" size={14} />
          Weekly Study Hours Performance
        </h4>
        <p className="text-[10px] text-slate-450 mt-0.5 mb-4">Track dynamic study minutes spent on OdiaLab classrooms.</p>

        {/* Custom SVG responsive chart canvas */}
        <div className="w-full flex justify-between items-end h-28 pt-2 select-none">
          {weeklyStudyHours.map((d, i) => {
            const barHeightPercent = chartMaxHour > 0 ? (d.hr / chartMaxHour) * 100 : 0;
            return (
              <div key={i} className="flex flex-col items-center flex-1 group relative">
                
                {/* Float indicator value on hover */}
                <div className="opacity-0 group-hover:opacity-100 absolute top-[-25px] bg-slate-850 text-white font-mono text-[9px] px-1.5 py-0.5 rounded-sm shadow-xs transition-opacity pointer-events-none font-bold">
                  {d.hr.toFixed(1)}h
                </div>

                <div className="w-6 h-20 bg-slate-50 rounded-sm overflow-hidden flex items-end">
                  <div 
                    className={`w-full rounded-sm transition-all duration-500 ${
                      d.day === "Fri" ? "bg-gradient-to-t from-accent-500 to-accent-600" : "bg-gradient-to-t from-primary-600 to-primary-500"
                    }`}
                    style={{ height: `${barHeightPercent || 5}%` }}
                  />
                </div>
                
                <span className="text-[9px] font-mono font-bold text-slate-400 mt-1.5">{d.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Study Notebook - Revision Bookmarks Tracker (Integrates bookmarks) */}
      <div className="bg-white border border-slate-150 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3 pb-1 border-b border-slate-100">
          <div className="flex items-center gap-1.5">
            <BookMarked className="text-primary-500" size={16} />
            <h4 className="font-display font-bold text-xs text-slate-900 uppercase tracking-wider">My Revision Notes</h4>
          </div>
          <span className="text-[10px] bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-mono font-bold">
            {profile.savedNotes.length} Saved
          </span>
        </div>

        {profile.savedNotes.length > 0 ? (
          <div className="flex flex-col gap-2.5 max-h-48 overflow-y-auto pr-1">
            {profile.savedNotes.map((note, idx) => (
              <div 
                key={idx}
                className="bg-slate-50/70 hover:bg-slate-50 border border-slate-100 rounded-xl p-2.5 flex items-start justify-between gap-3 text-[11px] leading-relaxed font-sans"
              >
                <p className="text-slate-700 font-medium">{note}</p>
                <button
                  type="button"
                  onClick={() => handleRemoveSavedNote(idx)}
                  className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded self-center cursor-pointer"
                  title="Remove Revision Reference"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-5 select-none bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <p className="text-[11px] font-bold text-slate-500">No revision bookmarks saved yet</p>
            <p className="text-[9px] text-slate-400 mt-1">Tap bookmarks inside course syllabus modules lists to populate real reference revision points.</p>
          </div>
        )}
      </div>

      {/* 5. Custom Dynamic Study Planner Checklist Editor */}
      <div className="bg-white border border-slate-150 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3 pb-1 border-b border-slate-100">
          <div className="flex items-center gap-1.5">
            <CheckSquare className="text-primary-500" size={16} />
            <h4 className="font-display font-bold text-xs text-slate-900 uppercase tracking-wider">Workspace Checklist</h4>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Daily Actions</span>
        </div>

        {/* Create new planner prompt formulation */}
        <form onSubmit={handleCreatePlannerItem} className="flex gap-2 mb-3">
          <input
            type="text"
            value={newPlannerTitle}
            onChange={(e) => setNewPlannerTitle(e.target.value)}
            placeholder="Add study plan (e.g. Learn Odia Sandhi Rules)..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl text-xs py-2 px-3 outline-hidden focus:bg-white focus:ring-1 focus:ring-primary-500 text-slate-800 font-semibold"
          />
          <button
            type="submit"
            className="bg-primary-500 hover:bg-primary-600 text-white px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer"
          >
            <Plus size={14} />
          </button>
        </form>

        <div className="flex flex-col gap-2">
          {planner.map((item) => (
            <div 
              key={item.id} 
              className="bg-slate-50/50 p-2.5 rounded-xl border border-slate-100/60 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-400 shrink-0"></span>
                <p className="text-xs font-semibold text-slate-800 truncate leading-snug">{item.title}</p>
              </div>

              <button
                onClick={() => handleRemovePlannerItem(item.id)}
                className="p-1 text-slate-350 hover:text-rose-500 hover:bg-rose-50 rounded transition-all shrink-0 cursor-pointer"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
