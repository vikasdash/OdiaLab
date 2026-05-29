import React, { useState, useEffect } from "react";
import { 
  Users, 
  Search, 
  Star, 
  Bookmark, 
  MessageSquare, 
  CheckCircle, 
  Video, 
  X, 
  Sparkles, 
  BookOpenCheck,
  Send,
  PenTool,
  RotateCcw,
  Volume2
} from "lucide-react";
import { Course, StudentProfile } from "../types";
import { SAMPLE_COURSES } from "../data";

interface CoursesTabProps {
  profile: StudentProfile;
  setProfile: React.Dispatch<React.SetStateAction<StudentProfile>>;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  enrolledCourses: string[]; // List of Course IDs enrolled (conceptually: joined P2P Match list)
  setEnrolledCourses: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function CoursesTab({ 
  profile, 
  setProfile, 
  activeCategory, 
  setActiveCategory,
  enrolledCourses,
  setEnrolledCourses
}: CoursesTabProps) {
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeLectureTab, setActiveLectureTab] = useState<string>("whiteboard");
  
  // Collaborative Notepad state
  const [scratchpadText, setScratchpadText] = useState(
    "💡 Peer Study Session Log\n-----------------------\n- Reviewed Eastern Ganga Dynasty & Konark Sun Temple build dates.\n- Odisha GK rules look key for General Studies paper.\n- "
  );

  // Chat message simulator state
  const [chatInput, setChatInput] = useState("");
  const [sessionMessages, setSessionMessages] = useState<Array<{sender: string, text: string, time: string}>>([
    { sender: "System", text: "Matched! Connected with Rashmi Ranjan (OPSC aspirant) in private pair room.", time: "Connected" },
    { sender: "Rashmi Ranjan", text: "Namaskar! Let's review Odia Grammar Sandhi rules today. Which topics do you want to test?", time: "08:31 AM" }
  ]);

  // Canvas Whiteboard simulator state
  const [points, setPoints] = useState<Array<{x: number, y: number}>>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  
  const categories = ["All", "OSSC Exams", "OPSC Civil Services", "Teaching Exams", "Spoken English"];

  const filteredCourses = SAMPLE_COURSES.filter(course => {
    const matchesCategory = activeCategory === "All" || course.category === activeCategory;
    const matchesSearch = course.title.toLowerCase().includes(course.title.toLowerCase()) || 
                          course.description.toLowerCase().includes(course.description.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleJoinMatchPool = (courseId: string, courseTitle: string) => {
    if (enrolledCourses.includes(courseId)) {
      // If already matching, just open
      const matched = SAMPLE_COURSES.find(c => c.id === courseId);
      if (matched) setSelectedCourse(matched);
      return;
    }
    
    setEnrolledCourses(prev => [...prev, courseId]);
    
    setProfile(prev => ({
      ...prev,
      studyMinutes: prev.studyMinutes + 45, // onboard incentive minutes
    }));

    // Trigger match
    const matched = SAMPLE_COURSES.find(c => c.id === courseId);
    if (matched) {
      setSelectedCourse(matched);
    }
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const userMsg = { sender: "You", text: chatInput, time: "Just Now" };
    setSessionMessages(prev => [...prev, userMsg]);
    const currentInput = chatInput.toLowerCase();
    setChatInput("");

    // Simulate smart dynamic peer responses
    setTimeout(() => {
      let replyText = "Interesting query! Let's add that to the shared scratchpad for our study records.";
      if (currentInput.includes("samas") || currentInput.includes("odia") || currentInput.includes("grammar")) {
        replyText = "Yes! Odia grammar Swara Varna contains 11 vowels. Gopinath Mohanty won first Jnanpith in 1973. Let's bookmark that points.";
      } else if (currentInput.includes("hi") || currentInput.includes("namaskar") || currentInput.includes("hello")) {
        replyText = "Namaskar friend! I am revising state General Studies syllabus. Ready for mutual questions.";
      } else if (currentInput.includes("test") || currentInput.includes("quiz") || currentInput.includes("exam")) {
        replyText = "Let's attempt a quick 1-on-1 Practice quiz mock test on the Mock Tests tab next!";
      }

      setSessionMessages(prev => [...prev, {
        sender: "Rashmi Ranjan",
        text: replyText,
        time: "Just Now"
      }]);
    }, 1000);
  };

  const handleBookmarkItem = (topic: string) => {
    if (profile.savedNotes.includes(topic)) {
      alert("This peer topic revision note is already saved!");
      return;
    }
    setProfile(prev => ({
      ...prev,
      savedNotes: [...prev.savedNotes, `💡 Peer Class Point: ${topic}`]
    }));
    alert(`📌 Saved: "${topic}" added to your Profile bookmarks for reference!`);
  };

  // Simple canvas simulations
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setPoints(prev => [...prev, { x: e.clientX - rect.left, y: e.clientY - rect.top }]);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setPoints(prev => [...prev, { x: e.clientX - rect.left, y: e.clientY - rect.top }]);
  };

  return (
    <div className="flex flex-col gap-4 p-4 pb-8 animate-fade-in relative min-h-full">
      
      {/* 1. Header & Dynamic Search */}
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-display font-bold text-slate-950">1-on-1 Peer Classroom</h3>
        <p className="text-xs text-slate-500">Collaborate with active Odisha candidates in dedicated private matching rooms.</p>
      </div>

      <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2 text-[11px] text-emerald-800 font-semibold flex items-center gap-2">
        <Users size={16} className="text-emerald-600 shrink-0" />
        <span>No group batches or overhead classes. OdiaLab is 100% focused on 1-on-1 peer exchange.</span>
      </div>

      {/* 2. Soft Category Pills */}
      <div className="flex gap-2.5 overflow-x-auto pb-1.5 scrollbar-thin select-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`py-1.5 px-3.5 rounded-full text-xs font-bold whitespace-nowrap transition-all tracking-tight cursor-pointer ${
              activeCategory === cat
                ? "bg-primary-500 text-white shadow-xs"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 3. List of Active P2P Match Pools */}
      <div className="flex flex-col gap-3.5">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => {
            const isEnrolled = enrolledCourses.includes(course.id);
            return (
              <div 
                key={course.id} 
                className="bg-white rounded-2xl border border-slate-150 p-4 transition-all duration-300 hover:shadow-md flex flex-col gap-3 relative"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3">
                    <div className="w-11 h-11 bg-indigo-50 text-2xl flex items-center justify-center rounded-xl ring-1 ring-slate-100 shrink-0">
                      {course.thumbnail}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-primary-600 bg-primary-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        {course.category}
                      </span>
                      <h4 className="text-xs font-bold font-display text-slate-900 mt-1 line-clamp-1 leading-snug">
                        {course.title}
                      </h4>
                    </div>
                  </div>
                  <span className="bg-emerald-500 text-white font-mono font-bold text-[8px] tracking-wider px-1.5 py-0.5 rounded animate-pulse shrink-0">
                    MATCHING NOW
                  </span>
                </div>

                <p className="text-[11px] leading-relaxed text-slate-500 line-clamp-2">
                  {course.description}
                </p>

                <div className="flex items-center gap-4 text-[10px] text-slate-400 font-mono font-bold">
                  <span className="flex items-center gap-1 text-amber-500">
                    <Star size={12} className="fill-amber-500 stroke-amber-500" />
                    {course.rating} Rating
                  </span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <Users size={12} />
                    {course.studentsCount} Peers Active
                  </span>
                  <span className="text-emerald-600 font-extrabold ml-auto font-sans text-[10px] uppercase">
                    {course.price}
                  </span>
                </div>

                {/* Match Trigger Controls */}
                <div className="pt-2 border-t border-slate-100">
                  {isEnrolled ? (
                    <button
                      onClick={() => setSelectedCourse(course)}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Video size={12} />
                      <span>Re-Enter Private Match Space</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleJoinMatchPool(course.id, course.title)}
                      className="w-full py-2 bg-primary-500 hover:bg-primary-600 text-white text-[11px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <span>Match 1-on-1 Instantly</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-sm font-bold text-slate-700">No active P2P Match categories found</p>
            <p className="text-xs text-slate-400 mt-1">Adjust filters or search criteria.</p>
          </div>
        )}
      </div>

      {/* 4. Detailed 1-on-1 Private Workspace Overlay */}
      {selectedCourse && (
        <div className="absolute inset-x-0 top-0 min-h-full bg-slate-50 z-50 animate-slide-up flex flex-col p-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="text-lg">{selectedCourse.thumbnail}</span>
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest font-mono">1-on-1 Active Session</h4>
                <p className="text-[10px] text-slate-400 font-mono font-medium">Room ID: MATCH-{selectedCourse.id.toUpperCase()}</p>
              </div>
            </div>
            <button 
              onClick={() => {
                setSelectedCourse(null);
              }}
              className="text-slate-400 hover:text-slate-700 bg-slate-250 hover:bg-slate-200 p-1.5 rounded-full cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pt-3 flex flex-col gap-3">
            {/* Connection Status & Member Widget */}
            <div className="bg-slate-900 text-white rounded-2xl p-3 flex flex-col gap-2 relative shadow-inner">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-primary-600 rounded-full flex items-center justify-center font-bold text-xs ring-2 ring-emerald-500">
                    RR
                  </div>
                  <div>
                    <h5 className="text-xs font-bold">Rashmi Ranjan</h5>
                    <p className="text-[9px] text-emerald-450 font-mono flex items-center gap-1 mt-0.5">
                      <Volume2 size={10} className="animate-pulse" />
                      Audio connected & High-res webcam live
                    </p>
                  </div>
                </div>
                <span className="bg-emerald-600 text-white font-bold text-[8px] px-1.5 py-0.5 rounded animate-pulse">1-TO-1</span>
              </div>
              <p className="text-[10px] text-slate-300 italic leading-snug bg-slate-800/80 p-2 rounded-lg border border-slate-705">
                "Study buddy matched safely relative to your search goals."
              </p>
            </div>

            {/* Tab switch inside dynamic Private Space */}
            <div className="flex border-b border-slate-200">
              <button 
                onClick={() => setActiveLectureTab("whiteboard")}
                className={`flex-1 py-1.5 text-center text-xs font-bold border-b-2 cursor-pointer ${
                  activeLectureTab === "whiteboard" ? "border-primary-500 text-primary-500" : "border-transparent text-slate-500"
                }`}
              >
                🖥️ Draw Board
              </button>
              <button 
                onClick={() => setActiveLectureTab("chat")}
                className={`flex-1 py-1.5 text-center text-xs font-bold border-b-2 cursor-pointer ${
                  activeLectureTab === "chat" ? "border-primary-500 text-primary-500" : "border-transparent text-slate-500"
                }`}
              >
                💬 Live Chat
              </button>
              <button 
                onClick={() => setActiveLectureTab("notes")}
                className={`flex-1 py-1.5 text-center text-xs font-bold border-b-2 cursor-pointer ${
                  activeLectureTab === "notes" ? "border-primary-500 text-primary-500" : "border-transparent text-slate-500"
                }`}
              >
                📒 Joint Notepad
              </button>
            </div>

            {/* Tab Content 1: Draw Board / Whiteboard Sim */}
            {activeLectureTab === "whiteboard" && (
              <div className="flex flex-col gap-2">
                <div className="bg-amber-50 border border-amber-200 p-2 rounded-xl text-[10px] text-amber-900 leading-relaxed font-semibold">
                  ✍️ Scratch, outline, or highlight question strategies together with your matched study buddy below:
                </div>
                <div className="relative border-2 border-slate-200 rounded-2xl bg-white overflow-hidden shadow-inner flex flex-col">
                  <canvas
                    onMouseDown={handleCanvasMouseDown}
                    onMouseMove={handleCanvasMouseMove}
                    onMouseUp={() => setIsDrawing(false)}
                    onMouseLeave={() => setIsDrawing(false)}
                    className="w-full h-40 cursor-crosshair bg-stone-50"
                  />
                  {/* Overlay Canvas points */}
                  <div className="absolute inset-x-0 bottom-0 p-2 bg-slate-100 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-500 font-mono">
                    <span className="flex items-center gap-1">
                      <PenTool size={10} /> Draw with fingers or mouse
                    </span>
                    <button 
                      onClick={() => setPoints([])}
                      className="text-primary-600 hover:text-primary-850 font-bold flex items-center gap-0.5"
                    >
                      <RotateCcw size={10} /> Clear
                    </button>
                  </div>
                  {/* Live Points rendered simulated */}
                  <svg className="absolute inset-0 pointer-events-none w-full h-full">
                    {points.map((p, i) => (
                      <circle key={i} cx={p.x} cy={p.y} r={3} fill="#4f46e5" />
                    ))}
                  </svg>
                </div>
              </div>
            )}

            {/* Tab Content 2: Live chat blocks */}
            {activeLectureTab === "chat" && (
              <div className="flex flex-col gap-2 h-64 bg-slate-100 rounded-2xl p-2.5 border border-slate-200 justify-between">
                <div className="flex flex-col gap-2 overflow-y-auto flex-1 pr-1">
                  {sessionMessages.map((msg, idx) => (
                    <div 
                      key={idx} 
                      className={`flex flex-col gap-0.5 ${msg.sender === "You" ? "items-end" : "items-start"}`}
                    >
                      <span className="text-[8px] text-slate-400 font-mono font-bold uppercase">{msg.sender} • {msg.time}</span>
                      <p className={`text-xs py-1.5 px-3 rounded-xl max-w-[85%] leading-tight ${
                        msg.sender === "You" 
                          ? "bg-primary-500 text-white rounded-tr-none" 
                          : msg.sender === "System"
                          ? "bg-slate-200 text-slate-550 italic self-center text-center text-[9px] py-1"
                          : "bg-white text-slate-800 rounded-tl-none border border-slate-200 shadow-xxs"
                      }`}>
                        {msg.text}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-1 pt-1.5 border-t border-slate-200 shrink-0">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Type helper rules or quiz doubts..."
                    className="flex-1 bg-white border border-slate-300 text-xs py-1.5 px-3 rounded-lg outline-hidden"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="p-1 px-2.5 bg-primary-500 hover:bg-primary-600 rounded-lg text-white"
                  >
                    <Send size={12} />
                  </button>
                </div>
              </div>
            )}

            {/* Tab Content 3: Joint Notepad review */}
            {activeLectureTab === "notes" && (
              <div className="flex flex-col gap-2">
                <p className="text-[10px] text-slate-400 leading-snug">Changes sync automatically in real-time with Rashmi Ranjan:</p>
                <textarea
                  value={scratchpadText}
                  onChange={(e) => setScratchpadText(e.target.value)}
                  className="w-full h-40 bg-indigo-50/40 text-xs p-3 rounded-xl border border-slate-200 font-mono focus:bg-white"
                />
              </div>
            )}

            {/* Target Revision Guidelines and Topics checklist */}
            <div className="mt-2 text-xs flex flex-col gap-2">
              <h5 className="font-bold text-slate-900 block font-display">Discussion Agenda Hints:</h5>
              <div className="flex flex-col gap-1.5">
                {selectedCourse.syllabus.map((topic, index) => (
                  <div key={index} className="bg-white border border-slate-150 p-2 rounded-xl flex items-center justify-between gap-2.5">
                    <p className="text-[11px] font-semibold text-slate-800 block truncate leading-tight">{topic}</p>
                    <button
                      onClick={() => handleBookmarkItem(topic)}
                      className="p-1 text-slate-400 hover:text-primary-500"
                      title="Save point to Profile Bookmarks"
                    >
                      <Bookmark size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className="pt-3 border-t border-slate-200 flex gap-2">
            <button
              onClick={() => {
                setProfile(prev => ({ ...prev, studyMinutes: prev.studyMinutes + 20 }));
                alert("👍 Review notes from session committed to memory dashboard! Streak score accounted.");
                setSelectedCourse(null);
              }}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-xl text-center text-xs active:scale-95 transition-transform cursor-pointer"
            >
              Finish Study Session & Save Profile
            </button>
            <button
              onClick={() => {
                setSelectedCourse(null);
              }}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-xl text-slate-700 font-bold text-xs cursor-pointer"
            >
              Minimise
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
